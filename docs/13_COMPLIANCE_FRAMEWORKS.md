# Compliance Frameworks

> **Stack-agnostic. Domain-agnostic.** This file is a directory — it tells you *which* frameworks apply to your product and *when* to activate them. Actual obligations, checklists, and controls live in the referenced docs.
>
> For AI-specific governance (EU AI Act, ISO 42001, NIST AI RMF), see `docs/14_AI_GOVERNANCE.md`.

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

Eight quality characteristics. Use as a **rubric for health checks** (`docs/6_HEALTH_CHECK.md`), not as a certification target.

| Characteristic | Definition | Proxy metric |
|---|---|---|
| Functional suitability | Does it do what users need? | % feature coverage, user-reported bugs |
| Performance efficiency | Is it fast enough? | Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1) |
| Compatibility | Does it work across environments? | Browser/device matrix coverage |
| Interaction capability | Is it usable? | WCAG 2.2 AA compliance, usability test pass rate |
| Reliability | Does it keep working? | Uptime %, error rate, MTTR |
| Security | Is it protected? | Open vulnerabilities (Snyk/Dependabot), pen-test findings |
| Maintainability | Can devs change it safely? | Lint errors, test coverage, cyclomatic complexity |
| Portability | Can it move environments? | Docker, env vars externalised, no hard-coded paths |

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
| **PCI DSS v4.0** | Yes — if storing, processing, or transmitting card data | 12 requirements |
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
| **NIS2 Directive** (EU 2022/2555) | Network and information security for essential/important entities |

---

## Decisions Log

Append compliance profile decisions here.

<!-- Example:
### 2026-05-03 — Activate `ai-governance` + `security` for FCA-STP PDGT
**Decision:** Both profiles active from day 1.
**Reason:** GCF contract requirement (ISO 27001 or equivalent) + PDGT processes financial data.
-->
