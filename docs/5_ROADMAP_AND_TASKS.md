# Roadmap & Tasks

> **Last updated:** 2026-05-07

## Task Format

```
- YYYY-MM-DD — Brief description of what was done (PR #N) → `file1`, `file2`
```

> **Rule:** Every merged PR must have a completed entry here with its PR number. No exceptions.

## Completed

### 2026-05-17 — Testing governance v1.17 (PR #40)

- 2026-05-17 — Add `docs/11_TESTING.md` (pyramid, frameworks, coverage, CI gates, AI evals linked to ISO 42001 A.7.2) + ODR-005 (testing governance + 4-location sync policy) + sync chain (SYSTEM_PROMPT §1+§6, CLAUDE.md Context Loading Policy, README.md) → `docs/11_TESTING.md`, `docs/decisions/template/ODR-005-testing-governance-and-doc-sync-policy.md`, `SYSTEM_PROMPT.md`, `CLAUDE.md`, `README.md`

### 2026-05-17 — Compliance refresh v1.16 (PR #39)

- 2026-05-17 — EU Cyber Resilience Act (CRA) + SBOM added to Tier 3; ISO 25010:2023 Safety + Flexibility; GDPR Art. 25 + RoPA; OWASP ASVS + NIST SSDF; NIS2 scope note; ISO 42001 Annex SL; vulnerability disclosure timeline (ISO 29147/30111); 3 trigger matrix rows added → `docs/13_COMPLIANCE_FRAMEWORKS.md`, `docs/14_AI_GOVERNANCE.md`, `SECURITY.md`, `docs/0_GROUND_RULES.md`, `SYSTEM_PROMPT.md`

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

- [ ] [task description]

### Medium Priority

- [ ] [task description]

### Low Priority

- [ ] [task description]
