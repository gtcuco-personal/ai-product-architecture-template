# ODR-002 — ODR Namespace Convention

**Status:** Approved
**Date:** 2026-03-14
**Author:** Gustavo Teixeira Cuco
**Reviewers:** Claude Code (2026-03-14)
**Applies to:** All projects using this governance template

## Context

ODR-001 introduced a documentation trigger matrix as part of the governance template. When propagating this template update to repos that already had their own ODRs (e.g., a repo with ODR-001 through ODR-004), a naming conflict emerged: the template's `ODR-001-documentation-trigger-matrix.md` would collide with the repo's existing `ODR-001-auth-strategy.md`.

Without a convention to distinguish template-inherited ODRs from repo-local ODRs, every template propagation would require manual renumbering — an error-prone process that breaks references and defeats the purpose of having a reusable template.

## Decision

Split `docs/decisions/` into two namespaces:

| Directory | Purpose | Managed by |
|---|---|---|
| `docs/decisions/` | ODRs created within the repo itself | Repo maintainers |
| `docs/decisions/template/` | ODRs inherited from the base governance template | Template repo |

Each namespace maintains its own independent numbering sequence. A repo can have both a local `ODR-001` and a template `ODR-001` without conflict.

`docs/decisions/TEMPLATE.md` (the format template for creating new ODRs) remains in the root of `decisions/` — it is a tool, not an ODR.

## Rationale

Alternatives considered:

1. **Renumber template ODRs per repo** — e.g., template ODR-001 becomes ODR-005 in the target repo. Simple but fragile: breaks cross-repo references, requires manual tracking of which number maps to which template ODR, and creates divergence between repos.

2. **Prefix-based naming** (e.g., `TODR-001` for template, `ODR-001` for local) — avoids directory separation but introduces a non-standard naming scheme. Less intuitive than a directory split and harder to enforce.

3. **Single flat directory with reserved ranges** (e.g., 001–099 for template, 100+ for local) — simple convention but arbitrary, easy to forget, and breaks when either range is exhausted.

The subdirectory approach was chosen because:
- It uses the filesystem as the namespace mechanism — no conventions to remember
- Template propagation becomes a simple operation: replace contents of `docs/decisions/template/`
- Local ODRs are never touched during template updates
- It is self-documenting — the directory name explains the distinction

## Consequences

### Positive

- Zero naming conflicts when propagating template updates to repos with existing ODRs
- Template updates become mechanical: copy `docs/decisions/template/` from the template repo
- Each repo's local decision history is preserved independently
- Cross-repo references to template ODRs are stable (always the same filename in `template/`)

### Negative

- Adds one level of directory nesting for template ODRs
- Requires updating existing repos that already have template ODRs in the wrong location

### Risks

- If the convention is not documented clearly, contributors may create local ODRs inside `template/` or vice versa. Mitigated by documenting the convention in `CONTRIBUTING.md` and referencing it in `SYSTEM_PROMPT.md`.

## Review

**Next review:** When a third namespace need emerges (e.g., shared ODRs across a subset of repos), or when the first template propagation to all repos is complete and the convention can be validated in practice.
