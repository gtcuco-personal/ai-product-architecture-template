# ODR-011 — Generated Roadmap and a Single Narrative

**Status:** Approved
**Date:** 2026-08-27
**Author:** Gustavo Teixeira Cuco
**Reviewers:** Claude Code (2026-08-27)
**Applies to:** All projects using this governance template

## Context

A single merged PR is currently narrated in five places:

| Where | What it holds today |
|---|---|
| `CHANGELOG.md` | The prose account of what changed and why |
| `docs/5_ROADMAP_AND_TASKS.md` § Completed | A dated line per merged PR, hand-written |
| `INDEX.md` header | A "Last updated" line summarising the same change |
| `docs/decisions/…` | The decision, when the change carried one |
| PR body | The argument for the change |

Only two of these are load-bearing. The ODR records a decision that outlives the PR; the CHANGELOG records what happened. The other three restate them, and restatement is not free: each copy is written by hand, each can drift, and none of them fails loudly when it does. A `Completed` entry that never got written does not break a build — it simply makes the file quietly wrong, and the wrongness is only discovered when somebody trusts it.

The rule that produced this — *"Every merged PR must have a completed entry here. No exceptions."* — was written when `docs/5_ROADMAP_AND_TASKS.md` was the only durable record of work. That stopped being true once the roadmap moved into a database with its own CLI, its own history triggers, and a renderer that generates its output file.

The cost is not theoretical. Work that lives in a repo's hand-written roadmap is invisible to the central roadmap unless somebody remembers to run a sync command; work recorded centrally is invisible to the repo. Two sources, both authoritative, neither complete.

## Decision

**1. The roadmap database is the single write door.**

Roadmap state is written only through the roadmap CLI. No agent, script, or human composes SQL by hand or edits a rendered Markdown file to record roadmap state.

**2. `docs/5_ROADMAP_AND_TASKS.md` becomes a generated file.**

It is rendered per repository from the roadmap database, filtered by that repository's source key, and carries a generation header naming the script that produced it. It stops being a place where anything is authored. This is the change that makes this version `3.0` rather than a point release: a file that every governed repository is required to have changes its nature, from hand-written to output.

**3. The `Completed` section is retired.**

The rule becomes: *every merged PR must have a `CHANGELOG.md` entry*. Historical `Completed` entries stay where they are — they describe what was true when written, and rewriting them would destroy the record of how the repository got here. They simply stop growing.

**4. Narrative lives in exactly one place.**

`CHANGELOG.md` carries the account of what changed. `docs/decisions/` carries decisions. `INDEX.md` maps artifacts and does not summarise changes. A PR body argues for its own change and is not a durable record.

**5. Generated files are validated by header, not by comparison.**

Any check that verifies governance files against this template must treat a file bearing a generation header as generated: it validates that the header is present and that the generator is the expected one. Byte-comparing a generated file against the template is a category error, and would mark every correctly migrated repository as drifted.

## Rationale

Alternatives considered:

1. **Keep the duplication and automate the copying.** A hook could write the `Completed` entry from the CHANGELOG at merge time. This removes the manual step but keeps two copies of the same fact, and two copies can still diverge — now with the added problem that the divergence is produced by a script nobody is reading.

2. **Delete `docs/5_ROADMAP_AND_TASKS.md` entirely** and let the central roadmap be the only view. Rejected: the file is genuinely useful *inside* a repository, where somebody working on that code wants to see that repository's open items without leaving it. The problem was never that the file exists; it was that it was authored in two places.

3. **Keep the file hand-written and make the central roadmap a mirror of it.** This inverts the direction but keeps the sync problem, and it scales worse: one central renderer is one piece of machinery, whereas thirty-seven hand-written files are thirty-seven opportunities to forget.

The generated-file approach was chosen because it removes the failure mode rather than automating around it. A file that cannot be written by hand cannot drift from its source, and a rule that no longer needs to be remembered cannot be forgotten.

The precedent is already in the repository: `ROADMAP.md` has been generated since the roadmap moved to a database, and the renderer refuses to overwrite a file that does not carry its header — precisely so that a hand-written file is never silently destroyed. This ODR extends that guarantee to the per-repository view.

## Consequences

**What improves.** One place to write, many places to read. A repository's roadmap becomes complete by construction rather than by discipline. The weekly drift scan stops being a report somebody has to open and becomes redundant for migrated repositories, because there is no second source to drift from.

**What this costs.** Migration is not free and cannot be done in one pass:

| Phase | Work |
|---|---|
| 1 | This ODR — doctrine first, so the machinery is built against a written decision |
| 2 | Machinery in the roadmap repository: per-repository renderer, and backfill of the items that exist only in repository files |
| 3 | Propagation to governed repositories, in layers, starting with the ones in active use |

Until a repository is migrated, its `docs/5_ROADMAP_AND_TASKS.md` remains hand-written and authoritative for that repository. The two states must be distinguishable at a glance, which is what the generation header provides.

**What can still fail.** Regenerating the roadmap seed from a database that is behind its remote will silently discard items added by other work in flight — the file is regenerated wholesale, and the generator cannot know which rows were meant to be there. Rebuild from the committed seed before mutating, and keep at most one roadmap change in flight at a time. This is a known trap, observed in practice, not a hypothetical.

**What is explicitly not decided here.** Items with no source repository — personal work that belongs to no codebase — keep living centrally. Whether they eventually acquire a home is a separate decision.

## Review

Revisit when phase 3 completes, or earlier if a repository is found where a generated per-repository roadmap is the wrong shape.
