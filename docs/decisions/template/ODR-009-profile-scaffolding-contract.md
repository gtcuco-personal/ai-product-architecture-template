# ODR-009 — Profile Scaffolding Contract

**Status:** Approved
**Date:** 2026-07-18
**Author:** Gustavo Teixeira Cuco
**Reviewers:** Codex
**Applies to:** Template initialization, optional governance modules, CI detection, and downstream repository validation

## Context

The lean-by-default decision in ODR-007 made heavy governance modules optional,
but applying that decision still required a user or agent to delete files by hand.
That process was inconsistent, easy to get wrong, and left no durable explanation
for intentionally absent documents. The universal CI also inferred package-manager
behavior directly in YAML, which made npm, Bun, Deno, and docs-only branches hard
to test without running a full hosted workflow.

## Decision

1. Ship four named profiles: `minimal`, `react-supabase`, `python-data`, and
   `regulated-ai`.
2. Make scaffolding a dry run by default. Files are removed only when the user
   passes `--apply`.
3. Restrict removal to an explicit allowlist of optional paths. The scaffolder
   never accepts arbitrary deletion targets.
4. Write `template-profile.json` after application, recording the selected
   profile and every retained or removed optional path.
5. Treat the manifest as part of the downstream repository contract: agents and
   validation must not recreate intentionally removed modules.
6. Do not support in-place profile switching. A different profile must start
   from a fresh template so deleted content cannot be reconstructed ambiguously.
7. Move CI stack detection into a dependency-free script and cover docs-only,
   npm, Bun, and Deno modes with temporary filesystem fixtures.
8. Cover every scaffold profile with a fixture that applies it and runs the
   governance validator in project mode.

## Rationale

Named profiles make the lean posture repeatable without maintaining separate
template forks. A checked-in manifest distinguishes deliberate absence from
documentation drift. Dry-run-first behavior and an explicit deletion allowlist
keep the destructive part narrow and reviewable.

Extracting CI detection from workflow YAML gives the same decision logic to
local tests and GitHub Actions. Temporary fixtures validate behavior without
polluting the real repository or requiring network access.

## Consequences

### Positive

- New repositories can start with an appropriate governance footprint using one
  deterministic command.
- Agents can explain why a module is absent instead of silently recreating it.
- npm/Bun lockfile precedence and Deno detection are tested locally.
- The template proves all four profile outputs still satisfy its core contract.

### Negative

- Profile definitions and fixture expectations must evolve together.
- Applied projects retain the scaffolding scripts even though profile switching
  is intentionally unsupported.
- Hosted CI behavior still needs one real pull-request run to validate runner
  integration beyond the locally tested detection logic.

### Risks

- A future optional path could be omitted from the profile allowlist. Mitigation:
  require an ODR/profile update and extend all fixtures when adding a module.
- A user could manually restore a manifest-declared removed path. Mitigation:
  `check-governance.mjs` rejects that drift.

## Review

**Next review:** After the profiles have initialized three downstream repos, or
when a fifth stack/profile is proposed.
