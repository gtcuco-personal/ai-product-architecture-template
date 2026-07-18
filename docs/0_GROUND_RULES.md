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
9. **No raw HTML rendering** — all user/DB content must be rendered via framework elements (components, template engines, etc.). If raw HTML is unavoidable (e.g. `dangerouslySetInnerHTML`, `v-html`, `innerHTML`), sanitise with DOMPurify or equivalent before rendering
10. **Repo controls structure, not every operational record** — schemas, migrations, seed fixtures, and configuration originate from this repository. User, guest, and external operational data may enter through documented, authorised application/API flows; no untracked manual production changes to schema or configuration.

## Data Format Conventions

- **Phone numbers:** [E.164](https://www.itu.int/rec/T-REC-E.164) — `+<country code><digits>`, no spaces, dashes, or parentheses (e.g. `+351912345678`). This is the actual international telecom standard (ITU-T, not ISO — there is no ISO phone number standard), and it is what `wa.me`/WhatsApp links, SMS gateways, and most telecom APIs expect anyway. Enforce with a DB `CHECK` constraint (e.g. `phone ~ '^\+[1-9][0-9]{5,14}$'`), not just a naming convention — free-text entry drifts within weeks otherwise.

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
- [ ] **Security check passed** — no exposed secrets, auth flows tested, access control verified
- [ ] **Analytics enabled** — tracking configured (if applicable)
- [ ] **Build passes** — `npm run build` (or equivalent) completes without errors
- [ ] **Performance acceptable** — page loads in <3s on mobile connection
- [ ] **SBOM generated** — Software Bill of Materials committed/attached to release (required if sold in EU market or enterprise/government clients)
- [ ] **Privacy by Design assessed** — Art. 25 checklist completed if feature processes personal data (see `docs/13_COMPLIANCE_FRAMEWORKS.md`)
- [ ] **CRA security support period declared** — if software sold in EU market with digital elements, document how long security updates will be provided

> Remove this section if the project is a CLI tool, library, or internal service.

## Dev Commands

```bash
# [Adjust to your stack]
npm run dev
npm run build
npm run lint
npm run test
# [deploy command]   # e.g. vercel deploy, fly deploy, gh workflow run deploy.yml
```
