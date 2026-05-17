# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.17] — 2026-05-17 — Testing governance: docs/11_TESTING.md + 4-location sync policy

### Added

- `docs/11_TESTING.md` — testing strategy: pyramid (70/20/10), framework selection per stack, coverage thresholds, CI/CD gates, test data strategy, Done definition, AI-specific testing (ISO 42001 A.7.2 — output regression, prompt injection, bias drift, hallucination rate)
- `docs/decisions/template/ODR-005-testing-governance-and-doc-sync-policy.md` — formalises (1) why testing has a dedicated doc and (2) the 4-location sync policy that must be followed whenever a doc is added/removed from `docs/`

### Changed

- `SYSTEM_PROMPT.md` — §1 source table: `docs/11_TESTING.md` entry added; §6 trigger matrix: 3 new rows (testing, dependency management, SBOM/vulnerability); version 1.17 changelog entry
- `CLAUDE.md` — Context Loading Policy: 2 new task types ("Code — test / CI pipeline", "Code — AI feature with eval")
- `README.md` — "What's Included" directory listing updated with `11_TESTING.md`, `13_COMPLIANCE_FRAMEWORKS.md`, `14_AI_GOVERNANCE.md`

## [1.16] — 2026-05-17 — Compliance refresh: CRA, ISO 25010:2023, GDPR Art. 25, OWASP ASVS

### Added

- `docs/13_COMPLIANCE_FRAMEWORKS.md` — EU Cyber Resilience Act (CRA, Reg. 2024/2847) in Tier 3 with SBOM checklist and timeline (11 Sep 2026 vulnerability reporting, 11 Dec 2027 full compliance)
- `docs/13_COMPLIANCE_FRAMEWORKS.md` — OWASP ASVS v4.0 and NIST SSDF (SP 800-218) in Tier 3 Security
- `docs/13_COMPLIANCE_FRAMEWORKS.md` — Privacy by Design Checklist (GDPR Art. 25) with 7-item checklist and EDPB Feb 2026 guidance note
- `SECURITY.md` — SBOM section with format, tooling, storage, and CRA obligation notes
- `SECURITY.md` — Vulnerability disclosure timeline table (ISO/IEC 29147:2018 + ISO/IEC 30111:2019); CRA ENISA 24h / 72h notification requirements
- `docs/0_GROUND_RULES.md` — 3 new items in Publishing Checklist: SBOM, Privacy by Design, CRA security support period
- `SYSTEM_PROMPT.md` — 3 new trigger matrix rows: SBOM/vulnerability, testing, dependency management

### Changed

- `docs/13_COMPLIANCE_FRAMEWORKS.md` — ISO 25010:2023: "Portability" renamed to "Flexibility", "Safety" added as 9th characteristic; header updated from "Eight" to "Nine quality characteristics"
- `docs/13_COMPLIANCE_FRAMEWORKS.md` — ISO 42001 Annex SL integration note added (interoperability with ISO 27001/9001)
- `docs/13_COMPLIANCE_FRAMEWORKS.md` — GDPR minimum obligations: added RoPA (Art. 30) and Privacy by Design (Art. 25) items
- `docs/13_COMPLIANCE_FRAMEWORKS.md` — PCI DSS: v3.2.1 EOL note (superseded 31 Mar 2025, v4.0 mandatory)
- `docs/13_COMPLIANCE_FRAMEWORKS.md` — NIST CSF 2.0: Govern function note added
- `docs/13_COMPLIANCE_FRAMEWORKS.md` — NIS2: scope note clarifying sector-triggered applicability (not only government profile)
- `docs/14_AI_GOVERNANCE.md` — ISO 42001 Annex SL note; AI Inventory: "Testing strategy" field added
- `SECURITY.md` — Dependencies section updated with pointer to `docs/12_DEPENDENCY_MANAGEMENT.md` (PR 3)
- `SYSTEM_PROMPT.md` — Version 1.16 changelog entry

## 2026-05-07 — Migração path local: ~/Documents/github → ~/devs/github (#37)

- Repo movido localmente para fora do iCloud Drive (eviction provocava falhas de acesso)
- Path references actualizadas em CLAUDE.md (mergeada em PR #37)

## [1.15] — 2026-05-03

### Added

- `docs/13_COMPLIANCE_FRAMEWORKS.md` — modular compliance directory: Tier 1 universal (data formats, WCAG 2.2 AA, ISO/IEC 25010), Tier 2 AI governance (EU AI Act, ISO 42001, NIST AI RMF), Tier 3 security/privacy (ISO 27001, SOC 2, GDPR, LGPD), Tier 4 domain-specific profiles (health, finance, climate, government). Activation via `compliance_profiles` flag in `docs/0_GROUND_RULES.md`
- `docs/14_AI_GOVERNANCE.md` — AI governance template: EU AI Act risk classification checklist (Art. 5 prohibited practices, GPAI, Annex III high-risk, limited/minimal risk), ISO/IEC 42001:2023 AIMS core requirements + Annex A controls, NIST AI RMF 1.0 + GenAI Profile, AI inventory template, AI risk register, human oversight checklist, production monitoring metrics, incident response SLAs
- `SYSTEM_PROMPT.md` §1 — two new source-of-truth entries for `docs/13_COMPLIANCE_FRAMEWORKS.md` and `docs/14_AI_GOVERNANCE.md`
- `SYSTEM_PROMPT.md` §6 — three new trigger matrix rows: compliance profile change, AI system/model change, EU AI Act risk level change
- `CLAUDE.md` Context Loading Policy — two new rows: compliance review, AI governance

## [1.14] — 2026-05-01

### Added

- `docs/7_CONTENT_I18N.md` — expanded with **Part 1: Cross-Layer Doctrine** (i18n vs storage vs MD, tech-agnostic). Decision framework (3 questions), classification table, translation pattern matrix per storage technology, anti-patterns, MD source-of-truth pattern, audit checklist for existing repos
- `docs/decisions/template/ODR-004-content-layer-doctrine.md` — Organisational Decision Record for the doctrine
- `CLAUDE.md` Context Loading Policy — new row "Code — content layer decision"; updated "Code — DB / schema" to load `docs/7_CONTENT_I18N.md` when content tables are involved
- `SYSTEM_PROMPT.md` §6 — new trigger matrix row for content-layer decisions (i18n → storage migrations, `page_seo`/`legal_pages`/`content_sections` tables, translation pattern changes)

### Changed

- `SYSTEM_PROMPT.md` §1 — source-of-truth entry for `docs/7_CONTENT_I18N.md` updated to reflect cross-layer scope (doctrine + i18n rules)
- `docs/7_CONTENT_I18N.md` Part 2 — existing i18n rules preserved, recontextualised as the rules for the i18n layer specifically; added smell-test pointer (any locale value > 200 chars or any namespace > 400 keys → reread Part 1)

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
