# UI/UX Guidelines

## Design Philosophy

- [e.g. Mobile-first, dark-first, minimal, accessible]
- [e.g. Component library: Shadcn/ui only — no custom components when a primitive exists]

### Emotional Tone (required)

Define 3-5 adjectives that describe how the app should *feel*. These guide every design decision — the agent uses them to resolve ambiguity.

> Example: "calm, precise, luminous, confident, generous"

| Word | Meaning in practice |
|------|-------------------|
| [word] | [what this means for spacing, color, motion, copy] |
| [word] | [what this means for spacing, color, motion, copy] |
| [word] | [what this means for spacing, color, motion, copy] |

### Design System Checklist

Define these global parameters **before** designing individual screens:

- [ ] **Emotional tone** — filled in above
- [ ] **Spacing rules** — defined in Spacing section below
- [ ] **Typography hierarchy** — defined in Typography section below
- [ ] **Grid logic** — max width, columns, breakpoints
- [ ] **Color scheme** — tokens for light/dark modes
- [ ] **Layout rhythm** — consistent vertical spacing between sections
- [ ] **Component patterns** — how cards, forms, CTAs should look

### Mobile-First Checklist

If the project targets mobile or responsive users:

- [ ] **Start with the smallest screen** — design mobile first, scale up
- [ ] **One clear action per screen** — no competing CTAs
- [ ] **One clear outcome per flow** — user knows what they're doing and why
- [ ] **Touch-optimized** — buttons >=44px, adequate spacing between tap targets
- [ ] **Responsive scaling** — layout adapts gracefully to desktop, not just "fits"
- [ ] **One-handed use** — primary actions reachable with thumb
- [ ] **PWA installability** — if applicable, manifest + service worker configured
- [ ] **Performance on mobile** — tested on real device or throttled connection

## Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--background` | [value] | [value] | Page background |
| `--foreground` | [value] | [value] | Primary text |
| `--primary` | [value] | [value] | Brand / CTAs |
| `--accent` | [value] | [value] | Highlights |
| `--muted` | [value] | [value] | Subtle backgrounds |
| `--destructive` | [value] | [value] | Errors / danger |

## Typography

| Element | Font | Size | Weight | When to use |
|---------|------|------|--------|-------------|
| H1 | [font] | [size] | [weight] | Page titles, hero headings |
| H2 | [font] | [size] | [weight] | Section titles |
| H3 | [font] | [size] | [weight] | Subsection titles, card titles |
| Body | [font] | [size] | [weight] | Paragraphs, descriptions |
| Caption | [font] | [size] | [weight] | Labels, metadata, timestamps |
| Code | [font] | [size] | [weight] | Code blocks, technical content |

## Spacing & Layout

### Spacing Scale

| Value | Tailwind | When to use |
|-------|----------|-------------|
| 4px | `p-1`, `gap-1` | Tight: between icon and label, inside badges |
| 8px | `p-2`, `gap-2` | Compact: between related items in a group |
| 16px | `p-4`, `gap-4` | Standard: between form fields, list items |
| 24px | `p-6`, `gap-6` | Comfortable: between card sections, content blocks |
| 32px | `p-8`, `gap-8` | Generous: between page sections |
| 48-64px | `py-12`-`py-16` | Spacious: between major page sections |

### Layout Rules

- [e.g. Max content width: 1280px]
- [e.g. Border radius: --radius: 16px → use rounded-xl or rounded-2xl]
- [e.g. No arbitrary values like py-[37px] — use Tailwind scale only]

## Component Patterns

Describe how key components should look and behave. This prevents the agent from making taste decisions.

### Cards
- [e.g. bg-card, rounded-xl, shadow-card, p-6, border border-border/50]
- [e.g. Always include: title, description, optional action]

### Buttons
- [e.g. Primary: bg-primary text-primary-foreground, min-height 44px]
- [e.g. Secondary: border-primary/30, text-primary]
- [e.g. Destructive: bg-destructive, only for irreversible actions]

### Forms
- [e.g. Labels above inputs, not inline]
- [e.g. Error messages below field in text-destructive text-sm]
- [e.g. Submit button full-width on mobile, right-aligned on desktop]

## Animations

- [e.g. Scroll reveal via IntersectionObserver]
- [e.g. Transitions: 300ms ease-in-out]
- [e.g. Motion should be purposeful — feedback, emphasis, context — not decoration]

## External Component Libraries

Use these to improve design quality beyond what the AI generates from scratch:

| Library | URL | Best for |
|---------|-----|----------|
| 21st.dev | https://21st.dev | Premium layout blocks (hero, navbar, pricing, testimonials) |
| Hover.dev | https://hover.dev | Interactive React + Tailwind components with animation |
| React Bits | https://reactbits.dev | Animated, interactive components |

**Workflow:** Find component → select "Lovable" output → paste into project → adjust to your design tokens.

## UI Rules

1. No inline styles — use Tailwind classes only
2. No arbitrary color values — use design tokens
3. No custom components when a library primitive exists
4. Emotional tone words guide ambiguous decisions — when in doubt, refer to them
5. [Add project-specific rules]

## Design Review (6 Dimensions)

Before approving any delivery, evaluate against:

1. **Intent Alignment** — does it do what was asked?
2. **UX** — is it easy to use without instructions?
3. **Visual Hierarchy** — does the eye know where to go?
4. **Mobile Readiness** — does it work on phone?
5. **Clarity** — is every element's purpose obvious?
6. **Execution Quality** — is it well-built or patched together?

---

## UI Patterns

Recurring compositions of components that solve common UX problems. Check here before building a new layout.

### Form Pattern
- Single column, `max-w-lg`, centered on desktop
- Labels above inputs — never floating or placeholder-as-label
- Inline validation errors below each field (`text-destructive text-sm`)
- Submit button: right-aligned, primary variant
- Cancel: ghost variant, left of submit
- Use `react-hook-form` + `zod` — never a naked `<form>`

### Data Table Pattern
- Use shadcn DataTable (Tanstack Table)
- Always include: column sorting, search/filter bar, pagination
- Row actions: `DropdownMenu` — not inline buttons
- Empty state: centered message + single CTA (see States section)
- Loading state: `Skeleton` rows matching column count

### Page Layout Pattern
- Sidebar navigation (desktop) / Sheet navigation (mobile)
- Page header: `h1` + optional description + primary action button (right-aligned)
- Content area: `max-w-7xl mx-auto px-4`
- Breadcrumbs only if depth > 2

### Auth Pattern
- Single centered card, `max-w-sm`
- Logo above form
- Social login buttons above email/password (if applicable)
- "Forgot password" as a text link below password field

### Modal / Confirmation Pattern
- Use `Dialog` for destructive actions and confirmations only
- Use `Sheet` for data entry and edit forms
- Destructive confirm: destructive variant button on right, ghost "Cancel" on left
- Never put long forms inside a `Dialog`

---

## States

Every async-loaded or data-dependent UI must handle all five states. This is the most skipped part of UI work.

### Empty State
- Centered layout
- Lucide icon (`size-12`, `text-muted-foreground`)
- `h3` title (e.g. "No properties yet")
- `p` description (`text-muted-foreground`)
- Single CTA button (primary variant)

### Loading State
- `Skeleton` components matching the layout of the loaded content (`bg-muted animate-pulse`)
- Never use a spinner alone for content areas — use skeletons
- Spinner (`Loader2` lucide, `animate-spin`) only for button actions in progress

### Error State
- `AlertCircle` icon (`text-destructive`)
- Short message explaining what failed (`text-muted-foreground`)
- Retry button (outline variant) if the action is retryable
- Never expose raw API error messages to the user

### Permission / Restricted State
- `Lock` icon (`text-muted-foreground`)
- Message in i18n key — never hardcoded
- Optional: contact or upgrade CTA

### Destructive Action Pattern
- Always require explicit `Dialog` confirmation
- Confirm button: destructive variant, verb-first label ("Delete property", not "Yes")
- Cancel: ghost variant
- Never auto-execute destructive actions
