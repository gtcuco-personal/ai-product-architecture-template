#!/usr/bin/env node

import { existsSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

export function detectCiMode(root = process.cwd()) {
  const packageJson = existsSync(resolve(root, "package.json"));
  const npmLock = existsSync(resolve(root, "package-lock.json"));
  const bunLock = existsSync(resolve(root, "bun.lock")) || existsSync(resolve(root, "bun.lockb"));
  const packageManager = packageJson ? (bunLock ? "bun" : "npm") : "none";
  const functionsRoot = resolve(root, "supabase/functions");
  let deno = false;

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
