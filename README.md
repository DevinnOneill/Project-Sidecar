# SideCar

**Personnel Distribution Intelligence Platform**
Navy Personnel Command · NPC Agentic Lab · March 2026

---

## What is SideCar?

SideCar modernizes how the Navy distributes Sailors to assignments. Instead of the detailer passing the Sailor on, the Sailor is passed *through* the detailer with full continuity. No more gaps. No more lost context. Every handoff is tracked, every status is visible, and every decision has a data trail.

Right now, SideCar is a **proof of concept** on synthetic data. No real Sailor records — everything is fabricated with realistic structure so we can build and test before connecting to real systems.

**Who uses SideCar:**
- **Detailers** — Assignment officers who manage Sailor portfolios
- **Placement Coordinators** — Cross-portfolio visibility across a community
- **Rating Evaluators** — Enterprise-level distribution analysis

---

## Quick Start (< 2 minutes)

**See the app right now:**

```bash
# Mac
open index.html

# Windows
start index.html
```

Or just double-click `index.html` in your file explorer. Every page links to every other page. Click around — nothing will break.

---

## New Developer? Start Here

### Step 1: Clone and set up

```bash
git clone https://github.com/DevinnOneill/Project-Sidecar.git
cd Project-Sidecar
git config core.hooksPath .githooks    # activates safety hooks
```

### Step 2: Open in your browser

```bash
open index.html
```

Click through all 4 pages. You'll see the white and gold interface — that's the Covenant design system.

### Step 3: Open in your editor

Open the `Project-Sidecar` folder in VS Code, Cursor, or Claude Code. The AI assistant loads project rules automatically.

### Step 4: Read the docs (30 min, required)

| Order | File | What You'll Learn |
|:---:|---|---|
| 1 | [GIT.md](GIT.md) | **Start here** — full git workflow, how to commit, push, open PRs |
| 2 | [directives/Gemini.md](directives/Gemini.md) | Master governance — module boundaries, constraints, design tokens |
| 3 | [directives/DEVELOPMENT.md](directives/DEVELOPMENT.md) | Code standards, commit format, branch rules |
| 4 | [directives/SECURITY.md](directives/SECURITY.md) | Data rules — synthetic only, what's prohibited |
| 5 | [directives/UI-UX.md](directives/UI-UX.md) | Design system — colors, typography, components |
| 6 | [directives/INTEGRATIONS.md](directives/INTEGRATIONS.md) | How `SideCarAdapter` works |
| 7 | [directives/ONBOARDING.md](directives/ONBOARDING.md) | First-day checklist, common mistakes |

### Step 5: Create your branch and start coding

```bash
git checkout -b dev/yourname/mod-det-your-task
```

Your AI assistant will scope your session before you write any code. See [GIT.md](GIT.md) for the full step-by-step workflow.

---

## How This Project Works

### Governed Development
1. **Every file has a boundary.** You work on ONE file at a time. Need another file? New session.
2. **An AI assistant helps you code.** It loads the rules automatically and guides you.
3. **Git hooks catch mistakes at commit.** Wrong color format? Commit rejected with a clear fix.
4. **QA Agent reviews every PR automatically.** Posts a pass/fail report on your PR within minutes.
5. **Reviewers gate your code.** Nothing reaches production without human approval.

### The Rules (Quick Version)

| Rule | What It Means |
|------|-------------|
| **No `fetch()`** | All data comes through `SideCarAdapter` in `app/app.js` |
| **No hex colors in CSS** | Use `var(--color-gold-primary)`, not `#B39F75` |
| **No npm / no frameworks** | No React, Vue, Tailwind. Vanilla HTML/CSS/JS only |
| **One module per session** | Working on `detailer.html`? Can't edit `style.css` too |
| **Synthetic data only** | No real names, SSNs, DODIDs, or commands |
| **Light mode only** | White surfaces + brass gold accents. No dark mode |
| **Adapter pattern only** | All data through `SideCarAdapter`. Never hardcode values |

### Branch Workflow

```
dev/yourname/task  →  qa-staging  →  main
     (you)             (QA review)     (Tier 1 merge)
```

Every PR triggers the automated QA Agent. See [GIT.md](GIT.md) for the complete guide.

---

## Tech Stack

**Intentionally simple.** No server. No install step. No terminal needed to run it.

| Layer | Technology | Why |
|---|---|---|
| **Structure** | HTML5 | Semantic markup. No framework. |
| **Styling** | CSS3 | Single `app/style.css`. CSS custom properties. No Sass/Tailwind. |
| **Logic** | Vanilla JS (ES6) | Single `app/app.js`. No React/Vue/npm. |
| **Data** | Embedded in `app/app.js` | Synthetic. No database. No API calls. |
| **Fonts** | Local `.woff2` files | System fallbacks if missing. |
| **QA** | GitHub Actions | Automated constraint + merge checks on every PR. |

**Why so simple?** SideCar must run on NMCI machines — no terminal, no Node.js, no internet. The entire app is a folder you can put on a USB drive.

---

## File Map

```
Project-Sidecar/
├── README.md ................. You are here
├── GIT.md .................... Git workflow guide (start here for git)
├── WHITE_PAPER.md ............ Governance framework (the "why")
├── CLAUDE.md ................. Claude Code session loader
├── index.html ................ Entry point (redirects to app/)
│
├── app/ ...................... All browser code
│   ├── landing.html .......... MOD-LAND: Landing / Role Selection
│   ├── detailer.html ......... MOD-DET: Detailer Dashboard
│   ├── placement.html ........ MOD-PLAC: Placement Coordinator
│   ├── analytics.html ........ MOD-ANLYT: Analytics Dashboard
│   ├── style.css ............. MOD-CSS: Covenant Design System
│   ├── app.js ................ MOD-JS: Shared logic + data + adapter
│   └── fonts/ ................ Local font files (woff2)
│
├── directives/ ............... Governance documents (Tier 1 owns these)
│   ├── Gemini.md ............. Master Session Brief
│   ├── DEVELOPMENT.md ........ Code standards
│   ├── SECURITY.md ........... Data boundary law
│   ├── UI-UX.md .............. Design system
│   ├── INTEGRATIONS.md ....... Adapter contracts
│   ├── AUDIT.md .............. Verification protocol
│   ├── TESTING.md ............ Quality gate
│   └── ONBOARDING.md ......... Developer onboarding
│
├── .github/workflows/ ........ Automated QA
│   └── qa-agent.yml .......... Runs on every PR
│
├── .githooks/ ................ Git hooks (boundary + constraint checks)
├── scripts/ .................. Session init/close scripts
├── sessions/ ................. Session logs (append-only)
└── lessons/ .................. Halts, exemplars, failure patterns
```

---

## Design System Cheat Sheet

### Colors (use the variable, never the hex)
| Token | Use For |
|---|---|
| `--color-bg-void` | Page background (#FAFAFA) |
| `--color-bg-surface` | Card/panel background (white) |
| `--color-bg-elevated` | Table headers, raised elements |
| `--color-gold-primary` | Signal — links, accents, borders |
| `--color-gold-bright` | Active nav, emphasized gold |
| `--color-text-primary` | Main body text (dark) |
| `--color-text-muted` | Secondary/inactive text |

### PRD Tier Colors (only for PRD urgency — never repurpose)
| Tier | Badge Class | Dot Class |
|---|---|---|
| STABLE (9+ months) | `.prd-badge--stable` | `.status-dot--gray` |
| WATCH (6-9 months) | `.prd-badge--watch` | `.status-dot--green` |
| URGENT (3-6 months) | `.prd-badge--urgent` | `.status-dot--yellow` |
| CRITICAL (0-3 months) | `.prd-badge--critical` | `.status-dot--red` |
| EXPIRED (past due) | `.prd-badge--expired` | `.status-dot--escalated` |

### Fonts
| Content Type | Token | Fallback |
|---|---|---|
| Page titles, nav | `var(--font-display)` | Impact |
| Body text | `var(--font-body)` | Georgia |
| Numbers, dates, codes | `var(--font-data)` | Consolas |

---

## Microsoft 365 Integration Roadmap

The adapter pattern makes this seamless. Pages never know where data comes from:

```
Phase 1A (now):   getSailors() → embedded JS array
Phase 1B (next):  getSailors() → Microsoft Graph API
Phase 2 (target): getSailors() → Dataverse API
```

| Phase | Data | Gate to Next |
|---|---|---|
| **1A** (current) | Synthetic only | COMNAVPERSCOM sponsorship + GCC High tenant |
| **1B** | Real Sailor records (pilot) | RMF assessment initiated |
| **2** | Full Navy data | ATO issued through DoD RMF |

---

## Glossary

| Term | Plain English |
|---|---|
| **Sailor** | Person whose data SideCar displays. Always capitalized. |
| **Detailer** | Assignment officer — primary SideCar user. |
| **PRD** | Projected Rotation Date — drives urgency colors. |
| **Billet** | A job slot at a command. |
| **NMCI** | Navy Marine Corps Intranet — the target network. |
| **Adapter** | `SideCarAdapter` in `app/app.js` — the only way to access data. |
| **Module** | A single page/file with defined boundaries. |
| **Halt** | System stopped you for a rule violation. Read the message, fix, retry. |
| **Tier 1** | Human decision layer. Owns directives and merge authority. |

---

## Need Help?

| Question | Where to Look |
|---|---|
| How do I use git? | [GIT.md](GIT.md) |
| What CSS class do I use? | `app/style.css` or [UI-UX.md](directives/UI-UX.md) |
| How do I get data? | `app/app.js` → `SideCarAdapter.getSailors()` |
| What are the rules? | [Gemini.md](directives/Gemini.md) Section 5 |
| My commit was rejected | Read the error — hooks tell you exactly what's wrong |
| My PR failed QA | Fix the violations, push again — QA re-runs automatically |

---

*Governed by: My Compass Tiered Agentic Development Framework v4.0*
