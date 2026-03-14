# Contributing

## Getting Started

### Prerequisites

- [e.g. Node.js 18+, Python 3.10+, Git]

### Local Setup

```bash
git clone <repo-url>
cd [repo-name]
# [stack-specific setup: npm install, pip install, etc.]
cp .env.example .env   # if applicable
```

## Development Workflow

### Branch Strategy

- **Never push directly to `main`**
- Create feature branches: `feat/description`, `fix/description`, `docs/description`, `chore/description`
- Open a Pull Request via `gh pr create`
- Wait for review and approval before merging

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: correct a bug
docs: update documentation
chore: upgrade dependencies
```

### Pull Requests

- Keep PRs focused and small (one concern per PR)
- Include a clear description of what changed and why
- Ensure build passes locally before pushing
- Link related issues if applicable

## Code Style

- [e.g. ESLint, PEP 8, Prettier]
- [e.g. All user-facing text via i18n — never hardcode strings]

## Testing

```bash
# [Adjust to your stack]
npm run test
```

## Protected Files

The following files must not be edited manually:

- [e.g. Auto-generated types, .env, lock files, migrations]

## Decision Records (ODR)

This project uses Organisational Decision Records to document architectural and governance decisions.

### Namespace Convention

ODRs are split into two directories to avoid naming conflicts when template updates are propagated to repos:

| Directory | Purpose | Managed by |
|---|---|---|
| `docs/decisions/` | ODRs created within this repo | Repo maintainers |
| `docs/decisions/template/` | ODRs inherited from the base governance template | Template repo |

- **Local ODRs** use sequential numbering scoped to the repo (e.g., `ODR-001-auth-strategy.md`)
- **Template ODRs** keep their original numbering from the template repo (e.g., `ODR-001-documentation-trigger-matrix.md`)
- The two sequences are independent — a repo can have both a local `ODR-001` and a template `ODR-001` without conflict
- When updating from the template, only files in `docs/decisions/template/` are replaced. Local ODRs are never touched.
- `docs/decisions/TEMPLATE.md` is the format template for creating new ODRs. It stays in the root of `decisions/`.

## Questions?

Open a GitHub issue or contact the maintainer directly.
