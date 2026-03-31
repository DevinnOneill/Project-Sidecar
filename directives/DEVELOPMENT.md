# DEVELOPMENT.md — Development Standards

> **Version:** 1.0 | **Domain:** Governed Development Cycle, Branch Workflow, Commit Format
> **Authority:** Tier 1 | **Loaded By:** Every code-producing session

---

## 1. Governed Development Cycle

The 10-step cycle defined in `Gemini.md` Section 6 is the authoritative sequence. This directive governs the operational details of Steps 4–6 (Module Agent execution) and the commit mechanics of Step 10.

## 2. Session Protocol

### Session Start
1. Confirm `Gemini.md` load
2. Confirm all applicable directives loaded
3. Receive Execution Script from Orchestrator
4. Confirm module boundary, authorized files, and halt conditions
5. Begin work only after all confirmations are logged

### Session Execution
- Work within assigned module boundary exclusively
- Log every file creation, modification, or deletion
- If a task requires modifying a file outside the authorized list — **halt**
- If the Execution Script is ambiguous — **halt and request clarification**
- Never interpret ambiguity. Never assume intent.

### Session Close
- Produce structured output matching the Execution Script's output contract
- Produce boundary confirmation: list every file touched
- Submit to QA gate

## 3. Commit Format

```
[SC-YYYY-MMDD-NNN] MODULE-ID: Brief description

- What changed (list files)
- Why it changed (reference task)
- Constraints verified (list constraint IDs)
- QA score: C:X S:X CR:X OD:X
```

Example:
```
[SC-2026-0325-001] MOD-P3: Add PRD tier column to dashboard table

- Modified: page3.html (lines 45-120)
- Task: Render PRD tiers with semantic color badges
- Constraints: C-11 (tokens), C-12 (typography), C-14 (PRD semantic)
- QA score: C:8 S:9 CR:8 OD:9
```

## 4. Branch Workflow

See `Gemini.md` Section 8 for the full branch structure. Key rules:

- **One branch per developer, per module, per session**
- **Branch naming:** `dev/[name]/[module-id]-[description]`
- **Merge direction:** `dev → qa-staging → main` (one direction only)
- **No lateral merges** between developer branches
- **All pushes are manual** — no automated CI/CD
- **Halt = branch deleted** — main and qa-staging untouched

## 5. Code Standards

### HTML
- Semantic HTML5 elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`)
- No inline styles (use CSS classes referencing tokens)
- No inline JavaScript longer than a single event binding
- All pages include the shared `style.css` and `app.js`

### CSS
- All values use CSS custom properties from `:root`
- No hardcoded hex values outside `:root` declaration
- BEM-like naming: `.dashboard-table__row--critical`
- No `@import` — single `style.css` file
- No CSS nesting (NMCI Chrome 110 compatibility)
- No `@layer` or `@container` (NMCI compatibility)

### JavaScript
- ES6 baseline (Chrome 110+): `const`, `let`, arrow functions, template literals, destructuring
- No top-level `await`
- No `import`/`export` (no modules — flat file architecture)
- No `fetch()` in Phase 1A
- All shared functions defined in `app.js`
- All data access through the `SideCarAdapter` interface

## 6. File Size Discipline

> **Amended 2026-03-29:** Targets updated to reflect workspace.html consolidation. The primary work surface is a single-file SPA that replaced what were previously 3 separate pages.

Phase 1A ships as a flat file bundle transferred via USB or SharePoint. Keep it lean.

- `style.css`: Target < 50KB (Covenant token system + all component styles)
- `app.js`: Target < 60KB (including embedded synthetic data and SideCarAdapter)
- `workspace.html`: Target < 80KB (consolidated primary work surface — exception to page target)
- `landing.html`: Target < 50KB (Intelligence Bar + Smart Pill)
- Other page HTML: Target < 20KB each (drilldown views)
- Total bundle (excluding fonts): Target < 400KB

---

*DEVELOPMENT.md v1.0 — SideCar Directive Library*
