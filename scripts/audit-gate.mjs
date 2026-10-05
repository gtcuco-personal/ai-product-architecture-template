#!/usr/bin/env node
// Gate do audit de dependências (ci.yml v8).
//
// Lê o relatório JSON do `bun audit --json` ou do `npm audit --json` e falha se houver avisos
// high/critical. Um aviso só deixa de bloquear se estiver na lista de excepções do repo,
// `.github/audit-allowlist.json` — ficheiro do repo consumidor, que o `/sync-repos` nunca toca.
//
// Porque existe: a 2026-09-18 saiu o GHSA-vfj7-8cjw-p6xm (`braces`, high, sem versão corrigida),
// que chega por `tailwindcss › micromatch` a qualquer repo com Tailwind 3. O audit passou a falhar
// em todos os PRs com código, sem nada que um PR pudesse corrigir — e um check sempre vermelho
// ensina a ignorá-lo. A excepção é por aviso, com motivo e data de revisão: quando a data passa,
// o gate volta a falhar até alguém decidir outra vez.
//
// Formato da lista:
//   [{ "id": "GHSA-xxxx-xxxx-xxxx", "package": "braces",
//      "reason": "porque não bloqueia e como se sai", "review_by": "AAAA-MM-DD" }]
//
// Uso: node scripts/audit-gate.mjs --pm bun|npm --report audit.json
//        [--allowlist .github/audit-allowlist.json] [--level high] [--today AAAA-MM-DD]

import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const SEVERITY_RANK = { info: 0, low: 1, moderate: 2, high: 3, critical: 4 };
const GHSA_RE = /GHSA-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Normaliza os dois formatos para [{ id, package, severity, title }].
export function collectAdvisories(report, pm) {
  if (!report || typeof report !== "object") throw new Error("relatório de audit vazio ou inválido");
  const out = [];
  if (pm === "bun") {
    for (const [pkg, list] of Object.entries(report)) {
      if (!Array.isArray(list)) continue;
      for (const a of list) out.push({ id: (a.url ?? "").match(GHSA_RE)?.[0]?.toUpperCase() ?? `bun:${a.id}`, package: pkg, severity: a.severity, title: a.title });
    }
  } else if (pm === "npm") {
    if (!report.vulnerabilities || typeof report.vulnerabilities !== "object") {
      throw new Error("relatório npm sem `vulnerabilities` — o audit não correu como esperado");
    }
    for (const [pkg, v] of Object.entries(report.vulnerabilities)) {
      for (const via of v.via ?? []) {
        if (typeof via !== "object") continue; // string = herdado de outro pacote, já contado lá
        out.push({ id: (via.url ?? "").match(GHSA_RE)?.[0]?.toUpperCase() ?? `npm:${via.source}`, package: via.name ?? pkg, severity: via.severity, title: via.title });
      }
    }
  } else {
    throw new Error(`gestor de pacotes desconhecido: ${pm}`);
  }
  // O mesmo aviso pode vir por vários caminhos; conta uma vez por (id, pacote).
  const seen = new Set();
  return out.filter((a) => {
    const k = `${a.id}|${a.package}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function validateAllowlist(list) {
  if (!Array.isArray(list)) return ["a lista de excepções tem de ser um array JSON"];
  const errors = [];
  list.forEach((e, i) => {
    const where = `excepção [${i}]`;
    if (!e || typeof e !== "object") return errors.push(`${where}: não é um objecto`);
    if (typeof e.id !== "string" || !GHSA_RE.test(e.id) || e.id.match(GHSA_RE)[0] !== e.id) errors.push(`${where}: \`id\` tem de ser um GHSA (ex. GHSA-vfj7-8cjw-p6xm)`);
    if (typeof e.package !== "string" || !e.package.trim()) errors.push(`${where}: falta \`package\``);
    if (typeof e.reason !== "string" || e.reason.trim().length < 20) errors.push(`${where}: \`reason\` tem de explicar porque não bloqueia e como se sai (≥20 caracteres)`);
    if (typeof e.review_by !== "string" || !DATE_RE.test(e.review_by) || Number.isNaN(Date.parse(e.review_by))) errors.push(`${where}: \`review_by\` tem de ser uma data AAAA-MM-DD`);
  });
  return errors;
}

export function evaluate(advisories, allowlist, { level = "high", today }) {
  const min = SEVERITY_RANK[level];
  if (min === undefined) throw new Error(`nível desconhecido: ${level}`);
  const blocking = advisories.filter((a) => (SEVERITY_RANK[a.severity] ?? 0) >= min);
  const allowed = new Map(allowlist.map((e) => [`${e.id.toUpperCase()}|${e.package}`, e]));
  const expired = allowlist.filter((e) => e.review_by < today);
  const failures = blocking.filter((a) => !allowed.has(`${a.id}|${a.package}`));
  const waived = blocking.filter((a) => allowed.has(`${a.id}|${a.package}`));
  const unused = allowlist.filter((e) => !blocking.some((a) => a.id === e.id.toUpperCase() && a.package === e.package));
  return { failures, waived, expired, unused, ok: failures.length === 0 && expired.length === 0 };
}

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

function main() {
  const pm = arg("pm");
  const reportPath = arg("report");
  const allowlistPath = arg("allowlist", ".github/audit-allowlist.json");
  const level = arg("level", "high");
  const today = arg("today", new Date().toISOString().slice(0, 10));

  let report;
  try {
    report = JSON.parse(readFileSync(reportPath, "utf8"));
  } catch (err) {
    // Relatório vazio ou ilegível = o audit não correu. Nunca é "sem avisos".
    console.log(`::error::O audit não produziu um relatório legível (${err.message}). Sem relatório, não há verde.`);
    process.exit(1);
  }

  let allowlist = [];
  if (existsSync(allowlistPath)) {
    try {
      allowlist = JSON.parse(readFileSync(allowlistPath, "utf8"));
    } catch (err) {
      console.log(`::error file=${allowlistPath}::JSON inválido: ${err.message}`);
      process.exit(1);
    }
    const errors = validateAllowlist(allowlist);
    if (errors.length) {
      for (const e of errors) console.log(`::error file=${allowlistPath}::${e}`);
      process.exit(1);
    }
  }

  const advisories = collectAdvisories(report, pm);
  const r = evaluate(advisories, allowlist, { level, today });

  for (const a of r.waived) {
    const e = allowlist.find((x) => x.id.toUpperCase() === a.id && x.package === a.package);
    console.log(`::notice::${a.id} (${a.package}, ${a.severity}) em excepção até ${e.review_by}: ${e.reason}`);
  }
  for (const e of r.unused) {
    console.log(`::warning file=${allowlistPath}::${e.id} (${e.package}) já não aparece no audit com severidade ≥ ${level} — a excepção pode sair.`);
  }
  for (const e of r.expired) {
    console.log(`::error file=${allowlistPath}::A excepção ${e.id} (${e.package}) passou da data de revisão (${e.review_by}). Decidir outra vez: corrigir, ou renovar a data com o motivo actualizado.`);
  }
  for (const a of r.failures) {
    console.log(`::error::${a.id} — ${a.package} (${a.severity}): ${a.title}`);
  }
  console.log(`audit-gate: ${advisories.length} avisos no relatório; ${r.failures.length} a bloquear, ${r.waived.length} em excepção, ${r.expired.length} excepções expiradas.`);
  process.exit(r.ok ? 0 : 1);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
