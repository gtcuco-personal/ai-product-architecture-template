# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
