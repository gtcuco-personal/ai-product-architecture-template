# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.13] — 2026-04-21

### Added

- `.claude/agents/isolated-worker.md` — worktree-isolated subagent for heavy/risky work (refactors, migrations, upgrades). Runs inside a temporary git worktree so the primary working directory is never mutated until the user merges.
- `.claude/agents/safe-explorer.md` — read-only subagent for exploration and architecture questions. No Write/Edit/Bash; hard guarantee nothing on disk changes.
- `CLAUDE.md` — new "Isolated Work (worktree subagents)" section documenting when to delegate to each subagent, invocation example, and the main-session limitation (worktree isolation is subagent-only).

## [1.12] — 2026-03-31

### Added

- `docs/8_DATA_AND_ANALYSIS.md` — stack-agnostic and domain-agnostic data governance template: metric registry, assumptions log, source contracts, pipeline & execution order, data quality checks, cohort definitions, data privacy rules, decisions log
- `SYSTEM_PROMPT.md` §1 — new entry in source-of-truth table for `docs/8_DATA_AND_ANALYSIS.md`
- `SYSTEM_PROMPT.md` §6 — new trigger matrix row: "Metric definition, assumption, source contract, or pipeline change → `docs/8_DATA_AND_ANALYSIS.md`"
- `CLAUDE.md` — new row in Context Loading Policy: "Code — data/analysis"

## [1.11] — 2026-03-31

### Added

- `docs/3_UI_UX_GUIDELINES.md` — UI Patterns section: Form, Data Table, Page Layout, Auth, Modal/Confirmation patterns
- `docs/3_UI_UX_GUIDELINES.md` — States section: Empty, Loading, Error, Permission, Destructive action patterns
- `docs/prompts.md` — Lovable Vocabulary Reference table (controlled terms to eliminate prompt drift)
- `docs/prompts.md` — Prompt Structure skeleton and DO NOT list (10 explicit Lovable restrictions)
- `docs/7_CONTENT_I18N.md` — New file: UI copy rules, i18n key naming convention, namespace strategy, copy rules, length constraints

## [1.10] — 2026-03-30

### Changed

- `SYSTEM_PROMPT.md` — RLS replaced with generic authorisation model; Edge functions → API handlers and server functions (PR #22)
- `docs/0_GROUND_RULES.md` — `dangerouslySetInnerHTML` rule generalised to cover React, Vue, vanilla JS; RLS verified → access control verified (PR #22)
- `CLAUDE.md` + `docs/0_GROUND_RULES.md` — deploy command placeholder added to Dev Commands (PR #22)

## [1.9] — 2026-03-30

### Added

- Context Loading Policy in `CLAUDE.md` — task-type → docs mapping table; agents load only relevant files per task type, not all docs by default (PR #20)
- `docs/guides/git-crypt-setup.md` — git-crypt setup guide for encrypting secrets in repos (PR #18)

### Changed

- `SYSTEM_PROMPT.md` §1 updated to delegate context-loading decisions to `CLAUDE.md`, eliminating ambiguity between the two files (PR #20)
- `SECURITY.md` updated with encrypted files policy (PR #18)
- Roadmap entry format now requires PR number for traceability (PR #17)
- Every PR now required to update roadmap + changelog before merge (PR #16)

### Removed

- Duplicate files `docs/6_CONTENT_AND_SOCIAL 2.md` and `docs/prompts 2.md`

## [1.8] — 2026-03-15

### Added

- `docs/6_CONTENT_AND_SOCIAL.md` — Content & social media strategy template with SEO/AEO 2026 best practices
- Source of truth entry for content strategy in `SYSTEM_PROMPT.md` §1
- Documentation trigger for content/social changes in `SYSTEM_PROMPT.md` §6
- PR number requirement in roadmap entry format (`SYSTEM_PROMPT.md` §3)

## [1.7] — 2026-03-14

### Added

- Debugging Escalation (4-Step Framework) in `SYSTEM_PROMPT.md` §3 — structured debugging ladder: Quick Fix → Flashlight → Third-Party → Revert (ODR-003)
- Build Health Checker in `SYSTEM_PROMPT.md` §3 — checklist to identify structurally compromised builds
- Security Review Questions in `SECURITY.md` — 6 practical questions before any feature goes live
- Auth Setup Checklist in `SECURITY.md` — pre-ship auth verification steps
- Database Design Checklist in `docs/2_ARCHITECTURE.md` — data-first design guidance
- Design System Checklist in `docs/3_UI_UX_GUIDELINES.md` — global parameters before screens
- Mobile-First Checklist in `docs/3_UI_UX_GUIDELINES.md` — practical mobile design rules
- Publishing Checklist in `docs/0_GROUND_RULES.md` — pre-deploy verification steps

## [1.6] — 2026-03-14

### Added

- Documentation Maintenance trigger matrix in `SYSTEM_PROMPT.md` §6 — proactive doc updates enforced as part of task completion (ODR-001)
- ODR namespace convention: `docs/decisions/` for local ODRs, `docs/decisions/template/` for template-inherited ODRs (ODR-002)
- New checklist item in `SYSTEM_PROMPT.md` §8: documentation trigger table check
- Agent self-governance row in trigger matrix
- Decision Records section in `CONTRIBUTING.md` with namespace convention

### Changed

- `SYSTEM_PROMPT.md` §1 source-of-truth table now lists both `docs/decisions/` and `docs/decisions/template/`
- Moved `ODR-001-documentation-trigger-matrix.md` from `docs/decisions/` to `docs/decisions/template/`

## [1.0] — 2026-03-11

### Added

- Initial project setup
- Governance framework (CLAUDE.md, CONTRIBUTING.md, SECURITY.md, SYSTEM_PROMPT.md, CHANGELOG.md)
- Documentation structure (`docs/`)
