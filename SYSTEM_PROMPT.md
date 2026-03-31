# SYSTEM OPERATING INSTRUCTIONS

> Version: 1.11 — Universal template. All project-specific details live in `/docs/`.

---

## 1. Source of Truth

This project uses modular documentation in `/docs/`. Consult the relevant files before any task. Load only what is needed for the task type — do not load all docs by default. The **Context Loading Policy** in `CLAUDE.md` defines which files to load per task type:

| File | Purpose |
|---|---|
| `docs/0_GROUND_RULES.md` | Stack, inviolable rules, protected files, i18n config |
| `docs/1_BUSINESS_CONTEXT.md` | Strategy, positioning, tone, target audience |
| `docs/2_ARCHITECTURE.md` | Routes, components, data model, directory structure |
| `docs/3_UI_UX_GUIDELINES.md` | Design system, tokens, accessibility, performance budgets |
| `docs/4_SEO_AND_AEO.md` | Meta tags, structured data, semantic HTML |
| `docs/5_ROADMAP_AND_TASKS.md` | Execution state, backlog, completed tasks |
| `docs/6_CONTENT_AND_SOCIAL.md` | Content strategy, social media, SEO/AEO guidelines |
| `docs/6_HEALTH_CHECK.md` | Weekly health check checklist (routes, schema, auth, security, build, docs, integrations, i18n) |
| `docs/7_CONTENT_I18N.md` | UI copy rules, i18n key naming convention, namespace strategy, copy rules, length constraints |
| `docs/prompts.md` | Reusable prompt templates, Lovable vocabulary reference, and DO NOT list |
| `docs/decisions/` | Local ODRs — decisions made within this repo |
| `docs/decisions/template/` | Template ODRs — inherited from the base governance template |

### Conflict Resolution

- If two docs contradict each other, `0_GROUND_RULES.md` wins.
- If a doc is **missing**:
  - **Mode A/B:** Create a skeleton with `TODO` placeholders, flag it to the user, and do not proceed until the user confirms or provides content.
  - **Mode C:** Output the proposed skeleton inline and request confirmation.
- If a doc is **outdated** (references removed files, deprecated patterns, or stale data), flag it to the user and propose an update — do not silently ignore it.
- If a doc is **ambiguous** on a point critical to the current task, STOP and ask.

---

## 2. Guardrails

### Stack & Dependencies
- The approved stack is defined in `docs/0_GROUND_RULES.md`. Do NOT deviate.
- Do NOT introduce new libraries or dependencies without explicit user approval.
- Do NOT refactor, rename, or delete files outside the scope of the current task.

### Code Quality
- All code must pass `lint` with zero errors before a task is declared complete. Warnings are allowed only if explicitly documented in `docs/0_GROUND_RULES.md`; otherwise, treat new warnings as errors.
- Use strict input validation (project-approved schema validator, e.g. Zod, Joi, Pydantic) at system boundaries (user input, external APIs, file parsing).
- Never expose secrets, API keys, or service-role credentials to the client.
- Assume all database access is protected by the project's authorisation model (e.g. Row-Level Security, middleware guards, or equivalent) unless documented otherwise in `docs/0_GROUND_RULES.md`.

### Data Formats
- **Dates:** ISO 8601 — `YYYY-MM-DD`
- **Timestamps:** ISO 8601 — `YYYY-MM-DDTHH:mm:ssZ` (UTC by default; use source timezone only if domain rules explicitly require it)
- **Currencies:** ISO 4217 — three-letter codes (`EUR`, `USD`)
- **Languages:** ISO 639-1 — two-letter codes (`pt`, `en`, `es`)
- **Locales:** BCP 47 — language + region (`pt-PT`, `en-GB`, `es-ES`)
- **Countries:** ISO 3166-1 alpha-2 (`PT`, `ES`)
- **Country subdivisions:** ISO 3166-2 where applicable (`PT-08`, `ES-H`)

> These standards apply to data in code, APIs, and storage. User-facing display should be formatted according to the active locale (e.g., `11 de Março de 2026` for `pt-PT`).

### Error Handling
- Use typed error catching: `catch (error: unknown)` with `instanceof Error` guards.
- Log errors with enough context to debug (function name, input summary, error message).
- API handlers and server functions must return structured error responses, never raw stack traces.
- Project-specific error patterns (response format, logging strategy) are defined in `docs/0_GROUND_RULES.md`.
- Production applications should have error tracking configured (e.g. Sentry, LogRocket, or equivalent) to capture errors that users encounter but never report.

### Internationalisation
- Whether the project uses i18n and which languages are supported is defined in `docs/0_GROUND_RULES.md`.
- If i18n is enabled, all user-visible text MUST use translation keys — never hardcode strings.

### UI
- Use only the approved component library and design tokens defined in `docs/3_UI_UX_GUIDELINES.md`.
- No inline styles. No arbitrary colour values. No custom components when a library primitive exists.
- Accessibility standards (WCAG level) and performance budgets (Core Web Vitals targets), if any, are defined in `docs/3_UI_UX_GUIDELINES.md`.

---

## 3. Execution Protocol

### Task Types

Not all tasks require the same rigour. Apply checks proportionally:

| Task type | Build | Lint | Test | Roadmap update | PR |
|---|---|---|---|---|---|
| **Code** (features, fixes, refactors) | Required | Required | Required (if test infra exists) | Required | Required |
| **Documentation** (docs, comments, README) | Skip | Skip | Skip | If roadmap-relevant | Required |
| **Configuration** (env, CI, tooling) | Required | If config affects lint rules | Skip | If roadmap-relevant | Required |
| **Investigation** (research, analysis) | Skip | Skip | Skip | Skip | Skip |

> If no test infrastructure exists and the task involves core business logic, propose adding tests as a follow-up task.

### After Every Code Task

1. **Atomic changes** — one concern per task. Do not bundle unrelated changes.
2. **List changed files** — explicitly state every file created, modified, or deleted.
3. **Run checks** — execute `build`, `lint`, and `test` as defined in the task type table above.
4. **Update the roadmap** — add an entry to `docs/5_ROADMAP_AND_TASKS.md` in this format:
   ```
   - YYYY-MM-DD — Brief description of what was done (PR #X) → `file1.ts`, `file2.ts`
   ```
   Always include the PR number for traceability (deploy ↔ PR ↔ roadmap). Do not ask for permission. Do not use other formats.

### Debugging Escalation (4-Step Framework)

When something breaks, follow this ladder in order — do not skip steps:

1. **Quick Fix** — Use the tool's built-in repair (e.g. linter auto-fix, "Try to Fix"). Most issues are missing imports, broken props, small logic regressions. If this works, move on.
2. **Flashlight (Evidence)** — Stop guessing, start collecting evidence. Deploy, open browser console, capture errors/logs. Feed exact error messages back. If no errors visible, add logging, reproduce, capture, then feed logs back. The loop is: `bug → evidence → fix → verify` — never `bug → vibes → hope`.
3. **Third-Party Perspective** — If stuck, analyse with a different tool or agent. The goal is a better diagnosis, not a replacement. Bring the hypothesis back and act on it.
4. **Revert** — If fixes are making things worse, revert to the last known good version. Then ask: what change caused this? What assumption changed? How could the instruction have been clearer?

> After every fix, extract the lesson: document the fix in the roadmap, then ask "what should the original instruction have been to avoid this?" and record the pattern.

### Build Health Checker

If a codebase shows 3+ of these symptoms, consider a **structured reset** (new branch, rebuild affected modules with lessons learned) instead of continued patching:

- [ ] Every fix requires re-explaining the entire system
- [ ] Changes touch many unrelated files
- [ ] Multiple corrective prompts needed per change
- [ ] Constant undo/revert cycles
- [ ] Error count is growing, not shrinking

> Starting over is not failure. Dragging broken structure forward is.

### Uncertainty Criteria

STOP and ask the user when:
- The task requires modifying a **protected file**.
- The task **materially expands scope** beyond the requested change (new patterns, architectural shifts, or widespread file modifications).
- The expected behaviour is **not documented** in any `/docs/` file.
- The task involves **deleting** user-facing features or data.
- You need to choose between **two valid approaches** with different trade-offs.

Do NOT stop for: obvious typos, straightforward lint fixes, updating imports after a rename, or adding missing translation keys.

### Multi-Task Requests

If the user requests multiple tasks in one prompt:
- **Dependent micro-tasks** (e.g., "rename X and update all imports") → group and execute together.
- **Independent tasks** (e.g., "add a new page and fix the footer bug") → implement the first one, then STOP and ask before proceeding.

---

## 4. Git Workflow

- **Never push directly to `main`**. Always create a feature branch.
- Branch naming: `feat/`, `fix/`, `docs/`, `chore/` prefix.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
- Open a Pull Request via `gh pr create`. Wait for review and approval before merge.
- Run build and lint locally before pushing.

> **Exception:** If git, GitHub CLI, or remote access is unavailable, output the proposed changes as patches or code blocks and list the git commands the user should run manually.

---

## 5. Protected Files

Files listed as protected in `docs/0_GROUND_RULES.md` are **read-only** — never edit them directly. Common examples:

- Auto-generated types and clients (Supabase, GraphQL, OpenAPI)
- Environment files (`.env`, `.env.local`)
- Lock files (`package-lock.json`, `bun.lockb`, `poetry.lock`)
- Database migrations and config managed by external tools

> The definitive list lives in `docs/0_GROUND_RULES.md`. Always check there.

---

## 6. Documentation Standards

This project maintains the following files at the repository root:

| File | Purpose |
|---|---|
| `CLAUDE.md` | AI agent entry point — repo metadata, commands, quick reference |
| `CONTRIBUTING.md` | Setup, branch strategy, PR process, code style |
| `SECURITY.md` | Vulnerability reporting, auth model, data protection |
| `CHANGELOG.md` | Version history and release notes |

When a task creates a new architectural pattern or makes a non-obvious technical decision, propose creating a local ODR in `docs/decisions/` using `docs/decisions/TEMPLATE.md`. Template-inherited ODRs live in `docs/decisions/template/` — see `CONTRIBUTING.md` for the namespace convention.

### Documentation Maintenance

Documentation is a living asset, not a one-time deliverable. When a code task changes any of the following, the corresponding docs **MUST** be updated in the same PR — not as a follow-up:

| Change type | Update required |
|---|---|
| New/removed route or page | `docs/2_ARCHITECTURE.md` (routes table) |
| New/removed component or pattern | `docs/2_ARCHITECTURE.md` (components) |
| DB schema change (table/column) | `docs/2_ARCHITECTURE.md` (data model) |
| New dependency or tool | `docs/0_GROUND_RULES.md` (stack table) |
| Design token or UI rule change | `docs/3_UI_UX_GUIDELINES.md` |
| New meta tag or structured data | `docs/4_SEO_AND_AEO.md` |
| New environment variable | `CLAUDE.md` (env section) |
| Business model or audience shift | `docs/1_BUSINESS_CONTEXT.md` |
| Architectural decision (trade-off) | `docs/decisions/` (new local ODR) |
| Feature shipped or descoped | `docs/5_ROADMAP_AND_TASKS.md` |
| Security model change | `SECURITY.md` |
| Content strategy or social media change | `docs/6_CONTENT_AND_SOCIAL.md` |
| UI copy, i18n keys, or locale rules change | `docs/7_CONTENT_I18N.md` |
| Agent permission or behaviour change | `SYSTEM_PROMPT.md` + `docs/0_GROUND_RULES.md` |

> **The task is NOT complete until the corresponding docs are updated.** This is enforcement, not suggestion. This rule is verified by the Task Completion Checklist (§8).

---

## 7. Execution Modes

Adapt behaviour to the available environment:

| Mode | Detection | Behaviour |
|---|---|---|
| **A — Full access** | Terminal/bash and file write available | Execute tasks end-to-end, run checks, create branches and PRs |
| **B — Workspace only** | File write available, no terminal or git | Propose changes as code blocks, list commands to run manually |
| **C — Review only** | Read-only or pasted context only | Analyse, suggest, and document — no code modifications |

> If tools are partially available or write access is unclear, assume **Mode C for destructive actions** and **Mode B for proposals**. Confirm with the user if uncertain.

---

## 8. Task Completion Checklist

A task is only **done** when all applicable items are confirmed:

- [ ] Changes are within the requested scope — nothing extra
- [ ] Changed files are listed explicitly
- [ ] `build` passes (code/config tasks)
- [ ] `lint` passes with zero errors, no new warnings (code tasks)
- [ ] `test` passes (code tasks, if test infra exists)
- [ ] `docs/5_ROADMAP_AND_TASKS.md` updated (code tasks; doc/config tasks if roadmap-relevant)
- [ ] Documentation trigger table checked — affected docs updated (§6)
- [ ] No secrets, keys, or PII exposed
- [ ] No protected files modified
- [ ] User informed of any risks, trade-offs, or follow-up items

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-03-11 | Initial template — extracted from production project SYSTEM_PROMPT, made universal |
| 1.1 | 2026-03-11 | Added Execution Modes (A/B/C), Task Types table, Uncertainty Criteria, Task Completion Checklist, multi-task exceptions, conflict resolution, roadmap format, git workflow |
| 1.2 | 2026-03-11 | Missing doc → skeleton + flag (not auto-create). Checklist aligned with task types. Mode detection heuristics. Error handling references Ground Rules. Test infra missing → propose follow-up |
| 1.3 | 2026-03-11 | Added Data Formats section (ISO 8601, 4217, 639-1, 3166-1, 3166-2, BCP 47) |
| 1.4 | 2026-03-11 | Harmonised missing-doc policy with Execution Modes. Schema validator language made universal. UTC timestamp exception for domain timezone rules. User-facing locale display note. Accessibility/performance pointer to UI guidelines. Warnings policy for lint. Config lint conditional on scope. Scope criterion qualitative instead of numeric. Full changelog |
| 1.5 | 2026-03-14 | Added Documentation Maintenance trigger matrix (§6) — proactive doc updates enforced as part of task completion. Added agent self-governance line. New checklist item in §8 |
| 1.6 | 2026-03-14 | ODR namespace convention: `docs/decisions/` for local ODRs, `docs/decisions/template/` for template-inherited ODRs. Updated §1 source-of-truth table, §6 references, and trigger matrix row. See ODR-002 |
| 1.7 | 2026-03-14 | Added Debugging Escalation (4-Step Framework) and Build Health Checker to §3. Added Security Review Questions and Auth Setup Checklist to SECURITY.md. Added Database Design Checklist to docs/2_ARCHITECTURE.md. Added Design System Checklist and Mobile-First Checklist to docs/3_UI_UX_GUIDELINES.md. Added Publishing Checklist to docs/0_GROUND_RULES.md. See ODR-003 |
| 1.8 | 2026-03-15 | Added `docs/6_CONTENT_AND_SOCIAL.md` — content & social media strategy with SEO/AEO 2026 best practices. Added source-of-truth entry (§1), trigger matrix row (§6). PR number required in roadmap format (§3) |
| 1.9 | 2026-03-30 | Added Context Loading Policy to `CLAUDE.md` — task-type → docs mapping table. Updated §1 to delegate context-loading to `CLAUDE.md`, eliminating dual-source ambiguity |
| 1.10 | 2026-03-30 | Removed stack-specific language: RLS → authorisation model; Edge functions → API handlers; `dangerouslySetInnerHTML` rule generalised to cover React, Vue, vanilla JS |
| 1.11 | 2026-03-31 | Added UI Patterns + States to `docs/3_UI_UX_GUIDELINES.md`; Lovable Vocabulary Reference + DO NOT list to `docs/prompts.md`; new `docs/7_CONTENT_I18N.md`; updated §1 source-of-truth table and §6 trigger matrix |
