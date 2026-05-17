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
- Not acceptable: mocked DB client (produces false confidence — see MEMORY: `feedback_test_sql_before_done`)

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

> Activate this section when the `ai-governance` compliance profile is set (see `docs/13_COMPLIANCE_FRAMEWORKS.md` Tier 2). Links to ISO/IEC 42001:2023 Annex A controls.

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

## Health Check Items

Add to `docs/6_HEALTH_CHECK.md` weekly review:

- [ ] CI pipeline green (no skipped or flaky tests accumulating)
- [ ] Coverage report reviewed — no silent drops
- [ ] New features have tests (check PRs merged this week)
- [ ] AI evals run and golden set current (if `ai-governance` profile active)
- [ ] No test files with `skip`, `todo`, or `xfail` older than 30 days without a linked issue
