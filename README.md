# SideCar

**The Navy's Agentic Distribution Platform**

Navy Personnel Command · NPC Agentic Lab · March 2026

---

## 🚀 New Here? One Command and You're In.

```bash
git clone https://github.com/DevinnOneill/Project-Sidecar.git && cd Project-Sidecar/sidecar-app && npm install && npm run dev
```

**That's it.** Copy-paste the command above, hit Enter, and the onboarding agent walks you through everything:

| What It Does | Time |
|---|---|
| Explains what SideCar is | 1 min |
| How the project works | 1 min |
| Sets up your workspace | automatic |
| Switches to your assigned branch | automatic |
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
dev-1 or dev-2  →  qa-staging  →  main
  (your team)       (review)      (production)
```

The project uses exactly four fixed branches. Developers push to their assigned branch (dev-1 or dev-2). Nobody creates new branches. Nobody's code goes straight to production. Ever.

---

## The 7 Rules

These are enforced automatically by git hooks and AI. You don't need to memorize them — the system will stop you and explain what's wrong.

| # | Rule | Why |
|---|------|-----|
| 1 | **No `fetch()` calls** | Must work on Navy NMCI computers with no internet |
| 2 | **No hardcoded colors** | Use `var(--color-gold-primary)` not `#B39F75` |
| 3 | **Vite + React + TypeScript only** | No additional frameworks without Tier 1 authorization |
| 4 | **One module per session** | Prevents conflicts between developers |
| 5 | **Synthetic data only** | No real names, SSNs, DODIDs. Legal requirement. |
| 6 | **Light mode only** | White + brass gold = Covenant design system |
| 7 | **Adapter pattern only** | All data through `SideCarAdapter` in `src/services/SideCarAdapter.ts` |

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | React 19 + TypeScript | Component-based architecture with full type safety. |
| **Build Tool** | Vite | Fast HMR development, optimized production builds. |
| **Routing** | React Router v7 | Client-side routing between modules. |
| **Animation** | Framer Motion | Declarative animations for state transitions. |
| **Styling** | CSS Custom Properties | Component-scoped CSS files with design tokens in `src/index.css`. |
| **Data** | Synthetic in `SyntheticData.ts` | No database. Adapter pattern for future Graph API. |
| **Fonts** | Inter + DM Mono | System fallbacks if missing. |
| **Deployment** | SPFx / Microsoft 365 | Target: NMCI via SharePoint Framework web parts. |

**Why this stack?** SideCar targets SPFx deployment on Microsoft 365 for NMCI. Vite + React + TypeScript gives us component-based architecture, full type safety, and optimized builds that compile to Chrome 110+ compatible output.

---

## File Map

```
Project-Sidecar/
├── START_HERE.md ............. New? Start here
├── README.md ................. You are reading this
├── ONBOARDING.md ............. The rules + onboarding guide
├── GIT.md .................... Git workflow guide
├── WHITE_PAPER.md ............ Governance framework
├── CHANGELOG.md .............. Merge history
│
├── sidecar-app/ .............. React application
│   ├── src/
│   │   ├── Landing/ .......... Landing page (role selector, search)
│   │   ├── Workspace/ ........ Detailer workspace (roster, calendar, actions)
│   │   ├── Personnel/ ........ Sailor record view (radar chart, comm log)
│   │   ├── Command/ .......... Command manning view
│   │   ├── Analytics/ ........ Portfolio analytics dashboard
│   │   ├── AdvancedSearch/ ... SQL-like query builder
│   │   ├── components/ ....... Shared components (Topbar)
│   │   ├── models/ ........... TypeScript interfaces (ISailor.ts)
│   │   ├── services/ ......... Business logic + data layer
│   │   │   ├── SideCarAdapter.ts ... Data access interface
│   │   │   ├── PrdEngine.ts ....... PRD computation (LOCKED)
│   │   │   └── SyntheticData.ts ... Test data generator
│   │   ├── App.tsx ........... Router + layout
│   │   ├── index.css ......... Design tokens (:root)
│   │   └── main.tsx .......... Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── directives/ ............... Governance documents
│   ├── Gemini.md ............. Master Session Brief
│   ├── DEVELOPMENT.md ........ Code standards, commit format
│   ├── SECURITY.md ........... Data boundary law
│   ├── UI-UX.md .............. Design system specs
│   ├── INTEGRATIONS.md ....... Adapter contracts
│   ├── AUDIT.md .............. Verification protocol
│   ├── TESTING.md ............ Quality gate
│   └── ONBOARDING.md ......... Developer onboarding checklist
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

| ID | File(s) | What It Is |
|---|---|---|
| `MOD-LAND` | `src/Landing/*` | Landing page |
| `MOD-WORK` | `src/Workspace/*` | Detailer Workspace |
| `MOD-MEMBER` | `src/Personnel/*` | Sailor Record View |
| `MOD-CMD` | `src/Command/*` | Command Manning View |
| `MOD-ANLYT` | `src/Analytics/*` | Analytics Dashboard |
| `MOD-SEARCH` | `src/AdvancedSearch/*` | Advanced Search |
| `MOD-CSS` | `src/index.css` + CSS files | Design system |
| `MOD-SVC` | `src/services/*` | Shared logic + data |

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
| **Adapter** | `SideCarAdapter` in `src/services/SideCarAdapter.ts` — the only way to access data. |
| **Module** | A single page/file with defined boundaries. |
| **Session** | One work period on one module. Starts with scope, ends with commit. |
| **Halt** | System stopped you for a rule violation. Read the message, fix, retry. |
| **Tier 1** | Human decision layer. Owns directives and merge authority. |

---

## Need Help?

| Question | Where to Look |
|---|---|
| How do I use git? | [GIT.md](GIT.md) |
| What CSS class do I use? | `src/index.css` or [UI-UX.md](directives/UI-UX.md) |
| How do I get data? | `src/services/SideCarAdapter.ts` → `SideCarAdapter.getSailors()` |
| What are the rules? | [Gemini.md](directives/Gemini.md) Section 5 |
| My commit was rejected | Read the error — hooks tell you exactly what's wrong |
| My PR failed QA | Fix the violations, push again — QA re-runs automatically |

---

*Governed by: My Compass Tiered Agentic Development Framework v5.0*
