# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

- **Preferred:** [GitHub Private Vulnerability Reporting](../../security/advisories/new)
- **Alternative:** Direct contact via repository owner
- **Do NOT** open a public GitHub issue for security vulnerabilities

We will acknowledge receipt within 48 hours and provide a detailed response within 5 business days.

## Security Practices

### Authentication & Authorization

- [Describe auth model: e.g. Supabase Auth, JWT, API keys, N/A for CLI tools]
- [Describe access control: e.g. RLS, RBAC, role-based access]

### Data Protection

- [Describe data sensitivity: e.g. PII handling, financial data, health data]
- [Describe logging policy: e.g. no PII in logs]
- [Describe validation: e.g. Zod schemas at system boundaries]

### Dependencies

- Dependencies are reviewed before addition
- Lock files are committed and protected
- Regular dependency audits via `npm audit` / `pip audit`

## Sensitive Files

The following files contain secrets and must NEVER be committed:

- `.env` / `.env.local` / `.env.production`
- [Any file containing service keys or credentials]

These patterns are included in `.gitignore`. Verify before every commit.
