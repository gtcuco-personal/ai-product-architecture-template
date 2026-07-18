# [Repo Name] — Index

> **Last updated:** 2026-07-18
> **Mandatory governance file.** Must be updated in every PR that adds, moves, or removes content in `stakeholders/`, `pitches/`, `research/`, `decisions/`, `meetings/`, or equivalent artifact folders. Refreshed automatically by `/sync-docs` and created by `/sync-repos` where missing.

## Purpose

Mapa rápido do que existe e onde está. Duas audiências:
1. **Humano** — encontrar artifacts sem `grep` (briefings, decisões, research, stakeholders)
2. **Claude / agents** — ler UM ficheiro antes de explorar, poupando tokens

## 🟢 Active initiatives

Lista de workstreams, deals ou projectos activos. Cada entrada:

- **Nome da iniciativa**
- 1 linha de descrição / contexto
- Links para artifacts principais (proposals, research, decisions, stakeholders)
- Status actual

### Downstream propagation

- Propagate v2.2 to child repos through `/sync-repos` after PR #50 is merged
- Verify the separate skills sync in the `agents-and-skills` repo before marking complete
- **Status:** Pending downstream propagation after PR #50; external repo status not assumed here

Exemplo:

```
### [Nome da iniciativa]
- Proposta: `path/to/proposal.md`
- Stakeholder: `stakeholders/nome.md`
- Research: `research/folder/`
- Decisão pendente: `decisions/briefing.md`
- **Status:** [aguardar decisão X / em execução / bloqueado por Y]
```

## 📁 Folder map

Estrutura de pastas principais com 1 linha de propósito:

- `docs/` — governance: roadmap, compliance frameworks, AI governance, testing, dependency management, health check (`15_`), architecture, content/SEO/AEO/GEO (`6_`, merged with the former `4_`)
- `docs/decisions/` — local ODRs (project-specific decisions)
- `docs/decisions/template/` — template ODRs inherited by all repos (ODR-001 to ODR-009)
- `docs/guides/` — setup guides (git-crypt, Lovable vocabulary, etc.)
- `skills/` — template for creating project-level Agent Skills
- `tasks/` — `lessons.md` for session corrections
- `.claude/agents/` — pre-configured subagents (isolated-worker, safe-explorer)
- `.githooks/` — pre-commit secrets scanner (gitleaks)
- `.github/workflows/` — CI for build/test, secret scanning, Deno checks, and governance validation
- `scripts/` — dependency-free repository validation utilities
- `tests/template/` — temporary profile/unit tests plus executable npm/Bun/Deno fixture projects; removed when a profile is applied

## 🗄️ Archive

Iniciativas completas, pausadas ou abandonadas. Mantêm-se aqui para contexto histórico sem poluir a vista activa.

### Executable CI fixtures (v2.2) — 2026-07-18

- Added dependency-free npm, Bun, and Deno mini-projects under `tests/template/fixtures/`
- Hosted CI executed locked installs, lint/build/test scripts, dependency audits, and Deno type-checks successfully
- **Status:** Complete in this repo via PR #50

### Multi-agent governance hardening (v2.1) — 2026-07-18

- Added portable agent guidance, runtime-safe instruction precedence, four scaffold profiles, CI mode detection, governance validation, and hardened dependency/secret checks
- Added 10 temporary-fixture tests covering all profiles plus docs-only, npm, Bun, and Deno detection
- ODR-008 and ODR-009 record the portable entry point and profile contract
- All five GitHub-hosted CI jobs passed on PR #49
- **Status:** Complete in this repo via PR #49

### Lean-by-default restructure (v2.0) — 2026-07-02
- PRs #46, #47, and #48 merged to main
- Full audit (docs 0-14, skills, CI, ODRs) + 12-repo adoption sweep found stale facts, drifted duplication, and enterprise-shaped defaults with near-zero downstream adoption
- Merged `4_SEO_AND_AEO.md` into `6_CONTENT_AND_SOCIAL.md`; renamed `6_HEALTH_CHECK.md` → `15_HEALTH_CHECK.md`; added Applicability Gate + "Enterprise/regulated — opt-in" tags; ODR-007
- Remaining cross-repo work moved to the active Downstream propagation initiative
- **Status:** Complete in this repo

### Compliance & Architecture refresh (v1.16–1.18) — 2026-05-17
- PRs #39, #40, #41 merged to main
- Added: EU Cyber Resilience Act, ISO 25010:2023 Safety, GDPR Art. 25, OWASP ASVS, `docs/11_TESTING.md`, `docs/12_DEPENDENCY_MANAGEMENT.md`, ODR-005, ODR-006
- **Status:** Complete

## Convention

Governance rules para este ficheiro:

1. **Obrigatório** em todos os repos governados por `ai-product-architecture-template`
2. Cada PR que adiciona, move ou remove conteúdo em pastas de artifacts deve actualizar esta INDEX
3. A data "Last updated" deve reflectir o último update
4. Iniciativas movem de "Active" para "Archive" quando completas — não são removidas
5. Se uma entrada tiver >5 links, considerar README.md dedicado na pasta da iniciativa
6. `/sync-docs` refresca automaticamente este ficheiro a cada run
7. `/sync-repos` audita a presença e auto-popula onde falta
