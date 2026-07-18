# ODR-010 — Product, Decision & Evidence Contract

**Status:** Approved
**Date:** 2026-07-18
**Author:** Gustavo Teixeira Cuco
**Reviewers:** Codex, Sol
**Applies to:** All template profiles and downstream repositories

## Context

An audit of 25 reachable downstream repositories found that only a small subset
had real operational metrics, while the current data module was retained only
by `python-data` and `regulated-ai`. Making the existing Python/pandas-shaped
document universal would recreate the unused-document problem recorded in
ODR-007. At the same time, products with Supabase/Postgres data had no common
place to declare retention, consumers, or decision links.

## Decision

1. Every repository declares a small product, decision, and evidence contract
   in the frontmatter of `docs/1_BUSINESS_CONTEXT.md`.
2. The contract separates repository role, runtime, data posture, PII level,
   storage, evidence mode, and retention. `hybrid` and `multiple` cover repos
   that combine interactive and batch work or durable stores. `none`, `null`,
   and `n/a` are valid answers when truthful.
3. `docs/8_DATA_AND_ANALYSIS.md` remains profile-controlled. It is retained by
   `react-supabase`, `python-data`, and `regulated-ai`; `minimal` removes it.
4. The data module supports two proportional paths: interactive products
   (entities, events, access, retention) and batch/analysis pipelines (sources,
   metrics, quality, idempotency).
5. A metric, event, or durable dataset needs a named consumer. Person-level
   cross-repository joins are prohibited by default; PII requires a real
   deletion/anonymisation mechanism.
6. `check-governance.mjs` validates the contract shape and project values; data
   or storage requires the data module. Legacy repositories remain valid until
   their explicit migration invokes project mode. The check does not pretend to
   prove that product strategy or retention jobs are true.

## Rationale

The frontmatter keeps human and machine-readable context in one source, avoids
coupling evolving product facts to the scaffolder's destructive profile manifest,
and lets a study or content repository say truthfully that it has no runtime or
data. Retaining the data module for React/Supabase fixes the observed gap without
making every repository carry pipeline ceremony.

## Consequences

### Positive

- Agents can determine data obligations before adding storage or telemetry.
- Interactive products and pipelines receive the detail they need.
- Repositories without runtime can opt out explicitly rather than filling fake
  North Stars or event tables.

### Negative

- Existing downstream repositories need a short migration to fill the contract.
- The contract adds a small validation burden to every new project.

### Risks

- Placeholder contracts could become ceremonial. Mitigation: pilot across an
  interactive product, a pipeline, and a no-runtime repository before fleet
  propagation; review adoption before enforcing more content checks.
- Retention may be documented without automation. Mitigation: require a named
  mechanism and use the health check to verify it for PII-bearing repos.

## Review

**Next review:** After the three-repository pilot has run, or when a new runtime
class is introduced.
