#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const manifestPath = resolve(root, "template-profile.json");
const indexPath = "INDEX.md";
const roadmapPath = "docs/5_ROADMAP_AND_TASKS.md";
const pristineSourceDigests = {
  [indexPath]: "a6b804e6f72079d4b5aad3719209386d3974f555485b489fb005d8fb37a9fb72",
  [roadmapPath]: "0a0ca4ddcb32ee4e1feea9ae6cbefb01814a864dbb1e0b6315b9dc8355e40468",
};

const optionalPaths = [
  "docs/3_UI_UX_GUIDELINES.md",
  "docs/6_CONTENT_AND_SOCIAL.md",
  "docs/7_CONTENT_I18N.md",
  "docs/8_DATA_AND_ANALYSIS.md",
  "docs/9_AGENT_SKILLS.md",
  "docs/12_DEPENDENCY_MANAGEMENT.md",
  "docs/13_COMPLIANCE_FRAMEWORKS.md",
  "docs/14_AI_GOVERNANCE.md",
  "docs/guides/lovable-vocabulary.md",
  "skills",
];

const profiles = {
  minimal: {
    description: "Core governance, security, testing, and agent guidance only.",
    keep: [],
  },
  "react-supabase": {
    description: "React/Supabase product with UI, data/evidence, content, i18n, AI, compliance, and dependency guidance.",
    keep: [
      "docs/3_UI_UX_GUIDELINES.md",
      "docs/6_CONTENT_AND_SOCIAL.md",
      "docs/7_CONTENT_I18N.md",
      "docs/8_DATA_AND_ANALYSIS.md",
      "docs/9_AGENT_SKILLS.md",
      "docs/12_DEPENDENCY_MANAGEMENT.md",
      "docs/13_COMPLIANCE_FRAMEWORKS.md",
      "docs/14_AI_GOVERNANCE.md",
      "docs/guides/lovable-vocabulary.md",
      "skills",
    ],
  },
  "python-data": {
    description: "Python/data product with analytics, skills, dependencies, compliance, and AI governance.",
    keep: [
      "docs/8_DATA_AND_ANALYSIS.md",
      "docs/9_AGENT_SKILLS.md",
      "docs/12_DEPENDENCY_MANAGEMENT.md",
      "docs/13_COMPLIANCE_FRAMEWORKS.md",
      "docs/14_AI_GOVERNANCE.md",
      "skills",
    ],
  },
  "regulated-ai": {
    description: "Full template for externally used or regulated AI products.",
    keep: [...optionalPaths],
  },
};

function cleanIndex() {
  return `# [Repo Name] — Index

> Stable pointer map. Keep operational state in its declared source of truth.

## Folder map

- \`README.md\` — project purpose, setup and ownership
- \`CLAUDE.md\` / \`AGENTS.md\` — agent instructions and repository entry points
- \`docs/\` — project governance and operating documentation
- \`docs/decisions/\` — project-specific decision records
- \`scripts/\` — repository automation and validation utilities

Add project-specific folders as they are created.
`;
}

function cleanRoadmap() {
  return `<!-- TASK SOURCE POINTER -->
# Roadmap & Tasks

> Pointer only. Choose one authoritative task source and do not copy its state here.

## Source and access

| Field | Value |
|-------|-------|
| Source of truth | [database, issue tracker, project file, or URL; use this file only by deliberate choice] |
| Repository key / filter | [key or filter, or n/a] |
| Read | \`[exact read command]\` or [link] |
| Write | \`[exact write command or path]\` or [link] |

Replace every placeholder before relying on this pointer. If the source already
exists in SQLite, code, or another tracker, reference it instead of creating a
second backlog.
`;
}

function assertPristineSourceArtifacts() {
  // These are scaffold safety snapshots, not downstream drift checks. Any
  // source edit must deliberately refresh its digest; any consumer edit makes
  // first-time replacement fail closed before optional modules are removed.
  for (const [path, expectedDigest] of Object.entries(pristineSourceDigests)) {
    const content = readFileSync(resolve(root, path));
    const actualDigest = createHash("sha256").update(content).digest("hex");
    if (actualDigest !== expectedDigest) {
      throw new Error(`${path} is not the pristine template artifact; refusing to replace existing work`);
    }
  }
}

function usage() {
  console.log("Usage: node scripts/scaffold.mjs --profile <name> [--apply]");
  console.log("       node scripts/scaffold.mjs --list");
  console.log("");
  console.log("Dry-run is the default. Files are removed and project pointers are initialized only with --apply.");
}

function listProfiles() {
  for (const [name, profile] of Object.entries(profiles)) {
    console.log(`${name.padEnd(18)} ${profile.description}`);
  }
}

function parseArgs(args) {
  const result = { apply: false, list: false, profile: undefined };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--apply") result.apply = true;
    else if (argument === "--list") result.list = true;
    else if (argument === "--profile") result.profile = args[++index];
    else if (argument.startsWith("--profile=")) result.profile = argument.slice(10);
    else throw new Error(`unknown argument: ${argument}`);
  }

  return result;
}

function assertTemplateRoot() {
  for (const marker of ["AGENTS.md", "CLAUDE.md", "SYSTEM_PROMPT.md", "docs/0_GROUND_RULES.md"]) {
    if (!existsSync(resolve(root, marker))) {
      throw new Error(`not at template root: missing ${marker}`);
    }
  }
}

export function buildPlan(profileName) {
  const profile = profiles[profileName];
  if (!profile) throw new Error(`unknown profile: ${profileName}`);

  const keep = new Set(profile.keep);
  return {
    profile: profileName,
    description: profile.description,
    keep: [...keep].sort(),
    remove: [...optionalPaths.filter((path) => !keep.has(path)), "tests/template"].sort(),
  };
}

export function applyPlan(plan) {
  if (existsSync(manifestPath)) {
    const existing = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (existing.profile === plan.profile) {
      return { alreadyApplied: true, manifest: existing };
    }
    throw new Error(
      `profile ${existing.profile} already applied; start from a fresh template to switch to ${plan.profile}`,
    );
  }

  // Both replacements are destructive in a consumer repository. Establish
  // that this is still a fresh copy of the source template before removing a
  // single optional module.
  assertPristineSourceArtifacts();

  for (const path of plan.remove) {
    rmSync(resolve(root, path), { recursive: true, force: true });
  }

  writeFileSync(resolve(root, indexPath), cleanIndex());
  writeFileSync(resolve(root, roadmapPath), cleanRoadmap());

  const manifest = {
    schema_version: 1,
    profile: plan.profile,
    applied_at: new Date().toISOString(),
    retained_optional_paths: plan.keep,
    removed_paths: plan.remove,
  };
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return { alreadyApplied: false, manifest };
}

function printPlan(plan) {
  console.log(`Profile: ${plan.profile}`);
  console.log(plan.description);
  console.log("");
  console.log("Remove:");
  for (const path of plan.remove) console.log(`- ${path}`);
  console.log("");
  console.log("Retain optional modules:");
  if (plan.keep.length === 0) console.log("- none");
  else for (const path of plan.keep) console.log(`- ${path}`);
  console.log("");
  console.log("Initialize project pointers:");
  console.log(`- ${indexPath}`);
  console.log(`- ${roadmapPath}`);
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    usage();
    process.exitCode = 1;
    return;
  }

  if (args.list) {
    listProfiles();
    return;
  }
  if (!args.profile) {
    usage();
    process.exitCode = 1;
    return;
  }

  try {
    assertTemplateRoot();
    const plan = buildPlan(args.profile);
    printPlan(plan);
    if (!args.apply) {
      console.log("\nDry-run only. Re-run with --apply to make the listed changes.");
      return;
    }

    const result = applyPlan(plan);
    if (result.alreadyApplied) {
      console.log(`\nProfile ${plan.profile} was already applied; no changes made.`);
    } else {
      console.log("\nProfile applied. Next:");
      console.log("1. Fill the required project placeholders.");
      console.log("2. Run node scripts/check-governance.mjs --project.");
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
