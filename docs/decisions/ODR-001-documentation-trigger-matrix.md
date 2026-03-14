# ODR-001 — Documentation Trigger Matrix

**Status:** Approved
**Date:** 2026-03-14
**Author:** Gustavo Teixeira Cuco
**Reviewers:** Claude Code (2026-03-14)
**Applies to:** All projects using this governance template

## Context

The template already provided comprehensive documentation files (`0_GROUND_RULES.md` through `5_ROADMAP_AND_TASKS.md`, `CLAUDE.md`, `SECURITY.md`, etc.) and an AI agent system prompt that governed task execution. However, the only explicit documentation update rule was:

- `SYSTEM_PROMPT.md` §3: "after every code task, update `5_ROADMAP_AND_TASKS.md`" — limited to the roadmap
- `SYSTEM_PROMPT.md` §1: "if a doc is outdated, flag it to the user" — reactive, dependent on the agent noticing staleness
- `CHANGELOG.md` tracked releases, but did not map product changes to documentation updates

This created a gap: the problem of *creating* context was solved, but the problem of *maintaining* context was not. Documentation would silently diverge from reality as the product evolved, and the agent would eventually operate on an outdated model of the system.

## Decision

Add a **Documentation Maintenance** subsection to `SYSTEM_PROMPT.md` §6 containing a trigger matrix — a table that maps specific change types (new route, new dependency, schema change, etc.) to the documentation files that must be updated. Include a corresponding checklist item in §8 (Task Completion Checklist) so that the update is enforced as part of the definition of "done".

Critically, include a self-referencing row: changes to agent permissions or behaviour must trigger an update to `SYSTEM_PROMPT.md` itself, preventing the governance document from being the one file that escapes its own governance.

## Rationale

The core shift is from **reactive context** (the agent notices something is outdated and flags it) to **proactive context** (the documentation update is part of the task definition — the task cannot be closed without it).

Alternatives considered:

1. **Rely on the agent's judgement** — the existing §1 rule. Failed because it depends on the agent recognising staleness, which requires comparing docs against code on every task. Unreliable and expensive.
2. **Periodic documentation review** — a scheduled ritual (e.g., weekly) to audit docs. Creates a window where docs are stale. Adds overhead without integrating into the natural workflow.
3. **Automated drift detection** — tooling that compares docs against code and flags mismatches. Technically complex, stack-specific, and still reactive.

The trigger matrix is the simplest mechanism that makes doc maintenance a **structural guarantee** rather than a **behavioural hope**.

## Consequences

### Positive

- Documentation stays current as a natural side-effect of doing work
- The agent cannot declare a task complete without checking the trigger table
- Zero additional tooling or infrastructure required
- The pattern is stack-agnostic — works for any project using this template
- Self-governance: `SYSTEM_PROMPT.md` is subject to its own update rules

### Negative

- Adds a small amount of overhead to every code task (checking the table, updating docs)
- The trigger table itself must be maintained — new doc categories require new rows

### Risks

- If the trigger table becomes too long or granular, developers may skip the check. Keep it at the category level, not the field level.
- The enforcement depends on the agent (or human) actually consulting the checklist. In Mode C (review only), this is advisory rather than enforced.

## Review

**Next review:** When a new documentation file is added to the template, or when a project reports that docs drifted despite the trigger matrix being in place.
