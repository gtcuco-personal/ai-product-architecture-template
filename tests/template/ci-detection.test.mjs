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
  });

  writeFileSync(join(directory, "package-lock.json"), "{}\n");
  assert.deepEqual(detectCiMode(directory), {
    node: true,
    package_manager: "npm",
    npm_lock: true,
    deno: false,
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
  });
});
