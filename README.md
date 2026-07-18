# AI Product Architecture Template

Governance and documentation template for AI product repositories. Provides a standardised structure for project documentation, security policies, contribution guidelines, and architectural decision records.

## What's Included

```
├── CLAUDE.md              # AI agent entry point — repo metadata, commands, quick reference
├── AGENTS.md              # Portable agent entry point — shared rules for Codex and other agents
├── CONTRIBUTING.md        # Setup, branch strategy, PR process, code style
├── SECURITY.md            # Vulnerability reporting, auth model, data protection
├── SYSTEM_PROMPT.md       # Shared operating policy (v2.2; runtime hierarchy still wins)
├── CHANGELOG.md           # Version history and release notes
├── docs/
    ├── 0_GROUND_RULES.md        # Stack, inviolable rules, protected files
    ├── 1_BUSINESS_CONTEXT.md    # Vision, mission, business model, markets
    ├── 2_ARCHITECTURE.md        # Routes, components, data model, directory structure
    ├── 3_UI_UX_GUIDELINES.md    # Design tokens, typography, spacing, UI rules
    ├── 5_ROADMAP_AND_TASKS.md   # Execution log and backlog
    ├── 6_CONTENT_AND_SOCIAL.md  # Content strategy + technical SEO/AEO/GEO (merged in v2.0)
    ├── 7_CONTENT_I18N.md        # Content architecture doctrine + i18n layer rules
    ├── 8_DATA_AND_ANALYSIS.md   # Metric registry, assumptions log, data quality checks
    ├── 9_AGENT_SKILLS.md        # Agent Skills framework and structure
    ├── 10_AGENT_SAFETY.md       # Trust hierarchy, prompt injection policy, minimal privilege
    ├── 11_TESTING.md            # Testing strategy, framework selection, coverage, CI/CD gates, AI evals
    ├── 12_DEPENDENCY_MANAGEMENT.md  # Licence policy, SBOM, SLSA, upgrade strategy, CVE SLAs
    ├── 13_COMPLIANCE_FRAMEWORKS.md  # ISO/regulatory compliance directory (Tier 1-4)
    ├── 14_AI_GOVERNANCE.md      # EU AI Act, ISO 42001, NIST AI RMF, AI inventory
    ├── 15_HEALTH_CHECK.md       # Weekly health check checklist (renamed from 6_ in v2.0)
    ├── prompts.md                # Reusable generic prompt templates
    ├── guides/                   # Standalone how-to guides (git-crypt, Lovable vocabulary, ...)
    └── decisions/
        ├── TEMPLATE.md          # ODR (Organisational Decision Record) format
        └── template/            # ODRs inherited from this base template
├── scripts/
    ├── check-governance.mjs     # Dependency-free governance self-check
    ├── detect-ci-mode.mjs       # npm/Bun/Deno stack detection used by CI
    └── scaffold.mjs             # Safe, dry-run-first profile scaffolder
└── tests/template/
    ├── fixtures/                # Executable npm, Bun, and Deno mini-projects
    └── run-ci-fixtures.mjs      # Runs real install/check/test/audit paths
```

## How to Use

1. Click **"Use this template"** on GitHub (or clone and remove `.git`)
2. Run `node scripts/scaffold.mjs --list`, then preview a profile with `node scripts/scaffold.mjs --profile <name>`
3. Apply the selected profile explicitly with `node scripts/scaffold.mjs --profile <name> --apply`
4. Replace all remaining `[placeholders]` with your project-specific information
5. Run `node scripts/check-governance.mjs --project` to catch unfilled required placeholders and broken governance references
6. Start building

### Scaffold Profiles

| Profile | Use when |
|---|---|
| `minimal` | Small internal tool or prototype needing only the governance core |
| `react-supabase` | React/Supabase product with UI, content, i18n, and AI guidance |
| `python-data` | Python analytics, data science, or data-heavy AI product |
| `regulated-ai` | External or regulated AI product that needs the complete template |

The scaffolder is dry-run by default. It records intentional removals in
`template-profile.json`; switching profiles later requires starting from a fresh
copy because deleted modules cannot be reconstructed safely.

## Design Principles

- **Opinionated for two stacks, not agnostic for all.** The governance structure (docs 0-1, 5, 9-14, ODRs) is genuinely stack-independent. But `docs/2_ARCHITECTURE.md`'s DB checklist, `docs/3_UI_UX_GUIDELINES.md`, and `docs/15_HEALTH_CHECK.md` assume **React/Vite + Tailwind + shadcn/ui + Supabase**; `docs/8_DATA_AND_ANALYSIS.md` assumes a **Python/pandas** analytics stack. If your project uses a different stack, treat those specific docs as examples to rewrite, not as agnostic scaffolding — don't assume the whole template is stack-neutral just because some of it is.
- **AI-first and multi-agent** — `AGENTS.md` carries portable guidance; runtime-specific adapters add capabilities without redefining the runtime's instruction hierarchy
- **Modular** — use what you need, delete what you don't
- **Convention over configuration** — consistent across all your repos
- **Lean by default** — compliance/security machinery sized for a team (SBOM, SLSA, incident SLAs, AI eval suites) is opt-in, gated by `docs/13_COMPLIANCE_FRAMEWORKS.md` §Applicability Gate, not default weight every repo carries

## Author

**Gustavo Teixeira Cuco** — [GitHub](https://github.com/gtcuco-personal)

## License

[MIT](LICENSE)
