# SideCar MVP

**Enlisted Personnel Distribution Intelligence Platform**
Navy Personnel Command · NPC Agentic Lab · March 2026

---

## Quick Start (< 2 minutes)

**To see the app right now:**

1. Open your file explorer (Finder on Mac, Explorer on Windows)
2. Navigate to this folder
3. Double-click `index.html` (or any `.html` file) — it opens in your default browser
4. That's it. You're looking at SideCar.

Or from terminal:
```bash
# Mac
open index.html

# Windows
start index.html
```

Every page links to every other page through the top navigation bar. Click around. Nothing will break.

---

## Tech Stack

**This is intentionally simple.** There is no server. No install step. No terminal commands needed to run it.

| Layer | Technology | Why |
|---|---|---|
| **Structure** | HTML5 | Semantic markup. No framework. No JSX. Just `.html` files. |
| **Styling** | CSS3 | Single `style.css` file. CSS custom properties (variables) for the design system. No Sass. No Tailwind. No preprocessor. |
| **Logic** | Vanilla JavaScript (ES6) | Single `app.js` file. No React. No Vue. No npm. No bundler. No build step. |
| **Data** | Embedded in `app.js` | All data is synthetic (fake but realistic). No database. No API calls. No `fetch()`. |
| **Fonts** | Local `.woff2` files | Stored in `fonts/` folder. System fallbacks if missing. |
| **Version Control** | Git + GitHub | Standard branching workflow. Manual pushes only. |

### Why so simple?

SideCar must run on **NMCI** (Navy Marine Corps Intranet) machines. Those machines have:
- A browser (Chrome/Edge 110+)
- No terminal
- No Node.js
- No npm
- No internet access to CDNs
- Files open from a local path or SharePoint

So the entire app is a folder of files you can put on a USB drive. If it opens in a browser, it works.

### What you need on your Mac to develop

| Tool | Required? | What it's for |
|---|---|---|
| **A browser** (Chrome recommended) | Yes | Viewing and testing the pages |
| **A text editor** (VS Code, Cursor, etc.) | Yes | Editing HTML/CSS/JS files |
| **Git** | Yes | Version control — clone, branch, commit, push |
| **Node.js / npm** | No | Not used. Do not install dependencies for this project. |
| **A terminal** | Helpful | For Git commands only. Not required to run the app. |

---

## Microsoft 365 / Azure Integration Roadmap

SideCar is built to integrate with the full Microsoft 365 suite and Azure ecosystem. The architecture was designed for this transition from day one.

### The Adapter Pattern — Why This Works

Every page calls the same `SideCarAdapter` interface (`getSailors()`, `getCommLog()`, `getBillets()`, etc.). The pages never know where the data comes from. When the data source changes, only the inside of the adapter functions change — zero page rewrites.

```
Phase 1A (now):   getSailors() → returns embedded JS array
Phase 1B (next):  getSailors() → calls Microsoft Graph API → returns same shape
Phase 2 (target): getSailors() → calls Dataverse API → returns same shape
```

### Three-Phase Authorization Model

| Phase | Data | Environment | Gate to Next Phase |
|---|---|---|---|
| **1A — Proof of Concept** (current) | Synthetic only. No real data. | Local files / `file://` path | COMNAVPERSCOM sponsorship + GCC High tenant provisioned |
| **1B — Authorized Pilot** | Real Sailor records (pilot group) | GCC High + SharePoint Online | RMF assessment initiated |
| **2 — Full Operational Deployment** | All Navy personnel data | Azure / GCC High at enterprise scale | ATO issued through DoD RMF |

### M365 / Azure Service Map

| Service | SideCar Use Case | Adapter Method | Phase |
|---|---|---|---|
| **Microsoft Graph API** | Personnel records, Sailor data from NSIPS/MNA | `getSailors()`, `getSailor()` | 1B |
| **Exchange Online (Graph)** | Communication log retrieval (Outlook emails, meetings) | `getCommLog()` | 1B |
| **Dataverse for Government** | Structured data backend — billets, commands, manning figures | `getBillets()`, `getCommands()` | 2 |
| **SharePoint Online** | App hosting + detailer spreadsheet imports | Hosting / CSV pipeline | 1B |
| **Azure AD / Entra ID** | Authentication — CAC-backed identity via GCC High | Auth layer (future) | 1B |
| **Power Automate** | Workflow triggers — automated queue entries for Sailor events | Queue integration (future) | 2 |
| **Azure Key Vault** | Secrets management for API tokens and credentials | Config layer (future) | 2 |
| **Azure Monitor / App Insights** | Telemetry, usage analytics, error tracking | Observability layer (future) | 2 |

### SharePoint Compatibility

The flat-file architecture is **intentionally SharePoint-compatible**:

- HTML/CSS/JS files can be hosted directly on a SharePoint document library
- For richer integration, pages can be wrapped into an **SPFx (SharePoint Framework) web part** — the vanilla JS is clean enough to embed without conflicts
- No build dependencies means no webpack/node conflicts with the SPFx toolchain
- Content Security Policy considerations (constraints C-06, C-07) were written specifically for SharePoint and NMCI CSP headers
- The dual-mode data pipeline (CSV file picker on Mac, embedded data on NMCI) already mirrors the SharePoint file-access pattern

### What's Built Now vs. What Comes Later

| Ready Now (Phase 1A) | Phase 1B (adapter swap) | Phase 2 (post-ATO) |
|---|---|---|
| Full UI for all 6 pages | Graph API calls inside adapter | Dataverse backend |
| Covenant design system | SPFx web part wrapper | Entra ID / CAC auth |
| SideCarAdapter interface (Promise-based) | Exchange Online comm log pull | Power Automate triggers |
| Synthetic data across all 5 PRD tiers | SharePoint hosting | Azure Monitor telemetry |
| Offline behavior scaffolding | Real Sailor pilot data | Enterprise-scale queue |
| PRD computation engine (locked) | GCC High deployment | Full ATO compliance |

The adapter methods already return Promises (even though they don't need to in Phase 1A) so the swap from `Promise.resolve(data)` to `async fetch()` is mechanical — no page code changes required.

---

## What's in This Repo

```
Project-Sidecar/
│
├── index.html .............. Entry point (redirects to Landing)
├── page2.html .............. Landing / Role Selection (start here)
├── page3.html .............. Detailer Dashboard (main work surface)
├── page4.html .............. Sailor Record View (individual profile)
├── page5.html .............. Command Manning View (billet health)
├── page6.html .............. Placement Coordinator / Evaluator View
│
├── style.css ............... All visual styling (Covenant Design System)
├── app.js .................. All logic + synthetic data + adapter layer
│
├── fonts/ .................. Local font files (Bebas Neue, Libre Baskerville, DM Mono)
│
├── Gemini.md ............... Master Session Brief — READ THIS FIRST
├── directives/ ............. Governance documents (8 files)
│   ├── DEVELOPMENT.md ...... Code standards, commit format, branch rules
│   ├── SECURITY.md ......... Data rules — what you can and cannot put in code
│   ├── UI-UX.md ............ Design system, colors, typography, components
│   ├── INTEGRATIONS.md ..... How data flows through the adapter layer
│   ├── AUDIT.md ............ How your work gets verified
│   ├── TESTING.md .......... Quality gate — how your work gets scored
│   └── ONBOARDING.md ....... Your first-day checklist
│
├── sessions/ ............... Session logs (one per work session, append-only)
├── lessons/ ................ Lessons learned (halts, exemplars, failure patterns)
├── CHANGELOG.md ............ History of every merge to main
└── README.md ............... You are here
```

---

## How the Pages Connect

```
index.html → page2.html (Landing)
                  │
                  ├── page3.html (Detailer Dashboard)
                  │       │
                  │       └── page4.html (Sailor Record — click a Sailor row)
                  │
                  ├── page5.html (Command Manning)
                  │
                  └── page6.html (Placement Coordinator)
```

All pages share the same top navigation bar. You can reach any page from any other page. Open any `.html` file and you're in.

---

## Your First Day — Step by Step

### Step 1: Get the code
```bash
git clone <repo-url>
cd Project-Sidecar
```

### Step 2: Open it in your browser
```bash
open index.html
```
Click through all 5 pages. Confirm navigation works. Look at the dark interface — that's the Covenant design system.

### Step 3: Open it in your editor
Open the entire `Project-Sidecar` folder in VS Code (or your editor of choice). Familiarize yourself with the file structure above.

### Step 4: Read the governance docs (in this order)
This is required before you write any code. It takes about 30 minutes.

| Order | File | What you'll learn |
|:---:|---|---|
| 1 | `Gemini.md` | Everything — the master document. Module boundaries, constraints, design tokens, PRD computation. |
| 2 | `directives/DEVELOPMENT.md` | How to commit, how to branch, code standards for HTML/CSS/JS. |
| 3 | `directives/SECURITY.md` | What data you can use (synthetic only). What's prohibited. |
| 4 | `directives/UI-UX.md` | The Covenant design system — colors, typography, component specs. |
| 5 | `directives/INTEGRATIONS.md` | How `SideCarAdapter` works — the only way to access data. |
| 6 | `directives/AUDIT.md` | How your work gets independently verified. |
| 7 | `directives/TESTING.md` | The quality gate — 4 dimensions, scored 1-10, must hit 7+ in all. |
| 8 | `directives/ONBOARDING.md` | Your onboarding checklist and common mistakes to avoid. |

### Step 5: Understand the key rules

These are the rules that will trip you up if you don't know them:

| Rule | What it means in practice |
|---|---|
| **No `fetch()`** | You cannot load data from a URL. All data lives in `app.js`. |
| **No hex colors in CSS** | Write `color: var(--color-gold-primary)`, not `color: #B88E48`. The only hex values live in the `:root` block of `style.css`. |
| **No npm / no frameworks** | No React. No Vue. No Tailwind. No `npm install`. Vanilla HTML/CSS/JS only. |
| **One module per session** | Working on `page3.html`? You can only edit `page3.html`. Need to change `style.css` too? That's a separate session. |
| **All data through the adapter** | Never hardcode a Sailor name in HTML. Call `SideCarAdapter.getSailors()` in `app.js`. |
| **Synthetic data only** | No real names, no real DODIDs, no real commands. Use the phonetic alphabet pattern. |
| **Dark mode only** | There is no light mode. The dark surface IS the interface. |

### Step 6: Create your branch
```bash
git checkout -b dev/your-name/mod-p3-your-task-description
```

Branch naming: `dev/[your-name]/[module-id]-[brief-description]`

### Step 7: Get your Execution Script
Before writing code, you need an Execution Script from the Orchestrator (or Tier 1). This defines exactly what you're building, which files you can touch, and when to stop. **Do not start coding without one.**

---

## How to Edit a Page

Each page is a self-contained HTML file. Here's what you're working with:

```html
<!-- Every page has this structure -->
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="style.css">     <!-- shared styles -->
</head>
<body>
  <header class="topbar">...</header>           <!-- shared nav bar -->
  <main class="page-container">
    <!-- YOUR MODULE CONTENT GOES HERE -->
  </main>
  <script src="app.js"></script>                <!-- shared logic + data -->
</body>
</html>
```

**To display data on a page**, call the adapter in a `<script>` block at the bottom:

```html
<script>
  SideCarAdapter.getSailors().then(function(sailors) {
    // Build your table rows, cards, etc. here
    sailors.forEach(function(sailor) {
      var prd = computePRDTier(sailor);
      // Use prd.tier, prd.color, prd.textColor to render
    });
  });
</script>
```

**To style your content**, use the CSS classes already defined in `style.css`:
- `.card` — a content panel
- `.data-table` — a data table
- `.prd-badge--critical` — a PRD urgency badge
- `.status-dot--red` — a colored status indicator
- `.btn--gold` — an action button

See `directives/UI-UX.md` for the full component list.

---

## Git Workflow

```
dev/your-name/your-task  →  qa-staging  →  main
        you                    QA review      Tier 1 merge
```

```bash
# 1. Create your branch
git checkout -b dev/yourname/mod-p3-dashboard-table

# 2. Do your work (edit files within your module boundary)

# 3. Stage and commit
git add page3.html
git commit -m "[SC-2026-0325-001] MOD-P3: Add PRD tier column to dashboard table

- Modified: page3.html
- Task: Render PRD tiers with semantic color badges
- Constraints: C-11, C-12, C-14
- QA score: C:8 S:9 CR:8 OD:9"

# 4. Push your branch
git push -u origin dev/yourname/mod-p3-dashboard-table

# 5. Open a pull request to qa-staging (not main)
```

**Rules:**
- Never push directly to `main` — only Tier 1 merges to main
- Never merge sideways between developer branches
- One branch per task, per module
- If your session halts, delete the branch and start fresh

---

## Design System Cheat Sheet

### Colors (use the variable name, never the hex)
| Token | Use for |
|---|---|
| `--color-bg-void` | Page background (deepest) |
| `--color-bg-surface` | Card/panel background |
| `--color-bg-elevated` | Table headers, raised elements |
| `--color-gold-primary` | Signal — links, accents, borders |
| `--color-gold-bright` | Active nav, emphasized gold |
| `--color-text-primary` | Main body text |
| `--color-text-muted` | Secondary/inactive text |

### PRD Tier Colors (only for PRD urgency — never repurpose)
| Tier | Badge class | Dot class |
|---|---|---|
| STABLE (9+ months) | `.prd-badge--stable` | `.status-dot--gray` |
| WATCH (6-9 months) | `.prd-badge--watch` | `.status-dot--green` |
| URGENT (3-6 months) | `.prd-badge--urgent` | `.status-dot--yellow` |
| CRITICAL (0-3 months) | `.prd-badge--critical` | `.status-dot--red` |
| EXPIRED (past due) | `.prd-badge--expired` | `.status-dot--escalated` |

### Fonts
| Content type | CSS variable | Fallback |
|---|---|---|
| Page titles, nav labels | `var(--font-display)` | Impact |
| Body text, descriptions | `var(--font-body)` | Georgia |
| Numbers, dates, codes, IDs | `var(--font-data)` | Consolas |

---

## Glossary (Navy terms you'll see in the code)

| Term | Plain English |
|---|---|
| **Sailor** | The person whose data we're displaying. Always capitalized. |
| **Detailer** | Assignment officer — the primary user of SideCar. |
| **PRD** | Projected Rotation Date — when a Sailor is due to move. This drives urgency. |
| **EAOS** | End of Active Obligated Service — when enlistment contract ends. |
| **Billet** | A job slot at a command. Can be filled or vacant. |
| **UIC** | Unit Identification Code — unique ID for a command/unit. |
| **DODID** | DoD ID number — unique ID for a person. (We use fake `9999XXXXXX` ones.) |
| **PCS** | Permanent Change of Station — a move to a new duty station. |
| **NMCI** | Navy Marine Corps Intranet — the network these machines sit on. |
| **Rate** | Job specialty (IT, CTN, YN, etc.) |
| **Pay Grade** | Rank level (E4, E5, E6, E7, etc.) |
| **GCC High** | Government Community Cloud High — Microsoft's DoD-authorized M365 environment. |
| **SPFx** | SharePoint Framework — the toolchain for building SharePoint web parts. |
| **Dataverse** | Microsoft's data platform — the structured backend for Phase 2. |
| **Graph API** | Microsoft's unified API for M365 services — how SideCar will pull real data. |

---

## Need Help?

| Question | Where to look |
|---|---|
| "What can I build?" | Your Execution Script (ask Tier 1 if you don't have one) |
| "What CSS class do I use?" | `style.css` or `directives/UI-UX.md` |
| "How do I get data?" | `app.js` — call `SideCarAdapter.getSailors()` etc. |
| "What colors/fonts?" | `Gemini.md` Section 14 or the cheat sheet above |
| "What are the rules?" | `Gemini.md` Section 5 — the 14 constitutional constraints |
| "My session halted" | That's normal — read `directives/AUDIT.md` for next steps |
| "I want to change style.css" | You need a separate Execution Script for MOD-CSS |
| "When does M365 plug in?" | Phase 1B — see the integration roadmap above |

---

*Governed by: My Compass Tiered Agentic Development Framework v4.0*
