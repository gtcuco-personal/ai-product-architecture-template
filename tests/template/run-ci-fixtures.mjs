#!/usr/bin/env node

import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { detectCiMode } from "../../scripts/detect-ci-mode.mjs";

const templateTestsRoot = dirname(fileURLToPath(import.meta.url));
const fixturesRoot = join(templateTestsRoot, "fixtures");
const requestedMode = process.argv.find((argument) => argument.startsWith("--mode="))?.slice(7) ?? "all";
const supportedModes = new Set(["all", "npm", "bun", "deno"]);

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
  });
  run(
    "deno",
    ["check", "--node-modules-dir=auto", "--no-lock", "example/index.ts"],
    join(root, "supabase/functions"),
  );
}

console.log(`\nCI fixture integration passed (${requestedMode}).`);
