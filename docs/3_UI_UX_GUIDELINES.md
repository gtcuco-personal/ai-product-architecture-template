# UI/UX Guidelines

## Design Philosophy

- [e.g. Mobile-first, dark-first, minimal, accessible]
- [e.g. Component library: Shadcn/ui only — no custom components when a primitive exists]

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
