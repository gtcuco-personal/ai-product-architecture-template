# Testing Strategy

> Remove sections that don't apply to your stack. A CLI tool with no UI skips E2E; a data pipeline skips browser tests. Adjust thresholds to your risk profile — the defaults below are starting points.

---

## Testing Pyramid

| Layer | Target mix | Scope | Speed |
|---|---|---|---|
| **Unit** | ~70% | Pure functions, utilities, business logic in isolation | < 1s per test |
| **Integration** | ~20% | Module interactions, DB queries, API handlers, external service calls | < 10s per test |
| **E2E / Smoke** | ~10% | Critical user journeys end-to-end through the real UI | < 60s per test |

**Rules:**
- If a test can be a unit test, it should be. E2E is expensive; overuse is a red flag.
- Integration tests must use a **real database** (container, branch, or local instance) — not mocks. Mocked DB tests produce false confidence and have historically masked migration bugs.
- E2E tests cover the **golden paths only**: sign up, core feature, payment, logout. Not edge cases.

---

## Framework Selection

Adjust to the project's approved stack (defined in `docs/0_GROUND_RULES.md`). Common defaults:

| Stack | Unit | Integration | E2E |
|---|---|---|---|
| React + Vite | Vitest + Testing Library | Vitest + MSW / supertest | Playwright |
| Next.js | Vitest / Jest | Jest + supertest | Playwright |
| Node API | Vitest / Jest | supertest + real DB | Playwright / Postman |
| Python / FastAPI | pytest | pytest + httpx | pytest-playwright |
| Go | `testing` stdlib | `testing` + `testcontainers-go` | k6 / Playwright |

> **Do not introduce a test framework not listed above** without explicit approval and a Ground Rules update.

---

## Coverage Requirements

| Metric | Minimum threshold | Notes |
|---|---|---|
| Line coverage | 70% | Not a target — a floor. Aiming for 100% produces test theatre. |
| Branch coverage | 60% | Especially critical for auth flows and error branches |
| New code | Must not decrease overall coverage | PRs that reduce coverage are blocked |

**Exclusions** (do not count toward coverage):
- Generated files (`*.gen.ts`, `supabase/types.ts`, GraphQL generated types)
- Test files themselves (`*.test.ts`, `*.spec.ts`)
- Type-only files (`*.d.ts`)
- Configuration files (`vite.config.ts`, `tailwind.config.ts`)

---

## CI/CD Integration

### Shipped with the template — `.github/workflows/ci.yml`

A **universal, stack-auto-detecting** CI ships with this template. Each job only acts if the relevant files exist, so the same file is safe in any repo — a docs/data repo concludes green doing nothing; a webapp runs the full checks.

| Job | Runs when | What runs |
|---|---|---|
| `build-test` | `package.json` exists | `npm ci` (if lockfile) + `lint`/`build`/`test` via `--if-present` (tolerates missing scripts) + `npm audit --audit-level=high` (report-only — `continue-on-error`, doesn't fail the job yet) |
| `gitleaks` | Always | Full-history secret scan (`gitleaks detect`, not just the diff) — **this is the only job that fails the build.** It's the server-side backstop for repos where something (e.g. Lovable) commits straight to `main` and never runs the local pre-commit hook (`.githooks/pre-commit`) |
| `deno-check` | `supabase/functions/*/index.ts` exist | `deno check` on every edge function (they sit **outside** the frontend `tsconfig`, so `build`/`lint` are blind to them). Network-tolerant: a CDN outage (esm.sh/deno.land 5xx) **warns** but does not fail — only real type errors fail. |

Triggers: PRs + pushes to `main` (push-to-main matters for repos where an external tool — e.g. Lovable — commits straight to `main` without local checks).

**Honesty note:** this is genuinely what runs — unlike the "Reference model" and "Coverage enforcement" below, which are aspirational until a repo actually wires them up. If you read only one row from this table, it's `gitleaks` — it's the one that's both real and load-bearing today.

**Propagation gotchas:**
- Adding/editing a workflow file requires the `workflow` OAuth scope on the git token. Org repos whose bot token lacks it → add `ci.yml` via the GitHub **web editor**.
- Lovable repos manage deps via **bun** (`bun.lockb`); the npm `package-lock.json` rots and `npm ci` rejects it. Sync with the runner's npm version: `npx npm@10 install --package-lock-only`.
- `/sync-repos` should flag repos missing `.github/workflows/ci.yml`.

### Reference model (aspirational stages — adapt per repo)

| Stage | What runs | Blocking? |
|---|---|---|
| **Pre-commit** | Type-check + lint + unit tests | Yes — commit blocked if any fail |
| **PR (open/push)** | Full suite: unit + integration + coverage report | Yes — PR merge blocked |
| **Merge to main** | Smoke tests + E2E against staging | Yes — no deploy if E2E fails |
| **Scheduled (nightly)** | Full E2E + performance baseline | No — alerts only |

**Coverage enforcement in CI:**

```yaml
# GitHub Actions example (adjust to your CI system)
- name: Run tests with coverage
  run: npx vitest run --coverage

- name: Check coverage threshold
  run: npx vitest run --coverage --coverage.thresholds.lines=70
```

---

## Test Data

- **Unit tests:** inline fixtures — small, deterministic, collocated with the test
- **Integration tests:** factory functions or seed scripts — no raw `INSERT` SQL in test files
- **E2E tests:** dedicated test accounts/tenants that are reset before each run
- **Never use production data** in tests — not even anonymised snapshots in CI

**Database strategy for integration tests:**
- Preferred: Supabase database branches / Docker container per test run
- Acceptable: shared test schema with transaction rollback per test
- Not acceptable: mocked DB client (produces false confidence — mocked tests can pass while the real schema/migration is broken)

---

## Done Definition

A feature or fix is **done** when all of the following are true:

- [ ] Unit tests written for new business logic
- [ ] Integration test written if the feature touches a DB table or external API
- [ ] All existing tests still pass (`vitest run` / `pytest` / equivalent)
- [ ] Coverage did not decrease
- [ ] Manual smoke test run on the staging URL (for UI features)
- [ ] `docs/5_ROADMAP_AND_TASKS.md` updated

---

## AI-Specific Testing

> **Enterprise/regulated — opt-in**, gated by `docs/13_COMPLIANCE_FRAMEWORKS.md` §Applicability Gate. Activate the full structure below only when the `ai-governance` compliance profile is set *and* the gate says yes (dedicated eval infra, weekly/monthly cadences, and demographic-disaggregated bias testing assume staff to run them). Otherwise use the honest minimum tier just above §Health Check Items. Links to ISO/IEC 42001:2023 Annex A controls when active.

### Eval Framework Structure

```
evals/
├── golden/          # Golden set: input → expected output pairs (versioned)
├── adversarial/     # Prompt injection + jailbreak test cases
├── bias/            # Disaggregated test sets per demographic/segment
└── regression/      # Auto-run on every model or prompt change
```

### AI Test Types

| Test type | ISO 42001 control | What to verify | Cadence |
|---|---|---|---|
| **Output regression** | A.7.2 | Core outputs match golden set within acceptable drift | Every PR that changes prompts or model |
| **Prompt injection** | A.8.3 + `docs/10_AGENT_SAFETY.md` | Adversarial inputs cannot redirect agent behaviour | Every PR, extended battery weekly |
| **Bias / fairness** | A.7.2 | Disaggregated metrics across demographic slices do not diverge > threshold | Monthly or on model change |
| **Hallucination rate** | A.7.2 | Sampled outputs checked for factual accuracy (manual or automated with citation check) | Weekly, sampled |
| **Human oversight** | A.8.1 | Override/reject mechanism works for every AI-generated output that affects users | Release checklist |

### Regression Definition

A regression is triggered when:
- Golden set accuracy drops > 5% vs. last baseline
- Any prompt injection test passes when it should have been blocked
- Bias metric diverges > 10% across any demographic slice

**Response:** block the PR/deploy, investigate root cause, update golden set if intentional, document in AI Risk Register (`docs/14_AI_GOVERNANCE.md`).

---

## Honest Minimum Tier

For a repo with no test infrastructure and no team to build one (solo project, prototype, low-stakes internal tool): don't try to run the full pyramid or the AI eval suite above. The floor that's actually worth maintaining is:

- [ ] `docs/11_TESTING.md`'s CI job (`build-test` / `deno-check`, shipped with the template) stays green
- [ ] A `gitleaks` scan runs on every push (see `.github/workflows/ci.yml`) — the one check that's cheap and catches something genuinely costly to get wrong
- [ ] New business-logic bugs get a regression test when found, not retroactively for everything that already exists
- [ ] Before shipping something a user depends on, manually exercise the golden path once

This is not "no testing" — it's testing sized to what one person can actually sustain. Scale up toward the full pyramid as the project gains complexity, contributors, or paying users, not because the template says to.

## Health Check Items

Add to `docs/15_HEALTH_CHECK.md` weekly review:

- [ ] CI pipeline green (no skipped or flaky tests accumulating)
- [ ] Coverage report reviewed — no silent drops
- [ ] New features have tests (check PRs merged this week)
- [ ] AI evals run and golden set current (if `ai-governance` profile active)
- [ ] No test files with `skip`, `todo`, or `xfail` older than 30 days without a linked issue
