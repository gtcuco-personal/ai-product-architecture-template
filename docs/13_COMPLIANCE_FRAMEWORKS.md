# Compliance Frameworks

> This file is a directory — it tells you *which* frameworks apply to your product and *when* to activate them. Actual obligations, checklists, and controls live in the referenced docs.
>
> For AI-specific governance (EU AI Act, ISO 42001, NIST AI RMF), see `docs/14_AI_GOVERNANCE.md`.

---

## Applicability Gate — answer this before reading further

Most of this file, `docs/12_DEPENDENCY_MANAGEMENT.md` §SBOM/SLSA, `docs/14_AI_GOVERNANCE.md` §Monitoring/Incident Response, and `SECURITY.md` §Disclosure Timeline describe obligations sized for a team with dedicated compliance/security/on-call functions. Sections marked **"Enterprise/regulated — opt-in"** below only apply if you can answer **yes** to at least one of:

1. **Do you sell software with digital elements into the EU market** (SaaS counts) to customers other than yourself? → triggers CRA (SBOM, vulnerability reporting SLAs)
2. **Do you have external users you don't personally know** (public product, paying customers, B2B/B2G contract) rather than internal/personal tooling? → triggers GDPR minimums, disclosure timelines, SLA-style incident response
3. **Is the AI system high-risk under the EU AI Act** (Annex III/I categories — biometric, credit scoring, medical device, employment decisions, etc.) or does a contract require a specific certification (ISO 27001, SOC 2, ISO 42001)? → triggers the full conformity/certification machinery

**If the answer is no to all three:** this is solo/internal-tooling scope. Read Tier 1 (Universal) for the baseline hygiene, skip the "Enterprise/regulated — opt-in" sections entirely, and don't let an agent apply them uninvited — they are real obligations for a company with customers and staff, not a checklist to perform for its own sake.

**If any answer is yes:** activate the relevant tier/profile below and the opt-in sections become real obligations, not aspiration.

---

## Activation

Declare active compliance profiles in `docs/0_GROUND_RULES.md` under a `## Compliance Profiles` heading:

```markdown
## Compliance Profiles

Active: universal, ai-governance, security
```

Agents loading `docs/13_COMPLIANCE_FRAMEWORKS.md` must check this list and skip obligations not in the active profiles. Never apply obligations from an inactive profile — compliance debt is real.

---

## Tier 1 — Universal (always active)

These apply to **every repo** governed by this template, regardless of domain.

### Data Formats (already in SYSTEM_PROMPT.md §2)

| Standard | Scope | Applies to |
|---|---|---|
| ISO 8601 | Dates and timestamps | All date/time fields in code, APIs, storage |
| ISO 4217 | Currency codes (`EUR`, `USD`, `STN`) | All monetary values |
| ISO 639-1 | Language codes (`pt`, `en`, `fr`) | i18n locale keys, DB locale columns |
| BCP 47 | Locale codes with region (`pt-PT`, `en-GB`) | User-facing locale selection |
| ISO 3166-1 alpha-2 | Country codes (`PT`, `GB`, `ST`) | Country fields in storage and APIs |
| ISO 3166-2 | Subdivision codes (`PT-11`, `GB-ENG`) | Region/province fields where applicable |

### Accessibility

| Standard | Level | Scope |
|---|---|---|
| WCAG 2.2 AA | Mandatory | All user-facing UIs. Verified with axe-core before each release. |
| EN 301 549 v3.2.1 | Reference | EU procurement standard; references WCAG 2.2 — satisfying WCAG 2.2 AA satisfies EN 301 549 for web |

**Checklist (add to `docs/0_GROUND_RULES.md` Publishing Checklist):**
- [ ] No critical or serious axe-core violations
- [ ] Keyboard navigation works end-to-end (Tab, Shift+Tab, Enter, Escape)
- [ ] All images have meaningful `alt` text or `aria-hidden="true"` if decorative
- [ ] Colour contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [ ] Focus indicators visible and styled
- [ ] All form inputs have associated `<label>` elements

### Software Quality (ISO/IEC 25010:2023)

Nine quality characteristics (ISO/IEC 25010:2023 edition — the 2015 edition had 8; "Portability" was renamed "Flexibility" and "Safety" was added as the 9th). Use as a **rubric for health checks** (`docs/15_HEALTH_CHECK.md`), not as a certification target.

| Characteristic | Definition | Proxy metric |
|---|---|---|
| Functional suitability | Does it do what users need? | % feature coverage, user-reported bugs |
| Performance efficiency | Is it fast enough? | Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1) |
| Compatibility | Does it work across environments? | Browser/device matrix coverage |
| Interaction capability | Is it usable? | WCAG 2.2 AA compliance, usability test pass rate |
| Reliability | Does it keep working? | Uptime %, error rate, MTTR |
| Security | Is it protected? | Open vulnerabilities (Snyk/Dependabot), pen-test findings |
| Maintainability | Can devs change it safely? | Lint errors, test coverage, cyclomatic complexity |
| Flexibility | Can it adapt to different environments and requirements? | Env vars externalised, feature flags, containerised deployment, no hard-coded paths |
| Safety | Does it prevent harm to users, data, or systems in case of failure? | Medical-device safety events, financial-loss exposure, DPIA impact level, mean-time-to-detect critical failures |

---

## Tier 2 — AI Governance (activate: `ai-governance`)

For any product that **uses, exposes, or is built on AI models**. Mandatory when the product name or SYSTEM_PROMPT.md §1 references AI/ML/LLM capabilities.

Full obligations in `docs/14_AI_GOVERNANCE.md`. Summary of frameworks:

| Framework | Type | Mandatory in UE? | Certification? |
|---|---|---|---|
| **EU AI Act** (Reg. 2024/1689) | Regulation | Yes — fines up to €35M or 7% turnover | No cert, compliance declaration |
| **ISO/IEC 42001:2023** | Management system (AIMS) | No — voluntary | Yes — by accredited body |
| **ISO/IEC 23894:2023** | Risk management | No — voluntary | No |
| **NIST AI RMF 1.0 + GenAI Profile** | Framework | No — voluntary (US focus) | No |
| **ISO/IEC 22989:2022** | Terminology | No — vocabulary only | No |

> **ISO/IEC 42001:2023 + Annex SL:** ISO 42001 adopts the Annex SL common management system structure — the same skeleton as ISO 9001, ISO 27001, and ISO 45001. For organisations already holding an ISO 27001 certificate, the incremental effort to add ISO 42001 is significantly reduced. Document the integration scope in `docs/0_GROUND_RULES.md` under `Compliance Profiles`.

**When to activate:** any of these triggers:
- Product description includes "AI", "ML", "LLM", "generative", "model", "prediction", "recommendation"
- Product calls an external AI API (OpenAI, Anthropic, Gemini, Azure AI, etc.)
- Product has a model embedded in its codebase
- Product makes decisions that affect users (content moderation, scoring, ranking)

---

## Tier 3 — Security & Privacy (activate: `security`)

For products handling **sensitive data, enterprise B2B, regulated industries, or government contracts**.

### Information Security

| Framework | Type | Mandatory | Certification? | When to use |
|---|---|---|---|---|
| **ISO/IEC 27001:2022** | ISMS | Only if contractually required | Yes — by accredited body | Government contracts, healthcare, finance, enterprise SaaS |
| **ISO/IEC 27002:2022** | Security controls (Annex A) | Companion to 27001 | No | Alongside 27001 |
| **ISO/IEC 27017:2015** | Cloud security | No | No | Any cloud-hosted product |
| **ISO/IEC 27018:2019** | PII in cloud | No | No | Products storing personal data in cloud |
| **SOC 2 Type II** | Audit report (Trust Services Criteria) | Only if US customers require it | Yes — CPA audit | US-facing B2B SaaS |
| **NIST CSF 2.0** | Framework | No (US federal: Yes) | No | Lightweight alternative to 27001 |
| **CIS Controls v8** | Controls catalogue | No | No | Prioritised quick-win controls (18 families) |
| **EU Cyber Resilience Act** (Reg. 2024/2847) | Regulation | Yes — software with digital elements sold in EU | CE marking (hardware-software products) | Any internet-connected or network-adjacent software sold in EU market |
| **OWASP ASVS v4.0** | Verification standard | No — voluntary | No | Web apps and APIs; L1 minimum, L2 for sensitive data, L3 for critical/regulated systems |
| **NIST SSDF** (SP 800-218) | Framework | No (US federal EO 14028: Yes) | No | Secure software development lifecycle; complements SLSA; required for US government contracts |

> **NIST CSF 2.0 note:** CSF 2.0 (February 2024) added a sixth core function — **Govern** — covering organisational context, risk management strategy, supply chain risk, roles/responsibilities, policies, and oversight. Projects with CSF 1.1 artifacts should map them to CSF 2.0's updated structure before compliance audits.

> **EU Cyber Resilience Act (CRA) timeline:** Vulnerability disclosure obligations apply from **11 September 2026**. Full compliance (SBOM, secure by default, CE marking) required by **11 December 2027**. SBOM format: SPDX 2.3 or CycloneDX 1.5. Vulnerability notification: ENISA within 24h of discovery + users within 72h.

**CRA Compliance Checklist** (activate when selling software in EU market):

- [ ] SBOM generated and committed/attached to each release (tools: `syft`, `cyclonedx-cli`)
- [ ] Vulnerability disclosure policy published (see `SECURITY.md`)
- [ ] ENISA 24h early warning + 72h detailed notification procedure documented
- [ ] Security support period declared (how long security updates will be provided)
- [ ] Secure-by-default configuration (no unnecessary features enabled, no hardcoded credentials)
- [ ] CE marking obtained (for hardware-software products or regulated categories only)

---

**ISO 27001 scope note:** ISO 27001 certifies **organisations**, not software. A product can be "designed for ISO 27001-certified operations" (Tier A — controls implemented) or be in scope of a certified organisation's ISMS (Tier C — full certification). These are different claims. Document which tier applies in `0_GROUND_RULES.md`.

| Tier | What it means | Effort |
|---|---|---|
| A — Aligned | Technical controls (Annex A Technical group) implemented; policy templates provided | +3-5 weeks |
| B — Ready | Tier A + gap assessment + SoA + risk register + audit-ready documentation | +2-3 months + €10-20k |
| C — Certified | Tier B + Stage 1/2 audit by accredited body | +6-12 months + €15-50k upfront + €5-15k/year |

### Privacy

| Framework | Mandatory | Scope |
|---|---|---|
| **GDPR / RGPD** (EU 2016/679) | Yes — for any EU personal data | Any product with EU users or EU-stored data |
| **ISO/IEC 27701:2019** | No — voluntary | Privacy Information Management System (PIMS); extends 27001 |
| **ISO/IEC 29100:2011** | No — vocabulary | Privacy framework and terminology |
| **LGPD** (Brazil, Lei 13.709/2018) | Yes — for Brazilian user data | Products with Brazilian users |

**Minimum GDPR obligations** (even for small products):
- [ ] Privacy policy published and accessible
- [ ] Cookie consent (if cookies set other than strictly necessary)
- [ ] Data subject rights mechanism (access, erasure, portability)
- [ ] Data Processing Agreement (DPA) with any sub-processors
- [ ] Legal basis for each processing activity documented
- [ ] Breach notification procedure (72h to supervisory authority)
- [ ] Data Protection Officer (DPO) if large-scale processing of sensitive data
- [ ] Records of Processing Activities (RoPA) maintained per Art. 30
- [ ] Privacy by Design assessment documented per Art. 25 (see checklist below)

**Privacy by Design Checklist (Art. 25)** — complete at the start of any feature that processes personal data:

- [ ] **Data minimisation** — collect only what is strictly necessary; no "nice to have" fields
- [ ] **Pseudonymisation** — personal identifiers stored separately where feasible (e.g. `user_id` reference vs. full name inline)
- [ ] **Retention period defined** — each data type has a documented maximum retention; delete or anonymise when expired
- [ ] **Default privacy-preserving settings** — the most protective option is the default (e.g. analytics opt-out by default)
- [ ] **DPIA required?** — triggers: large-scale processing, special categories (health, biometric, political), systematic profiling, public area surveillance
- [ ] **Lawful basis documented** — one of: consent, contract, legal obligation, vital interest, public task, legitimate interest (with LIA)
- [ ] **Third-party data flows mapped** — each sub-processor listed, purpose documented, DPA signed

> **EDPB guidance (February 2026):** Organisations must document *how* privacy was considered in design decisions, not merely assert compliance. The accountability principle (Art. 5(2)) requires evidence of Art. 25 measures.

---

## Tier 4 — Domain-Specific (activate: `health` / `finance` / `climate` / etc.)

Activate only the profile(s) relevant to the product's domain.

### `health` — Medical / Healthcare

| Framework | Mandatory | Notes |
|---|---|---|
| **ISO 13485:2016** | Yes — if software is a medical device or component | QMS for medical devices |
| **IEC 62304:2006+A1:2015** | Yes — if embedded in or integral to medical device | Software lifecycle for medical devices |
| **ISO 14971:2019** | Yes — if medical device | Risk management |
| **MDR 2017/745** (EU) | Yes — if medical device sold in EU | CE marking, UDI, PMS, PMCF |
| **IVDR 2017/746** (EU) | Yes — if in-vitro diagnostic | Companion to MDR |
| **EHDS** (EU, Reg. 2025) | In force 2025+ | European Health Data Space — secondary use of health data |
| **HIPAA** (US) | Yes — if US covered entity or business associate | PHI handling |
| **HL7 FHIR R4/R5** | Best practice | Interoperability standard for health data exchange |

> **AI + Health:** If the product is AI and health, the EU AI Act classifies it as **high-risk** (Annex III §5). Activating both `ai-governance` and `health` triggers the full high-risk conformity assessment path.

### `finance` — Fintech / Financial Services

| Framework | Mandatory | Notes |
|---|---|---|
| **ISO 20022** | Best practice | Financial messaging standard (SEPA, TARGET2, SWIFT gpi) |
| **PCI DSS v4.0** | Yes — if storing, processing, or transmitting card data | 12 requirements. **v3.2.1 superseded 31 March 2025 — v4.0 is mandatory.** |
| **PSD2 / DORA** (EU) | Yes — if payment service provider or critical ICT | Open banking, digital operational resilience |
| **AML / CFT** (FATF) | Yes — if financial institution | Anti-money laundering, counter-terrorism financing |
| **IATI Standard v2.03** | Best practice (development finance) | Transparency for aid/development/climate finance |

### `climate` — Environmental / Climate Finance

| Framework | Mandatory | Notes |
|---|---|---|
| **IATI Standard v2.03** | Best practice | Transparency for development finance; de facto for GCF/GEF/AF reporting |
| **ISO 14001:2015** | No — voluntary | Environmental management system |
| **GHG Protocol** | Context-dependent | Greenhouse gas accounting; required by many ESG mandates |
| **TCFD** | Increasingly mandatory (UK, EU) | Task Force on Climate-related Financial Disclosures |
| **GCF Reporting Standards** | If GCF-funded | Green Climate Fund specific M&E and reporting |
| **GEF Results Framework** | If GEF-funded | Global Environment Facility indicators |

### `government` — B2G / Public Sector

| Framework | Notes |
|---|---|
| **eIDAS 2.0** (EU) | Electronic identity and trust services |
| **WCAG 2.2 AA** | Already in Tier 1 but often explicitly required in B2G contracts |
| **DPIA** (GDPR Art. 35) | Data Protection Impact Assessment — mandatory for high-risk processing |
| **NIS2 Directive** (EU 2022/2555) | Network and information security for essential/important entities (in force October 2024) |

> **NIS2 scope note:** NIS2 applies to "essential entities" (energy, transport, banking, health, digital infrastructure, water) and "important entities" (postal services, waste, food, chemicals, digital providers). Activation is triggered by the **customer's sector classification**, not by serving a government client. A SaaS product sold to a bank or hospital may be in NIS2 scope without activating the `government` compliance profile. Verify the customer's NIS2 classification (Art. 2-4) before scoping obligations.

---

## Decisions Log

Append compliance profile decisions here.

<!-- Example:
### 2026-05-03 — Activate `ai-governance` + `security` for FCA-STP PDGT
**Decision:** Both profiles active from day 1.
**Reason:** GCF contract requirement (ISO 27001 or equivalent) + PDGT processes financial data.
-->
