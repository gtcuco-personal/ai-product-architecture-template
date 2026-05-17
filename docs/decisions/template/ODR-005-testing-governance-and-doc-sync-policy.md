# ODR-005 — Testing Governance as Separate Doc + 4-Location Sync Policy

**Status:** Approved
**Date:** 2026-05-17
**Author:** Gustavo Teixeira Cuco
**Reviewers:** —
**Applies to:** All repos governed by this template

---

## Context

Two related governance gaps were identified in the compliance and architecture review of the template (2026-05-17):

1. **No testing governance doc** — the template covered security (`SECURITY.md`, `docs/10_AGENT_SAFETY.md`), compliance (`docs/13_COMPLIANCE_FRAMEWORKS.md`), and AI governance (`docs/14_AI_GOVERNANCE.md`) but had no equivalent for testing strategy. Repos inheriting the template were making local, inconsistent decisions about test frameworks, coverage thresholds, CI gates, and AI-specific testing.

2. **No documented sync policy for adding docs** — when a new `/docs/` file was added (e.g. `docs/13_COMPLIANCE_FRAMEWORKS.md` in v1.15), four locations needed to be updated manually (SYSTEM_PROMPT.md §1, SYSTEM_PROMPT.md §6, CLAUDE.md, README.md). This was known informally but not written down, leading to incomplete syncs (e.g. `docs/9_AGENT_SKILLS.md` was missing from `SYSTEM_PROMPT.md §1` source table for several versions).

---

## Decision 1 — Testing governance lives in `docs/11_TESTING.md`

Testing strategy is documented in a dedicated file, not embedded in `docs/0_GROUND_RULES.md` or `CONTRIBUTING.md`.

### Rationale

- **Scope justifies a doc:** testing governance covers pyramid ratios, framework selection, coverage thresholds, CI/CD gates, test data strategy, and AI-specific eval patterns — too much for a subsection
- **Different audience:** Ground Rules are read by agents for every code task; testing doc is loaded specifically for test/CI tasks (per Context Loading Policy)
- **Compliance linkage:** AI-specific testing (ISO 42001 A.7.2, A.8.1) needs a home adjacent to `docs/14_AI_GOVERNANCE.md`; putting it in Ground Rules would mix concerns
- **Stack-agnostic:** the framework selection table pattern (already used in `docs/7_CONTENT_I18N.md`) works well here

### Alternatives considered

| Option | Rejected because |
|---|---|
| Subsection in `docs/0_GROUND_RULES.md` | Ground Rules are loaded for every code task — adding testing content increases context cost even for tasks unrelated to tests |
| Subsection in `CONTRIBUTING.md` | CONTRIBUTING is human-facing (onboarding), not agent-facing — agents don't load it |
| Testing section in `docs/2_ARCHITECTURE.md` | Architecture doc is about routes, components, and data model — testing is orthogonal |

---

## Decision 2 — 4-Location Sync Policy (mandatory when adding/removing a `/docs/` file)

When any file is added to or removed from `docs/`, four locations **must** be updated in the same PR:

| Location | Update required | Why |
|---|---|---|
| **`SYSTEM_PROMPT.md` §1** (Source of Truth table) | Add/remove row with file path + one-line purpose | Agents use this table to know what docs exist |
| **`SYSTEM_PROMPT.md` §6** (Documentation Maintenance trigger matrix) | Add/remove row mapping change type → new doc | Without this, agents never know when to load/update the new doc |
| **`CLAUDE.md`** (Context Loading Policy table) | Add/remove task type row | Without this, the new doc is never loaded for any task type |
| **`README.md`** (directory listing in "What's Included") | Add/remove entry in the `docs/` tree | Human-facing discoverability |

**`INDEX.md`** — update only if the new doc represents an active initiative visible in the roadmap. Governance docs (testing strategy, compliance frameworks) do not need INDEX entries.

### Rationale

This policy formalises what was already implicitly expected (ODR-001 documents the trigger matrix; ODR-002 documents namespace conventions) but was never stated as a 4-point checklist. Without it, new docs exist but are invisible to agents and humans.

### How to verify sync is complete

After adding a doc, run:

```bash
# Verify the new doc appears in all 4 locations
grep -r "11_TESTING" SYSTEM_PROMPT.md CLAUDE.md README.md
```

All 4 locations should return a match. If any are missing, the sync is incomplete — do not merge.

---

## Consequences

### Positive

- Testing governance is now consistent across all repos inheriting this template
- The 4-location sync policy eliminates invisible docs (agents can now find and use them)
- AI-specific testing (evals, golden sets, bias checks) is linked to ISO 42001 controls — supports compliance evidence
- Future doc additions have a clear checklist to follow

### Negative

- Each new doc now requires edits to 4 files — slightly more overhead per PR
- Repos that already have testing conventions may need to reconcile with the template's defaults

### Risks

- Framework selection table may go stale if new stacks are adopted — mitigate by reviewing this doc at session start for any test-related task
- AI eval thresholds (5% regression, 10% bias drift) are defaults — each product team should calibrate to their own risk profile

---

## Review

**Next review:** When a new AI framework is added to the template stack, or when ISO 42001:2023 is revised.
