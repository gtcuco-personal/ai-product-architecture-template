# Data & Analysis Governance

> **Applicability:** retain this module for a repository that persists data,
> runs a pipeline, reports metrics, or collects product events. Remove it for a
> truthful `runtime: none` / `data_posture: none` repository. The universal
> declaration lives in `docs/1_BUSINESS_CONTEXT.md`.

**Core rule:** collect or retain data only when it has a named consumer: a
decision, a quality control, an operational workflow, or a legal obligation.
"It may be useful later" needs an owner and review date; it is not a retention
policy.

---

## Data posture & decision links

For every metric, event, or durable dataset that matters, record its consumer.
The definition of a metric without a decision it can change is observability,
not a product metric.

| Record / metric | Consumer decision or control | Definition / grain | Source | Review by |
|-----------------|------------------------------|--------------------|--------|-----------|
| [name] | [pricing / quality check / legal report] | [formula or schema version] | [table/file/API] | [date/trigger] |

## Interactive products — entities, events & retention

Use this section for web/apps/services with persistent product data. Do not
create an event taxonomy for a static site or a batch-only tool.

### Entity & access registry

| Entity | Purpose | Personal data | Authorisation / access | Deletion or anonymisation mechanism |
|--------|---------|---------------|------------------------|-------------------------------------|
| [table/entity] | [why it exists] | [none/self/third-party/special-category] | [RLS/role/service] | [job/function/manual procedure] |

### Event registry

| Event | Trigger | Properties (classified) | Consumer | Retention | Schema version |
|-------|---------|-------------------------|----------|-----------|----------------|
| [event_name] | [when] | [no PII / pseudonymous / PII] | [metric/control] | [duration/trigger] | [v1] |

**Rules:**
- No event without a named consumer.
- Version event schemas; document deduplication/idempotency when retries exist.
- Cross-repository analysis is aggregate by default. A joinable person-level
  identifier requires an explicit local decision and access justification.
- A retention entry must name the mechanism that performs deletion or
  anonymisation; a Markdown promise alone is not enforcement.

---

## Batch & analysis pipelines

Use this section for Python, SQL, notebooks, ETL, scheduled automation, or
financial analysis. Interactive products may also use it for their reporting
pipeline.

### Source contracts

For each source, document:

```
Source:           [name]
Location:         [path, table, or URL pattern]
Expected fields:  [required columns/keys with types]
Refresh cadence:  [on-demand, scheduled, real-time]
Failure signal:   [how a broken import is detected]
Last verified:    [YYYY-MM-DD]
```

### Pipeline & execution order

| Step | Script / job | Input | Output | Quality or idempotency check |
|------|--------------|-------|--------|------------------------------|
| 1 | [filename] | [source] | [output] | [check] |
| 2 | [filename] | [step 1 output] | [output] | [check] |

### Metric registry & assumptions

| Metric / assumption | Formula or value | Grain | Source | Consumer | Review by |
|---------------------|------------------|-------|--------|----------|-----------|
| [name] | [exact formula/value] | [lowest valid level] | [table/file] | [decision/control] | [date] |

**Rules:**
- Aggregate up; never infer a lower grain without re-deriving it.
- Every changed formula, source schema, or assumption goes in the Decisions Log.
- Fail loudly on critical quality failures: duplicate keys, missing required
  fields, impossible dates, or an explicit row-count threshold.
- Archived scripts may be retained for reproducibility, but raw personal data,
  exports, embeddings, and backups still follow the retention/deletion rule.

---

## Data privacy

- Never commit real third-party PII (names, emails, IDs, financial data) to
  notebooks, reports, seeds, or fixtures. Use synthetic data in development.
- Store only the minimum data needed for the declared consumer.
- Review stakeholder outputs for accidental PII before sharing.
- For production access controls, see `SECURITY.md`; for applicable legal
  obligations, see `docs/13_COMPLIANCE_FRAMEWORKS.md`.

## Decisions log

Append-only. Record changes to a metric, source contract, event schema,
retention/deletion mechanism, or cohort boundary. Format and rules are in
`CONTRIBUTING.md` §Decisions Log Convention.

| Date | Section | What changed | Why |
|------|---------|--------------|-----|
| [YYYY-MM-DD] | [section] | [what changed — include old value] | [reason] |
