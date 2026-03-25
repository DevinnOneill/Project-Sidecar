# ONBOARDING.md — New Developer Protocol

> **Version:** 1.0 | **Domain:** Developer Onboarding, First-Session Rules, Role Authority
> **Authority:** Tier 1
> **Loaded By:** Any session involving a new developer or agent

---

## 1. Before You Write Any Code

No developer begins production work until three gates are cleared:

### Gate 1: Directive Library Review
Read every file in this order. Confirm understanding of each.
1. `Gemini.md` — Master Session Brief
2. `directives/DEVELOPMENT.md` — Development Standards
3. `directives/SECURITY.md` — Data Boundary Law
4. `directives/UI-UX.md` — Covenant Design System
5. `directives/INTEGRATIONS.md` — Adapter Contracts
6. `directives/AUDIT.md` — Verification Protocol
7. `directives/TESTING.md` — Quality Gate
8. This file (`directives/ONBOARDING.md`)

### Gate 2: Load Confirmation Session
The Orchestrator (or Tier 1) conducts a verbal or written confirmation:
- Can you state the 5 Covenant principles?
- What are the 14 constitutional constraints?
- What is the module boundary for the page you will be working on?
- What happens when your Execution Script is ambiguous?
- Where does data come from and how do you access it?
- What are the four QA dimensions and the pass threshold?

### Gate 3: First Commit Review
Your first commit is reviewed by Tier 1 regardless of QA gate status. This is not a trust issue — it is a calibration step. Tier 1 confirms that your output matches the governance model before you operate independently.

## 2. The Development Team — Role Map

All 5 developers are:
- Subject matter experts in Navy personnel management and distribution
- The ultimate end users of what is being built
- Operating as Tier 3 Module Agents under the governance framework

Gemini is the development LLM executing code within Antigravity sessions. Claude provides strategic governance and directive authoring within the Project Compass environment.

| Role | Authority | Constraint |
|---|---|---|
| Module Agent (each developer + Gemini) | Feature code within assigned module boundary | Active Execution Script required. Boundary explicitly defined. |
| Tier 1 (OSC Oneil) | Directive Library ownership. Sole merge authority. | Full program context. Authors the directives. |
| Orchestrator (AI session manager) | Session management. Execution Script generation. | No production code authority. |
| Verifier (independent AI instance) | Pass/halt verdict on output. | AUDIT.md only. Zero execution context. |
| QA Agent (AI or human) | Quality gate scoring. | TESTING.md loaded. Thresholds confirmed. |

## 3. Your Development Environment

### On Your Mac (Current)
- Editor: VS Code, Cursor, or any text editor
- AI: Antigravity with Gemini (Directive Library loads automatically at session open)
- Browser: Chrome (test from both `file://` and local server)
- Git: Standard workflow — clone, branch, commit, push
- Data: CSV file picker for rapid testing, then embed in `app.js`

### On NMCI (Target — You Won't Have)
- No terminal. No Git. No IDE.
- Microsoft Office and a browser. That's it.
- Files open from SharePoint or local path.
- **Your code must work in this environment.** Test accordingly.

## 4. Your First Session — Step by Step

1. Clone the repo
2. Read `Gemini.md` cover to cover
3. Read all 7 directives in order
4. Open `page1.html` through `page6.html` in Chrome from `file://` path
5. Open `style.css` and `app.js` — familiarize with token system and adapter pattern
6. Receive your first Execution Script from the Orchestrator
7. Create your branch: `dev/[your-name]/[module-id]-[description]`
8. Open Antigravity — confirm `Gemini.md` loads automatically
9. Execute within your module boundary
10. Submit for QA → Human Review → Verifier → Tier 1 Merge
11. Your first commit gets extra Tier 1 review. This is normal.

## 5. Common Mistakes to Avoid

| Mistake | Why It's Wrong | What To Do Instead |
|---|---|---|
| Hardcoding a hex color | Violates C-11. Breaks single-source-of-truth. | Use the CSS custom property from `:root` |
| Using `fetch()` to load data | Violates C-02. Breaks on `file://` protocol. | Use `SideCarAdapter` which returns embedded data |
| Modifying `style.css` while working on a page module | Boundary violation. Your Execution Script authorizes one module. | Request a separate session for CSS changes |
| Adding real Navy data for "more realistic testing" | Violates C-03 and SECURITY.md. | Use synthetic data patterns from SECURITY.md Section 3 |
| Using CSS nesting (`& .child`) | Violates C-04. Not supported in Chrome 110. | Use full selector paths |
| Skipping the QA gate because "it's a small change" | No step in the 10-step cycle can be skipped. | Run the full cycle. Small changes fail too. |
| Interpreting an ambiguous Execution Script | Architectural violation. Interpretation at handoff is failure. | Halt and request clarification. |
| Asking Gemini to "also fix this other thing" | Scope creep. The other thing needs its own session. | Log it, finish current scope, open new session. |

## 6. Where to Find Things

| Need | Location |
|---|---|
| Master governance rules | `Gemini.md` |
| All directives | `directives/` folder |
| Design tokens (full) | SIDECAR_DESIGN v2.0 (project knowledge) |
| Constitutional constraints | `Gemini.md` Section 5 |
| Execution Script template | `Gemini.md` Section 7 |
| PRD computation logic | `Gemini.md` Section 13 |
| Session log format | `Gemini.md` Section 9 |
| Past session logs | `sessions/` folder |
| Halt history | `lessons/halts.md` |
| Exemplar outputs | `lessons/exemplars.md` |
| Failure patterns | `lessons/patterns.md` |

---

*ONBOARDING.md v1.0 — SideCar Directive Library*
