# SideCar

**The Navy's Agentic Distribution Platform**

Navy Personnel Command · NPC Agentic Lab · March 2026

---

## 🚀 New Here? One Command and You're In.

```bash
git clone https://github.com/matthewcla/SideCar-Concept.git && cd SideCar-Concept && bash scripts/onboard.sh
```

**That's it.** Copy-paste the command above, hit Enter, and the onboarding agent walks you through everything:

| What It Does | Time |
|---|---|
| Explains what SideCar is | 1 min |
| How the project works | 1 min |
| Sets up your workspace | automatic |
| Creates your personal branch | automatic |
| Opens SideCar in your browser | automatic |
| Teaches you the 7 rules | 2 min |
| Shows you how to save work | 1 min |
| Git commands cheat sheet | 1 min |

**No experience needed. Takes about 5 minutes. Everything is explained.**

> 📖 Also see: [START_HERE.md](START_HERE.md) — one command, one page.

---

## What is SideCar?

SideCar modernizes how the Navy distributes Sailors to assignments. Right now, Detailers juggle **4 disconnected tools** — MyNavy Assignment exports, NSIPS, Outlook, and local spreadsheets. SideCar puts it all in **one browser-based dashboard**.

**Who uses SideCar:**

Every stakeholder within the distribution workflow. 


**Current phase:** Phase 1A — Proof of Concept. All data is synthetic (fake but realistic). No real Sailor records.

---

## How This Project Works

This project uses a **governed development framework**. Here's the short version:

| Concept | What It Means |
|---------|---------------|
| **One file at a time** | You work on ONE file per session. Need another? New session. |
| **AI assistant** | Opens automatically in your editor. Knows the rules. Guides you. |
| **Guardrails** | Git hooks catch mistakes at commit time. Clear error messages. |
| **Code review** | Your branch → QA review → production. Nothing skips a step. |
| **Halts are good** | If the system stops you, it caught something. Read the message, fix it. |

### Branch Workflow

```
Your Branch  →  qa-staging  →  main
   (you)         (review)      (production)
```

Nobody's code goes straight to production. Ever.

---

## The 7 Rules

These are enforced automatically by git hooks and AI. You don't need to memorize them — the system will stop you and explain what's wrong.

| # | Rule | Why |
|---|------|-----|
| 1 | **No `fetch()` calls** | Must work on Navy NMCI computers with no internet |
| 2 | **No hardcoded colors** | Use `var(--color-gold-primary)` not `#B39F75` |
| 3 | **No npm / no frameworks** | No React, Vue, Tailwind. Vanilla HTML/CSS/JS only |
| 4 | **One module per session** | Prevents conflicts between developers |
| 5 | **Synthetic data only** | No real names, SSNs, DODIDs. Legal requirement. |
| 6 | **Light mode only** | White + brass gold = Covenant design system |
| 7 | **Adapter pattern only** | All data through `SideCarAdapter` in `app/app.js` |

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
SideCar-Concept/
├── START_HERE.md ............. 👋 New? Start here
├── README.md ................. You are reading this
├── ONBOARDING.md ............. The rules + onboarding guide
├── GIT.md .................... Git workflow guide (step-by-step)
├── WHITE_PAPER.md ............ Governance framework (the "why")
├── CHANGELOG.md .............. Merge history
├── index.html ................ Entry point (redirects to app/)
│
├── app/ ...................... All browser code
│   ├── landing.html .......... Landing / Role Selection
│   ├── detailer.html ......... Detailer Dashboard
│   ├── placement.html ........ Placement Coordinator
│   ├── analytics.html ........ Analytics Dashboard
│   ├── style.css ............. Covenant Design System (CSS tokens)
│   ├── app.js ................ Shared logic + data + adapter
│   └── fonts/ ................ Local font files (woff2)
│
├── scripts/ .................. Automation
│   ├── onboard.sh ............ Onboarding agent (run this first!)
│   ├── session-init.sh ....... Start a development session
│   ├── session-close.sh ...... Close and log a session
│   ├── validate-boundaries.sh  Module boundary checker
│   └── validate-constraints.sh Constitutional constraint checker
│
├── directives/ ............... Governance documents (the rules)
│   ├── Gemini.md ............. Master Session Brief
│   ├── DEVELOPMENT.md ........ Code standards, commit format
│   ├── SECURITY.md ........... Data boundary law
│   ├── UI-UX.md .............. Design system specs
│   ├── INTEGRATIONS.md ....... Adapter contracts
│   ├── AUDIT.md .............. Verification protocol
│   ├── TESTING.md ............ Quality gate
│   └── ONBOARDING.md ......... Developer onboarding checklist
│
├── .githooks/ ................ Git hooks (automatic guardrails)
│   ├── pre-commit ............ Boundary + constraint checks
│   ├── commit-msg ............ Commit format enforcement
│   └── post-checkout ......... Auto-triggers onboarding on clone
│
├── .github/workflows/ ........ Automated QA on GitHub
│   ├── qa-agent.yml .......... Runs on every PR
│   ├── verifier-feedback.yml .. Independent verification
│   └── eod-audit.yml ......... End-of-day audit
│
├── workflow/ .................. Module routing
│   └── MODULE-MAP.md ......... Which module owns which file
│
├── sessions/ ................. Session logs (append-only)
└── lessons/ .................. Learning from every session
    ├── halts.md .............. Halt events log
    ├── exemplars.md .......... High-scoring outputs
    └── patterns.md ........... Recurring failure patterns
```

---

## Design System Quick Reference

### Colors (use the variable, never the hex)

| Token | Use For |
|---|---|
| `--color-bg-void` | Page background |
| `--color-bg-surface` | Card/panel background (white) |
| `--color-bg-elevated` | Table headers, raised elements |
| `--color-gold-primary` | Signal — links, accents, borders |
| `--color-gold-bright` | Active nav, emphasized gold |
| `--color-text-primary` | Main body text (dark) |
| `--color-text-muted` | Secondary/inactive text |

### PRD Tier Colors (only for PRD urgency — never repurpose)

| Tier | Meaning |
|---|---|
| STABLE (9+ months) | Gray — no action needed |
| WATCH (6-9 months) | Green — monitor |
| URGENT (3-6 months) | Yellow — action soon |
| CRITICAL (0-3 months) | Red — action now |
| EXPIRED (past due) | Purple — escalated |

### Fonts

| Content Type | Token | Fallback |
|---|---|---|
| Main logotype | `var(--font-brand)` | Impact |
| Page titles, nav | `var(--font-display)` | system-ui, sans-serif |
| Body text | `var(--font-body)` | system-ui, sans-serif |
| Numbers, dates, codes | `var(--font-data)` | Consolas |

---

## Commit Format

```
[SC-YYYY-MMDD-NNN] MODULE-ID: Brief description
```

**Example:**
```
[SC-2026-0327-001] MOD-DET: Add PRD tier column to dashboard table
```

**Module IDs:**

| ID | File | What It Is |
|---|---|---|
| `MOD-LAND` | `app/landing.html` | Landing page |
| `MOD-DET` | `app/detailer.html` | Detailer Dashboard |
| `MOD-PLAC` | `app/placement.html` | Placement Coordinator |
| `MOD-ANLYT` | `app/analytics.html` | Analytics Dashboard |
| `MOD-CSS` | `app/style.css` | Design system |
| `MOD-JS` | `app/app.js` | Shared logic + data |

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
| **Session** | One work period on one module. Starts with scope, ends with commit. |
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
