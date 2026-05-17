# Dependency Management

> Remove sections that don't apply. A pure Python service doesn't need npm audit; a CLI tool doesn't need SBOM for EU compliance unless distributed commercially. Adjust thresholds to your risk profile.

---

## Policy

Adding a dependency is an architectural decision. It increases attack surface, maintenance burden, and supply chain risk. The bar should be: **"Does this save more than the cost it introduces?"**

**Before adding any dependency:**

- [ ] No suitable native implementation exists (do not reinvent the wheel, but don't add 50kB for a utility that's 10 lines)
- [ ] Dependency is actively maintained (last commit < 12 months, > 1 maintainer, > 1k weekly downloads — adjust per ecosystem)
- [ ] Licence is acceptable (see Licence Policy below)
- [ ] Reviewed for known vulnerabilities (`npm audit` / `pip audit` / `cargo audit` before adding)
- [ ] Approval recorded in `docs/0_GROUND_RULES.md` (rule: no new dependencies without explicit approval)

---

## Licence Policy

| Category | Licences | Action |
|---|---|---|
| **Allowed** | MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, Unlicense | Add freely |
| **Review required** | MPL-2.0, LGPL-2.1, LGPL-3.0, EPL-2.0 | Assess copyleft scope — consult before adding |
| **Blocked** | GPL-2.0, GPL-3.0, AGPL-3.0, SSPL, Commons Clause, no-licence | Do not add without legal clearance |

> **Note:** AGPL-3.0 is blocked by default because it requires source disclosure of any software that *interacts with* the licensed code over a network — this includes SaaS products.

**Check licence before adding:**
```bash
# npm
npx license-checker --summary

# Python
pip-licenses --format=table

# Go
go-licenses check ./...
```

---

## SBOM (Software Bill of Materials)

Required by the **EU Cyber Resilience Act** (from 11 Sep 2026) for software with digital elements sold in the EU. Also increasingly required by enterprise and government procurement.

See `SECURITY.md` for format, tooling, and storage conventions. Key points:

- **Format:** SPDX 2.3 or CycloneDX 1.5
- **Generation:** automated in CI on every release (`syft`, `cyclonedx-cli`)
- **Update trigger:** any dependency add, remove, or version change
- **Contents:** all direct and transitive dependencies with name, version, licence, source URL

---

## Supply Chain Security (SLSA)

[SLSA (Supply chain Levels for Software Artifacts)](https://slsa.dev) is a framework for hardening the software build pipeline against tampering.

**Target: SLSA Level 2** for production releases. Increment to Level 3 if selling to government or regulated enterprise.

| SLSA Level | Source | Build | Provenance | Effort |
|---|---|---|---|---|
| **Level 1** | Documented build process | Scripted build | Generated (unsigned) | Low |
| **Level 2** | Version controlled source | Hosted CI (GitHub Actions) | Signed by builder | Medium |
| **Level 3** | Verified history | Hardened CI (no user-modifiable env) | Non-falsifiable | High |

**Level 2 implementation checklist:**
- [ ] All source code in version-controlled repository (GitHub)
- [ ] Build runs in GitHub Actions (or equivalent hosted CI) — not locally
- [ ] Build steps defined in version-controlled workflow files
- [ ] SLSA provenance attestations generated (`slsa-github-generator` or `sigstore/cosign`)
- [ ] Artefacts signed and provenance attached to GitHub Release

**Reference:** NIST SSDF (SP 800-218) — Secure Software Development Framework, complementary to SLSA. Required for US government contracts (EO 14028).

---

## Upgrade Strategy

| Upgrade type | Process | Approval |
|---|---|---|
| **Patch** (x.y.**Z**) | Dependabot/Renovate auto-merge if CI green | None required |
| **Minor** (x.**Y**.z) | Manual review — read changelog, check breaking changes | None required if tests pass |
| **Major** (**X**.y.z) | ODR required — document breaking changes, migration path, testing plan | Explicit approval |
| **Security patch** (any version) | Treat as patch — fast-track, no ODR | None required |

**Dependabot / Renovate configuration:**

```yaml
# .github/dependabot.yml (adjust to your stack)
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    auto-merge:
      match:
        - dependency-type: "direct"
          update-type: "semver:patch"
```

---

## Vulnerability Response

| Severity | CVSS score | Response SLA | Action |
|---|---|---|---|
| **Critical** | 9.0–10.0 | Triage 4h, patch 24h | Drop everything. Patch or remove dependency immediately. |
| **High** | 7.0–8.9 | Triage 24h, patch 7 days | Scheduled fix in current sprint. |
| **Medium** | 4.0–6.9 | Triage 7 days, patch 30 days | Add to backlog, assign owner. |
| **Low** | 0.1–3.9 | Next quarterly review | Log, monitor, patch when convenient. |

**CI enforcement:**
```bash
# Block build on critical/high vulnerabilities
npm audit --audit-level=high

# Python
pip-audit --vulnerability-service=osv --fail-on CRITICAL,HIGH
```

> For exploited CVEs in EU market products: also apply CRA vulnerability disclosure obligations (ENISA 24h + users 72h). See `SECURITY.md`.

---

## EOL and Deprecation Management

- **Quarterly review:** check EOL dates for all runtime dependencies (Node.js, Python, framework major versions)
- **Migration plan:** start planning **6 months before EOL** — do not wait until the last sprint
- **EOL trigger:** creates a new ODR documenting the migration path and deadline

**Useful EOL tracking resources:**
- [endoflife.date](https://endoflife.date) — authoritative EOL dates for runtimes, frameworks, OSes
- GitHub Dependabot alerts — flags unmaintained dependencies automatically

**EOL declaration in `docs/5_ROADMAP_AND_TASKS.md`:**
```
- YYYY-MM-DD — [runtime/package] EOL on [date]; migration to [replacement] planned → target: [date]
```

---

## Health Check Items

Add to `docs/6_HEALTH_CHECK.md` quarterly review:

- [ ] `npm audit` / `pip audit` run — zero High/Critical open
- [ ] Dependabot PRs reviewed and resolved (no stale open PRs > 30 days)
- [ ] SBOM generated and attached to latest release (if CRA in scope)
- [ ] No dependencies with EOL within 6 months without migration plan
- [ ] Licence audit run — no blocked licences introduced
- [ ] Major version upgrades logged as ODRs
