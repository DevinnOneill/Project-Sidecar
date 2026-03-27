# Module Map — Directive Routing

> Canonical routing table for Project-Sidecar. Referenced by CLAUDE.md, .cursorrules, git hooks, and session scripts.
> Source of truth for module boundaries. If this file and Gemini.md disagree, Gemini.md wins — update this file.

---

## MOD-LAND: Landing / Role Selection

- **File:** `app/landing.html`
- **Write:** `app/landing.html`
- **Read:** `app/style.css`, `app/app.js`
- **Focus Directives:** UI-UX.md, ONBOARDING.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-04, C-05, C-08, C-11, C-12, C-13
- **Context:** Entry point for role selection. 90-second flag officer test applies.

---

## MOD-DET: Detailer Dashboard

- **File:** `app/detailer.html`
- **Write:** `app/detailer.html`
- **Read:** `app/style.css`, `app/app.js`
- **Focus Directives:** UI-UX.md, INTEGRATIONS.md, TESTING.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-03, C-04, C-08, C-09, C-11, C-12, C-13, C-14
- **Context:** Primary work surface for detailers. PRD urgency, contact history, billet alignment. Uses SideCarAdapter.getSailors, getCommLog.
- **Operational Questions:**
  1. Who on my roster requires action right now?
  2. Which billets are at risk of going unfilled?
  3. Which Sailors have I not contacted in 30+ days?
  4. What is my portfolio health?
  5. Which Sailors are approaching EAOS or sea/shore rotation?

---

## MOD-PLAC: Placement Coordinator

- **File:** `app/placement.html`
- **Write:** `app/placement.html`
- **Read:** `app/style.css`, `app/app.js`
- **Focus Directives:** UI-UX.md, INTEGRATIONS.md, TESTING.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-03, C-04, C-08, C-09, C-11, C-12, C-13, C-14
- **Context:** Cross-portfolio view. Community health, vacancies, manning risk. Uses SideCarAdapter.getSailors, getCommands, getBillets.
- **Operational Questions:**
  1. Where are misalignments and vacancies concentrated?
  2. Which Sailors need immediate action regardless of detailer?
  3. What is the manning percentage and projected risk per command?
  4. Are candidates aligned to billets at correct rate and pay grade?

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
