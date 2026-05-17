# ODR-006 — Dependency Governance as Separate Doc

**Status:** Approved
**Date:** 2026-05-17
**Author:** Gustavo Teixeira Cuco
**Reviewers:** —
**Applies to:** All repos governed by this template

---

## Context

`SECURITY.md` had a minimal three-line "Dependencies" section:

```
- Dependencies are reviewed before addition
- Lock files are committed and protected
- Regular dependency audits via npm audit / pip audit
```

This was insufficient for three reasons that emerged in the 2026-05-17 arch-review:

1. **EU Cyber Resilience Act (CRA)** — in force for EU market software from September 2026 — requires SBOM, vulnerability disclosure, and documented security support periods. Dependency governance is a first-order CRA obligation, not a security footnote.
2. **Supply chain attacks** — SLSA, NIST SSDF (SP 800-218), and sigstore are now expected by enterprise and government customers. No mention of these existed in the template.
3. **Licence compliance** — adding a GPL or AGPL dependency to a SaaS product can create legal exposure. A blocked-licence list needs to be visible at repo level.

The question was: **where should this governance live?**

---

## Decision — Dependency governance lives in `docs/12_DEPENDENCY_MANAGEMENT.md`

A dedicated file, not a section in `SECURITY.md`.

### Rationale

| Concern | Why dedicated doc wins |
|---|---|
| **Scope** | Licence policy, SLSA, SBOM, upgrade strategy, CVE SLAs, EOL management — too large for a subsection |
| **Audience** | Dependency tasks have their own Context Loading Policy row — loading `SECURITY.md` for a routine `npm upgrade` is wasteful |
| **Compliance linkage** | CRA obligations (SBOM, vulnerability disclosure) are dependency-triggered, not security-model triggered — they belong next to the dependency rules that create them |
| **Separation of concerns** | `SECURITY.md` governs the product's security posture (auth, secrets, data protection); `12_DEPENDENCY_MANAGEMENT.md` governs the supply chain |

### Alternatives considered

| Option | Rejected because |
|---|---|
| Expand `SECURITY.md` §Dependencies | SECURITY.md is already long; mixing auth/secrets/data-protection with supply chain makes it harder to scan |
| Section in `docs/0_GROUND_RULES.md` | Ground Rules are loaded for every code task — adding 200 lines of licence tables and SLSA checklists increases context cost for tasks that don't touch dependencies |
| Inline in `CONTRIBUTING.md` | CONTRIBUTING is human-facing onboarding — agents don't load it; policy buried there would be ignored |

---

## Consequences

### Positive

- Dependency decisions are now auditable (licence policy, upgrade decisions, EOL tracking)
- CRA and SLSA obligations have a home — reduces risk of missing the September 2026 deadline
- Blocked-licence list is explicit — reduces legal exposure from accidental GPL/AGPL additions
- `docs/6_HEALTH_CHECK.md` can now reference concrete quarterly checks

### Negative

- One more file to maintain — mitigated by the quarterly review cadence in the doc itself
- Dependabot/Renovate configuration examples may go stale as CI platforms evolve — review annually

### Risks

- CVSS thresholds and patch SLAs are defaults — product teams in regulated industries (health, finance) should calibrate to their contractual obligations
- SLSA Level 2 is achievable on GitHub Actions but requires provenance setup — repos not using GitHub Actions need equivalent controls

---

## Sync applied (per ODR-005)

When this doc was created, all 4 sync locations were updated in the same PR:

| Location | Update |
|---|---|
| `SYSTEM_PROMPT.md` §1 | `docs/12_DEPENDENCY_MANAGEMENT.md` row added |
| `SYSTEM_PROMPT.md` §6 | "New dependency / EOL / supply chain change → `docs/12_DEPENDENCY_MANAGEMENT.md`" row added |
| `CLAUDE.md` | "Code — dependency change" row added to Context Loading Policy |
| `README.md` | `12_DEPENDENCY_MANAGEMENT.md` added to directory listing |

---

## Review

**Next review:** Annually, or when: CRA full compliance deadline (11 Dec 2027) approaches, SLSA spec updates to v1.1+, or a new EU supply chain regulation is adopted.
