# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly. This process follows **ISO/IEC 29147:2018** (Vulnerability Disclosure) and **ISO/IEC 30111:2019** (Vulnerability Handling).

- **Preferred:** [GitHub Private Vulnerability Reporting](../../security/advisories/new)
- **Alternative:** Direct contact via repository owner
- **Do NOT** open a public GitHub issue for security vulnerabilities

### Disclosure Timeline

| Stage | Deadline | Action |
|---|---|---|
| Acknowledgement | 48 hours | Confirm receipt and assign severity |
| Initial assessment | 5 business days | Provide detailed response with severity classification |
| Patch target | 7 days (Critical), 30 days (High), 90 days (Medium/Low) | Fix and release |
| Public disclosure | 90 days after report (coordinated) | Publish CVE / security advisory |

> **EU Cyber Resilience Act (CRA):** From 11 September 2026, actively exploited vulnerabilities in products with digital elements sold in the EU must be reported to **ENISA within 24 hours** and to affected users within **72 hours**. Update this policy before that date if the product is in scope.

## Security Practices

### Authentication & Authorization

- [Describe auth model: e.g. Supabase Auth, JWT, API keys, N/A for CLI tools]
- [Describe access control: e.g. RLS, RBAC, role-based access]

### Auth Setup Checklist

Before shipping any auth-protected feature, verify:

- [ ] Auth provider configured (email/password, OAuth, API keys, etc.)
- [ ] Password validation rules enabled (if applicable)
- [ ] Email confirmation flow configured (if applicable)
- [ ] User roles/permissions table created (if needed)
- [ ] Admin role assigned to project owner
- [ ] Row-Level Security policies match role definitions
- [ ] Auth flow tested end-to-end (signup → login → protected action → logout)
- [ ] Different role access tested (admin vs user vs anonymous)
- [ ] Session expiry and refresh behaviour verified

### Security Review Questions

Before any feature goes live, answer these questions:

1. **Who should be allowed to see this?** (everyone, authenticated users, specific roles?)
2. **Who should be allowed to change this?** (admin only, owner only, nobody?)
3. **Are defaults restrictive?** (deny by default, grant explicitly?)
4. **Is input validated at the boundary?** (user input, API payloads, URL params?)
5. **Are secrets server-side only?** (no API keys, service roles, or credentials in client code?)
6. **Have you tested your own assumptions?** (tried accessing as wrong role, unauthenticated, with malformed input?)

> Security is judgment, not a checkbox. If you can't answer these questions for a feature, the feature is not ready.

### Data Protection

- [Describe data sensitivity: e.g. PII handling, financial data, health data]
- [Describe logging policy: e.g. no PII in logs]
- [Describe validation: e.g. Zod schemas at system boundaries]
- Transactional emails must not contain sensitive data in plain text. Use rate limiting on email-sending endpoints to prevent abuse.

### SBOM (Software Bill of Materials)

Required by the **EU Cyber Resilience Act** from 11 September 2026 for software sold in the EU market. Also increasingly required by enterprise and government procurement.

- **Format:** SPDX 2.3 or CycloneDX 1.5 (machine-readable)
- **Generation:** automate in CI on every release (tools: [`syft`](https://github.com/anchore/syft), [`cyclonedx-cli`](https://github.com/CycloneDX/cyclonedx-cli))
- **Storage:** commit to `sbom/` directory or attach to GitHub Release as artifact
- **Update trigger:** any dependency change (add, remove, version bump)
- **Contents:** all direct and transitive dependencies with name, version, licence, and source URL

```bash
# Generate SBOM with syft (example — adjust to your stack)
syft . -o spdx-json > sbom/sbom.spdx.json
syft . -o cyclonedx-json > sbom/sbom.cdx.json
```

> See `docs/12_DEPENDENCY_MANAGEMENT.md` for full dependency governance policy including licence compliance and SLSA supply chain security.

### Dependencies

- Dependencies are reviewed before addition — see `docs/12_DEPENDENCY_MANAGEMENT.md` for governance policy
- Lock files are committed and protected
- Regular dependency audits via `npm audit` / `pip audit` / `cargo audit`

## Pre-commit Hook — Secrets Scanner (gitleaks)

A pre-commit hook at `.githooks/pre-commit` runs [gitleaks](https://github.com/gitleaks/gitleaks) against staged changes, blocking commits that contain potential secret values.

Unlike naive name-matching scanners, gitleaks detects by **value shape** (JWT format, API token patterns, private key blocks, etc.) — so documentation referencing env var names like `SUPABASE_SERVICE_ROLE_KEY` is not flagged.

### Coverage

- 800+ built-in patterns for major cloud providers and APIs (AWS, GCP, Azure, GitHub, Stripe, OpenAI, Anthropic, Supabase, Slack, etc.)
- JWT tokens, PEM private keys, SSH keys
- Repo-specific custom rules via `.gitleaks.toml`

### Setup

```bash
# 1. Install gitleaks (once per machine)
brew install gitleaks

# 2. Activate the hook for this repo
git config core.hooksPath .githooks
```

### Per-repo allowlist — `.gitleaks.toml`

Each repo can declare its own allowlist and custom rules in `.gitleaks.toml` at the root. Template file is included — extend as needed. Common customisations:

- Exclude paths (e.g. `docs/`, `*.md`)
- Allow env var names documented without values
- Add project-specific regex patterns

### Per-line bypass

Add a comment to the specific line:

```ts
const key = "abc123"; // gitleaks:allow — test fixture, not a real secret
```

### False positives

If gitleaks flags a legitimate commit:

1. **Preferred:** add the path/pattern to `.gitleaks.toml` allowlist
2. **Per-line:** add `gitleaks:allow` comment to the line
3. **Last resort:** `git commit --no-verify` (document the reason in commit message)

### Running gitleaks manually

```bash
# Scan the whole repo history
gitleaks detect --verbose

# Scan only staged changes (same as the hook)
gitleaks protect --staged --verbose

# Scan a single file
gitleaks detect --source path/to/file --no-git
```

## Sensitive Files

The following files contain secrets and must NEVER be committed unencrypted:

- `.env` / `.env.local` / `.env.production` — in `.gitignore`, never committed
- [Any file containing service keys or credentials]

### Encrypted files in the repository (git-crypt)

For sensitive data that **must** be version-controlled (e.g. bank accounts, shared credentials), use **git-crypt** to encrypt files transparently. Files appear as plain text locally but are encrypted on GitHub.

- Setup guide: [`docs/guides/git-crypt-setup.md`](docs/guides/git-crypt-setup.md)
- Encrypted paths are defined in `.gitattributes`
- Each repo has its own independent key — export and back it up securely

**Rule:** if a file contains sensitive data and needs to be in the repo, it goes through git-crypt. If it doesn't need to be in the repo, it goes in `.env` or a password manager.
