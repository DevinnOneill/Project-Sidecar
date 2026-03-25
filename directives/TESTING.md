# TESTING.md — Quality Assurance Standards

> **Version:** 1.0 | **Domain:** Quality Gate, Scoring Framework, Remediation Protocol
> **Authority:** Tier 1
> **Loaded By:** QA Agent at Step 7 of the Governed Development Cycle

---

## 1. Four-Dimension Scoring Framework

Every output is scored on a 1–10 scale across four dimensions. The pass threshold is **≥ 7 in every dimension simultaneously.**

| Dimension | Question | Threshold |
|---|---|:---:|
| **Clarity** | Is the output unambiguous? Can the next agent or developer consume it without interpretation? | ≥ 7 |
| **Specificity** | Are all referenced files, functions, tokens, and contracts explicitly named? No vague references? | ≥ 7 |
| **Chain-Readiness** | Is the output formatted for downstream consumption (merge, review, integration) without transformation? | ≥ 7 |
| **Output Definition** | Does the output match the contract defined in the Execution Script exactly? | ≥ 7 |

### Score Bands
- **1–3:** Non-compliant. Cannot advance under any condition. Immediate remediation required.
- **4–6:** Directed remediation required before re-evaluation. One remediation cycle permitted.
- **7–9:** Passes the gate. Score-specific notes logged for session record.
- **10:** Exemplary. Stored in `lessons/exemplars.md` as reference for future sessions.

## 2. SideCar-Specific QA Checks

Beyond the four dimensions, every SideCar output must pass these checks:

### Visual Compliance
- [ ] All colors use CSS custom properties (no hardcoded hex outside `:root`)
- [ ] PRD colors used only for PRD urgency (semantic lock)
- [ ] Typography roles correct: display/body/data fonts applied properly
- [ ] Background layer hierarchy not inverted
- [ ] Gold used for signal, not decoration

### Functional Compliance
- [ ] Works from `file://` path in Chrome/Edge
- [ ] No `fetch()` calls
- [ ] No external dependencies without local fallback
- [ ] All data access through `SideCarAdapter`
- [ ] Navigation between pages functional
- [ ] Comm log writes are append-only

### Data Compliance
- [ ] All data is synthetic
- [ ] No PII, CUI, or classification markings
- [ ] Synthetic data distributed across all 5 PRD tiers
- [ ] DODIDs use `9999XXXXXX` pattern
- [ ] Command names are fictional

### NMCI Compatibility
- [ ] No CSS features beyond Chrome 110 baseline
- [ ] Font fallbacks present and tested
- [ ] No `data:` URIs without file-based alternative
- [ ] No `top-level await`
- [ ] No ES modules (`import`/`export`)

## 3. QA Report Format

```markdown
# QA REPORT — SC-YYYY-MMDD-NNN

## Scores
| Dimension | Score | Notes |
|---|:---:|---|
| Clarity | X/10 | [observations] |
| Specificity | X/10 | [observations] |
| Chain-Readiness | X/10 | [observations] |
| Output Definition | X/10 | [observations] |

## SideCar Checks
- Visual Compliance: PASS | FAIL — [details]
- Functional Compliance: PASS | FAIL — [details]
- Data Compliance: PASS | FAIL — [details]
- NMCI Compatibility: PASS | FAIL — [details]

## Verdict
- **Overall:** PASS | REMEDIATION REQUIRED | ESCALATE TO TIER 1
- **Remediation Brief:** [if applicable — dimension that failed, specific deficiency, corrective action]
```

## 4. Remediation Protocol

- One remediation cycle is permitted per session
- The remediation brief specifies the exact deficiency and corrective action
- After remediation, the full QA gate runs again (not just the failed dimension)
- A second failure in any dimension escalates to Tier 1 for task redefinition
- Remediation does not restart the session — it continues from the existing output

## 5. Test Scenarios for Phase 1A

### PRD Tier Distribution Test
Load synthetic data. Verify all 5 tiers render correctly with proper colors, labels, and sort order.

### File:// Protocol Test
Open every page from `file:///path/to/sidecar-mvp/page1.html`. Verify no console errors, no broken resources, no CORS failures.

### Font Fallback Test
Block Google Fonts and remove local `.woff2` files. Verify the interface remains functional and readable with system fonts.

### Navigation Test
Click every navigation link from every page. Verify correct page loads with no broken paths.

### Data Adapter Test
Verify all displayed data originates from `SideCarAdapter` calls — no hardcoded values in HTML.

---

*TESTING.md v1.0 — SideCar Directive Library*
