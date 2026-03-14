# ODR-003 — Operational Checklists

**Status:** Approved
**Date:** 2026-03-14
**Author:** Gustavo Teixeira Cuco
**Reviewers:** —
**Applies to:** SYSTEM_PROMPT.md, SECURITY.md, docs/0_GROUND_RULES.md, docs/2_ARCHITECTURE.md, docs/3_UI_UX_GUIDELINES.md

## Context

The governance template (v1.0–1.6) was strong on **preventive governance** — rules, standards, and documentation maintenance. However, it lacked **operational guidance** for common scenarios:

- No process for when things break (debugging)
- No criteria for recognising structurally compromised builds
- No practical security questions (only policy)
- No pre-deploy checklist
- No database design guidance
- No mobile-first design rules

These gaps were identified by cross-referencing the template with the "28 Days of Lovable" course (february.lovable.app), which covers the practical/operational side of building with AI agents.

## Decision

Add 8 operational checklists and frameworks distributed across existing docs:

| Addition | Location |
|---|---|
| Debugging Escalation (4-Step Framework) | SYSTEM_PROMPT.md §3 |
| Build Health Checker | SYSTEM_PROMPT.md §3 |
| Security Review Questions (6 questions) | SECURITY.md |
| Auth Setup Checklist | SECURITY.md |
| Database Design Checklist | docs/2_ARCHITECTURE.md |
| Design System Checklist | docs/3_UI_UX_GUIDELINES.md |
| Mobile-First Checklist | docs/3_UI_UX_GUIDELINES.md |
| Publishing Checklist | docs/0_GROUND_RULES.md |

## Rationale

The template was designed as a **governance document** (what not to do, what to maintain). The course content fills the complementary role of **operational guidance** (what to do when things go wrong, how to think before building).

Alternatives considered:
- **Separate "Operations Guide" doc** — rejected; fragments knowledge across too many files. Checklists belong where the related content already lives.
- **Only add debugging** — rejected; the other checklists are equally universal and low-overhead.
- **Add course-specific content (PRDs, idea validation, etc.)** — rejected; too Lovable-specific, not universal enough for a stack-agnostic template.

Selection criteria: only items that are **universal** (apply to any stack/project) and **actionable** (checklist or framework, not philosophy) were included.

## Consequences

### Positive
- Template now covers both prevention and recovery
- Security guidance is practical, not just procedural
- Database and mobile design get first-class attention
- Publishing checklist prevents shipping incomplete products

### Negative
- Docs are slightly longer (8 checklists added)
- Some checklists may not apply to all project types (e.g. publishing checklist irrelevant for CLI tools) — mitigated with "remove if N/A" notes

### Risks
- Checklists could become stale if not maintained alongside the docs they live in — mitigated by the existing Documentation Maintenance trigger matrix (ODR-001)

## Review

**Next review:** When template reaches v2.0 or after 3+ repos have adopted v1.7
