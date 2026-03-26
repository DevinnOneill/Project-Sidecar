# READ BEFORE YOU CODE

> This is the first thing you read after cloning this repo. Everything else follows from here.

---

## What is SideCar?

SideCar is a tool that modernizes how the Navy distributes its Sailors to assignments. The core idea: instead of the detailer passing the Sailor on, the Sailor is passed *through* the detailer with full continuity. No more gaps. No more lost context. Every handoff is tracked, every status is visible, and every decision has a data trail.

Right now, SideCar is a **proof of concept** running on synthetic data. No real Sailor records, no real names, no real SSNs — everything is fabricated with realistic structure so we can build and test the tool before connecting to real systems.

**Who uses SideCar:**
- **Detailers** — The assignment officers who manage Sailor portfolios
- **Placement Coordinators** — Cross-portfolio visibility across an entire community
- **Rating Evaluators** — Enterprise-level distribution analysis

---

## How This Project Works

This project uses a **governed development framework**. Here's what that means in plain English:

1. **Every file has a boundary.** You work on ONE file at a time. If your task is on `app/detailer.html`, you cannot edit `app/style.css` in the same session. Need to touch another file? Open a new session.

2. **An AI assistant helps you code.** When you open this project in your IDE (Claude Code, Cursor, or VS Code with AI), the assistant automatically loads the project rules. It knows what you're allowed to do and what you're not. It will guide you.

3. **Git hooks catch mistakes at commit time.** If you accidentally break a rule — like using a hardcoded color instead of a CSS token — the commit will be rejected. The error message tells you exactly what's wrong and how to fix it.

4. **Experienced reviewers gate your code.** Your code goes to your own branch first, then to a review branch where senior team members check it, and only then to production. Nobody's code goes straight to production.

5. **If you break a rule, the system stops you.** This is called a **halt**. A halt is not a punishment — it's a guardrail. The system caught something before it became a problem. Read the message, fix the issue, and try again.

---

## Setup (Do This First)

After cloning the repo, run these commands in your terminal:

```bash
# 1. Enter the project folder
cd Project-Sidecar

# 2. Activate the git hooks (one-time setup)
git config core.hooksPath .githooks

# 3. Open in your IDE
#    For Claude Code: claude .
#    For Cursor: cursor .
#    For VS Code: code .
```

That's it. The AI assistant and git hooks are now active.

---

## Your First Session

Here's what happens when you open the project in your IDE:

### 1. The AI loads governance
The AI assistant reads all the project rules (the white paper, directives, and module map). It confirms what it loaded:

```
Loaded: WHITE_PAPER.md, Gemini.md, DEVELOPMENT.md, SECURITY.md,
        UI-UX.md, INTEGRATIONS.md, AUDIT.md, TESTING.md, ONBOARDING.md,
        MODULE-MAP.md. Ready.
```

### 2. The AI conducts a scoping conversation
Before you write any code, the AI asks you a series of questions to understand exactly what you'll be doing:
- **What is your name?**
- **Which module?** (MOD-LAND, MOD-DET, MOD-PLAC, MOD-ANLYT, MOD-CSS, MOD-JS)
- **What is your branch?** (e.g., `dev/jones/mod-det-prd-column`)
- **What are you working on?** (one sentence)
- **What type of changes?** (Functionality, UI/UX, Bug Fix, or Refactor)
- **List the specific changes you plan to make.** (e.g., "adding a PRD column to the dashboard table," "changing the sort order")

### 3. The AI confirms your scope and focuses
The AI summarizes everything back to you — your name, branch, module, goal, change type, and planned changes. You confirm, and then the AI:
- Loads the specific rules for your module (e.g., MOD-DET focuses on UI/UX and integration rules)
- Keeps all other rules as background guardrails
- Uses your listed changes as an **edit contract** — it will flag anything that drifts outside what you declared

### 4. You code within your boundary
Write your code. The AI assists you. If you try to edit a file outside your module, the AI will stop you and explain why.

### 5. You commit your work
When you're ready to save, commit with the required format:

```
[SC-YYYY-MMDD-NNN] MODULE-ID: Brief description
```

Example:
```
[SC-2026-0325-001] MOD-DET: Add PRD tier column to dashboard table
```

If the format is wrong, the git hook rejects the commit and shows you the correct format.

### 6. You close the session
When you're done with your task, either:
- **Close the IDE and reopen** for a completely fresh session
- **Say "new session"** in the AI chat for a quick pivot to a different module

---

## The Rules (Plain English)

These are the constitutional constraints. They're non-negotiable — the git hooks enforce them.

| Rule | What It Means | Why |
|------|-------------|-----|
| **No `fetch()` calls** | All data comes through the SideCarAdapter in `app/app.js`. Never call `fetch()` directly. | SideCar must work from `file://` protocol on NMCI machines with no internet. |
| **No hardcoded colors** | Use CSS tokens like `var(--color-gold-primary)`. Never write hex values like `#B88E48` outside of `:root`. | Keeps the design system consistent. One change in `:root` updates everything. |
| **No CSS nesting, @layer, @container** | Write flat CSS only. No `&` selectors, no modern CSS features. | NMCI machines run older browsers (Chrome 110+). These features aren't supported. |
| **One module per session** | If you're working on `app/detailer.html`, don't edit `app/style.css` or `app/app.js`. | Prevents conflicts when multiple developers work simultaneously. |
| **Synthetic data only** | No real names, SSNs, DODIDs, or command identifiers. Use the patterns in `app/app.js`. | Phase 1A has no authorization for real data. Legal requirement. |
| **Dark mode only** | No light mode. No `prefers-color-scheme`. The dark interface IS the design. | Covenant design system specification. |
| **Adapter pattern only** | All data access goes through `SideCarAdapter`. Never access `SYNTHETIC_SAILORS` directly from pages. | The adapter swaps between synthetic, CSV, and API data without changing page code. |

---

## What's a Halt?

A halt means the system stopped you because something wasn't right. **This is good.** Here's what happens:

**AI halt:** You tried to edit a file outside your module. The AI says:
```
HALT: style.css is MOD-CSS. You declared MOD-DET.
Close this session and open a new one for MOD-CSS.
```
**Fix:** Stay in your module, or close and start a new session for the other module.

**Git hook halt:** You tried to commit code with a violation. The terminal says:
```
HALT: C-11 violation in detailer.html:45
No hardcoded hex values outside :root. Use CSS custom properties.
```
**Fix:** Replace the hex value with a CSS token, re-stage, and commit again.

**Format halt:** Your commit message was wrong. The terminal says:
```
HALT: Commit message does not match required format.
Required: [SC-YYYY-MMDD-NNN] MODULE-ID: Brief description
Example:  [SC-2026-0325-001] MOD-DET: Add PRD column
```
**Fix:** Re-commit with the correct format.

---

## How to Switch Tasks

**Option A — Clean break:** Close the IDE entirely. Reopen it. The AI reloads everything fresh and asks what you're working on next.

**Option B — Quick pivot:** Type "new session" or "switch module" in the AI chat. The AI re-confirms your new scope before continuing.

Either way, you always declare your module and task before the AI lets you code.

---

## Branch Workflow

Your code reaches production in stages:

```
dev/[your-name]/[module-id]-[description]     ← You work here
        ↓ (push)
qa-staging                                     ← Senior devs review
        ↓ (merge — reviewers only)
main                                           ← Production
```

1. **Create your branch:** `git checkout -b dev/jones/mod-det-prd-column`
2. **Write code, commit, push** to your branch
3. **Senior reviewers** check your work in `qa-staging`
4. **Select team members** merge approved code to `main`

Nobody's code goes straight to `main`. Ever.

---

## File Map

```
Project-Sidecar/
├── README.md                   ← Project overview
├── READ_BEFORE_YOU_CODE.md     ← You are here
├── WHITE_PAPER.md              ← Governance framework (read this for the why)
├── CLAUDE.md                   ← Points Claude Code to directives/Gemini.md
├── .cursorrules                ← Points Cursor to directives/Gemini.md
├── CHANGELOG.md                ← Merge history
├── index.html                  ← Redirects to app/landing.html
│
├── app/                        ← All browser code lives here
│   ├── landing.html            ← MOD-LAND: Landing / Role Selection
│   ├── detailer.html           ← MOD-DET: Detailer Dashboard
│   ├── placement.html          ← MOD-PLAC: Placement Coordinator
│   ├── analytics.html          ← MOD-ANLYT: Analytics Dashboard
│   ├── style.css               ← MOD-CSS: Covenant Design System
│   ├── app.js                  ← MOD-JS: Shared logic + data + adapter
│   └── fonts/                  ← Local font files (woff2)
│
├── directives/                 ← The rules (Tier 1 owns these)
│   ├── Gemini.md               ← Master session brief (the AI reads this first)
│   ├── DEVELOPMENT.md          ← Code standards, commit format, branch workflow
│   ├── SECURITY.md             ← Data boundary law (synthetic only in Phase 1A)
│   ├── UI-UX.md                ← Covenant design system (dark mode, tokens, fonts)
│   ├── INTEGRATIONS.md         ← Adapter layer contracts
│   ├── AUDIT.md                ← Independent verification protocol
│   ├── TESTING.md              ← QA gate (4 dimensions, ≥7/10 to pass)
│   └── ONBOARDING.md           ← Developer onboarding checklist
│
├── workflow/                   ← Automation config
│   └── MODULE-MAP.md           ← Which module owns which file
│
├── lessons/                    ← Learning from every session
│   ├── halts.md                ← Halt events log
│   ├── exemplars.md            ← High-scoring outputs
│   └── patterns.md             ← Recurring failure patterns
│
├── sessions/                   ← Session logs (one per session, append-only)
│
├── .githooks/                  ← Git hooks (boundary + constraint enforcement)
├── scripts/                    ← Session init/close scripts
├── .vscode/                    ← VS Code workspace tasks
└── .cursor/rules/              ← Cursor auto-routing rules
```

---

## Glossary

| Term | What It Means |
|------|-------------|
| **Sailor** | The person whose data SideCar displays. Always capitalized. |
| **Detailer** | Navy assignment officer. The primary user of SideCar. |
| **PRD** | Projected Rotation Date. When a Sailor is scheduled to move to a new assignment. Drives the urgency colors in SideCar. |
| **EAOS** | End of Active Obligated Service. When a Sailor's enlistment contract ends. |
| **Billet** | A job slot at a command. Can be filled or vacant. |
| **NMCI** | Navy Marine Corps Intranet. The network environment SideCar must run on. |
| **Adapter** | The `SideCarAdapter` in `app/app.js`. All data flows through it. Currently returns synthetic data. Will later connect to real systems. |
| **Module** | A single page or file with defined boundaries. One module per session. |
| **Session** | One work period on one module. Starts with scope declaration, ends with a commit. |
| **Halt** | The system stopped you because a rule was violated. Read the message, fix the issue, try again. |
| **Directive** | A governance document in the `directives/` folder. Defines the rules for a specific area. |
| **Tier 1** | The human decision layer. Owns the directives and merge authority. |
| **QA Gate** | Quality check scored on 4 dimensions (Clarity, Specificity, Chain-Readiness, Output Definition). Must score ≥7/10 in all. |
| **Constitutional Constraint** | A non-negotiable rule (C-01 through C-14). Violation triggers a halt. |

---

## Questions?

Read `directives/Gemini.md` for the full technical governance framework. Read `WHITE_PAPER.md` for why the architecture works the way it does. Read the relevant directive in `directives/` for deep-dive rules on any specific area.

If something is unclear, ask your AI assistant — it has the full governance context loaded.
