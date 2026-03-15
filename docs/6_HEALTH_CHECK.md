# Weekly Health Check

> Run once per week. Copy this checklist into an issue, PR, or conversation and mark items as verified.

---

## 1. Routes & Navigation

- [ ] All routes in `docs/2_ARCHITECTURE.md` have matching components in code
- [ ] No orphan routes (defined in router but no component imported)
- [ ] No dead links in navigation menus
- [ ] Redirects and legacy URLs still work

## 2. Database & Schema

- [ ] Migration files match current DB state
- [ ] Edge functions reference correct table/column names (no stale schema references)
- [ ] RLS policies cover all tables (no unprotected tables)
- [ ] Test vs Live environment separation confirmed

## 3. Authentication & Roles

- [ ] Login flows reach valid destinations (no 404 after login)
- [ ] Signup flows show correct feedback (approval pending, confirmation email, etc.)
- [ ] Role-based access enforced (test as each role type)
- [ ] Unauthenticated users cannot access protected routes

## 4. Security

- [ ] No `dangerouslySetInnerHTML` without sanitisation (DOMPurify or equivalent)
- [ ] No secrets, API keys, or PII in client-side code or git history
- [ ] CORS allowlist up to date (no stale domains)
- [ ] CSP headers present and correct
- [ ] Dependencies checked for known vulnerabilities (`npm audit`)

## 5. Build & Performance

- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] No new warnings introduced
- [ ] Bundle size within budget (document current size and threshold)
- [ ] Core Web Vitals acceptable (LCP, FID, CLS)

## 6. Documentation Alignment

- [ ] `CLAUDE.md` reflects current project state (routes, tables, env vars)
- [ ] `docs/2_ARCHITECTURE.md` matches actual component and route structure
- [ ] `docs/5_ROADMAP_AND_TASKS.md` has no stale in-progress items
- [ ] `CHANGELOG.md` includes recent changes
- [ ] Scaffold/placeholder components either completed or removed

## 7. External Integrations

- [ ] Edge functions deployed and responding
- [ ] Third-party API keys valid and not expiring soon
- [ ] Webhook endpoints active
- [ ] Scheduled tasks (pg_cron) running as expected

## 8. Content & i18n

- [ ] All user-facing strings use translation keys (no hardcoded text)
- [ ] New content translated to all supported languages
- [ ] Sitemap up to date
- [ ] OG images and meta descriptions present for all public pages

---

## How to use

1. **Weekly cadence:** Run every Monday or at the start of each sprint
2. **AI-assisted:** Ask Claude Code to run through this checklist against the codebase
3. **Track findings:** Log issues found as tasks in `docs/5_ROADMAP_AND_TASKS.md` or as GitHub issues
4. **Prioritise:** Security and auth issues are critical; docs and i18n are important but not urgent
5. **Adapt:** Add project-specific checks as the codebase evolves
