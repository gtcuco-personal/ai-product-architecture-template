# Roadmap & Tasks

> **Last updated:** 2026-07-18

## Task Format

```
- YYYY-MM-DD — Brief description of what was done (PR #N) → `file1`, `file2`
```

> **Rule:** Every merged PR must have a completed entry here with its PR number. No exceptions.

## In Progress

No active template changes.

## Completed

### 2026-07-18 — Executable CI fixtures v2.2 (PR #50)

- [x] Add static npm, Bun, and Deno mini-projects and prove their real locked install, lint, build, test, audit, and type-check paths in hosted CI → `.github/workflows/ci.yml`, `tests/template/fixtures/`, `tests/template/run-ci-fixtures.mjs`, `scripts/check-governance.mjs`, `docs/11_TESTING.md`, `README.md`, `SYSTEM_PROMPT.md`, `CHANGELOG.md`, `INDEX.md`

### 2026-07-18 — Multi-agent governance hardening v2.1 (PR #49)

- [x] Add portable `AGENTS.md`; correct runtime precedence; record ODR-008/009; add four safe scaffold profiles; add npm/Bun/Deno detection fixtures; harden GitHub Actions and Gitleaks; repair current INDEX/README/ODR drift; confirm all five hosted CI jobs → `AGENTS.md`, `CLAUDE.md`, `SYSTEM_PROMPT.md`, `README.md`, `INDEX.md`, `CHANGELOG.md`, `.github/workflows/ci.yml`, `.gitleaks.toml`, `scripts/`, `tests/template/`, `docs/10_AGENT_SAFETY.md`, `docs/11_TESTING.md`, `docs/12_DEPENDENCY_MANAGEMENT.md`, `docs/decisions/template/ODR-008-portable-agent-entry-point.md`, `docs/decisions/template/ODR-009-profile-scaffolding-contract.md`, `SECURITY.md`

### 2026-07-02 — CI gitleaks job + npm audit, PR 3 of 4 (PR #48)

- 2026-07-02 — Add `gitleaks` job to CI (full-history secret scan, fails build on real finding — closes the gap where Lovable/direct-to-main commits never ran the local pre-commit hook); wire `npm audit --audit-level=high` into `build-test` (report-only); correct `docs/11_TESTING.md` job matrix and `SECURITY.md` to describe the CI that actually runs → `.github/workflows/ci.yml`, `docs/11_TESTING.md`, `SECURITY.md`

### 2026-07-02 — Lean-by-default restructure + v2.0, PR 2 of 4 (PR #47)

- 2026-07-02 — Merge `docs/4_SEO_AND_AEO.md` into `docs/6_CONTENT_AND_SOCIAL.md`; rename `docs/6_HEALTH_CHECK.md` → `docs/15_HEALTH_CHECK.md`; split `docs/prompts.md` (Lovable vocabulary → `docs/guides/lovable-vocabulary.md`); add Applicability Gate to `docs/13_COMPLIANCE_FRAMEWORKS.md` and tag heavy sections "Enterprise/regulated — opt-in" across docs 11/12/14 + SECURITY.md; drop "stack-agnostic" claim in README.md; bump SYSTEM_PROMPT.md to v2.0; ODR-007 → `docs/6_CONTENT_AND_SOCIAL.md`, `docs/15_HEALTH_CHECK.md`, `docs/prompts.md`, `docs/guides/lovable-vocabulary.md`, `docs/13_COMPLIANCE_FRAMEWORKS.md`, `docs/11_TESTING.md`, `docs/12_DEPENDENCY_MANAGEMENT.md`, `docs/14_AI_GOVERNANCE.md`, `SECURITY.md`, `README.md`, `CLAUDE.md`, `SYSTEM_PROMPT.md`, `INDEX.md`, `docs/decisions/template/ODR-007-lean-by-default-governance.md`

### 2026-07-02 — Factual fixes + dedup, PR 1 of 4 (PR #46)

- 2026-07-02 — Full-template audit (docs 0-14 + skills + CI + ODRs), then correct stale facts (FID→INP, CRA date confusion, EU AI Act Digital Omnibus deferrals, hardcoded model examples, unsourced AEO stats, stale AI crawler list, ephemeral anchors) and deduplicate content that had drifted across 2-3 files (Trust Hierarchy, routes/structure, CRA/SBOM timeline, Decisions Log format) → `CLAUDE.md`, `CONTRIBUTING.md`, `SECURITY.md`, `docs/3_UI_UX_GUIDELINES.md`, `docs/4_SEO_AND_AEO.md`, `docs/6_CONTENT_AND_SOCIAL.md`, `docs/6_HEALTH_CHECK.md`, `docs/7_CONTENT_I18N.md`, `docs/8_DATA_AND_ANALYSIS.md`, `docs/9_AGENT_SKILLS.md`, `docs/10_AGENT_SAFETY.md`, `docs/11_TESTING.md`, `docs/12_DEPENDENCY_MANAGEMENT.md`, `docs/14_AI_GOVERNANCE.md`

### 2026-07-01 — Gate governance-check no ci.yml (#44)
- [x] Novo job `governance-check` no `ci.yml` universal: barra PRs que tocam artefactos (videos/edge-fns/migrations/stakeholders/pitches/research/decisions/meetings) sem actualizar INDEX/CHANGELOG. Universal (grep não casa → verde em repos sem essas pastas). Auditado por `/sync-repos`. → `.github/workflows/ci.yml`

### 2026-05-17 — Dependency management governance v1.18 (PR #41)

- 2026-05-17 — Add `docs/12_DEPENDENCY_MANAGEMENT.md` (licence policy, SBOM, SLSA Level 2, CVE SLAs, EOL tracking) + ODR-006 + sync chain → `docs/12_DEPENDENCY_MANAGEMENT.md`, `docs/decisions/template/ODR-006-dependency-governance-tier.md`, `SYSTEM_PROMPT.md`, `CLAUDE.md`, `README.md`, `SECURITY.md`

### 2026-05-17 — Testing governance v1.17 (PR #40)

- 2026-05-17 — Add `docs/11_TESTING.md` + ODR-005 + sync chain → `docs/11_TESTING.md`, `docs/decisions/template/ODR-005-testing-governance-and-doc-sync-policy.md`, `SYSTEM_PROMPT.md`, `CLAUDE.md`, `README.md`

### 2026-05-17 — Compliance refresh v1.16 (PR #39)

- 2026-05-17 — CRA + SBOM + ISO 25010:2023 Safety + GDPR Art. 25 + OWASP ASVS + ISO 29147/30111 → `docs/13_COMPLIANCE_FRAMEWORKS.md`, `docs/14_AI_GOVERNANCE.md`, `SECURITY.md`, `docs/0_GROUND_RULES.md`, `SYSTEM_PROMPT.md`

### 2026-05-07 — Migração path local: ~/Documents/github → ~/devs/github (#37)

- 2026-05-07 — Repo movido localmente para fora do iCloud Drive (eviction de ficheiros provocava falhas de acesso intermitentes)
- 2026-05-07 —  actualizado em PR #37

- 2026-05-03 — Add compliance frameworks directory + AI governance template (PR #36) → `docs/13_COMPLIANCE_FRAMEWORKS.md`, `docs/14_AI_GOVERNANCE.md`, `SYSTEM_PROMPT.md`, `CLAUDE.md`, `CHANGELOG.md`
- 2026-05-01 — Add cross-layer content doctrine (i18n vs storage vs MD) — tech-agnostic framework codified in `7_CONTENT_I18N.md` Part 1, ODR-004, updated CLAUDE/SYSTEM_PROMPT context-loading and trigger matrix (PR #35) → `docs/7_CONTENT_I18N.md`, `docs/decisions/template/ODR-004-content-layer-doctrine.md`, `CLAUDE.md`, `SYSTEM_PROMPT.md`, `CHANGELOG.md`
- 2026-04-21 — Add worktree-isolated subagents to template (PR #33) → `.claude/agents/isolated-worker.md`, `.claude/agents/safe-explorer.md`, `CLAUDE.md`, `CHANGELOG.md`
- 2026-03-31 — Add stack-agnostic data & analysis governance (PR #26) → `docs/8_DATA_AND_ANALYSIS.md`, `SYSTEM_PROMPT.md`, `CLAUDE.md`
- 2026-03-31 — Add UI Patterns, States, Vocabulary table, DO NOT list, and Content/i18n guidelines (PR #25) → `docs/3_UI_UX_GUIDELINES.md`, `docs/prompts.md`, `docs/7_CONTENT_I18N.md`
- 2026-03-30 — Remove stack-specific language; add deploy command placeholder (PR #22) → `CLAUDE.md`, `SYSTEM_PROMPT.md`, `docs/0_GROUND_RULES.md`
- 2026-03-30 — Add Context Loading Policy — task-type → docs mapping table to prevent context bloat (PR #20) → `CLAUDE.md`, `SYSTEM_PROMPT.md`
- 2026-03-28 — Add git-crypt guide and update SECURITY.md with encrypted files policy (PR #18) → `SECURITY.md`, `docs/guides/git-crypt-setup.md`
- 2026-03-28 — Require PR number in commit/PR title for visibility (PR #17) → `SYSTEM_PROMPT.md`
- 2026-03-28 — Require roadmap + changelog update in every PR (PR #16) → `SYSTEM_PROMPT.md`
- 2026-03-15 — Enhance UI/UX guidelines with spacing scale, tone, components (PR #15) → `docs/3_UI_UX_GUIDELINES.md`
- 2026-03-15 — Add AI crawler and llms.txt guidance to SEO doc (PR #14) → `docs/4_SEO_AND_AEO.md`
- 2026-03-15 — Add GEO layer to content strategy template (PR #13) → `docs/6_CONTENT_AND_SOCIAL.md`
- 2026-03-15 — Add reusable prompt patterns template (PR #12) → `docs/prompts.md`
- 2026-03-15 — Add content & social media strategy template v1.8 (PR #11) → `docs/6_CONTENT_AND_SOCIAL.md`
- 2026-03-14 — Add weekly health check checklist (PR #9) → `docs/6_HEALTH_CHECK.md`
- [date] — Initial project setup → `CLAUDE.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SYSTEM_PROMPT.md`, `CHANGELOG.md`, `docs/`

## Backlog

### High Priority

No open high-priority items.

### Medium Priority

- [ ] [task description]

### Low Priority

- [ ] [task description]
