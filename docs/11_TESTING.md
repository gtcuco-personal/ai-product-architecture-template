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

A stack-detecting CI ships with this template. Code checks run for the supported
stacks on pull requests; documentation-only repositories still receive
governance and secret checks. A skipped code job is not evidence that application
tests ran.

| Job | Runs when | What runs |
|---|---|---|
| `detect` | Pull request | Determines which code and template checks apply before their runners start |
| `build-test` | Pull request and `package.json` exists | Chooses Bun when `bun.lock`/`bun.lockb` exists, otherwise npm; installs deterministically when locked; runs `lint`/`build`/`test` via `--if-present`; audit blocks High/Critical findings |
| `python-test` | Pull request and root `requirements.txt` or a Python `[project]`/`[build-system]` in `pyproject.toml` exists | Supports root requirements with a direct pytest declaration; installs them on Python 3.12, checks syntax and runs `python -m pytest tests`; unsupported setup and missing/empty tests fail explicitly |
| `gitleaks` | Always | Full-history secret scan (`gitleaks detect`, not just the diff), including Markdown; the downloaded binary is checksum-verified before execution |
| `deno-check` | Pull request and `supabase/functions/*/index.ts` exist | `deno check` on every edge function (they sit **outside** the frontend `tsconfig`, so `build`/`lint` are blind to them). Network-tolerant: a CDN outage (esm.sh/deno.land 5xx) **warns** but does not fail — only real type errors fail. |
| `governance-check` | Pull request | Validates consumer/legacy governance, local Markdown links and retired paths; PRs touching tracked artifacts must update `CHANGELOG.md`; `INDEX.md` only when an artifact folder is added, moved or removed |
| `template-tests` | Pull request and template fixtures exist | Explicitly validates `--template`, exercises profile initialization and independent consumer documents, then runs the executable CI fixtures |

Workflow triggers: PRs + pushes to `main`. On a push, only Gitleaks runs. Build,
tests and governance are PR checks; this avoids repeating them after a normal
PR merge. Gitleaks scans full history, including earlier reachable commits when
a newer run supersedes an older one.

### Delivery policy

Declare the delivery path in the project's architecture or contribution guide.
For PR delivery, configure the relevant required checks and branch protection on
GitHub; a workflow file alone does not prevent direct pushes. For direct-to-main
delivery, arrange the post-deploy verification in the shipping workflow described
under **Enforcement by delivery topology** below. Adding checks on `push` can
provide an additional alarm, but cannot prevent a deployment that already ran.

Keep that choice local to the consumer. This template does not change branch
protection or assume that a connected deployment service waits for its CI.

### Python scope and executable evidence

The initial Python consumer contract is `requirements.txt` with an active direct
`pytest` requirement and a `tests/` suite. `scripts/run-python-ci.py` checks Python
syntax while excluding environments, dependencies and caches, then propagates
the pytest result, including exit 5 for zero collected tests. It does not add
Ruff or infer another test framework. Adapt the workflow explicitly for other
package managers, runners or Python versions before adoption.

The offline Python fixture selects the helper's `--runner=unittest` path and
executes real passing, failing, invalid-syntax and zero-test cases with the
standard library. A separate unit test verifies pytest invocation and exit-code
propagation. This fixture does not prove installation of a consumer's Python
dependencies; that requires a real run of its `python-test` job.

**Propagation gotchas:**
- Adding/editing a workflow file requires the `workflow` OAuth scope on the git token. Org repos whose bot token lacks it → add `ci.yml` via the GitHub **web editor**.
- Lovable repos manage deps via **Bun** (`bun.lock` or legacy `bun.lockb`). The detector deliberately prefers Bun when both Bun and npm lockfiles exist, so a stale `package-lock.json` cannot select the wrong installer.
- The executable fixtures live under `tests/template/fixtures/` and contain no remote runtime dependencies. They are removed with `tests/template/` when a project profile is applied, so downstream repos do not carry template self-tests.
- Consumers may rewrite README and CHANGELOG. Only explicit `--template`
  validation compares the template's release to its policy header. Test consumer
  initialization with independent documents and test legacy repos without a
  profile manifest or template fixtures.
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

## Persistent Mutation Proof

A **persistent user-facing mutation** creates, updates, or deletes durable state through the product UI. A success toast, a resolved HTTP request, or optimistic UI state is not proof that the effect survived.

For every critical mutation journey:

1. Exercise the write through the real UI in an isolated Playwright session.
2. Confirm the expected API outcome; do not treat the visible success state as sufficient evidence.
3. Open a fresh browser context/session and read the record back through the product by a stable natural or external key. A same-session render can be optimistic or cached.
4. Query the live source directly when the UI does not round-trip the complete effect, when the write also changes side tables/background jobs, when service-role logic bypasses the user read path, or when the consequence of a false positive is high.

The direct-source assertion is risk-based, not universal. It must use a real test database or designated test tenant, never a mocked DB client. Match by a unique natural/external key, not a display name.

### Test-data and production boundary

- Pre-merge mutation tests use a database branch, local instance, or dedicated test tenant. They never use production data.
- A post-deploy production check is read-only by default. A synthetic production write is allowed only with a designated test entity, known and disabled side effects, an explicit cleanup plan, and user approval for the exact write and cleanup.
- Before any live mutation, inventory secondary effects such as email, WhatsApp, calendar events, payments, webhooks, or guest automations. If they cannot be suppressed safely, stop and report that persistence could not be verified; do not manufacture a green result.

### Enforcement by delivery topology

| Delivery path | Enforcement |
|---|---|
| PR-based repository | Run the mutation proof against test/staging before merge; make it a required check when branch protection supports it. |
| Direct-to-main agent (for example Lovable) | Run mandatory post-deploy verification in the shipping workflow. CI on `push` is an alarm, not a preventive gate. |

If post-deploy verification fails, the code may already be live. Report the evidence, do not mark the work complete, assess migration compatibility, and prepare a revert/remediation for explicit approval. Never auto-revert.

---

## Done Definition

A feature or fix is **done** when all of the following are true:

- [ ] Unit tests written for new business logic
- [ ] Integration test written if the feature touches a DB table or external API
- [ ] All existing tests still pass (`vitest run` / `pytest` / equivalent)
- [ ] Coverage did not decrease
- [ ] Manual smoke test run on the staging URL (for UI features)
- [ ] Persistent user-facing mutations pass the Playwright fresh-session read-back; direct-source proof added where the escalation criteria above apply
- [ ] Authoritative task source updated as directed by `docs/5_ROADMAP_AND_TASKS.md`

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
