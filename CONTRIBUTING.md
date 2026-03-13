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

## Questions?

Open a GitHub issue or contact the maintainer directly.
