# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
