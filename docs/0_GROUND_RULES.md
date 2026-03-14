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
9. **No `dangerouslySetInnerHTML`** — all user/DB content must be rendered via framework elements (React components, template engines, etc.). If raw HTML is unavoidable, sanitise with DOMPurify or equivalent before rendering

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

## Publishing Checklist

Before any deploy to production, verify:

- [ ] **Page title set** — meaningful title in browser tab and search results
- [ ] **Meta description written** — concise, keyword-relevant summary
- [ ] **OG image set** — social sharing preview image (1200×630px recommended)
- [ ] **Favicon added** — visible in browser tab
- [ ] **Mobile design verified** — tested on real device or responsive mode
- [ ] **Security check passed** — no exposed secrets, auth flows tested, RLS verified
- [ ] **Analytics enabled** — tracking configured (if applicable)
- [ ] **Build passes** — `npm run build` (or equivalent) completes without errors
- [ ] **Performance acceptable** — page loads in <3s on mobile connection

> Remove this section if the project is a CLI tool, library, or internal service.

## Dev Commands

```bash
# [Adjust to your stack]
npm run dev
npm run build
npm run lint
npm run test
```
