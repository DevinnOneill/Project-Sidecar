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

**Constitutional Constraint C-09:** All data access routes through the `SideCarAdapter` interface defined in `app.js`. No page, no function, no component may access data except through this adapter.

In Phase 1A, the adapter returns embedded synthetic data.
In Phase 1B, the adapter will call Microsoft Graph API.
**The calling code never knows which mode it is in.**

## 5. What This Means for Developers

- Never hardcode data values in HTML. Always call through the adapter.
- Never reference real Navy systems by their actual endpoint URLs.
- Never embed real API keys, tokens, or credentials — even for testing.
- Never copy real CSV exports into the codebase — even temporarily.
- If you need more synthetic data, add it to `app.js` through the adapter pattern.

## 6. Phase 2 Gate Conditions

SideCar advances to real data ONLY when:
1. COMNAVPERSCOM sponsorship is confirmed
2. GCC High tenant is provisioned
3. RMF assessment is initiated
4. Data access authorization is granted to the system (not to a developer)

**Until all four conditions are met, Phase 1A data rules are absolute.**

---

*SECURITY.md v1.0 — SideCar Directive Library*
