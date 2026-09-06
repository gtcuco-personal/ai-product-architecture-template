import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { detectCiMode } from "../../scripts/detect-ci-mode.mjs";

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), "ai-template-ci-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

test("detects a docs-only repository", (t) => {
  assert.deepEqual(detectCiMode(fixture(t)), {
    node: false,
    package_manager: "none",
    npm_lock: false,
    deno: false,
    python: false,
    python_supported: false,
    python_reason: "not-detected",
    template: false,
  });
});

test("detects Node with and without an npm lockfile", (t) => {
  const directory = fixture(t);
  writeFileSync(join(directory, "package.json"), "{}\n");
  assert.deepEqual(detectCiMode(directory), {
    node: true,
    package_manager: "npm",
    npm_lock: false,
    deno: false,
    python: false,
    python_supported: false,
    python_reason: "not-detected",
    template: false,
  });

  writeFileSync(join(directory, "package-lock.json"), "{}\n");
  assert.deepEqual(detectCiMode(directory), {
    node: true,
    package_manager: "npm",
    npm_lock: true,
    deno: false,
    python: false,
    python_supported: false,
    python_reason: "not-detected",
    template: false,
  });
});

test("prefers Bun when a Bun lockfile is present", (t) => {
  const directory = fixture(t);
  writeFileSync(join(directory, "package.json"), "{}\n");
  writeFileSync(join(directory, "package-lock.json"), "{}\n");
  writeFileSync(join(directory, "bun.lock"), "# fixture\n");

  assert.deepEqual(detectCiMode(directory), {
    node: true,
    package_manager: "bun",
    npm_lock: false,
    deno: false,
    python: false,
    python_supported: false,
    python_reason: "not-detected",
    template: false,
  });
});

test("detects Deno edge functions", (t) => {
  const directory = fixture(t);
  const functionDirectory = join(directory, "supabase/functions/example");
  mkdirSync(functionDirectory, { recursive: true });
  writeFileSync(join(functionDirectory, "index.ts"), "export {};\n");

  assert.deepEqual(detectCiMode(directory), {
    node: false,
    package_manager: "none",
    npm_lock: false,
    deno: true,
    python: false,
    python_supported: false,
    python_reason: "not-detected",
    template: false,
  });
});

test("detects template self-tests", (t) => {
  const directory = fixture(t);
  mkdirSync(join(directory, "tests/template"), { recursive: true });

  assert.deepEqual(detectCiMode(directory), {
    node: false,
    package_manager: "none",
    npm_lock: false,
    deno: false,
    python: false,
    python_supported: false,
    python_reason: "not-detected",
    template: true,
  });
});

test("supports requirements.txt only when it declares pytest", (t) => {
  const directory = fixture(t);
  writeFileSync(join(directory, "requirements.txt"), "requests==2.0.0\npytest>=7.4.0\n");

  assert.equal(detectCiMode(directory).python, true);
  assert.equal(detectCiMode(directory).python_supported, true);
  assert.equal(detectCiMode(directory).python_reason, "requirements-pytest");
});

test("flags unsupported Python setups instead of silently skipping them", (t) => {
  const directory = fixture(t);
  writeFileSync(join(directory, "pyproject.toml"), "[project]\nname = 'example'\n");

  assert.equal(detectCiMode(directory).python, true);
  assert.equal(detectCiMode(directory).python_supported, false);
  assert.equal(detectCiMode(directory).python_reason, "unsupported-setup");
});

test("does not treat a JavaScript tool-only pyproject as a Python project", (t) => {
  const directory = fixture(t);
  writeFileSync(join(directory, "pyproject.toml"), "[tool.ruff]\nline-length = 100\n");

  assert.equal(detectCiMode(directory).python, false);
});

test("detects semantic pyproject headers with trailing TOML comments", (t) => {
  const directory = fixture(t);
  writeFileSync(join(directory, "pyproject.toml"), "[build-system]   # Python package metadata\nrequires = []\n");

  assert.equal(detectCiMode(directory).python, true);
  assert.equal(detectCiMode(directory).python_supported, false);
});

test("comments and similarly named packages do not declare pytest", (t) => {
  const directory = fixture(t);
  writeFileSync(join(directory, "requirements.txt"), "# pytest>=7\npytest-cov>=4\n");

  assert.equal(detectCiMode(directory).python, true);
  assert.equal(detectCiMode(directory).python_supported, false);
});
