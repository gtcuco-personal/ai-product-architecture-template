# AI Product Architecture Template

Governance and documentation template for AI product repositories. Provides a standardised structure for project documentation, security policies, contribution guidelines, and architectural decision records.

## What's Included

```
├── CLAUDE.md              # AI agent entry point — repo metadata, commands, quick reference
├── CONTRIBUTING.md        # Setup, branch strategy, PR process, code style
├── SECURITY.md            # Vulnerability reporting, auth model, data protection
├── SYSTEM_PROMPT.md       # Universal AI agent operating instructions (v1.4)
├── CHANGELOG.md           # Version history and release notes
└── docs/
    ├── 0_GROUND_RULES.md        # Stack, inviolable rules, protected files
    ├── 1_BUSINESS_CONTEXT.md    # Vision, mission, business model, markets
    ├── 2_ARCHITECTURE.md        # Routes, components, data model, directory structure
    ├── 3_UI_UX_GUIDELINES.md    # Design tokens, typography, spacing, UI rules
    ├── 4_SEO_AND_AEO.md         # Meta tags, structured data, sitemap
    ├── 5_ROADMAP_AND_TASKS.md   # Execution log and backlog
    └── decisions/
        └── TEMPLATE.md          # ODR (Organisational Decision Record) format
```

## How to Use

1. Click **"Use this template"** on GitHub (or clone and remove `.git`)
2. Replace all `[placeholders]` with your project-specific information
3. Delete files that don't apply (e.g. `4_SEO_AND_AEO.md` for CLI tools)
4. Start building

## Design Principles

- **Stack-agnostic** — works for React, Python, Node, Go, or any stack
- **AI-first** — structured for Claude, GPT-4, and other AI coding assistants
- **Modular** — use what you need, delete what you don't
- **Convention over configuration** — consistent across all your repos

## License

MIT
