# Module Map — Directive Routing

> Canonical routing table for SideCar. Referenced by CLAUDE.md, .cursorrules, git hooks, and session scripts.
> Source of truth for module boundaries. If this file and Gemini.md disagree, Gemini.md wins — update this file.
> **Amended:** 2026-03-31 — Updated for Vite + React + TypeScript architecture

---

## MOD-LAND: Landing / Intelligence Bar

- **Files:** `sidecar-app/src/Landing/Landing.tsx`, `sidecar-app/src/Landing/Landing.css`
- **Write:** `sidecar-app/src/Landing/*`
- **Read:** `sidecar-app/src/index.css`, `sidecar-app/src/services/*`, `sidecar-app/src/models/*`
- **Focus Directives:** UI-UX.md, ONBOARDING.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-04, C-05, C-08, C-11, C-12, C-13
- **Context:** Entry point. Intelligence Bar search. 90-second flag officer test applies. Smart Pill operational summary. Role selector (Detailer/Placement modes).

---

## MOD-WORK: Detailer Workspace (Primary Work Surface)

- **Files:** `sidecar-app/src/Workspace/Workspace.tsx`, `sidecar-app/src/Workspace/Workspace.css`
- **Write:** `sidecar-app/src/Workspace/*`
- **Read:** `sidecar-app/src/index.css`, `sidecar-app/src/services/*`, `sidecar-app/src/models/*`
- **Focus Directives:** UI-UX.md, UX-PATTERNS.md, INTEGRATIONS.md, TESTING.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-03, C-04, C-08, C-09, C-11, C-12, C-13, C-14
- **Context:** Consolidated detailer/placement work surface. Three-tab interface: Roster table, Calendar week view, Action notifications. Slide-out comm panel. Uses SideCarAdapter.getSailors, getCommLog, getBillets, getCommands.
- **Operational Questions:**
  1. Who on my roster requires action right now? (PRD urgency + escalation flags)
  2. Which billets are at risk of going unfilled, and why?
  3. Which Sailors have I not contacted in 30+ days?
  4. What is my portfolio health — distribution vs. community demand?
  5. Which Sailors are approaching EAOS or sea/shore rotation?
  6. Where are misalignments and vacancies concentrated?

---

## MOD-MEMBER: Sailor Record View (Personnel)

- **Files:** `sidecar-app/src/Personnel/Personnel.tsx`, `sidecar-app/src/Personnel/Personnel.css`
- **Write:** `sidecar-app/src/Personnel/*`
- **Read:** `sidecar-app/src/index.css`, `sidecar-app/src/services/*`, `sidecar-app/src/models/*`
- **Focus Directives:** UI-UX.md, INTEGRATIONS.md, SECURITY.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-03, C-04, C-08, C-09, C-11, C-12, C-13
- **Context:** Individual Sailor profile with radar competitiveness chart, preference form responses, communication timeline. Integrates former detailer, placement, and billet detail views. Navigated to from workspace roster via React Router (`/personnel/:id`).

---

## MOD-CMD: Command View

- **Files:** `sidecar-app/src/Command/Command.tsx`, `sidecar-app/src/Command/Command.css`
- **Write:** `sidecar-app/src/Command/*`
- **Read:** `sidecar-app/src/index.css`, `sidecar-app/src/services/*`, `sidecar-app/src/models/*`
- **Focus Directives:** UI-UX.md, INTEGRATIONS.md, TESTING.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-03, C-04, C-08, C-09, C-11, C-12, C-13, C-14
- **Context:** Command-level manning view. Command cards with manning percentages, expandable detail showing billets and assigned personnel. Uses SideCarAdapter.getCommands, getBillets.

---

## MOD-ANLYT: Analytics Dashboard

- **Files:** `sidecar-app/src/Analytics/Analytics.tsx`, `sidecar-app/src/Analytics/Analytics.css`
- **Write:** `sidecar-app/src/Analytics/*`
- **Read:** `sidecar-app/src/index.css`, `sidecar-app/src/services/*`, `sidecar-app/src/models/*`
- **Focus Directives:** UI-UX.md, INTEGRATIONS.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-03, C-04, C-08, C-09, C-11, C-12, C-13, C-14
- **Context:** Portfolio dashboard with PRD distribution, contact health, pipeline stages, and rate mix bar charts. Summary cards with key metrics. Uses SideCarAdapter.getSailors, getCommands, getBillets.

---

## MOD-SEARCH: Advanced Search

- **Files:** `sidecar-app/src/AdvancedSearch/AdvancedSearch.tsx`, `sidecar-app/src/AdvancedSearch/AdvancedSearch.css`
- **Write:** `sidecar-app/src/AdvancedSearch/*`
- **Read:** `sidecar-app/src/index.css`, `sidecar-app/src/services/*`, `sidecar-app/src/models/*`
- **Focus Directives:** UI-UX.md, INTEGRATIONS.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-03, C-04, C-08, C-09, C-11, C-12, C-13
- **Context:** SQL-like query builder for sailors, billets, and commands. Dual-panel interface with live results table. Uses SideCarAdapter for all data queries.

---

## MOD-COMP: Shared Components

- **Files:** `sidecar-app/src/components/Topbar.tsx`, `sidecar-app/src/components/Topbar.css`
- **Write:** `sidecar-app/src/components/*`
- **Read:** `sidecar-app/src/index.css`, `sidecar-app/src/services/*`
- **Focus Directives:** UI-UX.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-04, C-05, C-11, C-12, C-13
- **Context:** Shared React components used across all pages. Topbar with global search, data mode indicator, and navigation. Changes here affect all pages — confirm cross-module impact.

---

## MOD-CSS: Covenant Design System

- **Files:** `sidecar-app/src/index.css`, component-specific CSS files
- **Write:** `sidecar-app/src/index.css`, `sidecar-app/src/App.css`
- **Read:** All component directories
- **Focus Directives:** UI-UX.md, DEVELOPMENT.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-04, C-05, C-11, C-12, C-13, C-14
- **Context:** CSS custom properties in `:root` (index.css) plus component-scoped CSS. Light mode only (white + gold). NMCI rendering constraints still apply to build output. All colors via CSS custom properties.

---

## MOD-SVC: Services + Data + Adapter

- **Files:** `sidecar-app/src/services/SideCarAdapter.ts`, `sidecar-app/src/services/PrdEngine.ts`, `sidecar-app/src/services/SyntheticData.ts`
- **Write:** `sidecar-app/src/services/*`
- **Read:** `sidecar-app/src/models/*`, all component directories
- **Focus Directives:** INTEGRATIONS.md, SECURITY.md, DEVELOPMENT.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-01, C-02, C-03, C-09, C-10
- **Context:** Contains SideCarAdapter TypeScript service, synthetic data generator, PRD computation engine (LOCKED), and TypeScript interfaces. Adapter interface contract must not change without Tier 1 authorization.

---

## MOD-MODEL: TypeScript Interfaces

- **Files:** `sidecar-app/src/models/ISailor.ts`
- **Write:** `sidecar-app/src/models/*`
- **Read:** All service and component directories
- **Focus Directives:** INTEGRATIONS.md, DEVELOPMENT.md
- **All Directives Loaded:** Yes (as background guardrails)
- **Key Constraints:** C-03, C-09
- **Context:** TypeScript interface definitions for Sailor, Command, Billet, CommEntry, and all domain types. Changes here affect the entire application — confirm with Tier 1.

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

When a task inherently requires changes across module boundaries (e.g., adding a new feature that touches both a component TSX and the shared services), the developer declares the cross-module scope at session start. The agent confirms the expanded boundary and proceeds. No separate session is required for routine cross-cutting work. The boundary confirmation at session close documents which files were actually touched.
