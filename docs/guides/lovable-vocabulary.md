# Lovable Vocabulary Reference

> Tool-specific guide for prompting Lovable. Not part of the generic prompt library (`docs/prompts.md`) — split out because it only applies when the project uses Lovable, and it overlaps with `docs/3_UI_UX_GUIDELINES.md`'s component/token vocabulary (which is the canonical source for what the tokens *mean*; this file is the canonical source for how to *phrase* a Lovable prompt using them).

Use these exact terms in prompts — they map to the design system. Vague language forces Lovable to guess, which causes drift.

| Say this | Not this |
|---|---|
| `primary variant` | blue button, main button, brand button |
| `destructive variant` | red button, danger button, delete button |
| `muted foreground` | gray text, light text, secondary text |
| `Card component` | box, container, panel, wrapper |
| `Sheet` | sidebar, slide-over, drawer, side panel |
| `Dialog` | modal, popup, overlay |
| `Toast` | notification, snackbar, alert popup |
| `Skeleton` | loading placeholder, shimmer |
| `comfortable spacing` | normal padding, some space, a bit of padding |
| `text-destructive` | red text, error color |
| `shadcn Select` | dropdown, combo box (unless using Combobox) |

## Prompt Structure

Every Lovable prompt should follow this skeleton:

```
[ACTION] a [PATTERN from docs/3_UI_UX_GUIDELINES.md] for [PURPOSE].
Use [COMPONENTS] with [VARIANT/TOKEN] styling.
[State handling: include empty/loading/error states if data-dependent.]
[i18n: all strings via t('namespace:key') — no hardcoded text.]
```

## DO NOT List

Violations that cause the most rework — check before submitting any prompt:

- **DO NOT** use standard HTML `<button>` or `<input>` — always import from `@/components/ui/`
- **DO NOT** write custom CSS or `style={}` — Tailwind utilities only
- **DO NOT** use arbitrary values like `px-[13px]` — use Tailwind scale
- **DO NOT** use raw hex or rgb colors — use CSS variable tokens (`text-primary`, `bg-muted`, etc.)
- **DO NOT** use standard `<a>` for internal links — use the framework's `<Link>`
- **DO NOT** hardcode text strings — every user-facing string must use `t('namespace:key')`
- **DO NOT** create a custom component when a shadcn/ui primitive exists
- **DO NOT** put data entry forms inside a `Dialog` — use `Sheet`
- **DO NOT** skip empty/loading/error states for async content
- **DO NOT** use `"make it look nice/premium/modern"` — reference tokens and patterns explicitly
