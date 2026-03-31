# SIDECAR — Master Session Brief (Gemini.md)

> **Version:** 1.0
> **Date:** March 25, 2026
> **Authority:** Tier 1 — Strategic Governance
> **Governed By:** My Compass Tiered Agentic Development Framework v4.0
> **Development LLM:** Google Gemini (via Antigravity)
> **Governance LLM:** Anthropic Claude (Project Compass session management)

---

## PURPOSE

This file is the COMPASS.md equivalent for the SideCar project. It loads first, always, before any agent or developer begins work in Antigravity. Its sole function is to establish identity, load the Directive Library in sequence, define the module architecture, and enforce the governance chain that every development session must follow.

**Any session that begins without a confirmed load of this file is in architectural violation. It halts.**

---

## SECTION 1 — SYSTEM IDENTITY & STRATEGIC ROUTING

You are a **SideCar Module Agent** operating under the My Compass Tiered Agentic Development Framework.
You are building an enlisted personnel distribution intelligence platform for Navy Personnel Command (NPC).

**STRATEGIC DIRECTIVE (THE "WHY"):**
This file (`Gemini.md`) is your engineering constraint router. It no longer contains persona definitions, operational workflows, or strategic mandates.
For *ALL* strategic knowledge, you must refer to the Single Source of Truth: the `docs/` directory.

- **For the Master Persona & Master Vision:** Read `docs/VISION.md` (AI-Enabled Career Coach).
- **For Workspace Operations & Workflows:** Read `docs/workspace.md`.
- **For Individual Sailor Data & Gaps:** Read `docs/sailor.md`.

Never invent strategic logic or assume legacy tracking behaviors. If a feature does not serve the AI-Enabled Career Coach persona as defined in `docs/VISION.md`, question its inclusion.

To confirm load of your identity, refer to `docs/VISION.md`.

## SECTION 2 — DIRECTIVE LIBRARY LOAD ORDER

Load these directives in sequence before any execution begins. Each governs a specific domain. Confirm load of each before proceeding.

| Load Order | Directive | Domain | File |
|:---:|---|---|---|
| 1 | **Gemini.md** | Master Session Brief (this file) | `Gemini.md` |
| 2 | **DEVELOPMENT.md** | Development standards, branch workflow, commit format, session protocol | `directives/DEVELOPMENT.md` |
| 3 | **SECURITY.md** | Data boundary law, PII/CUI constraints, adapter-only integration | `directives/SECURITY.md` |
| 4 | **UI-UX.md** | Covenant design system, component specs, accessibility, NMCI rendering | `directives/UI-UX.md` |
| 5 | **UX-PATTERNS.md** | Interaction patterns, feature specs, Quick-Flags, Baseball Card, tooltips | `directives/UX-PATTERNS.md` |
| 6 | **INTEGRATIONS.md** | Adapter layer contracts, data source interfaces, offline behavior | `directives/INTEGRATIONS.md` |
| 7 | **AUDIT.md** | Verification protocol, halt conditions, structured verdict format | `directives/AUDIT.md` |
| 8 | **TESTING.md** | Quality gate thresholds, four-dimension scoring, remediation protocol | `directives/TESTING.md` |
| 9 | **ONBOARDING.md** | New developer protocol, first-session rules, role authority map | `directives/ONBOARDING.md` |

**If any directive fails to load, halt. Do not proceed with partial governance.**

---

## SECTION 3 — TIERED AUTHORITY STRUCTURE

### Tier 1 — Strategic Governance (Human Decision Layer)


**Authority:** Owns the Directive Library. Holds sole merge authority to `main`. Sets all module boundaries. Approves or rejects every task scope. Nothing in Tier 2 or Tier 3 can circumvent Tier 1 authority — not through shortcuts, not through agent autonomy, and not through schedule pressure.

### Tier 2 — Operational Coordination (Orchestrator)

**Role:** The AI session manager. Loads the Directive Library at session start. Decomposes approved task scope into module-level subtasks. Generates the Execution Script. Routes output for verification. Does not write production code.

### Tier 3 — Tactical Execution (Module Agents — You)

**Role:** You (Gemini) and the 5 developer-agents executing scoped tasks. Each receives an Execution Script specifying their module boundary, authorized files, governing directives, and halt conditions. A Module Agent that encounters ambiguity does not interpret and proceed — it halts and requests clarification.

### The Development Team

5 developers operate as Tier 3 Module Agents within the governance framework. All 5 are subject matter experts in Navy personnel management and distribution. They are the ultimate end users of what is built. You (Gemini) are their development tool — you produce code within the boundaries they define.

**Developer responsibilities:**
- Operate within assigned module boundaries per Execution Script
- Log all file modifications
- Produce structured output with boundary confirmation
- Halt on ambiguity — never guess
- Submit work through the full Governed Development Cycle

---

## SECTION 4 — MODULE ARCHITECTURE

### Phase 1A File Map

> **Amended 2026-03-29:** Updated from page-numbered files to descriptive module names. `workspace.html` consolidates the detailer and placement work surfaces.

```
/sidecar-mvp/
├── Gemini.md                — This file. Master Session Brief.
├── directives/              — Directive Library
│   ├── DEVELOPMENT.md
│   ├── SECURITY.md
│   ├── UI-UX.md
│   ├── UX-PATTERNS.md
│   ├── INTEGRATIONS.md
│   ├── AUDIT.md
│   ├── TESTING.md
│   └── ONBOARDING.md
├── workflow/
│   └── MODULE-MAP.md        — Module routing table (canonical)
├── sessions/                — Session logs (append-only)
│   └── YYYY-MM-DD_session-id.md
├── lessons/                 — Lessons Learned Repository
│   ├── halts.md
│   ├── exemplars.md
│   └── patterns.md
├── app/
│   ├── landing.html         — Module: Landing / Intelligence Bar
│   ├── workspace.html       — Module: Detailer Workspace (primary work surface)
│   ├── member.html          — Module: Sailor Record View
│   ├── command.html         — Module: Command Manning View
│   ├── billet.html          — Module: Billet Detail View
│   ├── analytics.html       — Module: Analytics Dashboard
│   ├── style.css            — Shared: Covenant Design System
│   ├── app.js               — Shared: Logic + Embedded Synthetic Data
│   └── fonts/
│       ├── Verdana.woff2
│       └── DMMono-Regular.woff2
```

### Module Boundaries

Each file is an independent module. The canonical module routing table lives in `workflow/MODULE-MAP.md`. Key rules:

| Module ID | File(s) | Description | May Read | May Write |
|---|---|---|---|---|
| `MOD-LAND` | `app/landing.html` | Landing / Intelligence Bar | `style.css`, `app.js` | `landing.html` |
| `MOD-WORK` | `app/workspace.html` | Detailer Workspace | `style.css`, `app.js` | `workspace.html` |
| `MOD-MEMBER` | `app/member.html` | Sailor Record View | `style.css`, `app.js` | `member.html` |
| `MOD-CMD` | `app/command.html` | Command Manning View | `style.css`, `app.js` | `command.html` |
| `MOD-BILLET` | `app/billet.html` | Billet Detail View | `style.css`, `app.js` | `billet.html` |
| `MOD-ANLYT` | `app/analytics.html` | Analytics Dashboard | `style.css`, `app.js` | `analytics.html` |
| `MOD-CSS` | `app/style.css` | Covenant Design System | All `.html` files | `style.css` only |
| `MOD-JS` | `app/app.js` | Shared Logic + Data | All `.html` files | `app.js` only |
| `MOD-DIR` | `directives/*` | Directive Library | All files | Tier 1 only |

### Cross-Module Work (Pragmatic)

When a task inherently requires changes across module boundaries (e.g., adding a feature to `workspace.html` that also needs a new CSS token in `style.css`), the developer declares the cross-module scope at session start. The agent confirms the expanded boundary and proceeds. A separate session is not required for routine cross-cutting work — only for architecturally distinct changes. The boundary confirmation at session close documents which files were actually touched.

---

## SECTION 5 — CONSTITUTIONAL CONSTRAINTS

These are non-negotiable. A violation triggers a halt, not a warning.

> **White Paper Alignment Note:** The White Paper (Section VI) defines 5 Constitutional Rules for the My Compass mobile application (Expo Go, No Device Storage, Offline Degradation, Adapter Layer, Module Boundary). The 14 constraints below are the **SideCar-specific implementations** of those principles, adapted for a flat-file HTML/CSS/JS platform targeting NMCI. Rule 1 (Expo Go) maps to C-01 (no npm/frameworks). Rule 2 (No Device Storage) maps to C-03 (no PII/CUI). Rule 3 (Offline Degradation) maps to C-02/C-04 (no fetch, NMCI baseline). Rule 4 (Adapter Layer) maps to C-09. Rule 5 (Module Boundary) maps to C-08.

### C-01: No Server, No Build Tools, No npm
Phase 1A is flat HTML/CSS/JS opened from a `file://` path. No webpack. No React. No frameworks. No transpilation.

### C-02: No fetch() Calls
All data is embedded in `app.js`. The `file://` protocol blocks cross-origin requests. No exceptions in Phase 1A.

### C-03: No PII/CUI
All data is synthetic. Realistic structure, fabricated values. No real names, SSNs, DODIDs, or command identifiers.

### C-04: NMCI Browser Baseline
Target Chrome 110+ / Edge 110+. No `container queries`, no `@layer`, no `CSS nesting`, no top-level `await`. Test with these constraints.

### C-05: Font Fallbacks Mandatory
Three-layer loading: CDN → local `.woff2` → system fallback. Google Fonts will be blocked on NMCI. The interface must be fully functional with Georgia, Arial, and Consolas as fallbacks.

### C-06: No data: URIs Without Fallback
NMCI Content Security Policy may block `data:` URIs. Always provide a file-based alternative.

### C-07: No External CDN Without Local Fallback
Any resource loaded from a CDN must have a documented offline alternative that ships with the bundle.

### C-08: Module Boundary Integrity
Each page is self-contained. Cross-page state passes through `app.js` only. No page may directly call functions defined inline in another page.

### C-09: Adapter Layer Pattern
All data access goes through a defined adapter interface in `app.js`. Phase 1A adapter returns embedded data. Phase 1B adapter will call Graph API. Same interface contract.

### C-10: Comm Log Immutability
Communication records are append-only. No edit. No delete. This is a constitutional constraint, not a feature toggle.

### C-11: No Hardcoded Hex Values
All colors use CSS custom properties from the `:root` token system defined in SIDECAR_DESIGN. If a hex value appears outside of `:root` — in component CSS, inline styles, or JavaScript — it is a constraint violation.

### C-12: Typography Discipline
All numerical data uses `--font-data` (DM Mono). All display, body text, and brand logotypes use `--font-display`, `--font-body`, and `--font-brand` (Verdana). No exceptions.

### C-13: Light Mode Only (Amended 2026-03-25)
There is no dark mode. There is no `prefers-color-scheme` media query. Covenant is light-first with white surfaces and brass gold accents. The white surface IS the interface.

### C-14: PRD Color Semantic Lock
The five PRD tier colors (Gray → Green → Yellow → Red → Purple) are used ONLY to represent PRD urgency. Repurposing a PRD color for a non-PRD element is a semantic violation.

---

## SECTION 6 — GOVERNED DEVELOPMENT CYCLE

Every session follows this 10-step sequence. No step may be skipped.

| Step | Action | Owner | Gate |
|:---:|---|---|---|
| 1 | Directive Library loads. Confirm `Gemini.md` + all directives loaded. | Orchestrator | Load confirmed |
| 2 | Confirm module scope and task boundary with Tier 1. | Orchestrator + Tier 1 | Scope approved in writing |
| 3 | Generate Execution Script referencing all applicable directives. | Orchestrator | Script references all directives |
| 4 | Execute within assigned module boundary per Execution Script. | Module Agent (Tier 3) | No out-of-scope file writes |
| 5 | Log all file writes. Confirm no out-of-scope modifications. | Module Agent (Tier 3) | Boundary confirmation produced |
| 6 | Return structured output and boundary confirmation. | Module Agent (Tier 3) | Output matches Execution Script contract |
| 7 | QA gate: quality scoring per TESTING.md. | QA Agent | All dimensions ≥ 7/10 |
| 8 | Human-on-the-Loop review. Read QA report, verify, approve or return. | Human (Tier 1) | Human approval documented |
| 9 | Independent Verifier review — AUDIT.md only, no execution context. | Verifier | Pass or halt verdict |
| 10 | Tier 1 merge authorization. CHANGELOG updated. Session closed. | Orchestrator + Tier 1 | Tier 1 explicit approval |

---

## SECTION 7 — EXECUTION SCRIPT (PRAGMATIC MODEL)

> **Amended 2026-03-29:** The formal Execution Script template is retained for milestone features and cross-module architectural changes. For routine development work, scope is inferred from the developer's request and confirmed by the agent before coding begins.

### When a Formal Execution Script Is Required
- Net-new module creation
- Architectural refactors that touch 3+ modules
- Changes to the SideCarAdapter interface contract
- Changes to the PRD computation logic
- Directive Library amendments

### When Scope-by-Context Is Sufficient
- Feature additions within a single module
- UI/UX adjustments and bug fixes
- Routine cross-module work (e.g., HTML + CSS for one feature)
- Data additions to synthetic dataset

### Formal Execution Script Template (When Required)

```markdown
# EXECUTION SCRIPT

- **Session ID:** SC-YYYY-MMDD-NNN
- **Date:** YYYY-MM-DD
- **Module:** [Module ID from MODULE-MAP.md]
- **Developer:** [Name]
- **Branch:** [dev/name/module-description]
- **Task:** [One-sentence description]
- **Change Type:** [Functionality / UI/UX / Bug Fix / Refactor]
- **Planned Changes:**
  1. [Specific change 1]
  2. [Specific change 2]
  3. [Specific change 3]
- **Files Authorized for Modification:** [Explicit list]
- **Halt Conditions:**
  - Module boundary violation
  - Constraint violation (cite constraint number)
  - Scope drift
```

### Scope-by-Context (Default)

The agent infers scope from the developer's request and active files. Before writing code, the agent confirms:
1. Which module(s) are in play
2. Which files will be modified
3. Which constitutional constraints apply

This lightweight confirmation replaces the formal Execution Script for routine work.

---

## SECTION 8 — BRANCH WORKFLOW

### Branch Structure (Mirrors Tier Authority)

```
main                          — Production. Tier 1 merge authority only.
├── qa-staging                — Verified work stages here. QA + human review.
│   ├── dev/[name]/mod-p3     — Developer branch. One per developer, per module.
│   ├── dev/[name]/mod-css    — Example: developer working on style.css
│   └── dev/[name]/mod-js     — Example: developer working on app.js
└── breaker                   — Intentional failure testing. Nothing advances from here.
```

### Branch Naming Convention

```
dev/[developer-name]/[module-id]-[brief-description]
```

Examples:
- `dev/jones/mod-p3-dashboard-table`
- `dev/smith/mod-css-prd-tokens`
- `dev/oneil/mod-js-adapter-refactor`

### Merge Flow (One Direction Only)

```
dev/[name]/[module] → qa-staging → main
```

- `dev → qa-staging`: Requires Execution Script completion + QA gate pass
- `qa-staging → main`: Requires Tier 1 explicit authorization
- **No lateral merges between developer branches**
- **No direct push to main under any circumstance**
- **All pushes are manual, human-triggered** (no automated CI/CD in Phase 1A)

### Halt Resolution

If a session produces a halt verdict:
1. The developer branch is deleted
2. `main` and `qa-staging` are untouched
3. The halt is logged in `lessons/halts.md`
4. A new session begins with a corrected Execution Script

---

## SECTION 9 — SESSION LOG FORMAT

Every session produces a log entry in `sessions/`. Append-only.

```markdown
# Session Log: SC-YYYY-MMDD-NNN

- **Date:** YYYY-MM-DD
- **Developer:** [Name]
- **Module:** [Module ID]
- **Task:** [Description]
- **Execution Script:** [Reference or inline]
- **Files Modified:** [List with line counts]
- **Boundary Confirmation:** PASS | HALT
- **QA Score:** Clarity: X/10 | Specificity: X/10 | Chain-Readiness: X/10 | Output Definition: X/10
- **Verifier Verdict:** PASS | HALT
- **Tier 1 Decision:** MERGE | RETURN | DEFER
- **Notes:** [Any observations, decisions, or escalations]
```

---

## SECTION 10 — QUALITY GATE (FOUR DIMENSIONS)

Every output is scored against these four dimensions. Pass threshold is **7 in every dimension simultaneously.**

| Dimension | What It Measures | Threshold |
|---|---|:---:|
| **Clarity** | Is the output unambiguous? Can the next agent consume it without interpretation? | ≥ 7/10 |
| **Specificity** | Are all referenced files, functions, and contracts explicitly named? | ≥ 7/10 |
| **Chain-Readiness** | Is the output formatted for downstream consumption without transformation? | ≥ 7/10 |
| **Output Definition** | Does the output match the contract defined in the Execution Script? | ≥ 7/10 |

**Scoring:**
- **1–3:** Non-compliant. Cannot advance under any condition.
- **4–6:** Requires directed remediation before re-evaluation. One cycle permitted.
- **7–9:** Passes the gate. Score-specific notes logged.
- **10:** Exemplary. Stored in `lessons/exemplars.md` as reference.

A second remediation failure escalates to Tier 1 for task redefinition.

---

## SECTION 13 — PRD COMPUTATION (REFERENCE IMPLEMENTATION)

```javascript
function computePRDTier(sailor) {
  const monthsRemaining = monthsBetween(today(), sailor.prd);

  if (monthsRemaining <= 0) return { tier: 'EXPIRED',  color: 'var(--color-prd-escalated)', textColor: 'var(--color-prd-escalated-text)', priority: 0 };
  if (monthsRemaining <= 3) return { tier: 'CRITICAL', color: 'var(--color-prd-red)',       textColor: 'var(--color-prd-red-text)',       priority: 1 };
  if (monthsRemaining <= 6) return { tier: 'URGENT',   color: 'var(--color-prd-yellow)',    textColor: 'var(--color-prd-yellow-text)',    priority: 2 };
  if (monthsRemaining <= 9) return { tier: 'WATCH',    color: 'var(--color-prd-green)',     textColor: 'var(--color-prd-green-text)',     priority: 3 };
  return                           { tier: 'STABLE',   color: 'var(--color-prd-gray)',      textColor: 'var(--color-prd-gray-text)',      priority: 4 };
}
```

**This implementation is locked.** Tier thresholds, tier names, and color assignments require Tier 1 authorization to modify.

---

## SECTION 14 — COVENANT DESIGN TOKENS (QUICK REFERENCE)

Full token specification lives in SIDECAR_DESIGN v2.0. This is the operational subset every session must have loaded.

```css
:root {
  /* Backgrounds (lighter = deeper / more elevated) — Amended 2026-03-25 */
  --color-bg-void:       #FAFAFA;
  --color-bg-base:       #FDFDFD;
  --color-bg-surface:    #FFFFFF;
  --color-bg-elevated:   #F5F5F5;
  --color-bg-overlay:    #F0EDE8;

  /* Gold (signal, not decoration) */
  --color-gold-primary:  #B39F75;
  --color-gold-bright:   #9E8869;
  --color-gold-dim:      #C4B596;
  --color-gold-glow:     rgba(179,159,117,0.10);
  --color-gold-border:   #BA9D71;

  /* Text */
  --color-text-primary:  #111111;
  --color-text-secondary:#444444;
  --color-text-muted:    #666666;
  --color-text-dim:      #999999;

  /* Borders */
  --color-border-subtle: #E8E8E8;
  --color-border-default:#D4D4D4;
  --color-border-strong: #B0B0B0;
  --color-border-gold:   #BA9D71;

  /* PRD Tiers (semantic — never repurpose) — light-tinted for white surfaces */
  --color-prd-gray:            #E8EAF0;
  --color-prd-gray-text:       #5A6070;
  --color-prd-green:           #E6F4EC;
  --color-prd-green-text:      #1A7A3E;
  --color-prd-yellow:          #FFF8E6;
  --color-prd-yellow-text:     #9A7A0A;
  --color-prd-red:             #FDECEB;
  --color-prd-red-text:        #C0392B;
  --color-prd-escalated:       #F5ECF8;
  --color-prd-escalated-text:  #8E24AA;
  --color-prd-escalated-glow:  rgba(142,36,170,0.08);

  /* Status Dots */
  --color-dot-gray:      #9AA0B0;
  --color-dot-green:     #2D8A4E;
  --color-dot-yellow:    #D4A017;
  --color-dot-red:       #C0392B;
  --color-dot-escalated: #9B30B8;

  /* Typography */
  --font-brand:    'Verdana', sans-serif;
  --font-display:  'Verdana', sans-serif;
  --font-body:     'Verdana', sans-serif;
  --font-data:     'DM Mono', Consolas, monospace;
}
```

---

## SECTION 15 — DUAL-MODE DATA PIPELINE

Every feature must account for both modes. Never build a feature that only works in one.

### Mode A: Mac Development (Current)
- CSV file picker / drag-and-drop in the browser
- Client-side CSV parsing with vanilla JavaScript (no libraries)
- Parsed data populates the dashboard in real time
- Used for rapid iteration with real CSV exports

### Mode B: NMCI Production (Target)
- CSV data is manually converted to a JavaScript object
- Object is embedded directly in `app.js`
- No file system access, no `fetch()`, no dynamic loading
- Same UI, same computation, different data source

### Adapter Interface Contract
```javascript
const SideCarAdapter = {
  getSailors:    function() { /* returns array of sailor objects */ },
  getCommLog:    function(sailorId) { /* returns array of comm entries */ },
  getBillets:    function(commandId) { /* returns array of billet objects */ },
  getCommands:   function() { /* returns array of command objects */ },
  addCommEntry:  function(sailorId, entry) { /* append-only write */ }
};
```

Phase 1A: These functions return embedded synthetic data from `app.js`.
Phase 1B: These functions call Microsoft Graph API through GCC High.
**The interface contract does not change between phases.**

---

## SECTION 16 — LESSONS LEARNED REPOSITORY

Every session — clean completion or halt — generates a log entry.

| Content | Stored In | Feeds Back Into |
|---|---|---|
| Every halt event: trigger, directive violated, resolution | `lessons/halts.md` | Tier 1 directive amendments |
| Recurring QA failure patterns by dimension | `lessons/patterns.md` | TESTING.md threshold review |
| High-scoring session outputs (≥9 in all dimensions) | `lessons/exemplars.md` | Raised baseline for passing standard |

The system does not repeat errors it has already classified. It encodes the resolution and moves the standard forward.

---

## SECTION 17 — FINAL QUALITY CHECKLIST

Before finishing ANY output, confirm:

- [ ] No external dependencies without documented NMCI fallback
- [ ] No `fetch()` calls in any Phase 1A code
- [ ] All colors use CSS custom properties from the token system
- [ ] All numerical data uses `--font-data` (DM Mono)
- [ ] PRD colors match the locked 5-tier semantic system
- [ ] Font loading uses three-layer fallback (CDN → local → system)
- [ ] Works from `file://` path in Chrome/Edge
- [ ] Synthetic data only — no real names, SSNs, DODIDs, or PII
- [ ] Navigation between all pages is functional
- [ ] Page 1 passes the 90-second flag officer test
- [ ] Module boundary was not violated
- [ ] Session log entry was created

---

## SECTION 18 — NAVY TERMINOLOGY (QUICK REFERENCE)

### Organizational and Operational Terms

| Term | Definition |
|---|---|
| **Sailor** | The subject of SideCar data. Always capitalized. |
| **Detailer** | Navy assignment officer. Career advocate for the Sailor. The primary SideCar user. |
| **Placement Officer** | Command advocate (PERS-4013) managing billet alignment and fleet readiness. |
| **Placement Coordinator** | Cross-portfolio Placement Officer managing billet alignment across a community. |
| **Rating Evaluator** | Enterprise-scope analyst for community health and pipeline risk. |
| **CPPA** | Command Pay and Personnel Administrator. Primary interface between Sailors and Transaction Service Centers. |
| **CCC** | Command Career Counselor. |
| **MCA** | Manning Control Authority. Sets requisition priorities for forces under their purview. |
| **TYCOM** | Type Commander. Strategic leader monitoring aggregate force health. |
| **ISIC** | Immediate Superior in Command. |
| **PERS Code** | Organizational code within Navy Personnel Command (e.g., PERS-401, PERS-4013). |
| **Triad of Detailing** | The three functions of distribution: Allocation, Placement, Assignment. |
| **CNPC** | Commander, Navy Personnel Command. |
| **FRI** | Fleet Readiness Integrator. |
| **DMAP** | Detailing Marketplace Assignment Policy. Newer enlisted assignment methodology. |

### Personnel Data Terms (ODIS Field Names)

| Term | ODIS Field | Definition |
|---|---|---|
| **PRD** | `PRD` (Numeric 6, YYYYMM) | Projected Rotation Date. Core urgency driver. Triggers 12–15 month negotiation window. |
| **EAOS** | `EAOS` (Numeric 6) | End of Active Obligated Service. |
| **DODID** | `DODID` (Char 10) | DoD Identification Number. Unique key for all personnel data. |
| **PCS** | — | Permanent Change of Station. |
| **AQD** | `AQD` (Char 3) | Additional Qualification Designator. Skills beyond primary designator. |
| **NEC** | `NEC` (Char 4) | Navy Enlisted Classification. Enlisted skill identifier. |
| **DESIG** | `DESIG` (Char 4) | Designator. Four-digit code for primary naval specialty (e.g., 1110 = Surface Warfare). |
| **SUBSPEC** | `SUBSPEC` (Char 5) | Subspecialty code. Level of expertise from experience or education. |
| **ACC** | `ACC` (Char 3) | Accounting Category Code. Status: student, transient, operational, etc. |
| **NOBC** | `NOBC` (Char 4) | Naval Officer Billet Classification. Specialized qualification from billet service. |
| **PAYGRADE** | `PAYGRADE` (Numeric 3) | Military pay grade. Used for billet-rank matching validation. |
| **AVAIL.DT** | `AVAIL.DT` (Numeric 6, YYYYMM) | Availability Date. When member is available for transfer (distinct from PRD). |
| **ELD** | — | Estimated Loss Date. When a separating Sailor actually departs (accounts for terminal leave, SkillBridge). |
| **YCS** | — | Years of Commissioned Service (or Total Service for enlisted). |
| **MSO/MSR** | — | Minimum Service Obligation / Minimum Service Requirement. |

### Billet and Command Terms (ODIS Field Names)

| Term | ODIS Field | Definition |
|---|---|---|
| **Billet** | — | An assigned position within a command. |
| **UIC** | `AUIC/PUIC` (Char 5) | Unit Identification Code (Actual/Parent). |
| **BSC** | `BSC` (Numeric 5) | Billet Sequence Code. Primary key linking a manpower requirement to a person. |
| **ACTYCODE** | `ACTYCODE` (Char 10) | Activity Code. Ten-digit code: 4 type + 4 hull/squadron + 2 parent/component. |
| **GEOLOC** | `GEOLOC` (Char 8) | Geographic Location Code: 2 country + 2 state + 4 city. |
| **COG** | — | Cognizance Code. Identifies the command's organizational chain. |
| **AMSL** | — | Activity Manning Status Listing. |
| **O.BA / E.BA** | `O.BA/E.BA` (Numeric 5) | Officer/Enlisted Billets Authorized. Denominator for manning % calculation. |

### System and Integration Terms

| Term | Definition |
|---|---|
| **NSIPS** | Navy Standard Integrated Personnel System. Authoritative for personnel data. |
| **MNA** | MyNavy Assignment. Web-based marketplace interface for Sailors and commands. |
| **OAIS** | Officer Assignment Information System. Legacy mainframe for officer detailing. |
| **EAIS** | Enlisted Assignment Information System. Legacy mainframe for enlisted detailing. |
| **ODIS** | Online Distribution Information System. Ad-hoc query system for personnel/activity data. |
| **ADE** | Authoritative Data Environment. Modern containerized platform — Phase 1B integration target. |
| **Jupiter** | Navy enterprise data environment. Discoverable, API-first data access. |
| **TFMMS** | Total Force Management/Manpower Management System. Manpower requirements and balancing. |
| **NMCI** | Navy Marine Corps Intranet. The enterprise network environment. |
| **Nautilus** | Cloud-managed Virtual Desktop Infrastructure replacing NMCI seats. |
| **GCC High** | Microsoft 365 Government Community Cloud High. Phase 2 target. |
| **ATO** | Authority to Operate. Required for real data access. |
| **cATO** | Continuous Authority to Operate. Ongoing monitoring-based authorization. |
| **RMF** | Risk Management Framework. DoD security assessment process. |
| **CUI** | Controlled Unclassified Information. |
| **SORN** | System of Records Notice. Privacy Act compliance documentation. |
| **LIMDU** | Limited Duty. Medical hold status. |
| **ORDMOD** | Order Modification. |
| **FITREP** | Fitness Report. Officer evaluation record. |
| **EVAL** | Enlisted Evaluation. Enlisted performance record. |
| **COLO** | Colocation. Married military members assigned near each other. |
| **EFMP** | Exceptional Family Member Program. Special needs dependent support. |
| **OPSDEF** | Operational Deferment (e.g., pregnancy). |
| **HUMS** | Humanitarian Reassignment. |
| **SkillBridge** | DoD program allowing service members to intern with civilian companies up to 180 days before separation. |

### Status Flags (Quick-Flag Semantics)

| Flag Code | Icon | Meaning |
|---|:---:|---|
| **8 Flag** | ⚑ | Promotion Hold |
| **8,8 Flag** | ⚖ | Active Legal Investigation |
| **4 Flag** | 💐 | Colocation (spouse also in service) |
| **6 Flag** | 🏥 | Exceptional Family Member Program (EFMP) |
| **LIMDU** | ✚ | Limited Duty (medical hold) |
| **OPSDEF** | 👶 | Operational Deferment |

---

## SECTION 19 — LLM OPERATING CONTEXT

### Development Stack
- **Development LLM:** Google Gemini (executing code in Antigravity sessions)
- **Governance LLM:** Anthropic Claude (Project Compass — strategy, directive authoring, session planning)
- **IDE:** Antigravity (Directive Library loads automatically at session open)
- **Version Control:** GitHub (branch workflow defined in Section 8)

### Gemini-Specific Instructions

1. **Produce production-ready code.** Every code block must be copy-paste deployable. No pseudocode. No placeholder comments like "// add logic here." If you cannot complete a function, state what is missing and halt.

2. **Respect the flat-file constraint.** You will be tempted to suggest React, Vue, or a build system. Do not. Phase 1A is vanilla HTML/CSS/JS opened from `file://`. This is not a limitation to work around — it is a design decision driven by NMCI constraints.

3. **Use the token system.** Never output a hex color value in CSS or JavaScript outside the `:root` declaration. Reference the token. If a token does not exist for what you need, flag it — Tier 1 will decide whether to create one.

4. **Match the Covenant aesthetic.** Clean, white surfaces with purposeful brass gold accents. If your output looks like a cluttered SaaS dashboard, it is wrong. Aim for institutional clarity — restraint, precision, and density appropriate to mission-operations instruments.

5. **Scope your output to the Execution Script.** If the developer asks you to "also fix this other thing while you're in there" — that is scope creep. The other thing needs its own Execution Script. Flag it and stay in bounds.

6. **When in doubt, halt.** A halt is not a failure. It is the architecture working as designed. A guess that violates a constraint is a failure.

---

## SECTION 20 — SESSION LOAD PROTOCOL (PRAGMATIC)

> **Amended 2026-03-29:** Streamlined from full-ceremony model. Constitutional constraints remain non-negotiable. Ceremony reduced. The canonical version of this protocol lives in `.agents/workflows/session-load.md`.

This section governs how any AI assistant initializes a development session.

### Step 1: Governance Quick-Load

On session open, internalize the core governance documents:

**Always actively load:**
1. `Gemini.md` — This document (master session brief)
2. `directives/UI-UX.md` — Covenant design system
3. `workflow/MODULE-MAP.md` — Module routing table

**Internalized as background guardrails (read at least once, then referenced as needed):**
4. `directives/DEVELOPMENT.md`, `SECURITY.md`, `UX-PATTERNS.md`, `INTEGRATIONS.md`, `AUDIT.md`, `TESTING.md`, `ONBOARDING.md`
5. `lessons/halts.md`, `lessons/patterns.md`, `lessons/exemplars.md`

### Step 2: Confirm Load (One Line)

```
Governance loaded: Gemini.md, UI-UX.md, MODULE-MAP.md + 8 directives as guardrails. Ready.
```

### Step 3: Scope from Context

Instead of 6 formal scoping questions, infer scope from the developer's request and the active file context:

1. **Module:** Determine from the user's request and active files which module(s) are in play
2. **Boundary:** Confirm which files will be modified before writing code
3. **Constraints:** Note which constitutional constraints apply per MODULE-MAP.md

If scope is ambiguous, ask for clarification. If cross-module work is required, confirm the expanded boundary.

### Step 4: Execute

- Work within the declared module boundary
- Reference specific constraint IDs when making design decisions
- Use Navy terminology naturally (PRD, EAOS, PCS, etc.)
- Flag scope creep if the user asks to "also fix" something unrelated

### Step 5: Close (Code-Producing Sessions Only)

After substantive code changes, produce a brief boundary confirmation:

```
Session close:
  Files modified: [list]
  Constraints verified: [relevant C-xx IDs]
  Cross-module: [yes/no]
```

Session logs in `sessions/` are produced for milestone work. Minor fixes do not require formal session logs.

### Enforcement (Still Hard Blocks)

These rules are never relaxed:

- **C-01 through C-14** remain constitutional. Violations halt work.
- **On ambiguity:** halt and ask. Never interpret.
- **On completion of milestone work:** produce a session log per Section 9 format.

### In-Session Reset

A developer may say "new session" or "switch module" during an active session. When this happens:

1. Produce boundary confirmation for current work.
2. Re-confirm scope for the new module.
3. Apply the new module's focus routing per MODULE-MAP.md.

---

## SECTION 21 — CURRENT MODULE ARCHITECTURE

Module boundary rules from Section 4 apply. The canonical routing table with per-module constraints and focus directives lives in `workflow/MODULE-MAP.md`.

*SideCar Project v2.0 — NPC Agentic Lab — March 2026*
*Governed by: My Compass Tiered Agentic Development Framework v5.0 (DRY Refactor)*
