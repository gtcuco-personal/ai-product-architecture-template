# ODR-004 — Content Layer Doctrine (i18n vs Storage vs MD)

**Status:** Approved
**Date:** 2026-05-01
**Author:** Gustavo Teixeira Cuco
**Reviewers:** Claude Code (2026-05-01)
**Applies to:** All product repos governed by `ai-product-architecture-template` that combine an i18n layer, a runtime content store, and authored content files.

## Context

Across multiple product repos (`lusiberiastays2`, `icon-site`, `gtc-portfolio`, `pitch-q-liri`, `liri-product`, `referenceguard`, `lsflux`), the same architectural question kept being re-decided per repo: **where does each type of content live?**

Three layers exist in every product repo:

- **i18n layer** — locale JSONs in the bundle, e.g. `public/locales/*.json` or `src/i18n/locales/*.json`
- **Storage layer** — runtime store of any technology: Postgres/Supabase, SQLite, MongoDB/Firestore, headless CMS (Strapi/Sanity/Contentful), or JSON-as-API
- **MD layer** — authored markdown files in `content/` or equivalent

Without a shared doctrine, drift is inevitable: page-level SEO meta scattered between i18n and storage, long-form blog body copy in locale JSONs, the frontend reading `.md` files directly, locale JSONs ballooning past 1500+ keys per language, legal pages in i18n with no version history (a GDPR/RGPD problem).

The trigger for codifying this was `lusiberiastays2`: ~1640 keys per locale across 5 languages, with mixed-layer content on the same page (i18n SEO meta + DB blog content + i18n FAQ headers + DB FAQ items).

## Decision

Adopt a single, tech-agnostic content-layer doctrine, codified in `docs/7_CONTENT_I18N.md` (Part 1), inherited by every product repo via the template.

The doctrine has three parts:

1. **A 3-question decision framework** for routing any piece of content to the correct layer (owner & change cadence, atomic vs structured, availability before fetch).
2. **A classification table** mapping content type to layer (navigation/CTAs/forms/errors → i18n; articles/products/FAQs/page-SEO/hero copy/legal → storage; long-form authored content → MD-as-source + storage-as-runtime).
3. **A translation pattern matrix per storage technology** (relational → column-per-locale; document → nested object per locale; CMS → native i18n; JSON API → nested object).

The single guiding principle:

> **i18n = chrome of the site. Storage = content of the site. MD = an authoring format, never a runtime source.**
> **If a non-developer would edit it, it goes to storage. If only a dev touches it in PRs, it stays in i18n.**

Where the doctrine lives:

- `docs/7_CONTENT_I18N.md` Part 1 — the doctrine (cross-layer)
- `docs/7_CONTENT_I18N.md` Part 2 — i18n layer rules (unchanged from prior version, now framed as the rules for one of the three layers)
- `CLAUDE.md` — Context Loading Policy gains a row for "Code — content layer decision"; the "Code — DB / schema" row references `7_CONTENT_I18N.md` when content tables are involved
- `SYSTEM_PROMPT.md` §1 — entry for `7_CONTENT_I18N.md` updated to reflect the cross-layer scope
- `SYSTEM_PROMPT.md` §6 — documentation trigger matrix gains a row for content-layer decisions (move text from i18n → storage, add `page_seo`/`legal_pages`/`content_sections` tables, change translation pattern)

## Rationale

Alternatives considered:

1. **Per-repo conventions** — let each repo decide. Rejected: the same question kept being re-asked and re-answered, often inconsistently, with no shared anti-pattern catalogue.

2. **Doctrine in `ai-governance`** (the universal parent template). Rejected: `ai-governance` is intentionally sparse (system prompt, safety policy). Content-layer concerns are product-specific, not universal AI-agent governance.

3. **New doc `2A_CONTENT_LAYERS.md`** as a separate file. Rejected: `7_CONTENT_I18N.md` already exists and was already loaded for i18n decisions. Splitting forces agents to load two docs to answer one question. Expanding the existing doc keeps the load policy simple and avoids breaking inbound links from existing repos.

4. **Renaming `7_CONTENT_I18N.md` to `7_CONTENT_ARCHITECTURE.md`** to better reflect the scope. Rejected: every product repo already references the existing filename in its `CLAUDE.md` Context Loading Policy. Renaming creates a propagation problem with no commensurate benefit — the doc title and Part 1 heading make the broader scope explicit.

The chosen approach (expand `7_CONTENT_I18N.md` in place, add Part 1 as the doctrine, keep Part 2 as the i18n-specific rules) was selected because:

- Filenames stay stable across all downstream repos
- A single load location for any content-related decision
- Existing i18n rules are recontextualised, not rewritten — they become "the rules for one of the three layers"
- Tech-agnostic framing (storage = role, not product) survives stack changes (a repo that migrates from Supabase to Firestore or adds a Strapi CMS does not need a new doctrine)

## Consequences

### Positive

- Cross-repo consistency: the same content type lands in the same layer regardless of which repo
- Shared anti-pattern catalogue: page-level SEO in i18n, long-form copy in locale JSONs, legal pages without versioning, frontend reading `.md` directly, auto-translate triggers in the storage layer — all explicitly forbidden
- Migration is incremental, not big-bang: the doctrine applies on next-touch of a content area, not as a stop-the-world retrofit
- Tech-agnostic: the same framework applies to Postgres, SQLite, Mongo, Firestore, Strapi, or JSON-as-API; only the modelling syntax changes
- Auditability: a clear checklist exists for assessing any repo against the doctrine (Part 1 §7)

### Negative

- `docs/7_CONTENT_I18N.md` is now longer (~270 lines) and dual-purpose. Mitigated by the Part 1 / Part 2 split and explicit table-of-contents at the top
- Existing repos with mixed-layer content (notably `lusiberiastays2`) carry an audit debt: ~1640 keys per locale need triage. Mitigated by the on-touch migration rule

### Risks

- **Over-eager retrofit.** An agent might interpret "doctrine adopted" as "migrate everything now". Mitigation: Part 1 §7 explicitly states migration is incremental, applied on next-touch.
- **CMS integrations.** Repos that adopt a headless CMS (Strapi, Sanity) get i18n via the CMS itself, not via locale JSONs. The doctrine accommodates this in Part 1 §4 but real-world adoption may surface edge cases (e.g. CMS-managed UI strings). Re-review when the first CMS-adopting repo lands.
- **Document stores.** The nested-object-per-locale pattern is recommended but untested in this fleet (all current product repos are relational). If a Mongo/Firestore project adopts the doctrine, validate the pattern in practice.

## Review

**Next review:** When the doctrine has been propagated to all listed product repos (via `/sync-repos`) and at least one full migration has been executed (likely `lusiberiastays2` Phase 2 — page-level SEO meta from i18n to a `page_seo` table). At that point, validate the framework against the lessons learned and tighten any anti-patterns that proved insufficient.
