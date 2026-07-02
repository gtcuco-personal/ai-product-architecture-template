# AI Governance

> Activate this file when the `ai-governance` compliance profile is set in `docs/0_GROUND_RULES.md`. For the framework directory and activation conditions, see `docs/13_COMPLIANCE_FRAMEWORKS.md`.
>
> **Scope:** Any product that uses, exposes, or is built on AI/ML models — including products that call external AI APIs.

## Short Path (read this first)

Most products in this template are **deployers** of a third-party model API (§1 Obligations by Role), not providers, and are **minimal-risk**, not high-risk (§1 Risk Classification Step 3-5). If that's you, the real obligations are just two things:

1. **Tell users they're interacting with AI** (EU AI Act Art. 50 — transparency)
2. **Don't use the AI for high-stakes decisions without human confirmation** — medical, financial, legal, or anything else consequential to a person

Everything else below this line — ISO 42001 certification, the full AI Risk Register, production bias monitoring, 1-hour incident SLAs — is real, useful process for a team with dedicated AI-safety/compliance staff, and is **Enterprise/regulated — opt-in** per `docs/13_COMPLIANCE_FRAMEWORKS.md` §Applicability Gate. Don't build it for a solo project until a contract, a regulator, or an actual high-risk classification requires it.

---

## 1. EU AI Act (Regulation 2024/1689)

### Overview

In force since 1 August 2024. Application is phased:

| Date | What applies |
|---|---|
| 2 Feb 2025 | Prohibited AI practices banned |
| 2 Aug 2025 | GPAI model obligations + governance provisions |
| 2 Dec 2026 | Transparency obligations for AI-generated/manipulated content — watermarking (Art. 50) |
| 2 Dec 2027 | High-risk AI systems — stand-alone, use-based (Annex III) |
| 2 Aug 2028 | High-risk AI embedded in regulated products, e.g. medical devices, lifts (Annex I) |

> **Digital Omnibus (2026):** the Council, Parliament, and Commission reached a provisional agreement on 7 May 2026 to defer high-risk obligations — Annex III from 2 Aug 2026 to 2 Dec 2027, Annex I from 2 Aug 2027 to 2 Aug 2028 — and simplify GPAI/transparency rules. Formally endorsed by Parliament on 16 Jun 2026 and given final Council green light on 29 Jun 2026; enters into force shortly after Official Journal publication. **Verify current status before treating any date above as final** — dates above reflect the Omnibus agreement, not the original Regulation.

### Risk Classification

**Step 1: Is any practice prohibited?** (Art. 5)

- [ ] Social scoring of natural persons by public authorities → **Prohibited**
- [ ] Real-time biometric surveillance in public spaces → **Prohibited**
- [ ] Subliminal manipulation exploiting vulnerabilities → **Prohibited**
- [ ] Emotion recognition in workplace/education (with exceptions) → **Prohibited**
- [ ] Biometric categorisation by sensitive attributes → **Prohibited**
- [ ] Predictive policing based solely on profiling → **Prohibited**

**Step 2: Is it a GPAI model?** (Art. 51-56 — applies to model providers, not deployers)

A GPAI (General Purpose AI) model is trained on broad data and usable for many tasks. If the product *provides* a GPAI model (not just *uses* one):
- [ ] Publish technical documentation
- [ ] Maintain copyright compliance policy
- [ ] If systemic risk (≥ 10^25 FLOPs training compute): additional obligations (Art. 55)

**Step 3: Is it high-risk?** (Annex III)

High-risk AI systems (full conformity assessment required):

| Category | Examples |
|---|---|
| Biometric identification | Remote biometric ID, emotion recognition |
| Critical infrastructure | Safety components for energy, water, transport, finance |
| Education | Admissions, assessment, monitoring of students |
| Employment | Recruitment, evaluation, promotion, task allocation |
| Essential services | Credit scoring, life insurance risk, emergency dispatch |
| Law enforcement | Risk assessment of individuals, evidence reliability |
| Migration / asylum | Document authenticity, risk assessment |
| Justice / democracy | Judicial decisions, electoral influence |
| **Medical devices** | AI as safety component of medical device or IVD |

If high-risk:
- [ ] Conformity assessment (Art. 43) before placing on market
- [ ] Technical documentation (Annex IV)
- [ ] Register in EU database (Art. 49)
- [ ] CE marking (if product category requires it)
- [ ] Post-market monitoring plan
- [ ] Human oversight measures (Art. 14)
- [ ] Transparency obligations (Art. 13) — inform users they're interacting with AI

**Step 4: Is it limited-risk?** (Art. 50)

- [ ] Chatbots / AI that interacts with humans → disclose it's AI
- [ ] Deepfakes → label as artificially generated/manipulated
- [ ] Emotion recognition / biometric categorisation → inform affected persons

**Step 5: If none of the above → minimal risk.** No mandatory obligations, but Code of Practice encouraged.

### Obligations by Role

| Role | Definition | Key obligations |
|---|---|---|
| **Provider** | Develops and places AI system on market | Conformity assessment, technical docs, registration, CE marking (if applicable) |
| **Deployer** | Uses AI system in own processes | Risk management, human oversight, logging, data governance |
| **Importer / Distributor** | Brings to EU market without modifying | Verify provider compliance, cooperate with authorities |

Most products using third-party AI APIs are **deployers**, not providers. Deployer obligations are lighter but non-trivial for high-risk systems.

---

## 2. ISO/IEC 42001:2023 — AI Management System (AIMS)

The first certifiable management system standard for AI. Structure mirrors ISO 9001 / 27001 (Plan-Do-Check-Act) — adopts **Annex SL**, the common high-level structure shared across all ISO management system standards. Organisations already certified for ISO 27001 or ISO 9001 have significant overlap in governance infrastructure (policies, internal audit, management review, corrective action) and can integrate ISO 42001 incrementally.

### Core Requirements Summary

| Clause | Topic | Key obligation |
|---|---|---|
| 4 | Context | Define internal/external issues, interested parties, scope of AIMS |
| 5 | Leadership | Top management commitment, AI policy, roles and responsibilities |
| 6 | Planning | AI risk and opportunity assessment, AI objectives |
| 7 | Support | Resources, competence, awareness, communication, documented information |
| 8 | Operation | AI system impact assessment, AI system lifecycle management |
| 9 | Performance evaluation | Monitoring, internal audit, management review |
| 10 | Improvement | Nonconformity, corrective action, continual improvement |

### AI System Impact Assessment (Clause 8.4)

Required for each AI system in scope. Minimum fields:

```
AI System: [name / description]
Purpose: [what it does]
Intended users: [who uses it]
Data inputs: [what data it processes]
Model type: [classification / generation / recommendation / etc.]
Provider: [in-house / Anthropic / OpenAI / Google / etc.]
EU AI Act risk level: [prohibited / high / limited / minimal]
Impact on individuals: [low / medium / high]
Bias / fairness considerations: [documented]
Human oversight mechanism: [describe]
Monitoring plan: [how performance is tracked in production]
Last reviewed: [date]
```

### Annex A Controls (selected most relevant for software products)

| Control | Description |
|---|---|
| A.2.2 | AI policy — documented and communicated |
| A.3.2 | AI risk assessment process |
| A.4.1 | Internal and external AI use — inventory maintained |
| A.5.1 | AI-related roles and responsibilities defined |
| A.6.1 | Data for AI — provenance, quality, bias assessment |
| A.6.2 | Data governance for training and validation data |
| A.7.1 | AI system design — documented architecture and data flows |
| A.7.2 | AI system testing — validation, bias testing, robustness |
| A.8.1 | Human oversight — mechanism for human review of AI decisions |
| A.8.2 | AI system logging — decisions and confidence scores logged |
| A.8.3 | Transparency — users informed when AI is used |
| A.9.1 | Feedback mechanism — users can flag AI errors |
| A.10.1 | Responsible disclosure — AI incidents reported |

---

## 3. NIST AI RMF 1.0 + GenAI Profile (2024)

Voluntary framework from NIST (US), but widely referenced globally. Four core functions:

| Function | Description | Key activities |
|---|---|---|
| **GOVERN** | Establish culture, accountability, policies | AI policy, roles, risk appetite, supplier terms |
| **MAP** | Identify and categorise AI risks | Context, use case, stakeholders, potential harms |
| **MEASURE** | Analyse and assess risks | Bias testing, performance metrics, red-teaming |
| **MANAGE** | Prioritise and treat risks | Risk treatment plans, incident response, monitoring |

### GenAI Profile (NIST AI RMF Playbook, Jul 2024)

Specific to Generative AI (LLMs, image generators, multimodal models). Key additional risks:

| Risk | Description |
|---|---|
| Hallucination | Model generates plausible but false information |
| Confabulation | Model fills gaps with invented details |
| Data provenance | Training data origin unknown or problematic |
| Homogenisation | Models converging on similar outputs, reducing diversity |
| Prompt injection | External content hijacks model behaviour |
| Harmful content | Generating illegal, harmful, or biased content |
| Intellectual property | Copyright infringement via generated content |
| Privacy | Memorisation and disclosure of training data PII |

Mitigations to document in the AI inventory:
- Grounding strategy (RAG, structured data, citations)
- Output filtering / guardrails
- Human review cadence
- Prompt injection defences (see `docs/10_AGENT_SAFETY.md`)
- Copyright policy for generated content

---

## 4. AI Inventory

Maintain an inventory of all AI systems used by or embedded in the product. Update whenever a model is added, changed, or decommissioned.

### Template

| Field | Description |
|---|---|
| ID | Unique identifier (e.g., `AI-001`) |
| Name | Human-readable name |
| Type | `generative` / `classification` / `recommendation` / `retrieval` / `agent` / `other` |
| Provider | `in-house` / vendor name |
| Model | Specific model ID, e.g. `<vendor>-<model>-<version>` (avoid hardcoding a current model name here — it goes stale) |
| Version | Model version or date pinned |
| Purpose | What the system does in the product |
| Data inputs | Types of data the model processes |
| Data outputs | Types of data the model produces |
| Affected users | Who is subject to AI decisions/outputs |
| EU AI Act risk | `prohibited` / `high` / `limited` / `minimal` |
| ISO 42001 impact | `high` / `medium` / `low` |
| Human oversight | Mechanism for human review |
| Opt-out available | `yes` / `no` / `partial` |
| Logging | What is logged and where |
| Last assessed | Date of last impact assessment |
| Testing strategy | Link to eval suite in `evals/` — see `docs/11_TESTING.md` §AI-Specific Testing |

---

## 5. AI Risk Register

One row per identified AI risk. Review quarterly.

| ID | Risk description | Likelihood (1-5) | Impact (1-5) | Score | Treatment | Owner | Status |
|---|---|---|---|---|---|---|---|
| R-AI-001 | [e.g., Hallucination in medical advice context] | | | | [mitigate / accept / transfer / avoid] | | [open / mitigated / accepted] |

---

## 6. Human Oversight Checklist

For each AI system in the inventory, confirm:

- [ ] Users are informed they are interacting with AI (Art. 50 EU AI Act)
- [ ] A human can review, override, or reject any AI output that affects users
- [ ] Escalation path defined for cases where AI confidence is low
- [ ] AI decisions affecting individuals are logged with rationale
- [ ] Feedback mechanism exists for users to flag incorrect AI outputs
- [ ] High-stakes decisions (medical, financial, legal) require human confirmation before acting

---

## 7. Monitoring and Incident Response

> **Enterprise/regulated — opt-in.** Disaggregated bias monitoring and sub-hour incident SLAs assume on-call staff. For a solo/small project, the honest minimum is: watch for obviously wrong outputs, let users flag problems (§6 feedback mechanism), and fix issues when found — don't perform a monitoring programme you can't staff.

### Production Monitoring

Track these metrics per AI system in production:

| Metric | Description | Threshold (define per product) |
|---|---|---|
| Accuracy / task success rate | % correct outputs vs. ground truth or user acceptance | |
| Hallucination rate | % outputs containing fabricated facts (sampled review) | |
| Latency p50 / p95 / p99 | Response time distribution | |
| Refusal rate | % requests refused by model safety filters | |
| User correction rate | % outputs manually corrected by users | |
| Error rate | % API errors / model unavailability | |
| Bias indicators | Disaggregated performance across demographic groups | |

### AI Incident Definition

An AI incident is any event where:
- The AI system produces outputs that cause or risk harm to users
- The AI system behaves outside its documented intended use
- A security breach affects training data, model weights, or inference API
- The EU AI Act or ISO 42001 obligations are violated

**Response SLAs:**

| Severity | Definition | Response | Resolution |
|---|---|---|---|
| Critical | Harm to user, regulatory violation, data breach | 1 hour | 24 hours |
| High | Systematic incorrect outputs, safety filter bypass | 4 hours | 72 hours |
| Medium | Degraded performance, bias detected | 24 hours | 2 weeks |
| Low | Individual incorrect output, user complaint | 72 hours | Next sprint |

---

## Decisions Log

Append AI governance decisions here.

<!-- Example:
### 2026-05-03 — Model <model-id> classified as minimal risk (EU AI Act)
**Decision:** Product uses the model as a content assistant, not for consequential decisions. Minimal risk.
**Reason:** No Annex III category applies. Users are informed AI is used.
**Review date:** 2027-05-03
-->
