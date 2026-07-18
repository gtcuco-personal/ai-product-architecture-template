---
contract_version: 1
repository_role: TODO # product|component|pipeline|automation|content|study|governance
product_ref: null # canonical product/repo reference, or null when this repo is the product
beneficiary: TODO # role, never a person's identity
intended_outcome: TODO
runtime: TODO # none|batch|interactive|hybrid
data_posture: TODO # none|consumes|produces|collects
pii: TODO # none|self|third_party|special_category
storage: TODO # none|files|sqlite|duckdb|parquet|postgres|supabase|external|multiple
evidence_mode: TODO # none|manual|artifact|telemetry
retention: TODO # n/a or a duration/deletion trigger
---

# Business Context

> **Product, decision & evidence contract.** Fill the frontmatter before the
> first release. `none`, `null`, and `n/a` are valid answers when they are true;
> invented metrics and placeholder data are not.

## Contract rules

- `repository_role` describes this repository, not necessarily the whole product.
  Use `product_ref` when several repositories serve one product.
- `runtime: hybrid` means the repository has both interactive and batch work.
  Use `storage: multiple` when more than one durable store matters, then name
  each store in `docs/8_DATA_AND_ANALYSIS.md`.
- `runtime: none` normally pairs with `data_posture: none`, `storage: none`, and
  evidence through manual review or artifacts.
- `pii` is the highest sensitivity handled by this repository. Any value other
  than `none` requires a real retention/deletion trigger, not merely "review
  later".
- A North Star is optional: use `n/a` for work without a recurring, measurable
  value loop. Do not substitute activity counts for value.

## Company

| Field | Value |
|-------|-------|
| **Name** | [Company name] |
| **Domain** | [website URL] |
| **Contact** | [email] |

## Vision

[One sentence: what does the world look like if this succeeds?]

## Mission

[One sentence: what does this product/company do to get there?]

## North Star Metric

[The single metric that best captures recurring value delivery, or `n/a` with a short reason.]

## Value Proposition

[What problem does this solve? For whom? How is it different?]

## Target Audience

| Segment | Description |
|---------|-------------|
| [Primary] | [description] |
| [Secondary] | [description] |

## Business Model

[How does this make money? Pricing, tiers, revenue streams. Use `n/a` for non-commercial work.]

## Tone & Voice

[e.g. Premium but accessible, technical but clear, formal/informal]

## Markets

| Market | Location | Notes |
|--------|----------|-------|
| [Primary] | [location] | [notes] |

## Key Product Decisions

| # | Decision | Type | Evidence / threshold | Review date | Rationale |
|---|----------|------|----------------------|-------------|-----------|
| 1 | [decision] | [bet/delivery/maintenance/obligation] | [metric, artifact, or n/a] | [date/trigger] | [why] |

**Rule:** only a `bet` needs a hypothesis and measurable success threshold.
Delivery, maintenance, and obligations should state their real constraint rather
than inventing an experiment.
