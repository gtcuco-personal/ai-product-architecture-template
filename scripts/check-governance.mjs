#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

const root = process.cwd();
const profileManifestPath = resolve(root, "template-profile.json");
const projectMode = process.argv.includes("--project") || existsSync(profileManifestPath);
const failures = [];
let profileManifest;

if (existsSync(profileManifestPath)) {
  try {
    profileManifest = JSON.parse(readFileSync(profileManifestPath, "utf8"));
  } catch (error) {
    failures.push(`template-profile.json is invalid JSON: ${error.message}`);
  }
}

const requiredFiles = [
  "AGENTS.md",
  "CLAUDE.md",
  "INDEX.md",
  "README.md",
  "SYSTEM_PROMPT.md",
  "CHANGELOG.md",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "docs/0_GROUND_RULES.md",
  "docs/1_BUSINESS_CONTEXT.md",
  "docs/2_ARCHITECTURE.md",
  "docs/5_ROADMAP_AND_TASKS.md",
  "scripts/check-governance.mjs",
  "scripts/detect-ci-mode.mjs",
  "scripts/scaffold.mjs",
];

if (!projectMode) {
  requiredFiles.push(
    "docs/10_AGENT_SAFETY.md",
    "docs/11_TESTING.md",
    "docs/12_DEPENDENCY_MANAGEMENT.md",
    "docs/13_COMPLIANCE_FRAMEWORKS.md",
    "docs/14_AI_GOVERNANCE.md",
    "docs/15_HEALTH_CHECK.md",
    "tests/template/ci-detection.test.mjs",
    "tests/template/scaffold.test.mjs",
  );
}

function read(path) {
  return readFileSync(resolve(root, path), "utf8");
}

function fail(message) {
  failures.push(message);
}

for (const path of requiredFiles) {
  if (!existsSync(resolve(root, path))) fail(`missing required file: ${path}`);
}

if (profileManifest) {
  const validProfiles = new Set(["minimal", "react-supabase", "python-data", "regulated-ai"]);
  if (profileManifest.schema_version !== 1) fail("template-profile.json has unsupported schema_version");
  if (!validProfiles.has(profileManifest.profile)) fail(`template-profile.json has unknown profile: ${profileManifest.profile}`);
  if (!Array.isArray(profileManifest.removed_paths)) fail("template-profile.json removed_paths must be an array");
  else {
    for (const path of profileManifest.removed_paths) {
      if (typeof path !== "string" || path.startsWith("/") || path.includes("..")) {
        fail(`template-profile.json has unsafe removed path: ${String(path)}`);
      } else if (existsSync(resolve(root, path))) {
        fail(`profile ${profileManifest.profile} declares removed path that still exists: ${path}`);
      }
    }
  }
  if (!Array.isArray(profileManifest.retained_optional_paths)) {
    fail("template-profile.json retained_optional_paths must be an array");
  } else {
    for (const path of profileManifest.retained_optional_paths) {
      if (typeof path !== "string" || path.startsWith("/") || path.includes("..")) {
        fail(`template-profile.json has unsafe retained path: ${String(path)}`);
      } else if (!existsSync(resolve(root, path))) {
        fail(`profile ${profileManifest.profile} declares retained path that is missing: ${path}`);
      } else if (Array.isArray(profileManifest.removed_paths) && profileManifest.removed_paths.includes(path)) {
        fail(`template-profile.json lists path as both retained and removed: ${path}`);
      }
    }
  }
}

if (failures.length === 0) {
  const systemPrompt = read("SYSTEM_PROMPT.md");
  const readme = read("README.md");
  const changelog = read("CHANGELOG.md");
  const systemVersion = systemPrompt.match(/> Version:\s*([0-9]+(?:\.[0-9]+)*)/)?.[1];
  const readmeVersion = readme.match(/Shared operating policy \(v([0-9]+(?:\.[0-9]+)*)/)?.[1];

  if (!systemVersion) fail("SYSTEM_PROMPT.md has no parseable Version header");
  if (!readmeVersion) fail("README.md has no parseable SYSTEM_PROMPT version");
  if (systemVersion && readmeVersion && systemVersion !== readmeVersion) {
    fail(`version drift: SYSTEM_PROMPT.md=${systemVersion}, README.md=${readmeVersion}`);
  }
  if (systemVersion && !changelog.includes(`## [${systemVersion}]`)) {
    fail(`CHANGELOG.md has no release section for version ${systemVersion}`);
  }
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if ([".git", "node_modules"].includes(entry.name)) return [];
    const fullPath = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

const markdownFiles = walk(root).filter((path) => path.endsWith(".md"));
const historicalFiles = new Set([
  "CHANGELOG.md",
  "SYSTEM_PROMPT.md",
  "docs/5_ROADMAP_AND_TASKS.md",
  "docs/decisions/template/ODR-007-lean-by-default-governance.md",
]);
const retiredPaths = ["docs/4_SEO_AND_AEO.md", "docs/6_HEALTH_CHECK.md"];

for (const absolutePath of markdownFiles) {
  const repoPath = relative(root, absolutePath);
  const content = readFileSync(absolutePath, "utf8");

  if (!historicalFiles.has(repoPath)) {
    for (const retiredPath of retiredPaths) {
      if (content.includes(retiredPath)) {
        fail(`${repoPath} references retired path: ${retiredPath}`);
      }
    }
  }

  for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    let target = match[1].trim().replace(/^<|>$/g, "");
    if (/^(https?:|mailto:|#|\/)/.test(target)) continue;
    if (target.startsWith("../../security/")) continue; // GitHub repository UI route.
    target = target.split("#")[0];
    if (!target) continue;

    let decodedTarget;
    try {
      decodedTarget = decodeURIComponent(target);
    } catch {
      fail(`${repoPath} contains an invalid encoded link: ${target}`);
      continue;
    }

    const resolvedTarget = resolve(dirname(absolutePath), decodedTarget);
    const repoTarget = relative(root, resolvedTarget);
    const intentionallyRemoved = profileManifest?.removed_paths?.some(
      (path) => repoTarget === path || repoTarget.startsWith(`${path}/`),
    );
    if (!existsSync(resolvedTarget) && !intentionallyRemoved) {
      const line = content.slice(0, match.index).split("\n").length;
      fail(`${repoPath}:${line} has broken local link: ${target}`);
    }
  }
}

if (projectMode) {
  const requiredProjectValues = [
    ["CLAUDE.md", "# [Project Name]"],
    ["CLAUDE.md", "~/devs/github/[repo-name]"],
    ["CLAUDE.md", "https://github.com/[org]/[repo-name].git"],
    ["CLAUDE.md", "`[account]`"],
    ["INDEX.md", "# [Repo Name] — Index"],
    ["docs/0_GROUND_RULES.md", "| [Layer] | [Technology] | [Version] |"],
  ];

  for (const [path, placeholder] of requiredProjectValues) {
    if (read(path).includes(placeholder)) {
      fail(`${path} still contains required placeholder: ${placeholder}`);
    }
  }
}

if (failures.length > 0) {
  console.error(`Governance check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Governance check passed (${projectMode ? "project" : "template"} mode).`);
