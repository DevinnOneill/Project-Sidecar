---
description: SideCar Session Load Protocol — lightweight governance load on session open
---

# SideCar — Session Load Protocol (Pragmatic)

This workflow fires at the start of every development session. It ensures the Directive Library is internalized and constitutional constraints are active before any code is written.

> **Amended 2026-03-29:** Streamlined from full-ceremony model to pragmatic protocol. Constitutional constraints and code standards remain non-negotiable. Ceremony reduced.

## Step 1: Governance Quick-Load

// turbo-all

On session open, internalize the following governance documents. You do NOT need to read every document on every session — but you must have read them at least once in context and confirm they are loaded.

**Always read on first session:**
1. `docs/VISION.md` — Strategic Concept (AI-Enabled Coaching, Pvol, Legacy Divestment)
2. `directives/Gemini.md` — Master Session Brief (primary authority)
3. `directives/UI-UX.md` — Covenant design system
4. `workflow/MODULE-MAP.md` — Module routing table

**Internalized as background guardrails (read at least once, then referenced as needed):**
5. `directives/DEVELOPMENT.md` — Code standards
6. `directives/SECURITY.md` — Data boundary law
7. `directives/UX-PATTERNS.md` — Interaction patterns
8. `directives/INTEGRATIONS.md` — Adapter contracts
9. `directives/AUDIT.md` — Verification protocol
10. `directives/TESTING.md` — Quality gate
11. `directives/ONBOARDING.md` — Developer onboarding
12. `.agents/workflows/detailer-validation.md` — Holistic UX/CRM Audit Agent
13. `lessons/halts.md`, `lessons/patterns.md`, `lessons/exemplars.md`

## Step 2: Confirm Load (One Line)

After loading, confirm in one line:

```
Governance loaded: VISION.md, Gemini.md, UI-UX.md, MODULE-MAP.md + 9 guardrails. [N] halts, [N] patterns, [N] exemplars. Ready.
```

## Step 3: Scope from Context

Instead of asking 6 formal scoping questions, infer scope from context:

1. **Module:** Determine from the user's request and active files which module(s) are in play
2. **Boundary:** Confirm which files you intend to modify before writing code
3. **Constraints:** Note which constitutional constraints apply based on MODULE-MAP.md

If the scope is ambiguous, ask for clarification. If the user's request would cross module boundaries, confirm the expanded scope.

## Step 4: Execute

- Work within the declared module boundary
- Reference specific constraint IDs when making design decisions
- Use Navy terminology naturally (PRD, EAOS, PCS, etc.)
- Flag scope creep if the user asks to "also fix" something unrelated

## Step 5: Close (For Code-Producing Sessions Only)

After substantive code changes, produce a brief boundary confirmation:

```
Session close:
  Files modified: [list]
  Constraints verified: [relevant C-xx IDs]
  Cross-module: [yes/no — if yes, which modules]
```

Session logs in `sessions/` are produced for milestone work (new features, architectural changes). Minor fixes and adjustments do not require formal session logs.

## Enforcement (Still Hard Blocks)

These rules are never relaxed:

- **C-01 through C-14** remain constitutional. Violations halt work.
- **On ambiguity:** halt and ask. Never interpret.
- **Adapter pattern (C-09):** All data through SideCarAdapter. No exceptions.
- **No PII/CUI (C-03):** Synthetic data only in Phase 1A. No exceptions.
- **PRD semantic lock (C-14):** 5 tier colors used ONLY for PRD urgency. No exceptions.
