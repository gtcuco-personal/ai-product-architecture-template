# ODR-008 — Portable Agent Entry Point

**Status:** Approved
**Date:** 2026-07-18
**Author:** Gustavo Teixeira Cuco
**Reviewers:** Codex
**Applies to:** Agent guidance, runtime adapters, instruction precedence, and downstream template propagation

## Context

The template claimed to support Claude and other coding agents, but its durable
guidance lived primarily in `CLAUDE.md`, `.claude/agents/`, and Claude-specific
skill conventions. Compatible runtimes such as Codex did not automatically load
that guidance.

`SYSTEM_PROMPT.md` also declared itself absolute authority above explicit user
instructions. A checked-in repository file cannot impose that precedence across
agent runtimes; the active runtime owns its system, developer, administrator,
user, and project-instruction hierarchy.

## Decision

1. Add `AGENTS.md` as the portable, concise entry point for compatible coding
   agents.
2. Keep `CLAUDE.md` as the Claude Code adapter and as the current home of repo
   metadata plus the Context Loading Policy.
3. Keep `.claude/agents/` as optional Claude-specific capabilities.
4. Treat `SYSTEM_PROMPT.md` as a shared project operating policy, not as a real
   runtime system prompt.
5. Let each runtime enforce its own instruction precedence. Within repo-owned
   guidance, the more specific scoped instruction wins.
6. Keep shared rules in checked-in docs and avoid copying runtime-specific tool
   syntax into the portable layer.

## Rationale

`AGENTS.md` provides a small cross-agent contract without forcing every runtime
to understand Claude-specific frontmatter or subagent syntax. Retaining adapters
preserves useful native capabilities while making the shared baseline visible to
Codex and other compatible tools.

Explicitly deferring precedence to the runtime removes a misleading security
claim and prevents repository guidance from being used to ignore legitimate user
intent.

## Consequences

### Positive

- Codex and other `AGENTS.md`-compatible agents receive repository guidance
  automatically.
- Claude-specific features remain available without being presented as
  universal.
- Instruction safety matches the actual enforcement boundary.
- Downstream repos gain a clear place for portable build, test, review, and
  delivery rules.

### Negative

- `AGENTS.md` and `CLAUDE.md` become two maintained entry points.
- Some shared context still lives in `CLAUDE.md` until a future migration moves
  the Context Loading Policy into a runtime-neutral file.

### Risks

- Guidance may drift between adapters. Mitigation: keep `AGENTS.md` concise,
  keep project facts in `/docs`, and validate required entry points in CI.
- A downstream runtime may not support `AGENTS.md`. Mitigation: retain the
  runtime-specific adapter and document which layer it uses.

## Review

**Next review:** After v2.1 has been propagated to at least three downstream
repos using different agent runtimes, or when the Context Loading Policy moves
out of `CLAUDE.md`.
