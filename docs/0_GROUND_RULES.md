# Ground Rules

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| [Layer] | [Technology] | [Version] |

> **The stack above is fixed.** Do not introduce alternatives without explicit approval.

## Inviolable Rules

1. **No new dependencies** without explicit user approval
2. **No unrelated refactoring** — one concern per task
3. **No file renaming or deletion** outside task scope
4. **All user-facing text** via i18n (if enabled) — never hardcode strings
5. **Validation** at system boundaries (Zod, Pydantic, etc.)
6. **No secrets** on the client side — service keys stay server-side
7. **Atomic changes** — each PR addresses one concern
8. **Build and lint** must pass before push

## Lint Warnings Policy

- **Errors:** must be zero before any task is complete
- **Warnings:** new warnings introduced by your changes must be fixed; pre-existing warnings are acceptable

## Protected Files (Read-Only)

These files are managed automatically — **NEVER edit**:

- [e.g. Auto-generated types]
- `.env` / `.env.local` / `.env.production`
- `.gitignore`
- Lock files (`package-lock.json`, `bun.lockb`, `poetry.lock`)
- [e.g. Database migrations]

## Dev Commands

```bash
# [Adjust to your stack]
npm run dev
npm run build
npm run lint
npm run test
```
