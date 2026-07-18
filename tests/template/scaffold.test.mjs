import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const profileNames = ["minimal", "react-supabase", "python-data", "regulated-ai"];

function copyTemplate(t) {
  const parent = mkdtempSync(join(tmpdir(), "ai-template-scaffold-"));
  const destination = join(parent, "repo");
  t.after(() => rmSync(parent, { recursive: true, force: true }));

  cpSync(repositoryRoot, destination, {
    recursive: true,
    filter(source) {
      const path = relative(repositoryRoot, source);
      return path !== ".git" && !path.startsWith(`.git${process.platform === "win32" ? "\\" : "/"}`);
    },
  });
  return destination;
}

function run(directory, script, args = []) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: directory,
    encoding: "utf8",
  });
}

function replace(path, replacements) {
  let content = readFileSync(path, "utf8");
  for (const [from, to] of replacements) content = content.split(from).join(to);
  writeFileSync(path, content);
}

function fillRequiredPlaceholders(directory) {
  replace(join(directory, "CLAUDE.md"), [
    ["# [Project Name]", "# Fixture Project"],
    ["[repo-name]", "fixture-project"],
    ["[org]", "fixture-org"],
    ["`[account]`", "`fixture-account`"],
  ]);
  replace(join(directory, "INDEX.md"), [["# [Repo Name] — Index", "# Fixture Project — Index"]]);
  replace(join(directory, "docs/0_GROUND_RULES.md"), [
    ["| [Layer] | [Technology] | [Version] |", "| Runtime | Node.js | 22 |"],
  ]);
}

for (const profile of profileNames) {
  test(`scaffolds and validates the ${profile} profile`, (t) => {
    const directory = copyTemplate(t);
    const dryRun = run(directory, "scripts/scaffold.mjs", ["--profile", profile]);
    assert.equal(dryRun.status, 0, dryRun.stderr);
    assert.match(dryRun.stdout, /Dry-run only/);
    assert.equal(existsSync(join(directory, "template-profile.json")), false);

    const applied = run(directory, "scripts/scaffold.mjs", ["--profile", profile, "--apply"]);
    assert.equal(applied.status, 0, applied.stderr);
    fillRequiredPlaceholders(directory);

    const manifest = JSON.parse(readFileSync(join(directory, "template-profile.json"), "utf8"));
    assert.equal(manifest.profile, profile);
    assert.equal(existsSync(join(directory, "tests/template")), false);
    for (const path of manifest.removed_paths) assert.equal(existsSync(join(directory, path)), false, path);
    for (const path of manifest.retained_optional_paths) assert.equal(existsSync(join(directory, path)), true, path);

    const validation = run(directory, "scripts/check-governance.mjs");
    assert.equal(validation.status, 0, `${validation.stdout}\n${validation.stderr}`);
    assert.match(validation.stdout, /Governance check passed \(project mode\)/);
  });
}

test("profile application is idempotent and refuses in-place switching", (t) => {
  const directory = copyTemplate(t);
  const first = run(directory, "scripts/scaffold.mjs", ["--profile", "minimal", "--apply"]);
  assert.equal(first.status, 0, first.stderr);

  const repeated = run(directory, "scripts/scaffold.mjs", ["--profile", "minimal", "--apply"]);
  assert.equal(repeated.status, 0, repeated.stderr);
  assert.match(repeated.stdout, /already applied/);

  const switched = run(directory, "scripts/scaffold.mjs", ["--profile", "regulated-ai", "--apply"]);
  assert.equal(switched.status, 1);
  assert.match(switched.stderr, /start from a fresh template/);
});

test("governance validation detects drift in a retained profile module", (t) => {
  const directory = copyTemplate(t);
  const applied = run(directory, "scripts/scaffold.mjs", ["--profile", "regulated-ai", "--apply"]);
  assert.equal(applied.status, 0, applied.stderr);
  fillRequiredPlaceholders(directory);

  rmSync(join(directory, "docs/8_DATA_AND_ANALYSIS.md"));
  const validation = run(directory, "scripts/check-governance.mjs");
  assert.equal(validation.status, 1);
  assert.match(validation.stderr, /declares retained path that is missing: docs\/8_DATA_AND_ANALYSIS\.md/);
});
