# SECURITY.md — Data Boundary Law

> **Version:** 1.0 | **Domain:** Data Handling, PII/CUI Constraints, Adapter-Only Integration
> **Authority:** Tier 1 | **Loaded By:** Every session

---

## 1. The One Rule

**No real data. No exceptions. Not in Phase 1A.**

All data in the SideCar Phase 1A MVP is synthetic. Realistic structure, fabricated values. This is not a convenience — it is a security boundary mandated by the Three-Phase Authorization Model (White Paper Section IX).

## 2. What SideCar May Never Contain in Phase 1A

| Category | Examples | Status |
|---|---|---|
| Personally Identifiable Information | Real names, SSNs, DODIDs, phone numbers, addresses | **PROHIBITED** |
| Controlled Unclassified Information | Real command data, real manning figures, real billet assignments | **PROHIBITED** |
| Real Personnel Records | NSIPS data, OAIS/EAIS records, real PRDs | **PROHIBITED** |
| Classification Markings | UNCLASSIFIED, FOUO, CUI banners or headers | **PROHIBITED** |
| Authentication Credentials | CAC cert data, EDIPI-based auth tokens, session keys | **PROHIBITED** |
| Real Command Identifiers | Actual UICs, real unit names, real homeport assignments | **PROHIBITED** |

## 3. Synthetic Data Standards

Synthetic data must be operationally realistic without being traceable to real personnel:

- **Names:** Use obviously synthetic names (e.g., "Sailor, Alpha B." or phonetic alphabet patterns)
- **DODIDs:** Use `9999XXXXXX` pattern (clearly outside valid ranges)
- **Commands:** Use fictional command names (e.g., "USS EXAMPLE (CVN-00)")
- **UICs:** Use `XXXXX` pattern
- **Dates:** Use realistic date ranges relative to current date
- **Rates/Ranks:** Use real rate/rank abbreviations (these are not PII)
- **PRD values:** Distribute across all 5 tiers for testing

## 4. Adapter-Only Integration

**Constitutional Constraint C-09:** All data access routes through the `SideCarAdapter` TypeScript service defined in `src/services/SideCarAdapter.ts`. No component, no function, no hook may access data except through this adapter.

In Phase 1A, the adapter returns synthetic data from `SyntheticData.ts`.
In Phase 1B, the adapter will call Microsoft Graph API via SPFx.
**The calling code never knows which mode it is in.**

## 5. What This Means for Developers

- Never hardcode data values in React components. Always call through the adapter.
- Never use `fetch()` directly in components — route through `SideCarAdapter.ts`.
- Never reference real Navy systems by their actual endpoint URLs.
- Never embed real API keys, tokens, or credentials — even for testing.
- Never copy real CSV exports into the codebase — even temporarily.
- If you need more synthetic data, add it to `src/services/SyntheticData.ts` through the adapter pattern.

## 6. Phase 2 Gate Conditions

SideCar advances to real data ONLY when:
1. COMNAVPERSCOM sponsorship is confirmed
2. GCC High tenant is provisioned
3. RMF assessment is initiated
4. Data access authorization is granted to the system (not to a developer)

**Until all four conditions are met, Phase 1A data rules are absolute.**

## 7. Privacy Act and SORN Compliance

When SideCar transitions to real data in Phase 2, it will be subject to Privacy Act System of Records Notices (SORNs):

| SORN | Coverage |
|---|---|
| **N01080-1** | Personnel records, service history, pay data |
| **N01301-2** | Assignment and distribution records |

**Phase 1A implication:** Even though we use synthetic data now, the application architecture must be designed to enforce SORN-level data handling from the start. This means:
- Role-based access controls must be structurally present (not bolted on later)
- Audit logging must be scaffolded now (append-only comm log is the first example)
- Data masking patterns must be architecturally supported

## 8. Data Lifecycle Governance

The Separations Tracker module requires strict data lifecycle rules:

| Rule | Specification |
|---|---|
| **Active records** | Full personnel data retained for active-duty members and those within 5 years of separation |
| **5-year archive** | After 5 years post-separation, personalized profile data (PII) is **automatically deleted** |
| **Anonymized retention** | Structural metadata (rate, designator, command type, separation reason) is retained permanently for enterprise analytics and congressional inquiry |
| **Comm log retention** | Communication records tied to separated personnel follow the 5-year deletion rule for PII fields, but anonymized summaries persist |

**Phase 1A implication:** The adapter interface should support a concept of "archived" vs. "active" records even in synthetic data, so the UI patterns for handling archived data are built now.

## 9. RMF/ATO/cATO Authorization Pathway

SideCar must achieve Authority to Operate (ATO) before processing real data:

| Step | Description | Phase |
|---|---|---|
| **RMF Categorization** | System categorized under DoD Risk Management Framework based on data sensitivity (CUI/PII) | Phase 1B planning |
| **Control Selection** | NIST 800-53 security controls selected based on categorization | Phase 1B planning |
| **Implementation** | Controls implemented in the application architecture | Phase 1B development |
| **Assessment** | Independent security assessment with vulnerability scanning, penetration testing, STIG compliance | Phase 1B pre-launch |
| **ATO Issuance** | Formal authorization to process real data | Phase 2 gate |
| **cATO Transition** | Continuous monitoring, automated control assessments, rapid vulnerability remediation | Phase 2 ongoing |

**Phase 1A implication:** Security controls must be designed into the architecture now. DISA STIG/SRG compliance requirements affect how we handle authentication, encryption, logging, and endpoint hardening. Even without real data, the application structure must not create barriers to future ATO.

## 10. Zero Trust Architecture Alignment

The Navy's Flank Speed (M365 GCC High) and Nautilus (VDI) environments are built on Zero Trust principles:

- **Continuous authentication:** Every session, every request must be authorized
- **Least privilege:** Users see only data commensurate with their echelon of command and verified need-to-know
- **Micro-segmentation:** Application components must minimize attack surfaces
- **No implicit trust:** Even on the NMCI network, the application assumes the network is hostile

**Phase 1A implication:** The RBAC structure in the UI (Detailer sees their roster, Placement sees their commands, TYCOM sees aggregate) must be designed now. Phase 1A enforces RBAC through role-based view rendering. Phase 2 enforces it through Active Directory security groups and ICAM integration.

## 11. Health Data Considerations (LIMDU, EFMP, Medical)

SideCar displays health-adjacent status flags (LIMDU, EFMP, OPSDEF) that may intersect with HIPAA requirements:

| Flag | Health Data? | Handling Rule |
|---|---|---|
| **LIMDU** | Yes — indicates medical hold | Display presence of flag only. Never display diagnosis, prognosis, or medical details. |
| **EFMP** | Yes — indicates special needs dependent | Display enrollment status only. Never display dependent condition. |
| **OPSDEF** | Potentially | Display status only. Never display underlying reason beyond category code. |

**Phase 1A implication:** Synthetic data may include these flags as boolean values, but must never include synthetic medical narratives or diagnostic information — even fabricated ones. The pattern of "flag-only, no detail" must be established in the UI now.

---

*SECURITY.md v2.1 — SideCar Directive Library — Amended 2026-03-31 for React/TypeScript*
