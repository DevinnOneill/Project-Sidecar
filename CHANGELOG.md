# CHANGELOG — SideCar MVP

> Every merge to `main` is recorded here with session ID, module, and summary.

---

## [Unreleased]

### 2026-03-29 — Governance Pragmatic Amendment

- **Session:** Governance Self-Audit + Tier 1 Authorized Amendment
- **Author:** Tier 1 (OSC Clark) + Claude Opus 4.6 (Antigravity)
- **Rationale:** Compliance audit revealed the full-ceremony governance model (14-doc sequential load, 6-question scoping conversation, formal Execution Script per session) was not being followed by any AI agent. The ceremony was designed for a multi-agent orchestrated workflow that does not match the actual single-agent direct-execution development model.
- **Approach:** Keep all constitutional constraints (C-01 through C-14) as hard blocks. Reduce ceremony overhead. Align module architecture with actual codebase.
- **Files Modified:**
  - `directives/Gemini.md` — §4 file map updated (page-numbered → descriptive names), §7 Execution Script made optional for routine work (formal template retained for milestones), §20 Session Load Protocol streamlined (scope-by-context replaces 6-question ceremony), §21 module IDs updated to match actual files
  - `workflow/MODULE-MAP.md` — Complete rewrite. Added MOD-WORK (workspace.html), MOD-MEMBER, MOD-CMD, MOD-BILLET. Removed MOD-P1 through MOD-P6. Added cross-module authorization clause.
  - `directives/DEVELOPMENT.md` — §6 file size targets updated (15KB→50KB for style.css, 20KB→80KB for workspace.html, 200KB→400KB total bundle)
  - `.agents/workflows/session-load.md` — Rewritten as pragmatic 5-step protocol (quick-load → confirm → scope from context → execute → close)
  - `CLAUDE.md` — Simplified to reference pragmatic protocol
  - `.cursorrules` — Simplified to reference pragmatic protocol, retained full C-01 through C-14 quick-reference
- **What Did NOT Change:**
  - Constitutional constraints C-01 through C-14 remain non-negotiable
  - Halt-on-ambiguity rule remains
  - Adapter-only data access (C-09) remains
  - PRD semantic lock (C-14) remains
  - Session logs still required for milestone work
  - QA gate scoring framework remains available for formal reviews
  - Verifier protocol remains available for high-stakes changes

### 2026-03-25 — Project Restructure + White/Gold Theme + CI/CD
- **Session:** SC-2026-0325-001
- **Author:** Tier 1 (OSC Oneil) + Claude Opus 4.6
- **Branch:** dev-Matthew → qa-staging (PR #1)
- **Actions:**
  - Restructured flat files into `app/` directory (landing, detailer, placement, analytics)
  - **C-13 Amended:** Dark/void → Light/white+gold (Tier 1 authorized)
  - Updated all design tokens: `style.css`, `Gemini.md` Section 14, `UI-UX.md` v2.0
  - New landing page with white/gold Covenant design (vanilla CSS, no Tailwind)
  - Added governance tooling: `CLAUDE.md`, `MODULE-MAP.md`, `WHITE_PAPER.md`, git hooks, validation scripts
  - Added `READ_BEFORE_YOU_CODE.md` — plain English developer onboarding
  - Added `GIT.md` — step-by-step git workflow guide
  - Created `qa-staging` branch with protection rules
  - Set up `CODEOWNERS` (@matthewcla as sole approver)
  - Branch protection on `main` and `qa-staging` (require PR + code owner review)
  - QA Agent GitHub Action: automated constraint checks + merge safety on every PR
  - Verifier Feedback GitHub Action: root-cause analysis + fix suggestions on failures
- **Directives Modified:**
  - `UI-UX.md` v1.0 → v2.0 (dark→light, Tailwind CDN prohibited)
  - `Gemini.md` C-13 amended, Section 14 tokens updated, Section 19 aesthetic guidance updated
  - `ONBOARDING.md` v1.0 → v1.1 (file paths updated)
- **Constraints Verified:** C-01, C-02, C-04, C-05, C-07, C-11, C-12, C-13 (amended), C-14

---

### 2026-03-25 — Repository Initialized
- **Session:** SC-2026-0325-000 (Repository Setup)
- **Author:** Tier 1
- **Action:** Initialized SideCar MVP repository with full Directive Library, governance structure, and Lessons Learned Repository
- **Files Created:**
  - `Gemini.md` — Master Session Brief v1.0
  - `directives/DEVELOPMENT.md` v1.0
  - `directives/SECURITY.md` v1.0
  - `directives/UI-UX.md` v1.0
  - `directives/INTEGRATIONS.md` v1.0
  - `directives/AUDIT.md` v1.0
  - `directives/TESTING.md` v1.0
  - `directives/ONBOARDING.md` v1.0
  - `lessons/halts.md`
  - `lessons/exemplars.md`
  - `lessons/patterns.md`
  - `sessions/README.md`
  - `style.css` — Covenant Design System (token foundation)
  - `app.js` — SideCarAdapter + synthetic data + PRD computation
  - `page1.html` through `page6.html` — Module scaffolds
  - `CHANGELOG.md`
  - `README.md`
