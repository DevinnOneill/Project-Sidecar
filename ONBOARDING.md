# ONBOARDING — New Developer Guide

> **Welcome to SideCar — The Navy's Agentic Distribution Platform**
>
> Everything you need to get started is on this page.

---

## One Command Setup

Copy this, paste it in your terminal, hit Enter:

```bash
git clone https://github.com/DevinnOneill/Project-Sidecar.git && cd Project-Sidecar/sidecar-app && npm install && npm run dev
```

Install dependencies and start the Vite dev server. The app opens at `http://localhost:5173`.

---

## What is SideCar?

SideCar modernizes how the Navy distributes Sailors to assignments. Instead of the detailer passing the Sailor on, the Sailor is passed *through* the detailer with full continuity. No more gaps. No more lost context. Every handoff is tracked, every status is visible, and every decision has a data trail.

Right now, SideCar is a **proof of concept** running on synthetic data. No real Sailor records, no real names, no real SSNs — everything is fabricated with realistic structure so we can build and test before connecting to real systems.

**Who uses SideCar:**
- **Detailers** — The assignment officers who manage Sailor portfolios
- **Placement Coordinators** — Cross-portfolio visibility across an entire community
- **Rating Evaluators** — Enterprise-level distribution analysis

---

## How This Project Works

This project uses a **governed development framework**. In plain English:

1. **Every module has a boundary.** You work on ONE module at a time. If your task is in `src/Workspace/`, you cannot edit `src/index.css` in the same session. Need to touch another module? Open a new session.

2. **An AI assistant helps you code.** When you open this project in your IDE (Claude Code, Cursor, or VS Code with AI), the assistant automatically loads the project rules. It knows what you're allowed to do and guides you.

3. **Git hooks catch mistakes at commit time.** If you accidentally break a rule — like using a hardcoded color instead of a CSS token — the commit is rejected. The error message tells you exactly what's wrong and how to fix it.

4. **Experienced reviewers gate your code.** Your code goes to your branch first, then to a review branch, then to production. Nobody's code goes straight to production.

5. **If you break a rule, the system stops you.** This is called a **halt**. A halt is not a punishment — it's a guardrail. Read the message, fix the issue, try again.

---

## The 7 Rules

These are the constitutional constraints. They're non-negotiable — the git hooks enforce them automatically.

| Rule | What It Means | Why |
|------|-------------|-----|
| **No `fetch()` calls** | All data comes through `SideCarAdapter` in `src/services/SideCarAdapter.ts`. Never call `fetch()` directly. | SideCar must work offline on NMCI machines with no internet. |
| **No hardcoded colors** | Use CSS tokens like `var(--color-gold-primary)`. Never write hex values outside of `:root`. | Keeps the design system consistent. One change updates everything. |
| **No CSS nesting in build output** | Write flat CSS in component files | NMCI Chrome 110+ baseline for build output |
| **One module per session** | Working on `Workspace/`? Don't edit `index.css` in the same session. | Prevents conflicts when multiple developers work simultaneously. |
| **Synthetic data only** | No real names, SSNs, DODIDs, or command identifiers. | Phase 1A has no authorization for real data. Legal requirement. |
| **Light mode only** | White surfaces + brass gold accents. No dark mode. | Covenant design system specification. |
| **Adapter pattern only** | All data goes through `SideCarAdapter` in `src/services/SideCarAdapter.ts`. Never access data arrays directly. | The adapter swaps between synthetic, CSV, and API data seamlessly. |

---

## What's a Halt?

A halt means the system stopped you because something wasn't right. **This is good.** Here's what to do:

**AI halt** — You tried to edit a file outside your module:
```
HALT: index.css is MOD-CSS. You declared MOD-WORK.
Close this session and open a new one for MOD-CSS.
```
**Fix:** Stay in your module, or close and start a new session.

**Git hook halt** — You committed code with a violation:
```
HALT: C-11 violation in Workspace.css:45
No hardcoded hex values outside :root. Use CSS custom properties.
```
**Fix:** Replace the hex value with a CSS token, re-stage, and commit again.

**Format halt** — Your commit message was wrong:
```
HALT: Commit message does not match required format.
Required: [SC-YYYY-MMDD-NNN] MODULE-ID: Brief description
Example:  [SC-2026-0325-001] MOD-DET: Add PRD column
```
**Fix:** Re-commit with the correct format.

---

## Your First Session

Here's what happens when you open the project in your IDE after onboarding:

### 1. The AI loads governance
The AI reads all project rules automatically and confirms:
```
Loaded: WHITE_PAPER.md, Gemini.md, DEVELOPMENT.md, SECURITY.md,
        UI-UX.md, INTEGRATIONS.md, AUDIT.md, TESTING.md, ONBOARDING.md,
        MODULE-MAP.md. Ready.
```

### 2. The AI scopes your work
Before you write any code, the AI asks:
- **Which module?** (MOD-LAND, MOD-WORK, MOD-MEMBER, MOD-CMD, MOD-ANLYT, MOD-SEARCH, MOD-CSS, MOD-SVC)
- **What is your branch?** (dev-1 or dev-2)
- **What are you working on?** (one sentence)
- **What type of changes?** (Functionality, UI/UX, Bug Fix, or Refactor)
- **List your planned changes** (your "edit contract")

### 3. You code within your boundary
Write your code. The AI assists you. If you try to edit a file outside your module, the AI stops you.

### 4. You commit your work
```
[SC-YYYY-MMDD-NNN] MODULE-ID: Brief description
```
Example: `[SC-2026-0325-001] MOD-DET: Add PRD tier column to dashboard table`

### 5. You close the session
- **Clean break:** Close the IDE. Reopen for a fresh session.
- **Quick pivot:** Type "new session" in the AI chat to switch modules.

---

## Branch Workflow

Your code reaches production in stages. The project uses a **fixed branch model** — there are exactly four branches, all permanent:

```
dev-1 or dev-2  →  qa-staging  →  main
   (your team)      (Tier 1 QA)    (production)
```

Each dev branch is shared by two developers. You push to your assigned branch (dev-1 or dev-2), open a PR to qa-staging, and Tier 1 merges qa-staging into main. Nobody creates new branches. Nobody's code goes straight to `main`. Ever.

---

## Onboarding Gates (Formal)

No developer begins production work until these gates are cleared:

### Gate 0: Onboarding Agent
Run the one-command setup above. The script handles hooks, branch, dependencies, and orientation automatically.

### Gate 1: Directive Library Review
Read the directives in this order:
1. `directives/Gemini.md` — Master Session Brief
2. `directives/DEVELOPMENT.md` — Development Standards
3. `directives/SECURITY.md` — Data Boundary Law
4. `directives/UI-UX.md` — Covenant Design System
5. `directives/INTEGRATIONS.md` — Adapter Contracts
6. `directives/AUDIT.md` — Verification Protocol
7. `directives/TESTING.md` — Quality Gate

### Gate 2: Load Confirmation
Confirm understanding of:
- The 5 Covenant principles
- The 14 constitutional constraints
- Module boundaries for your assigned page
- Where data comes from and how to access it
- The 4 QA dimensions and pass threshold

### Gate 3: First Commit Review
Your first commit is reviewed by Tier 1 regardless of QA status. This is a calibration step — not a trust issue.

---

## The Team — Role Map

| Role | Authority | Constraint |
|---|---|---|
| Module Agent (developer + AI) | Feature code within assigned module | Active Execution Script required |
| Tier 1 (OSC Oneil) | Directive Library ownership. Sole merge authority. | Full program context |
| Orchestrator (AI session manager) | Session management. Execution Script generation. | No production code authority |
| Verifier (independent AI) | Pass/halt verdict on output. | AUDIT.md only. Zero execution context |
| QA Agent | Quality gate scoring. | TESTING.md thresholds |

---

## Development Environment

### On Your Mac (Current)
- Editor: VS Code, Cursor, or Claude Code
- AI: Loads governance automatically at session open
- Runtime: Node.js + npm
- Browser: Chrome (`http://localhost:5173` via `npm run dev`)
- Git: Clone, branch, commit, push
- Data: Synthetic generated by `src/services/SyntheticData.ts`

### On NMCI (Target — SPFx Deployment)
- Application deployed as SPFx web part. Build output targets Chrome 110+.

---

## Common Mistakes

| Mistake | What To Do Instead |
|---|---|
| Hardcoding a hex color | Use the CSS custom property from `:root` |
| Using `fetch()` to load data | Use `SideCarAdapter.ts` which returns synthetic data |
| Modifying `index.css` while on a component module | Request a separate session for CSS changes |
| Adding real Navy data for "testing" | Use synthetic data patterns from SECURITY.md |
| Using CSS nesting (`& .child`) | Use full selector paths |
| Skipping the QA gate for "small changes" | Run the full cycle. Small changes fail too. |
| Interpreting an ambiguous Execution Script | Halt and request clarification |
| Asking AI to "also fix this other thing" | Log it, finish current scope, open new session |

---

## Where to Find Things

| Need | Location |
|---|---|
| Master governance rules | `directives/Gemini.md` |
| All directives | `directives/` folder |
| Constitutional constraints | `directives/Gemini.md` Section 5 |
| Execution Script template | `directives/Gemini.md` Section 7 |
| Module-to-file mapping | `workflow/MODULE-MAP.md` |
| Past session logs | `sessions/` folder |
| Halt history | `lessons/halts.md` |
| Exemplar outputs | `lessons/exemplars.md` |
| Failure patterns | `lessons/patterns.md` |

---

## Glossary

| Term | What It Means |
|------|-------------|
| **Sailor** | The person whose data SideCar displays. Always capitalized. |
| **Detailer** | Navy assignment officer. The primary user of SideCar. |
| **PRD** | Projected Rotation Date. Drives the urgency colors. |
| **EAOS** | End of Active Obligated Service. |
| **Billet** | A job slot at a command. Can be filled or vacant. |
| **NMCI** | Navy Marine Corps Intranet. The target network. |
| **Adapter** | `SideCarAdapter` in `src/services/SideCarAdapter.ts`. All data flows through it. |
| **Module** | A React component directory or service with defined boundaries. One module per session. |
| **Session** | One work period on one module. Starts with scope, ends with commit. |
| **Halt** | System stopped you for a rule violation. Read the message, fix, retry. |
| **Directive** | A governance document in `directives/`. Defines rules for a specific area. |
| **Tier 1** | Human decision layer. Owns directives and merge authority. |
| **QA Gate** | Quality check: 4 dimensions, ≥7/10 in all to pass. |
| **Constitutional Constraint** | Non-negotiable rule (C-01 through C-14). Violation triggers a halt. |

---

*ONBOARDING.md v3.0 — SideCar Governed Development Framework*
