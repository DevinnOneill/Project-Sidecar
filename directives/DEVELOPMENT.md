# DEVELOPMENT.md — Development Standards

> **Version:** 2.0 | **Domain:** Governed Development Cycle, Branch Workflow, Commit Format
> **Authority:** Tier 1 | **Loaded By:** Every code-producing session
> **Amended:** 2026-03-31 — Updated for Vite + React + TypeScript architecture

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
[SC-2026-0331-001] MOD-WORK: Add comm panel slide-out to Workspace

- Modified: src/Workspace/Workspace.tsx, src/Workspace/Workspace.css
- Task: Implement slide-out communication panel with append-only log
- Constraints: C-09 (adapter), C-10 (immutability), C-11 (tokens), C-14 (PRD semantic)
- QA score: C:8 S:9 CR:8 OD:9
```

## 4. Branch Workflow

See `Gemini.md` Section 8 for the full branch structure. Key rules:

- **Developers push to their assigned fixed branch (dev-1 or dev-2).** See `workflow/BRANCH-ASSIGNMENTS.md`.
- **Merge direction:** `dev-1 or dev-2 → qa-staging → main` (one direction only)
- **No lateral merges** between dev branches
- **All pushes are manual** — no automated CI/CD
- **Halt = commits reverted on dev branch** — main and qa-staging untouched

## 5. Code Standards

### TypeScript
- **Strict mode required** — `tsconfig.json` enforces `strict: true`
- All components and services must be fully typed — no `any` without justification
- Use TypeScript interfaces from `src/models/ISailor.ts` for all domain types
- ES2020 target (Chrome 110+ compatibility)
- All data access through the `SideCarAdapter` TypeScript service

### React Components
- Functional components only (no class components)
- Each module follows the pattern: `ModuleName/ModuleName.tsx` + `ModuleName/ModuleName.css`
- Props must be explicitly typed with TypeScript interfaces
- State management through React hooks (`useState`, `useEffect`, `useMemo`)
- Routing through React Router v7 — no manual URL manipulation
- Animations through Framer Motion only — no CSS keyframe animations on data

### CSS
- All values use CSS custom properties from `:root` in `src/index.css`
- No hardcoded hex values outside `:root` declaration (C-11)
- BEM-like naming: `.workspace__roster-row--critical`
- Component-scoped CSS files (one per module)
- No CSS nesting (NMCI Chrome 110 compatibility in build output)
- No `@layer` or `@container` (NMCI compatibility)
- No CSS-in-JS libraries — use plain CSS files with token references

### Services
- All business logic in `src/services/` — never in components
- `SideCarAdapter.ts` is the sole data access interface (C-09)
- `PrdEngine.ts` owns PRD computation — LOCKED, requires Tier 1 to modify
- `SyntheticData.ts` generates all Phase 1A test data

## 6. Build & Bundle Discipline

> **Amended 2026-03-31:** Updated for Vite build pipeline.

### Development
- `npm run dev` — Vite dev server with HMR
- `npm run build` — Production build with TypeScript checking
- `npm run lint` — ESLint checks

### Bundle Targets
- Total production build (excluding fonts): Target < 500KB
- Individual component CSS: Target < 10KB each
- `src/index.css` (design tokens): Target < 5KB
- Vite tree-shaking and code-splitting enabled by default
- Build output must target ES2020 for Chrome 110+ (C-04)

---

*DEVELOPMENT.md v2.0 — SideCar Directive Library*
