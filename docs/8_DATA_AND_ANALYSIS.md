# Data & Analysis Governance

> Remove this file if the project has no data analysis, reporting, or metrics work.

**Core rule:** One metric, one definition, one source of truth. If it is not in this file, it is not governed — it is a guess.

---

## Metric Registry

Every metric that appears in a report, dashboard, or stakeholder conversation must have a canonical definition here. If two outputs disagree, this table is the tiebreaker. Changing a formula requires a Decisions Log entry.

| Metric | Formula | Grain | Source | Owner |
|--------|---------|-------|--------|-------|
| [metric name] | [exact formula] | [lowest valid aggregation level] | [table or file] | [owner] |

**Rules:**
- Grain = the lowest level at which the metric is valid. Aggregate UP, never down without re-deriving.
- If a metric has changed definition, log the old version in the Decisions Log with an effective date.

---

## Assumptions Log

An assumption is any value that is chosen, not observed. Every assumption that drives an analysis must be registered here.

| Assumption | Value | Set Date | Review By | Justification |
|------------|-------|----------|-----------|---------------|
| [name] | [value] | [YYYY-MM-DD] | [YYYY-MM-DD] | [reason + source] |

**Rules:**
- Every assumption has a Review By date — no assumption is permanent.
- When updating a value: move the old row to the Decisions Log with its retirement date, add the new row here.
- If an assumption is "industry standard," cite the specific standard and date.

---

## Source Contracts

A source contract defines what you expect from an upstream data source. When reality violates the contract, the pipeline should fail loudly — not silently produce wrong outputs.

For each source, document:

```
Source:           [name — e.g. "Monthly export from X"]
Location:         [path, table, or URL pattern]
Expected fields:  [list of required columns/keys with types]
Refresh cadence:  [e.g. monthly, on-demand, real-time]
Failure signal:   [how to detect a broken import — e.g. "row count drops > 20% vs prior run"]
Last verified:    [YYYY-MM-DD]

Known breaking changes (append only):
- [YYYY-MM-DD]: [what changed and what was fixed]
```

---

## Pipeline & Execution Order

The canonical sequence from raw data to outputs. Run steps in order. Do not skip.

| Step | Script / Notebook | Input | Output | Notes |
|------|-------------------|-------|--------|-------|
| 1 | [filename] | [source] | [output] | [e.g. run after new export lands] |
| 2 | [filename] | [step 1 output] | [output] | |

### Notebook / Script Registry

| File | Status | Purpose |
|------|--------|---------|
| [filename] | active | [what it does] |
| [filename] | archived | [why retired — date] |

**Rules:**
- Name files with a numeric prefix: `01_`, `02_`, `03_`
- Archived files move to `archive/` — never delete, you may need to reproduce old outputs
- Only `active` files are part of the pipeline

### Directory Structure

```
data/
├── raw/         # Immutable — never overwrite source files
└── processed/   # Outputs of cleaning/transformation steps
notebooks/
├── [active notebooks]
└── archive/     # Retired experiments
src/             # Reusable functions (metrics, parsers, validation)
reports/         # Final outputs — the source of truth for stakeholders
```

---

## Data Quality Checks

Pre-flight assertions that must pass before any analysis output is trusted. If a check fails, the pipeline stops.

```python
# checks.py — adapt per repo
CHECKS = {
    "no_future_dates":   lambda df: df["date"].max() <= pd.Timestamp.today(),
    "no_duplicate_keys": lambda df: df.duplicated(subset=["[key_columns]"]).sum() == 0,
    "row_count_minimum": lambda df: len(df) >= [minimum],
    # add domain-specific checks below
}
```

**Rules:**
- Fail loudly — raise an exception, do not silently skip rows
- Log which check failed and the actual vs expected value
- Add a new check every time a silent failure is discovered

---

## Cohort & Segment Definitions

Any grouping used in analysis must have a precise definition here. Prose is not a definition — the boundary logic (SQL, code, or date range) is the definition.

| Name | Definition | Boundary logic | Notes |
|------|------------|----------------|-------|
| [cohort name] | [plain language] | [SQL snippet or code] | [edge cases] |

**Rules:**
- If two queries define the same cohort differently, this table wins
- Date boundaries must specify inclusion/exclusion explicitly (`>` vs `>=`)
- When a cohort definition changes, log the old version in Decisions Log with effective date

---

## Data Privacy

- Never commit real PII (names, emails, IDs, financial data) to notebooks or reports
- Use anonymised or synthetic data in development and testing
- For production data access rules, see `SECURITY.md`
- Outputs intended for stakeholders must be reviewed for accidental PII before sharing

---

## Decisions Log

Append-only. Every change to a metric definition, assumption, source contract, or cohort boundary.

| Date | Section | What changed | Why |
|------|---------|--------------|-----|
| [YYYY-MM-DD] | [section] | [what changed — include old value] | [reason] |

---

## Maintenance Rule

Update this file when any of the following change:
- A metric formula or grain
- A cohort or segment boundary
- A core assumption value
- A source schema or field name
- The active pipeline order
- An official output path
