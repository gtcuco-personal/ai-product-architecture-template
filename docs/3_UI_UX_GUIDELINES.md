# UI/UX Guidelines

## Design Philosophy

- [e.g. Mobile-first, dark-first, minimal, accessible]
- [e.g. Component library: Shadcn/ui only — no custom components when a primitive exists]
- [e.g. Emotional tone: premium, calm, confident — or: playful, expressive, bold]

### Design System Checklist

Define these global parameters **before** designing individual screens:

- [ ] **Spacing rules** — e.g. 8px grid, Tailwind scale
- [ ] **Typography hierarchy** — headings, body, captions, sizes, weights
- [ ] **Grid logic** — max width, columns, breakpoints
- [ ] **Color scheme** — tokens for light/dark modes (see below)
- [ ] **Layout rhythm** — consistent vertical spacing between sections
- [ ] **Emotional tone** — 2-3 adjectives that describe how the app should *feel*

### Mobile-First Checklist

If the project targets mobile or responsive users:

- [ ] **Start with the smallest screen** — design mobile first, scale up
- [ ] **One clear action per screen** — no competing CTAs
- [ ] **One clear outcome per flow** — user knows what they're doing and why
- [ ] **Touch-optimized** — buttons ≥44px, adequate spacing between tap targets
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

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings | [font] | [size] | [weight] |
| Body | [font] | [size] | [weight] |
| Code | [font] | [size] | [weight] |

## Spacing & Layout

- [e.g. Use Tailwind spacing scale — no arbitrary values]
- [e.g. Border radius: --radius: 16px]
- [e.g. Max content width: 1280px]

## Animations

- [e.g. Scroll reveal via IntersectionObserver]
- [e.g. Transitions: 300ms ease-in-out]

## UI Rules

1. No inline styles — use Tailwind classes only
2. No arbitrary color values — use design tokens
3. No custom components when a library primitive exists
4. [Add project-specific rules]
