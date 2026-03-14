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

### Dependencies

- Dependencies are reviewed before addition
- Lock files are committed and protected
- Regular dependency audits via `npm audit` / `pip audit`

## Sensitive Files

The following files contain secrets and must NEVER be committed:

- `.env` / `.env.local` / `.env.production`
- [Any file containing service keys or credentials]

These patterns are included in `.gitignore`. Verify before every commit.
