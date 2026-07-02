# ODR-007 — Lean-by-Default Governance (Applicability Gate + Restructure)

**Status:** Approved
**Date:** 2026-07-02
**Author:** Gustavo Teixeira Cuco
**Reviewers:** —
**Applies to:** All repos governed by this template

---

## Context

A full audit of the template (docs 0-14, skills, CI, ODRs) against actual usage across ~20 downstream repos (a solo founder's personal + venture repos, none with dedicated compliance/security/QA staff) found three structural problems:

1. **Docs vs. reality had diverged.** `docs/11_TESTING.md`, `docs/12_DEPENDENCY_MANAGEMENT.md`, and `SECURITY.md` described coverage gates, `npm audit` in CI, SBOM per release, and gitleaks scanning as obligations — but the shipped `.github/workflows/ci.yml` only ran `build/test --if-present`. Where governance isn't enforced by CI, it's prose, and prose that isn't true erodes trust in the rest of the document.
2. **The template had one setting: "regulated enterprise."** SLSA Level 2 with signed provenance, SBOM generated on every release, 1-hour incident response SLAs, disaggregated bias monitoring in production, and a 232-line compliance framework directory were all presented as the template's default posture. For a solo founder with no external customers on most repos, none of this will ever be executed — it just sits in the docs as friction and false signal.
3. **Facts had gone stale**, because nothing forced a periodic re-check: FID (retired by Google in 2024) was still the referenced Core Web Vital; the EU AI Act phase table didn't reflect the 2026 Digital Omnibus deferral; the CRA's two distinct deadlines (11 Sep 2026 reporting vs. 11 Dec 2027 full conformity) were conflated into one wrong date in three separate files.

Adoption data across 12 sampled downstream repos confirmed the mismatch: `docs/14_AI_GOVERNANCE.md` had 0/12 adoption, `.github/workflows/ci.yml` existed in 1/12, and `tasks/lessons.md` had real entries in only 3/12 — the heaviest, most enterprise-shaped parts of the template were the least used.

## Decision

1. **Add an Applicability Gate** to `docs/13_COMPLIANCE_FRAMEWORKS.md` — three yes/no questions (sell into the EU market? external users? high-risk/certification-triggering AI?) that gate the heaviest obligations.
2. **Tag the heaviest sections "Enterprise/regulated — opt-in"** across `docs/11_TESTING.md` (AI eval suite), `docs/12_DEPENDENCY_MANAGEMENT.md` (SLSA, SBOM), `docs/14_AI_GOVERNANCE.md` (monitoring/incident SLAs), and `SECURITY.md` (disclosure timeline) — content stays (it's real and useful when the gate says yes), but is no longer presented as the default a repo carries unasked.
3. **Add an honest minimum tier** to `docs/11_TESTING.md` and a **short path** to `docs/14_AI_GOVERNANCE.md` — a few concrete bullets for the common case (solo project, deployer of a third-party AI API, minimal risk) instead of forcing every reader through the full enterprise structure to find out it doesn't apply to them.
4. **Drop the "stack-agnostic" claim** in `README.md` — several docs (`3_UI_UX_GUIDELINES.md`, `15_HEALTH_CHECK.md`, `8_DATA_AND_ANALYSIS.md`) were never actually agnostic; naming the two real stacks (React/Vite/Tailwind/shadcn/Supabase, Python/pandas) is more honest than maintaining a false claim.
5. **Restructure for one source of truth per fact**: merge `4_SEO_AND_AEO.md` into `6_CONTENT_AND_SOCIAL.md` (it was a strict subset), rename `6_HEALTH_CHECK.md` → `15_HEALTH_CHECK.md` (resolves the duplicate `6_` prefix), split the Lovable-specific half of `docs/prompts.md` into `docs/guides/lovable-vocabulary.md`, and de-duplicate content that had drifted apart after being copy-pasted into 2-3 files (Trust Hierarchy, routes/structure, CRA/SBOM timeline, Decisions Log format — see PR #46 for the fact/dedup pass that preceded this restructure).
6. **Bump to v2.0** — this is a breaking change for the doc-name contract that `/sync-repos` and `/read-context` depend on.

### Rationale

| Concern | Why this approach wins |
|---|---|
| Trust | A template that says what it means is more useful than one that describes an idealised process nobody runs |
| Adoption | Gating heavy sections behind 3 questions costs a reader 10 seconds; forcing everyone through enterprise-grade process by default costs adoption |
| Reversibility | Nothing is deleted — SLSA/SBOM/eval-suite content is intact, just correctly labelled as conditional, so a repo that later needs it doesn't have to rebuild it |
| Root cause | The gap between docs and CI (see problem 1) isn't fixed by this ODR alone — that's PR 3 (add `gitleaks`/`npm audit` to CI) |

### Alternatives considered

| Option | Rejected because |
|---|---|
| Leave the heavy sections as unconditional defaults, just fix the stale facts | Doesn't address why the heaviest docs have near-zero adoption — the weight itself is the problem, not just staleness |
| Split into two templates ("solo" vs. "enterprise") | Doubles maintenance burden for a fork that will drift; a gate inside one template is cheaper and keeps the enterprise content available without copy-pasting it |
| Extract stack-specific content into a `docs/stacks/` overlay to fully deliver on "stack-agnostic" | No consumer for a third stack across the ~20 downstream repos today; overlay infrastructure would be speculative work for a hypothetical future repo |

---

## Consequences

### Positive

- A repo with no external users and no EU sales can now read the compliance directory and correctly conclude "none of this applies yet" in under a minute, instead of wading through 232 lines to reach that conclusion
- Facts are corrected against verified 2026-07-02 sources (Digital Omnibus status, CRA timeline) rather than left stale
- Doc-name collisions (duplicate `6_` prefix) and cross-doc drift (permissions schema, CRA dates, Trust Hierarchy) are resolved at the source

### Negative

- Breaking change: any tooling or memory referencing `docs/4_SEO_AND_AEO.md` or `docs/6_HEALTH_CHECK.md` by path must be updated (`/sync-repos`, `/read-context` — tracked as a separate PR against the `agents-and-skills` repo)
- Downstream repos will show as "out of sync" until `/sync-repos` propagates v2.0 — expected, not a defect

### Risks

- The Applicability Gate's three questions are necessarily coarse; a repo on the boundary (e.g. B2B pilot with one external design partner) should err toward activating the tier rather than skipping it
- Regulatory facts (EU AI Act Digital Omnibus, CRA dates) can still move — the gate and the "verify before treating as final" notes reduce but don't eliminate staleness risk

---

## Sync applied (per ODR-005)

| Location | Update |
|---|---|
| `SYSTEM_PROMPT.md` header + §1 + §6 + changelog | Version bumped to 2.0; doc-name changes reflected; v2.0 changelog entry added |
| `CLAUDE.md` | Context Loading Policy updated for all renamed/removed docs; routes/structure tables removed (now point to `docs/2_ARCHITECTURE.md`) |
| `README.md` | Directory listing and Design Principles updated; "stack-agnostic" claim replaced |
| `docs/5_ROADMAP_AND_TASKS.md`, `CHANGELOG.md` | Entries added referencing this PR |

Downstream propagation (repos in `~/devs/github/`) is a separate step via `/sync-repos`, run after this PR and PR #46 are both merged.

---

## Review

**Next review:** When the EU AI Act Digital Omnibus is formally published in the Official Journal (verify the resulting dates against `docs/14_AI_GOVERNANCE.md`), or when a downstream repo's Applicability Gate answer changes from "no" to "yes" (first repo to sell into the EU or take on external users should trigger a re-read of the opt-in sections).
