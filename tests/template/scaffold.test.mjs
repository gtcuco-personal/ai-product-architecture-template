import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdirSync,
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

function fillRequiredPlaceholders(directory, profile = "react-supabase") {
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
  const contract = profile === "minimal"
    ? [
      ["repository_role: TODO", "repository_role: automation"],
      ["beneficiary: TODO", "beneficiary: operator"],
      ["intended_outcome: TODO", "intended_outcome: complete a fixture task"],
      ["runtime: TODO", "runtime: none"],
      ["data_posture: TODO", "data_posture: none"],
      ["pii: TODO", "pii: none"],
      ["storage: TODO", "storage: none"],
      ["evidence_mode: TODO", "evidence_mode: manual"],
      ["retention: TODO", "retention: n/a"],
    ]
    : [
    ["repository_role: TODO", "repository_role: product"],
    ["beneficiary: TODO", "beneficiary: operator"],
    ["intended_outcome: TODO", "intended_outcome: complete a fixture task"],
    ["runtime: TODO", "runtime: interactive"],
    ["data_posture: TODO", "data_posture: collects"],
    ["pii: TODO", "pii: none"],
    ["storage: TODO", "storage: supabase"],
    ["evidence_mode: TODO", "evidence_mode: telemetry"],
    ["retention: TODO", "retention: n/a"],
    ];
  replace(join(directory, "docs/1_BUSINESS_CONTEXT.md"), contract);
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
    fillRequiredPlaceholders(directory, profile);

    const manifest = JSON.parse(readFileSync(join(directory, "template-profile.json"), "utf8"));
    assert.equal(manifest.profile, profile);
    assert.equal(existsSync(join(directory, "tests/template")), false);
    for (const path of manifest.removed_paths) assert.equal(existsSync(join(directory, path)), false, path);
    for (const path of manifest.retained_optional_paths) assert.equal(existsSync(join(directory, path)), true, path);

    const validation = run(directory, "scripts/check-governance.mjs");
    assert.equal(validation.status, 0, `${validation.stdout}\n${validation.stderr}`);
    assert.match(validation.stdout, /Governance check passed \(project mode\)/);

    const index = readFileSync(join(directory, "INDEX.md"), "utf8");
    const roadmap = readFileSync(join(directory, "docs/5_ROADMAP_AND_TASKS.md"), "utf8");
    assert.doesNotMatch(index, /Product, decision & evidence contract v2\.3|Downstream propagation/);
    assert.doesNotMatch(index, /PR #(?:49|50)|ai-product-architecture-template/);
    assert.doesNotMatch(index, /^## (?:Active initiatives|Archive)$/m);
    assert.match(index, /^# Fixture Project — Index/m);
    assert.doesNotMatch(roadmap, /GERADO POR|ai-product-architecture-template|PR #(?:49|50|56)/);
    assert.match(roadmap, /^<!-- TASK SOURCE POINTER -->\n/);
    assert.match(roadmap, /^# Roadmap & Tasks/m);
    assert.match(roadmap, /\| Source of truth \|/);
    assert.match(roadmap, /\| Repository key \/ filter \|/);
    assert.match(roadmap, /\| Read \|/);
    assert.match(roadmap, /\| Write \|/);
    assert.doesNotMatch(roadmap, /^- \[[ xX]\]/m);
    assert.doesNotMatch(roadmap, /^## (?:This week|This month|Backlog)$/m);
    assert.doesNotMatch(roadmap, /Last updated/);
    const policy = readFileSync(join(directory, "SYSTEM_PROMPT.md"), "utf8");
    assert.match(policy, /If it is `<!-- TASK SOURCE POINTER -->`/);
    assert.match(policy, /do not copy task state into the pointer file/);
    assert.match(policy, /Do not create a local backlog implicitly/);
  });
}

test("profile application is idempotent and refuses in-place switching", (t) => {
  const directory = copyTemplate(t);
  const first = run(directory, "scripts/scaffold.mjs", ["--profile", "minimal", "--apply"]);
  assert.equal(first.status, 0, first.stderr);

  writeFileSync(join(directory, "INDEX.md"), "# Consumer Index\n\nKeep this edit.\n");
  writeFileSync(join(directory, "docs/5_ROADMAP_AND_TASKS.md"), "# Consumer Roadmap\n\nKeep this too.\n");

  const repeated = run(directory, "scripts/scaffold.mjs", ["--profile", "minimal", "--apply"]);
  assert.equal(repeated.status, 0, repeated.stderr);
  assert.match(repeated.stdout, /already applied/);
  assert.equal(readFileSync(join(directory, "INDEX.md"), "utf8"), "# Consumer Index\n\nKeep this edit.\n");
  assert.equal(
    readFileSync(join(directory, "docs/5_ROADMAP_AND_TASKS.md"), "utf8"),
    "# Consumer Roadmap\n\nKeep this too.\n",
  );

  const switched = run(directory, "scripts/scaffold.mjs", ["--profile", "regulated-ai", "--apply"]);
  assert.equal(switched.status, 1);
  assert.match(switched.stderr, /start from a fresh template/);
});

test("governance validation detects drift in a retained profile module", (t) => {
  const directory = copyTemplate(t);
  const applied = run(directory, "scripts/scaffold.mjs", ["--profile", "regulated-ai", "--apply"]);
  assert.equal(applied.status, 0, applied.stderr);
  fillRequiredPlaceholders(directory, "regulated-ai");

  rmSync(join(directory, "docs/8_DATA_AND_ANALYSIS.md"));
  const validation = run(directory, "scripts/check-governance.mjs");
  assert.equal(validation.status, 1);
  assert.match(validation.stderr, /declares retained path that is missing: docs\/8_DATA_AND_ANALYSIS\.md/);
});

test("governance validation rejects an unfilled or incoherent product-evidence contract", (t) => {
  const directory = copyTemplate(t);
  const applied = run(directory, "scripts/scaffold.mjs", ["--profile", "minimal", "--apply"]);
  assert.equal(applied.status, 0, applied.stderr);
  fillRequiredPlaceholders(directory, "minimal");

  replace(join(directory, "docs/1_BUSINESS_CONTEXT.md"), [["data_posture: none", "data_posture: collects"]]);
  const validation = run(directory, "scripts/check-governance.mjs");
  assert.equal(validation.status, 1);
  assert.match(validation.stderr, /runtime none requires data_posture none/);
  assert.match(validation.stderr, /declares data or storage but docs\/8_DATA_AND_ANALYSIS\.md is absent/);
});

test("legacy repositories without a manifest or template fixtures validate normally", (t) => {
  const directory = copyTemplate(t);
  const path = join(directory, "docs/1_BUSINESS_CONTEXT.md");
  writeFileSync(path, readFileSync(path, "utf8").replace(/^---\n[\s\S]*?\n---\n\n/, ""));
  rmSync(join(directory, "tests/template"), { recursive: true, force: true });
  rmSync(join(directory, "scripts/run-python-ci.py"), { force: true });

  const legacyValidation = run(directory, "scripts/check-governance.mjs");
  assert.equal(legacyValidation.status, 0, legacyValidation.stderr);
  assert.match(legacyValidation.stdout, /Governance check passed \(legacy mode\)/);

  const projectValidation = run(directory, "scripts/check-governance.mjs", ["--project"]);
  assert.equal(projectValidation.status, 1);
  assert.match(projectValidation.stderr, /has no product-evidence frontmatter/);
});

test("a missing generated roadmap reports a validation failure without crashing", (t) => {
  const directory = copyTemplate(t);
  rmSync(join(directory, "docs/5_ROADMAP_AND_TASKS.md"));

  const validation = run(directory, "scripts/check-governance.mjs", ["--template"]);
  assert.equal(validation.status, 1);
  assert.match(validation.stderr, /missing required file: docs\/5_ROADMAP_AND_TASKS\.md/);
  assert.doesNotMatch(validation.stderr, /ENOENT|no such file or directory/i);
});

test("governance traversal ignores dependency, environment, and worktree directories", (t) => {
  const directory = copyTemplate(t);

  for (const ignored of [".venv", "venv", "vendor", ".worktrees"]) {
    const nested = join(directory, ignored, "nested");
    mkdirSync(nested, { recursive: true });
    writeFileSync(
      join(nested, "ignored.md"),
      "References retired docs/4_SEO_AND_AEO.md and [a missing file](missing.md).\n",
    );
  }

  const validation = run(directory, "scripts/check-governance.mjs", ["--template"]);
  assert.equal(validation.status, 0, `${validation.stdout}\n${validation.stderr}`);
});

test("governance link validation ignores code examples but still rejects real broken links", (t) => {
  const directory = copyTemplate(t);
  const examples = join(directory, "docs/code-link-examples.md");
  writeFileSync(
    examples,
    [
      "# Link examples",
      "",
      "Inline `[link](url)` and ``[regex](\\+[0-9])`` examples.",
      "",
      "```md",
      "[fenced](missing-fenced.md)",
      "```",
      "",
      "~~~md",
      "[tilde fenced](missing-tilde.md)",
      "~~~",
      "",
    ].join("\n"),
  );

  const examplesOnly = run(directory, "scripts/check-governance.mjs", ["--template"]);
  assert.equal(examplesOnly.status, 0, `${examplesOnly.stdout}\n${examplesOnly.stderr}`);

  writeFileSync(examples, `${readFileSync(examples, "utf8")}Real [broken](missing-real.md).\n`);
  const realBrokenLink = run(directory, "scripts/check-governance.mjs", ["--template"]);
  assert.equal(realBrokenLink.status, 1);
  assert.match(realBrokenLink.stderr, /broken local link: missing-real\.md/);
  assert.doesNotMatch(realBrokenLink.stderr, /missing-fenced|missing-tilde|\\\+\[0-9\]|url/);
});

test("a filled legacy contract is enforced by the normal governance check", (t) => {
  const directory = copyTemplate(t);
  rmSync(join(directory, "tests/template"), { recursive: true, force: true });
  fillRequiredPlaceholders(directory, "minimal");
  replace(join(directory, "docs/1_BUSINESS_CONTEXT.md"), [["data_posture: none", "data_posture: collects"]]);

  const validation = run(directory, "scripts/check-governance.mjs");
  assert.equal(validation.status, 1);
  assert.match(validation.stderr, /runtime none requires data_posture none/);
});

test("consumer releases and hand-maintained roadmaps are independent from the template", (t) => {
  const directory = copyTemplate(t);
  const applied = run(directory, "scripts/scaffold.mjs", ["--profile", "minimal", "--apply"]);
  assert.equal(applied.status, 0, applied.stderr);
  fillRequiredPlaceholders(directory, "minimal");

  writeFileSync(join(directory, "README.md"), "# Consumer Product\n\nIts own release history.\n");
  writeFileSync(join(directory, "CHANGELOG.md"), "# Changelog\n\n## [0.1.0] - Initial consumer release\n");
  writeFileSync(
    join(directory, "docs/5_ROADMAP_AND_TASKS.md"),
    "# Roadmap & Tasks\n\n## This week\n\n- [ ] Ship the consumer product\n",
  );

  const validation = run(directory, "scripts/check-governance.mjs");
  assert.equal(validation.status, 0, `${validation.stdout}\n${validation.stderr}`);
  assert.match(validation.stdout, /Governance check passed \(project mode\)/);

  replace(join(directory, "SYSTEM_PROMPT.md"), [["> Version: 3.1", "> Consumer policy"]]);
  const invalidPolicy = run(directory, "scripts/check-governance.mjs");
  assert.equal(invalidPolicy.status, 1);
  assert.match(invalidPolicy.stderr, /SYSTEM_PROMPT\.md has no parseable Version header/);
});

test("explicit template mode enforces template fixtures and release coherence", (t) => {
  const directory = copyTemplate(t);

  const baseline = run(directory, "scripts/check-governance.mjs", ["--template"]);
  assert.equal(baseline.status, 0, `${baseline.stdout}\n${baseline.stderr}`);
  assert.match(baseline.stdout, /Governance check passed \(template mode\)/);

  replace(join(directory, "README.md"), [["Shared operating policy (v3.1", "Shared operating policy (v9.9"]]);
  rmSync(join(directory, "tests/template/fixtures/npm"), { recursive: true, force: true });

  const validation = run(directory, "scripts/check-governance.mjs", ["--template"]);
  assert.equal(validation.status, 1);
  assert.match(validation.stderr, /version drift: SYSTEM_PROMPT\.md=3\.1, README\.md=9\.9/);
  assert.match(validation.stderr, /missing required file: tests\/template\/fixtures\/npm\/package\.json/);
});

test("scaffold refuses a customized INDEX before removing optional modules", (t) => {
  const directory = copyTemplate(t);
  replace(join(directory, "INDEX.md"), [
    ["## 📁 Folder map", "Custom consumer note.\n\n## 📁 Folder map"],
  ]);

  const applied = run(directory, "scripts/scaffold.mjs", ["--profile", "minimal", "--apply"]);
  assert.equal(applied.status, 1);
  assert.match(applied.stderr, /INDEX\.md.*not the pristine template artifact/);
  assert.equal(existsSync(join(directory, "template-profile.json")), false);
  assert.equal(existsSync(join(directory, "docs/3_UI_UX_GUIDELINES.md")), true);
});

test("scaffold refuses a roadmap customized between source markers before removals", (t) => {
  const directory = copyTemplate(t);
  replace(join(directory, "docs/5_ROADMAP_AND_TASKS.md"), [
    ["## Completed", "User-owned roadmap item.\n\n## Completed"],
  ]);

  const applied = run(directory, "scripts/scaffold.mjs", ["--profile", "minimal", "--apply"]);
  assert.equal(applied.status, 1);
  assert.match(applied.stderr, /docs\/5_ROADMAP_AND_TASKS\.md.*not the pristine template artifact/);
  assert.equal(existsSync(join(directory, "template-profile.json")), false);
  assert.equal(existsSync(join(directory, "docs/3_UI_UX_GUIDELINES.md")), true);
});

test("scaffold refuses a generated consumer roadmap before removing optional modules", (t) => {
  const directory = copyTemplate(t);
  replace(join(directory, "docs/5_ROADMAP_AND_TASKS.md"), [
    ["src_repo = ai-product-architecture-template", "src_repo = consumer-product"],
  ]);

  const applied = run(directory, "scripts/scaffold.mjs", ["--profile", "minimal", "--apply"]);
  assert.equal(applied.status, 1);
  assert.match(applied.stderr, /docs\/5_ROADMAP_AND_TASKS\.md.*not the pristine template artifact/);
  assert.equal(existsSync(join(directory, "template-profile.json")), false);
  assert.equal(existsSync(join(directory, "docs/3_UI_UX_GUIDELINES.md")), true);
});
