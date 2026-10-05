import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

import { collectAdvisories, evaluate, validateAllowlist } from "../../scripts/audit-gate.mjs";

const GATE = resolve("scripts/audit-gate.mjs");
const BRACES = "GHSA-vfj7-8cjw-p6xm";

// Formas reais, reduzidas, de `bun audit --json` e `npm audit --json` (lusiberiastays2, 2026-10-05).
const bunReport = {
  braces: [{ id: 1240992, url: `https://github.com/advisories/${BRACES}`, title: "braces DoS", severity: "high" }],
  "@babel/core": [{ id: 1123528, url: "https://github.com/advisories/GHSA-4x5r-pxfx-6jf8", title: "file read", severity: "low" }],
};
const npmReport = {
  vulnerabilities: {
    braces: { name: "braces", severity: "high", via: [{ source: 1240992, name: "braces", url: `https://github.com/advisories/${BRACES}`, title: "braces DoS", severity: "high" }] },
    micromatch: { name: "micromatch", severity: "high", via: ["braces"] },
  },
};
const allow = [{ id: BRACES, package: "braces", reason: "só no build do Tailwind 3; sai com o Tailwind 4", review_by: "2026-12-31" }];

test("normaliza bun e npm para o mesmo aviso, sem contar heranças", () => {
  const bun = collectAdvisories(bunReport, "bun");
  const npm = collectAdvisories(npmReport, "npm");
  assert.deepEqual(bun.find((a) => a.package === "braces"), { id: BRACES.toUpperCase(), package: "braces", severity: "high", title: "braces DoS" });
  assert.equal(npm.length, 1, "micromatch só herda o aviso do braces");
  assert.equal(npm[0].id, BRACES.toUpperCase());
});

test("relatório vazio ou com forma errada nunca é verde", () => {
  assert.throws(() => collectAdvisories(null, "bun"));
  assert.throws(() => collectAdvisories({}, "npm"), /vulnerabilities/);
  assert.throws(() => collectAdvisories({}, "yarn"), /desconhecido/);
});

test("sem excepção, um high bloqueia; um low não", () => {
  const r = evaluate(collectAdvisories(bunReport, "bun"), [], { today: "2026-10-05" });
  assert.equal(r.ok, false);
  assert.deepEqual(r.failures.map((a) => a.package), ["braces"]);
});

test("com excepção válida, passa e diz que está em excepção", () => {
  const r = evaluate(collectAdvisories(bunReport, "bun"), allow, { today: "2026-10-05" });
  assert.equal(r.ok, true);
  assert.equal(r.waived.length, 1);
});

test("excepção expirada volta a falhar, mesmo com o aviso coberto", () => {
  const r = evaluate(collectAdvisories(bunReport, "bun"), allow, { today: "2027-01-01" });
  assert.equal(r.ok, false);
  assert.equal(r.expired.length, 1);
});

test("a excepção é por pacote: o mesmo GHSA noutro pacote continua a bloquear", () => {
  const other = { lodash: [{ id: 1, url: `https://github.com/advisories/${BRACES}`, title: "x", severity: "high" }] };
  const r = evaluate(collectAdvisories(other, "bun"), allow, { today: "2026-10-05" });
  assert.equal(r.ok, false);
});

test("excepção que já não é precisa é assinalada", () => {
  const r = evaluate([], allow, { today: "2026-10-05" });
  assert.equal(r.ok, true);
  assert.equal(r.unused.length, 1);
});

test("a lista exige id GHSA, pacote, motivo e data", () => {
  assert.deepEqual(validateAllowlist(allow), []);
  assert.equal(validateAllowlist([{ id: "CVE-2026-93687", package: "braces", reason: "x".repeat(25), review_by: "2026-12-31" }]).length, 1);
  assert.equal(validateAllowlist([{ id: BRACES, package: "braces", reason: "curto", review_by: "2026-12-31" }]).length, 1);
  assert.equal(validateAllowlist([{ id: BRACES, package: "braces", reason: "x".repeat(25), review_by: "31/12/2026" }]).length, 1);
  assert.equal(validateAllowlist({}).length, 1);
});

function run(t, files, args) {
  const dir = mkdtempSync(join(tmpdir(), "ai-template-audit-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(join(dir, name, ".."), { recursive: true });
    writeFileSync(join(dir, name), content);
  }
  return spawnSync(process.execPath, [GATE, ...args], { cwd: dir, encoding: "utf8" });
}

test("CLI: sem lista de excepções, falha com o aviso no output", (t) => {
  const r = run(t, { "audit.json": JSON.stringify(bunReport) }, ["--pm", "bun", "--report", "audit.json", "--today", "2026-10-05"]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /::error::GHSA-VFJ7-8CJW-P6XM — braces/);
});

test("CLI: com a lista do repo, passa", (t) => {
  const r = run(t, { "audit.json": JSON.stringify(npmReport), ".github/audit-allowlist.json": JSON.stringify(allow) }, ["--pm", "npm", "--report", "audit.json", "--today", "2026-10-05"]);
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /::notice::GHSA-VFJ7-8CJW-P6XM \(braces, high\) em excepção até 2026-12-31/);
});

test("CLI: relatório vazio falha (o audit não correu)", (t) => {
  const r = run(t, { "audit.json": "" }, ["--pm", "bun", "--report", "audit.json"]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /não produziu um relatório legível/);
});

test("CLI: lista de excepções com JSON inválido falha", (t) => {
  const r = run(t, { "audit.json": JSON.stringify(bunReport), ".github/audit-allowlist.json": "[{" }, ["--pm", "bun", "--report", "audit.json"]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /JSON inválido/);
});
