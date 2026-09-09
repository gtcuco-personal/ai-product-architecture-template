#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

const root = process.cwd();
const profileManifestPath = resolve(root, "template-profile.json");
const explicitProjectMode = process.argv.includes("--project");
const templateMode = process.argv.includes("--template");
// Absence of a profile manifest also describes legacy consumers, so original
// template identity must never be inferred from it.
const projectMode = !templateMode && (explicitProjectMode || existsSync(profileManifestPath));
const validationMode = templateMode ? "template" : projectMode ? "project" : "legacy";
const requireProductEvidenceContract = projectMode || process.argv.includes("--require-product-evidence-contract");
const failures = [];
let profileManifest;

if (templateMode && explicitProjectMode) {
  failures.push("--template and --project are mutually exclusive");
}

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

if (templateMode) {
  requiredFiles.push(
    "docs/10_AGENT_SAFETY.md",
    "docs/11_TESTING.md",
    "docs/12_DEPENDENCY_MANAGEMENT.md",
    "docs/13_COMPLIANCE_FRAMEWORKS.md",
    "docs/14_AI_GOVERNANCE.md",
    "docs/15_HEALTH_CHECK.md",
    "tests/template/ci-detection.test.mjs",
    "tests/template/run-ci-fixtures.mjs",
    "tests/template/scaffold.test.mjs",
    "tests/template/fixtures/npm/package.json",
    "tests/template/fixtures/npm/package-lock.json",
    "tests/template/fixtures/npm/src/math.mjs",
    "tests/template/fixtures/npm/math.test.mjs",
    "tests/template/fixtures/bun/package.json",
    "tests/template/fixtures/bun/bun.lock",
    "tests/template/fixtures/bun/src/math.ts",
    "tests/template/fixtures/bun/math.test.ts",
    "tests/template/fixtures/bun/vendor/fixture-local/package.json",
    "tests/template/fixtures/deno/supabase/functions/example/index.ts",
    "tests/template/fixtures/deno/supabase/functions/example/math.ts",
    "scripts/run-python-ci.py",
    "tests/template/python_ci_helper_test.py",
    "tests/template/fixtures/python/tests/test_example.py",
  );
}

function read(path) {
  return readFileSync(resolve(root, path), "utf8");
}

function maskMarkdownCode(content) {
  const masked = content.split("");
  const maskRange = (start, end) => {
    for (let index = start; index < end; index += 1) {
      if (masked[index] !== "\n" && masked[index] !== "\r") {
        masked[index] = " ";
      }
    }
  };

  // Mask fenced code first. A closing fence may be longer than its opener;
  // shorter runs and the other fence character do not close it. If no closing
  // fence exists, the code block continues to EOF.
  let openFence = null;
  let lineStart = 0;
  while (lineStart < content.length) {
    const newlineIndex = content.indexOf("\n", lineStart);
    const lineEnd = newlineIndex === -1 ? content.length : newlineIndex + 1;
    const rawLine = content.slice(lineStart, newlineIndex === -1 ? content.length : newlineIndex);
    const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;

    if (openFence) {
      const closingMatch = line.match(/^ {0,3}(`+|~+)[ \t]*$/);
      if (
        closingMatch &&
        closingMatch[1][0] === openFence.character &&
        closingMatch[1].length >= openFence.length
      ) {
        maskRange(openFence.start, lineEnd);
        openFence = null;
      }
    } else {
      const openingMatch = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
      if (
        openingMatch &&
        !(openingMatch[1][0] === "`" && openingMatch[2].includes("`"))
      ) {
        openFence = {
          character: openingMatch[1][0],
          length: openingMatch[1].length,
          start: lineStart,
        };
      }
    }

    lineStart = lineEnd;
  }
  if (openFence) maskRange(openFence.start, content.length);

  // Code spans open and close only with maximal backtick runs of equal length.
  // Do not split a longer run to close a shorter one: unmatched delimiters are
  // literal Markdown and any links beside them must still be validated.
  const runs = [];
  for (let index = 0; index < content.length; index += 1) {
    if (masked[index] !== "`") continue;
    const start = index;
    while (index + 1 < content.length && masked[index + 1] === "`") index += 1;
    runs.push({ start, length: index - start + 1 });
  }

  const nextRunWithLength = new Array(runs.length).fill(-1);
  const nextByLength = new Map();
  for (let runIndex = runs.length - 1; runIndex >= 0; runIndex -= 1) {
    const run = runs[runIndex];
    nextRunWithLength[runIndex] = nextByLength.get(run.length) ?? -1;
    nextByLength.set(run.length, runIndex);
  }

  for (let runIndex = 0; runIndex < runs.length; runIndex += 1) {
    const closingRunIndex = nextRunWithLength[runIndex];
    if (closingRunIndex === -1) continue;
    const opening = runs[runIndex];
    const closing = runs[closingRunIndex];
    maskRange(opening.start, closing.start + closing.length);
    runIndex = closingRunIndex;
  }

  return masked.join("");
}

function fail(message) {
  failures.push(message);
}

function parseFrontmatter(path) {
  const content = read(path);
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return undefined;

  const values = {};
  for (const line of match[1].split("\n")) {
    const entry = line.match(/^([a-z_]+):\s*(.*?)(?:\s+#.*)?$/);
    if (entry) values[entry[1]] = entry[2].trim();
  }
  return values;
}

function validateProductEvidenceContract() {
  const path = "docs/1_BUSINESS_CONTEXT.md";
  if (!existsSync(resolve(root, path))) return;

  const contract = parseFrontmatter(path);
  const fields = [
    "contract_version",
    "repository_role",
    "product_ref",
    "beneficiary",
    "intended_outcome",
    "runtime",
    "data_posture",
    "pii",
    "storage",
    "evidence_mode",
    "retention",
  ];
  if (!contract) {
    if (requireProductEvidenceContract) fail(`${path} has no product-evidence frontmatter`);
    return;
  }
  for (const field of fields) {
    if (!(field in contract)) fail(`${path} product-evidence contract is missing ${field}`);
  }
  const placeholders = Object.entries(contract)
    .filter(([field]) => fields.includes(field))
    .filter(([, value]) => value === "" || value === "TODO")
    .map(([field]) => field);
  if (placeholders.length > 0) {
    if (requireProductEvidenceContract) {
      fail(`${path} product-evidence contract has unfilled fields: ${placeholders.join(", ")}`);
    }
    return;
  }

  const allowed = {
    repository_role: ["product", "component", "pipeline", "automation", "content", "study", "governance"],
    runtime: ["none", "batch", "interactive", "hybrid"],
    data_posture: ["none", "consumes", "produces", "collects"],
    pii: ["none", "self", "third_party", "special_category"],
    storage: ["none", "files", "sqlite", "duckdb", "parquet", "postgres", "supabase", "external", "multiple"],
    evidence_mode: ["none", "manual", "artifact", "telemetry"],
  };
  for (const [field, values] of Object.entries(allowed)) {
    if (!values.includes(contract[field])) {
      fail(`${path} product-evidence contract has invalid ${field}: ${contract[field]}`);
    }
  }
  if (contract.contract_version !== "1") fail(`${path} product-evidence contract has unsupported contract_version`);
  if (contract.runtime === "none" && contract.data_posture !== "none") {
    fail(`${path} runtime none requires data_posture none`);
  }
  if (contract.runtime === "none" && contract.storage !== "none") {
    fail(`${path} runtime none requires storage none`);
  }
  if (contract.pii !== "none" && ["n/a", "none"].includes(contract.retention.toLowerCase())) {
    fail(`${path} PII requires a retention or deletion trigger`);
  }
  const dataModuleRequired = contract.data_posture !== "none" || contract.storage !== "none";
  if (dataModuleRequired && !existsSync(resolve(root, "docs/8_DATA_AND_ANALYSIS.md"))) {
    fail(`${path} declares data or storage but docs/8_DATA_AND_ANALYSIS.md is absent`);
  }
}

for (const path of requiredFiles) {
  if (!existsSync(resolve(root, path))) fail(`missing required file: ${path}`);
}

validateProductEvidenceContract();

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

if (existsSync(resolve(root, "SYSTEM_PROMPT.md"))) {
  const systemPrompt = read("SYSTEM_PROMPT.md");
  const systemVersion = systemPrompt.match(/> Version:\s*([0-9]+(?:\.[0-9]+)*)/)?.[1];
  if (!systemVersion) fail("SYSTEM_PROMPT.md has no parseable Version header");

  if (templateMode && existsSync(resolve(root, "README.md")) && existsSync(resolve(root, "CHANGELOG.md"))) {
    const readme = read("README.md");
    const changelog = read("CHANGELOG.md");
    const readmeVersion = readme.match(/Shared operating policy \(v([0-9]+(?:\.[0-9]+)*)/)?.[1];

    if (!readmeVersion) fail("README.md has no parseable SYSTEM_PROMPT version");
    if (systemVersion && readmeVersion && systemVersion !== readmeVersion) {
      fail(`version drift: SYSTEM_PROMPT.md=${systemVersion}, README.md=${readmeVersion}`);
    }
    if (systemVersion && !changelog.includes(`## [${systemVersion}]`)) {
      fail(`CHANGELOG.md has no release section for version ${systemVersion}`);
    }
    // The check above only proves the version EXISTS somewhere in the changelog.
    // It stays green when CHANGELOG is bumped and SYSTEM_PROMPT is not, because
    // the older section is still present — which is how 2.4 and 2.7 both shipped
    // with a stale header. Compare against the TOP entry instead.
    const latestChangelogVersion = changelog.match(/^## \[([0-9]+(?:\.[0-9]+)*)\]/m)?.[1];
    if (systemVersion && latestChangelogVersion && systemVersion !== latestChangelogVersion) {
      fail(
        `version drift: CHANGELOG.md latest=${latestChangelogVersion}, ` +
          `SYSTEM_PROMPT.md=${systemVersion} — bump the header and its changelog table too`
      );
    }
  }
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if ([".git", ".venv", ".worktrees", "node_modules", "vendor", "venv"].includes(entry.name)) return [];
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
  const linkScanContent = maskMarkdownCode(content);

  if (!historicalFiles.has(repoPath)) {
    for (const retiredPath of retiredPaths) {
      if (linkScanContent.includes(retiredPath)) {
        fail(`${repoPath} references retired path: ${retiredPath}`);
      }
    }
  }

  for (const match of linkScanContent.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
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

// ODR-011 — ficheiros gerados validam-se pelo CABEÇALHO, nunca por comparação
// byte a byte com o template. Comparar marcaria como drift todos os repositórios
// correctamente migrados: o ficheiro deles difere do template por desenho.
//
// O que se valida aqui é o contrato do cabeçalho: se um ficheiro se declara
// gerado, tem de nomear o script que o produz e avisar quem o abrir de que
// editá-lo não guarda. Um cabeçalho a meio do ficheiro não conta — só a
// primeira linha, que é a que alguém lê antes de escrever.
const GENERATED_FILES = ["docs/5_ROADMAP_AND_TASKS.md"];
const GENERATED_HEADER = /^<!--\s*GERADO POR\s+(\S+)\s+—\s*(.*?)\s*-->\s*$/;

for (const path of GENERATED_FILES) {
  if (!existsSync(resolve(root, path))) continue;
  const content = read(path);
  if (!content) continue;
  const first = content.split("\n", 1)[0] ?? "";
  if (!/GERADO POR/.test(content)) continue;          // escrito à mão: nada a validar
  const match = first.match(GENERATED_HEADER);
  if (!match) {
    fail(`${path} mentions GERADO POR but the first line is not a well-formed generation header`);
    continue;
  }
  if (!/\.(py|mjs|js|sh)$/.test(match[1])) {
    fail(`${path} generation header does not name a script: ${match[1]}`);
  }
  if (!/NÃO EDITAR À MÃO/i.test(match[2])) {
    fail(`${path} generation header must warn that hand edits are not saved`);
  }
}

if (failures.length > 0) {
  console.error(`Governance check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Governance check passed (${validationMode} mode).`);
