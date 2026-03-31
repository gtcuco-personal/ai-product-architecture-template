# Content & i18n

> This file covers UI copy rules and internationalisation conventions. For marketing content, blog, and social media, see `6_CONTENT_AND_SOCIAL.md`.

---

## Supported Locales

| Code | Language | Status |
|------|----------|--------|
| [e.g. en] | English | [primary / supported] |
| [e.g. fr] | French | [primary / supported] |
| [e.g. pt] | Portuguese | [primary / supported] |

---

## i18n Rules

- Every user-facing string uses `t('namespace:key')` — no hardcoded text, ever
- Dates and numbers: use `Intl` formatters — never manual string formatting
- Language switcher: always available in the UI (globe icon in header)
- Default locale fallback: `[define per repo]`

---

## Key Naming Convention

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

### Rules
- Use **camelCase** for all key segments
- Use **dot notation** for nesting — never underscores or slashes in keys
- Keep keys **descriptive but concise** — `submitButton` not `theButtonThatSubmitsTheForm`
- `common.*` namespace for shared labels (Save, Cancel, Error, etc.)
- Never reuse a key in a different semantic context — duplicate rather than misuse

---

## Namespace Strategy

Organize translation files by feature or route, not one monolithic file.

| Namespace | Contents |
|---|---|
| `common` | Shared labels, actions, errors, states |
| `auth` | Login, register, password reset |
| `[feature]` | All copy for that feature/route |
| `[e.g. properties]` | Property listing, detail, form |

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

---

## Copy Rules

### Casing
- **Buttons and CTAs:** Sentence case — "Save changes", not "Save Changes"
- **Headings:** Sentence case — "Your properties", not "Your Properties"
- **Labels:** Sentence case

### Tone
- [Define per repo — e.g. "direct and professional", "warm and approachable"]
- Avoid jargon unless the target audience uses it fluently
- Error messages: explain what happened, not what the system did ("Couldn't save changes" not "POST request failed")

### Button Labels
- Verb-first: "Save changes", "Delete property", "Send invoice"
- Avoid generic labels: not "OK", "Yes", "Submit" — be specific about the action
- Destructive actions: use the object — "Delete property", not just "Delete"

### Empty States
- Title: concise noun phrase — "No properties yet"
- Description: one sentence explaining what to do — "Add your first property to get started."
- CTA: matches the primary action — "Add property"

### Error Messages
- Never expose raw API errors or stack traces
- Always suggest a next action if possible
- Generic fallback: "Something went wrong. Please try again." (key: `common.errors.generic`)

---

## Length Constraints

Long translations break layouts. Define max character counts for key elements:

| Element | Max chars | Notes |
|---|---|---|
| Button label | 24 | Longer labels wrap on mobile |
| Nav item | 20 | Sidebar items must fit on one line |
| Card title | 60 | Truncate with `truncate` class if needed |
| Toast message | 80 | Auto-dismisses — must be scannable |
| Page title (h1) | 50 | SEO and layout |

---

## Decisions Log

Append non-obvious i18n decisions here.

<!-- Example:
### 2026-03-31 — Common namespace for all action labels
**Decision:** All action verbs (Save, Cancel, Delete, Edit) live in `common.actions.*`.
**Reason:** Avoids duplication across 10+ feature namespaces for identical strings.
-->
