#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

export function detectCiMode(root = process.cwd()) {
  const packageJson = existsSync(resolve(root, "package.json"));
  const npmLock = existsSync(resolve(root, "package-lock.json"));
  const bunLock = existsSync(resolve(root, "bun.lock")) || existsSync(resolve(root, "bun.lockb"));
  const packageManager = packageJson ? (bunLock ? "bun" : "npm") : "none";
  const functionsRoot = resolve(root, "supabase/functions");
  let deno = false;

  const requirementsPath = resolve(root, "requirements.txt");
  const pyprojectPath = resolve(root, "pyproject.toml");
  const pythonPyproject = existsSync(pyprojectPath) && /^\s*\[(?:project|build-system)\]\s*(?:#.*)?$/m.test(
    readFileSync(pyprojectPath, "utf8"),
  );
  const python = existsSync(requirementsPath) || pythonPyproject;
  const pytestDeclared = existsSync(requirementsPath) && readFileSync(requirementsPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.split("#", 1)[0].trim())
    .some((line) => /^pytest(?:\[[^\]]+\])?(?:\s*(?:===|==|~=|!=|<=|>=|<|>).*)?$/i.test(line));

  if (existsSync(functionsRoot)) {
    deno = readdirSync(functionsRoot, { withFileTypes: true }).some(
      (entry) => entry.isDirectory() && existsSync(resolve(functionsRoot, entry.name, "index.ts")),
    );
  }

  return {
    node: packageJson,
    package_manager: packageManager,
    npm_lock: packageManager === "npm" && npmLock,
    deno,
    python,
    python_supported: python && pytestDeclared,
    python_reason: !python ? "not-detected" : pytestDeclared ? "requirements-pytest" : "unsupported-setup",
    template: existsSync(resolve(root, "tests/template")),
  };
}

function main() {
  const result = detectCiMode();
  if (process.argv.includes("--github-output")) {
    for (const [key, value] of Object.entries(result)) console.log(`${key}=${value}`);
  } else {
    console.log(JSON.stringify(result));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
