# [Repo Name] — Index

> Stable pointer map (ODR-011). History → `CHANGELOG.md`. Decisions → `docs/decisions/`.
> Tasks and state → the source declared on the first line of `docs/5_ROADMAP_AND_TASKS.md`.

## Folder map

- `README.md` — purpose, initialization flow and validation modes
- `CLAUDE.md` / `AGENTS.md` — agent instructions and repository entry points
- `SYSTEM_PROMPT.md` — shared operating policy
- `docs/` — governance: roadmap, compliance, AI governance, testing, dependencies, health check, architecture, content
- `docs/decisions/` — local decision records · `docs/decisions/template/` — ODR-001 to ODR-011, inherited
- `docs/guides/` — setup guides (git-crypt, Lovable vocabulary)
- `skills/` — template for project-level agent skills
- `tasks/` — `lessons.md`, session corrections
- `.claude/agents/` — pre-configured subagents
- `.githooks/` — pre-commit secret scanner · `.github/workflows/` — CI: build, secrets, Deno, governance
- `scripts/` — dependency-free repository validation
- `tests/template/` — template tests and fixtures; removed when a profile is applied

## Convention

1. Mandatory at the root of every repository governed by this template.
2. **Changes only when the structure changes** — a folder added, moved or removed. Content changes do not touch it; CI requires it only then.
3. **No dates, no change summaries, no status** ("in progress", "pending", "done"). History → `CHANGELOG.md`; tasks and state → the source declared in `docs/5_ROADMAP_AND_TASKS.md` (ODR-011 §4).
4. Map folders, not files. A folder with enough inside to need its own map gets a `README.md` there.
