# Content Architecture & i18n

> This file covers two things, in order:
>
> 1. **Cross-layer doctrine** — where each type of content belongs (i18n vs storage vs MD). Tech-agnostic.
> 2. **i18n layer rules** — once content is correctly placed in the i18n layer, how to model it: locales, key naming, namespaces, copy, length.
>
> For marketing content, blog, and social media strategy, see `6_CONTENT_AND_SOCIAL.md`. For data-model and schema decisions that affect content storage, also load `2_ARCHITECTURE.md`.

---

## Part 1 — Cross-Layer Doctrine

A product repo typically has three places content can live:

- **i18n** — locale files in the bundle (`public/locales/*.json`, `src/i18n/locales/*.json`, etc.)
- **Storage** — any runtime store: Postgres/Supabase, SQLite, MongoDB/Firestore, headless CMS (Strapi/Sanity/Contentful), or even a JSON file served as an API
- **MD/MDX** — markdown files in the repo, typically under `content/`

Each was invented to solve a different problem. Mixing them — same string in two places, long-form copy in locale JSONs, frontend reading `.md` directly — produces drift, deploys for typos, and broken SEO.

**This doctrine is technology-agnostic.** "Storage" is a *role*, not a product. The split below applies whether you use Supabase, SQLite, Mongo, Firestore, Strapi, or a JSON API.

### 1. Decision Framework (3 questions)

For every piece of content, answer in order:

**Q1. Who owns it and when does it change?**
- Changes with code releases, dev-owned → **i18n**
- Changes independently of code, editorial-owned (or you, without touching code) → **Storage**
- Changes rarely, versioned in git, has long-form body → **MD as source + Storage as runtime**

**Q2. Is it an atomic string or a structured record?**
- Loose string bound to a component (`<Button>{t('cta.book')}</Button>`) → **i18n**
- Record with multiple related fields (article: title + slug + body + author + date + meta) → **Storage**
- Reusable copy block across pages (hero, "why us" section) → **Storage** (e.g. `content_sections`)

**Q3. Must it be available before any fetch?**
- Yes (error pages, loading states, 404, base navigation, validation messages) → **i18n** (in bundle)
- No (any content page) → **Storage**

### 2. The single principle (TL;DR)

> **i18n = chrome of the site (UI, navigation, errors, validation).**
> **Storage = content of the site (articles, products, FAQs, editorial copy, page-level SEO meta).**
> **MD = an authoring format, never a runtime source.**
>
> If a non-developer would edit the text, it goes to storage. If only a dev touches it in PRs, it stays in i18n.

### 3. Classification table

| Content type | Layer | Notes |
|---|---|---|
| Navigation (`menu.*`, `header.*`) | **i18n** | always |
| Buttons / CTAs (`cta.*`, `common.*`) | **i18n** | always |
| Form labels and validation messages | **i18n** | always |
| Loading / empty / error UI states | **i18n** | always |
| 404 and error boundaries | **i18n** | always |
| Accessibility (aria-labels) | **i18n** | always |
| Blog articles / news / posts | **Storage** + MD source | MD in `content/article-*.md` → SQL/JSON → storage |
| Products / properties / catalogue items | **Storage** | title, description, specs, images |
| FAQs | **Storage** | one row per question, categorised |
| Page-level SEO meta (title, description, og:image) | **Storage** | `page_seo` table or equivalent (slug, title_*, description_*, og_image_url, canonical, robots, structured_data) |
| Hero copy / editorial blocks | **Storage** | `content_sections` table or equivalent |
| Legal pages (privacy, terms, cookies) | **Storage** with versioning | requires `version` + `effective_date` columns — regulators demand history |
| Location guides / amenities / facets | **Storage** | dedicated tables |
| Internal MD (research, status, internal docs) | **MD only** | not published, lives in `content/` or `docs/` in git |

### 4. Translation pattern by storage technology

The **rule of which content gets translated** does not change. The **modelling** depends on the storage:

| Storage | Recommended pattern | Example |
|---|---|---|
| **Relational** (Postgres, Supabase, SQLite, MySQL) | One column per locale | `title_pt TEXT, title_en TEXT, title_es TEXT, ...` |
| **Document** (MongoDB, Firestore) | Nested object with locale keys | `{ title: { pt: "...", en: "..." } }` |
| **Headless CMS** (Strapi, Sanity, Contentful) | Native i18n feature | use the platform's locales mechanism |
| **JSON file API** (MVP / dev) | Same as document | `{ title: { pt, en } }` |

**Default for relational stores:** column-per-locale. With a stable list of ≤ ~10 locales the trade-offs favour it:

- Simple queries (`SELECT title_pt FROM ...`) — no joins, no N+1
- Generated TypeScript types (e.g. `supabase gen types`) are trivial
- Adding a locale = one schema migration with `ADD COLUMN`
- IDE autocomplete catches missing translations

**When to deviate (any storage):** dynamic / large structured content (FAQ items embedded in an article, sources list, key takeaways) → JSON / JSONB column. Use a *shared* JSON when the structure is the same across locales (e.g. an array of source URLs); use *nested-by-locale* JSON when the values are translated (e.g. an array of FAQ items per locale).

**Do NOT create a separate `*_translations` table.** It is an anti-pattern for ≤ 10 stable locales. It only pays off when:
- The locale list is very long (> 10) or unbounded
- Locales are added dynamically by users (e.g. user-generated translations)
- The relational store has no JSONB / JSON column type

### 5. Anti-patterns (do not do)

- ❌ Page-level SEO meta in i18n — SEO changes with marketing decisions, not code releases
- ❌ Long-form content in locale JSONs (any single string > ~200 chars is a smell)
- ❌ Legal pages in i18n — destroys legal-versioning history (GDPR/RGPD requires it)
- ❌ Auto-translate triggers in storage (DB triggers calling LLM APIs) — costly, low quality, hard to audit. Prefer an offline pipeline that writes all locales upfront
- ❌ Frontend reading `.md` directly at runtime — keep MD as offline source-of-truth, storage as runtime
- ❌ Same content duplicated across i18n and storage — pick one source-of-truth
- ❌ A separate `translations` table just because the article said so — see Part 1 §4

### 6. MD source-of-truth pattern

When markdown authoring makes sense (long articles, rich formatting, multi-locale frontmatter):

```
content/article-{slug}.md       ← human-authored source (frontmatter + body)
                                ↓ pipeline (script, Claude Code, etc.)
content/article-{slug}.sql      ← generated insert/upsert (or .json for document stores)
                                ↓ migration / sync script
storage: blog_articles row      ← runtime, read by the frontend
```

**Rules:**
1. The frontend never reads `.md` files directly.
2. The MD file is the source of truth — never edit the storage row by hand once a pipeline exists. Edits go to `.md`, then re-sync.
3. The pipeline must produce all locales atomically (no partial publishes).
4. The `.md` file lives in git for review, history, and diff.

### 7. Applying the doctrine to existing repos

Use this audit checklist when adopting the doctrine in a repo that already mixes layers:

- [ ] List all locale JSON keys with values > 200 chars — these are likely candidates for storage
- [ ] List all `t('...')` calls in SEO `<head>` components — page-level SEO should move to storage
- [ ] List all legal-page content currently in i18n — needs a `legal_pages` table with versioning
- [ ] List all MD files in `content/` — confirm none are read at runtime by the frontend
- [ ] For each storage table with translated columns, confirm the column-per-locale pattern (or document the deviation)
- [ ] Confirm no auto-translate triggers in the storage layer

> Migration is incremental. Apply the doctrine when you next touch a content area — do not stop the world to retrofit everything at once.

---

## Part 2 — i18n Layer Rules

Once content is correctly placed in i18n (per Part 1), follow these rules.

### Supported Locales

| Code | Language | Status |
|------|----------|--------|
| [e.g. en] | English | [primary / supported] |
| [e.g. fr] | French | [primary / supported] |
| [e.g. pt] | Portuguese | [primary / supported] |

> Locales here must use ISO 639-1 codes (`pt`, `en`) or BCP 47 where region matters (`pt-PT`, `en-GB`). See `SYSTEM_PROMPT.md` §2 — Data Formats.

### i18n Rules

- Every user-facing string uses `t('namespace:key')` — no hardcoded text, ever
- Dates and numbers: use `Intl` formatters — never manual string formatting
- Language switcher: always available in the UI (globe icon in header)
- Default locale fallback: `[define per repo]`

### Key Naming Convention

Keys are nested by feature/route, then by element type.

**Pattern:** `feature.context.element`

```
auth.login.title
auth.login.submitButton
auth.login.forgotPassword
dashboard.properties.emptyState.title
dashboard.properties.emptyState.description
dashboard.properties.emptyState.cta
common.actions.save
common.actions.cancel
common.actions.delete
common.errors.generic
common.errors.notFound
```

**Rules:**
- Use **camelCase** for all key segments
- Use **dot notation** for nesting — never underscores or slashes in keys
- Keep keys **descriptive but concise** — `submitButton` not `theButtonThatSubmitsTheForm`
- `common.*` namespace for shared labels (Save, Cancel, Error, etc.)
- Never reuse a key in a different semantic context — duplicate rather than misuse

### Namespace Strategy

Organise translation files by feature or route, not one monolithic file.

| Namespace | Contents |
|---|---|
| `common` | Shared labels, actions, errors, states |
| `auth` | Login, register, password reset |
| `[feature]` | All copy for that feature/route |

**File structure:**
```
public/locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   └── [feature].json
├── fr/
│   └── ...
```

> **Anti-pattern alert:** if a namespace file passes ~400 keys or any key value exceeds ~200 chars, re-read Part 1 — that content probably belongs in storage.

### Copy Rules

#### Casing
- **Buttons and CTAs:** Sentence case — "Save changes", not "Save Changes"
- **Headings:** Sentence case — "Your properties", not "Your Properties"
- **Labels:** Sentence case

#### Tone
- [Define per repo — e.g. "direct and professional", "warm and approachable"]
- Avoid jargon unless the target audience uses it fluently
- Error messages: explain what happened, not what the system did ("Couldn't save changes" not "POST request failed")

#### Button Labels
- Verb-first: "Save changes", "Delete property", "Send invoice"
- Avoid generic labels: not "OK", "Yes", "Submit" — be specific about the action
- Destructive actions: use the object — "Delete property", not just "Delete"

#### Empty States
- Title: concise noun phrase — "No properties yet"
- Description: one sentence explaining what to do — "Add your first property to get started."
- CTA: matches the primary action — "Add property"

#### Error Messages
- Never expose raw API errors or stack traces
- Always suggest a next action if possible
- Generic fallback: "Something went wrong. Please try again." (key: `common.errors.generic`)

### Length Constraints

Long translations break layouts. Define max character counts for key elements:

| Element | Max chars | Notes |
|---|---|---|
| Button label | 24 | Longer labels wrap on mobile |
| Nav item | 20 | Sidebar items must fit on one line |
| Card title | 60 | Truncate with `truncate` class if needed |
| Toast message | 80 | Auto-dismisses — must be scannable |
| Page title (h1) | 50 | SEO and layout |

> If a string genuinely needs more than 200 chars, it almost always belongs in storage (Part 1 §3) — not i18n.

---

## Decisions Log

Append non-obvious content-architecture or i18n decisions here.

<!-- Example:
### 2026-03-31 — Common namespace for all action labels
**Decision:** All action verbs (Save, Cancel, Delete, Edit) live in `common.actions.*`.
**Reason:** Avoids duplication across 10+ feature namespaces for identical strings.
-->
