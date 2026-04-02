# TESTING.md — Quality Assurance Standards

> **Version:** 2.0 | **Domain:** Quality Gate, Scoring Framework, Remediation Protocol
> **Authority:** Tier 1
> **Loaded By:** QA Agent at Step 7 of the Governed Development Cycle
> **Amended:** 2026-03-31 — Updated for Vite + React + TypeScript architecture

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
- [ ] Builds cleanly with `npm run build` (zero TypeScript errors)
- [ ] Runs correctly with `npm run dev`
- [ ] No direct `fetch()` calls from components — all through SideCarAdapter
- [ ] No external dependencies without local fallback
- [ ] All data access through `SideCarAdapter.ts`
- [ ] React Router navigation between all routes functional
- [ ] Comm log writes are append-only

### Data Compliance
- [ ] All data is synthetic
- [ ] No PII, CUI, or classification markings
- [ ] Synthetic data distributed across all 5 PRD tiers
- [ ] DODIDs use `9999XXXXXX` pattern
- [ ] Command names are fictional

### NMCI Compatibility (Build Output)
- [ ] Vite build output targets ES2020 (Chrome 110+ compatible)
- [ ] No CSS features beyond Chrome 110 baseline in output
- [ ] Font fallbacks present and tested
- [ ] No `data:` URIs without file-based alternative
- [ ] TypeScript strict mode enabled — no `any` without justification
- [ ] All component props properly typed

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

### Dev Server Test
Run `npm run dev` and navigate to every route. Verify no console errors, no broken resources, no React rendering failures.

### Font Fallback Test
Block Google Fonts and remove local `.woff2` files. Verify the interface remains functional and readable with system fonts.

### Navigation Test
Click every navigation link and React Router route. Verify correct component renders with no broken paths or 404s.

### Data Adapter Test
Verify all displayed data originates from `SideCarAdapter` calls — no hardcoded values in component JSX.

### RBAC View Validation Test
Verify role-based rendering serves the correct scope per persona:

| Role | Expected View | Verify |
|---|---|---|
| **Detailer** | Personal roster only — Sailors assigned to their PERS code | Cannot see Sailors outside their constituency |
| **Placement Officer** | Commands under their COG — all Sailors at those commands | Cannot modify individual assignment proposals |
| **TYCOM/ISIC** | Aggregate manning across subordinate units | Sees aggregate numbers, not individual Sailor records |
| **Flag Officer** | Landing page executive summary | Passes 90-second comprehension test |

### Manning Calculation Validation Test
Verify the manning percentage calculation supports both analytical lenses:

| Test Case | Input | Expected Output |
|---|---|---|
| **Billet-Based** | Command with 10 authorized billets, 8 filled | Manning: 80% |
| **DMP-Limited** | Same command, DMP limits to 9 billets, 8 filled | Manning: 89% |
| **Zero billets** | Command with 0 authorized billets | Display "N/A" — never divide by zero |
| **Overmanned** | 10 authorized, 12 assigned | Manning: 120% — display with appropriate indicator |

### Mass Update Validation Gateway Test (Future Module)
Verify the validation engine blocks invalid bulk operations:

| Test Case | Expected Result |
|---|---|
| Assign Aviation AQD to Surface Warfare (1110) designator | **HARD ERROR** — transaction rejected |
| Update 500 records with valid AQD for their designator | Transaction succeeds, generates unique Transaction Number |
| Bulk update with no RBAC authorization | **DENIED** — user lacks write access |
| Rollback request for completed mass update | Transaction reversed using stored Transaction Number |

### Data Freshness Timestamp Test
Verify every screen renders `Data Last Refreshed: [timestamp]`:

- [ ] Timestamp visible on every page load
- [ ] Timestamp uses `SideCarAdapter.getLastUpdated()`
- [ ] Rendered in `--font-data` at `--type-data-xs` with `--color-text-dim`
- [ ] Position: topbar, right-aligned
- [ ] Timestamp updates when data source changes (CSV reimport or API refresh)

### Quick-Flag Icon Rendering Test (Detailer View)
Verify all status flag icons render correctly in the sticky Status column:

| Flag | Icon | Hover Tooltip |
|---|:---:|---|
| 8 Flag (Promotion Hold) | ⚑ | "8 Flag: Promotion Hold" |
| 8,8 Flag (Active Legal) | ⚖ | "8,8 Flag: Active Legal Investigation" |
| 4 Flag (Colocation) | 💐 | "4 Flag: Colocation Request" |
| 6 Flag (EFMP) | 🏥 | "6 Flag: Exceptional Family Member Program" |
| LIMDU | ✚ | "LIMDU: Limited Duty (Medical Hold)" |
| OPSDEF | 👶 | "OPSDEF: Operational Deferment" |

- [ ] Icons render in a sticky column pinned next to Name/Rank
- [ ] Tooltips trigger on hover with slight delay (prevent flicker)
- [ ] Multiple flags on one Sailor render side-by-side without overflow
- [ ] No flag text is shown — icons only, with tooltip fallback

### Comm Log Immutability Test
Verify append-only constraint (C-10):

- [ ] New entries append to log successfully via `SideCarAdapter.addCommEntry()`
- [ ] No UI affordance exists to edit existing entries
- [ ] No UI affordance exists to delete existing entries
- [ ] Entries maintain chronological order
- [ ] Each entry stores `sailorId`, `date`, `type`, and `summary`

---

*TESTING.md v3.0 — SideCar Directive Library — Amended 2026-03-31 for React/TypeScript*
