# Module Map — Directive Routing

> Canonical routing table for SideCar-Concept. Referenced by CLAUDE.md, .cursorrules, git hooks, and session scripts.
> Source of truth for module boundaries. If this file and Gemini.md disagree, Gemini.md wins — update this file.
> **Amended:** 2026-03-29 — Updated to reflect actual codebase structure (workspace.html consolidation)

---

## MOD-LAND: Landing / Intelligence Bar

- **File:** `app/landing.html`
- **Write:** `app/landing.html`
- **Read:** `app/style.css`, `app/app.js`
- **Focus Directives:** UI-UX.md, ONBOARDING.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-04, C-05, C-08, C-11, C-12, C-13
- **Context:** Entry point. Intelligence Bar search. 90-second flag officer test applies. Smart Pill operational summary.

---

## MOD-WORK: Detailer Workspace (Primary Work Surface)

- **File:** `app/workspace.html`
- **Write:** `app/workspace.html`
- **Read:** `app/style.css`, `app/app.js`
- **Focus Directives:** UI-UX.md, UX-PATTERNS.md, INTEGRATIONS.md, TESTING.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-03, C-04, C-08, C-09, C-11, C-12, C-13, C-14
- **Context:** Consolidated detailer/placement work surface. Roster table, communication panel, workflow pipeline, escalation flags, contact staleness heatmap. Uses SideCarAdapter.getSailors, getCommLog, getBillets, getCommands.
- **Operational Questions:**
  1. Who on my roster requires action right now? (PRD urgency + escalation flags)
  2. Which billets are at risk of going unfilled, and why?
  3. Which Sailors have I not contacted in 30+ days?
  4. What is my portfolio health — distribution vs. community demand?
  5. Which Sailors are approaching EAOS or sea/shore rotation?
  6. Where are misalignments and vacancies concentrated?

---

## MOD-MEMBER: Sailor Record View

- **File:** `app/member.html`
- **Write:** `app/member.html`
- **Read:** `app/style.css`, `app/app.js`
- **Focus Directives:** UI-UX.md, INTEGRATIONS.md, SECURITY.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-03, C-04, C-08, C-09, C-11, C-12, C-13
- **Context:** Individual Sailor profile. Personnel data, comm log history, assignment history, flag status. Navigated to from workspace roster.

---

## MOD-CMD: Command View

- **File:** `app/command.html`
- **Write:** `app/command.html`
- **Read:** `app/style.css`, `app/app.js`
- **Focus Directives:** UI-UX.md, INTEGRATIONS.md, TESTING.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-03, C-04, C-08, C-09, C-11, C-12, C-13, C-14
- **Context:** Command-level manning view. Manning percentage, billet occupancy, projected gaps. Uses SideCarAdapter.getCommands, getBillets.

---

## MOD-BILLET: Billet View

- **File:** `app/billet.html`
- **Write:** `app/billet.html`
- **Read:** `app/style.css`, `app/app.js`
- **Focus Directives:** UI-UX.md, INTEGRATIONS.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-03, C-04, C-08, C-09, C-11, C-12, C-13
- **Context:** Individual billet detail. Billet requirements, incumbent, match scoring. Navigated to from command view.

---

## MOD-ANLYT: Analytics Dashboard

- **File:** `app/analytics.html`
- **Write:** `app/analytics.html`
- **Read:** `app/style.css`, `app/app.js`
- **Focus Directives:** UI-UX.md, INTEGRATIONS.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-03, C-04, C-08, C-09, C-11, C-12, C-13, C-14
- **Context:** Distribution health metrics, trends, and community-level analytics. Uses SideCarAdapter.getSailors, getCommands, getBillets.

---

## MOD-CSS: Covenant Design System

- **File:** `app/style.css`
- **Write:** `app/style.css`
- **Read:** All `app/*.html` files
- **Focus Directives:** UI-UX.md, DEVELOPMENT.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-04, C-05, C-11, C-12, C-13, C-14
- **Context:** Single CSS file with token system. Light mode only (white + gold). NMCI rendering constraints (no nesting, no @container, no @layer, no Tailwind CDN). All colors via CSS custom properties in :root.

---

## MOD-JS: Shared Logic + Data + Adapter

- **File:** `app/app.js`
- **Write:** `app/app.js`
- **Read:** All `app/*.html` files
- **Focus Directives:** INTEGRATIONS.md, SECURITY.md, DEVELOPMENT.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-03, C-09, C-10
- **Context:** Contains SideCarAdapter interface, synthetic data, utility functions, PRD computation (LOCKED). No fetch(), no modules, no npm. Adapter interface contract must not change without Tier 1 authorization.

---

## MOD-DIR: Directive Library (Tier 1 Only)

- **Files:** `directives/*`, `WHITE_PAPER.md`, `ONBOARDING.md`
- **Write:** Tier 1 authorization required
- **Read:** All (loaded at every session start)
- **Focus Directives:** N/A — these ARE the directives
- **Key Constraints:** All (C-01 through C-14)
- **Context:** Governance documents. Amendments require Tier 1 review. Changes logged in CHANGELOG.md with directive version incremented.

---

## Cross-Module Authorization

When a task inherently requires changes across module boundaries (e.g., adding a new feature that touches both `workspace.html` and `style.css`), the developer declares the cross-module scope at session start. The agent confirms the expanded boundary and proceeds. No separate session is required for routine cross-cutting work. The boundary confirmation at session close documents which files were actually touched.
