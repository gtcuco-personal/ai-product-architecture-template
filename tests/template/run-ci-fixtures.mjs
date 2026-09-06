#!/usr/bin/env node

import assert from "node:assert/strict";
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { detectCiMode } from "../../scripts/detect-ci-mode.mjs";

const templateTestsRoot = dirname(fileURLToPath(import.meta.url));
const fixturesRoot = join(templateTestsRoot, "fixtures");
const requestedMode = process.argv.find((argument) => argument.startsWith("--mode="))?.slice(7) ?? "all";
const supportedModes = new Set(["all", "npm", "bun", "deno", "python"]);

if (!supportedModes.has(requestedMode)) {
  console.error(`Unsupported mode: ${requestedMode}`);
  process.exit(1);
}

function executable(name) {
  return process.platform === "win32" ? `${name}.cmd` : name;
}

function run(command, args, cwd) {
  console.log(`\n[${cwd.slice(fixturesRoot.length + 1)}] ${command} ${args.join(" ")}`);
  const result = spawnSync(executable(command), args, { cwd, encoding: "utf8", stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed with exit ${result.status}`);
}

function runResult(command, args, cwd, env = process.env) {
  return spawnSync(executable(command), args, { cwd, encoding: "utf8", env });
}

function selected(mode) {
  return requestedMode === "all" || requestedMode === mode;
}

if (selected("npm")) {
  const root = join(fixturesRoot, "npm");
  assert.deepEqual(detectCiMode(root), {
    node: true,
    package_manager: "npm",
    npm_lock: true,
    deno: false,
    python: false,
    python_supported: false,
    python_reason: "not-detected",
    template: false,
  });
  run("npm", ["ci"], root);
  for (const script of ["lint", "build", "test"]) run("npm", ["run", script, "--if-present"], root);
  run("npm", ["audit", "--audit-level=high"], root);
}

if (selected("bun")) {
  const root = join(fixturesRoot, "bun");
  assert.deepEqual(detectCiMode(root), {
    node: true,
    package_manager: "bun",
    npm_lock: false,
    deno: false,
    python: false,
    python_supported: false,
    python_reason: "not-detected",
    template: false,
  });
  try {
    run("bun", ["install", "--frozen-lockfile"], root);
    for (const script of ["lint", "build", "test"]) run("bun", ["run", "--if-present", script], root);
    run("bun", ["audit", "--audit-level=high"], root);
  } finally {
    rmSync(join(root, "dist"), { recursive: true, force: true });
    rmSync(join(root, "node_modules"), { recursive: true, force: true });
  }
}

if (selected("deno")) {
  const root = join(fixturesRoot, "deno");
  assert.deepEqual(detectCiMode(root), {
    node: false,
    package_manager: "none",
    npm_lock: false,
    deno: true,
    python: false,
    python_supported: false,
    python_reason: "not-detected",
    template: false,
  });
  run(
    "deno",
    ["check", "--node-modules-dir=auto", "--no-lock", "example/index.ts"],
    join(root, "supabase/functions"),
  );
}

if (selected("python")) {
  const source = join(fixturesRoot, "python");
  const root = mkdtempSync(join(tmpdir(), "ai-template-python-ci-"));
  const helper = join(templateTestsRoot, "../../scripts/run-python-ci.py");
  try {
    cpSync(source, root, { recursive: true });
    assert.equal(runResult("python3", [helper, "--runner=unittest"], root).status, 0, "passing Python test must pass");

    writeFileSync(join(root, "tests/test_example.py"), "import unittest\nclass FailureTest(unittest.TestCase):\n    def test_failure(self):\n        self.fail('expected')\n");
    assert.equal(runResult("python3", [helper, "--runner=unittest"], root).status, 1, "failing Python test must fail");

    writeFileSync(join(root, "tests/test_example.py"), "def broken(:\n    pass\n");
    assert.equal(runResult("python3", [helper, "--runner=unittest"], root).status, 1, "invalid Python syntax must fail");

    rmSync(join(root, "tests/test_example.py"));
    assert.equal(runResult("python3", [helper, "--runner=unittest"], root).status, 5, "zero Python tests must fail");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

console.log(`\nCI fixture integration passed (${requestedMode}).`);
