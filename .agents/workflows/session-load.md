---
description: SideCar Session Load Protocol — auto-loads governance directives on session open
---

# SideCar — Session Load Protocol

This workflow fires at the start of every development session. It ensures the full Directive Library is loaded and confirmed before any code is written.

## Step 1: Load Governance Documents (In Order)

Read the following documents in this exact sequence:

// turbo-all

1. `WHITE_PAPER.md` — Canonical governance framework
2. `directives/Gemini.md` — Master Session Brief (your primary authority)
3. `directives/DEVELOPMENT.md` — Code standards, branch workflow, commit format
4. `directives/SECURITY.md` — Data boundary law, PII/CUI constraints
5. `directives/UI-UX.md` — Covenant design system, component specs
6. `directives/INTEGRATIONS.md` — Adapter layer contracts, data source interfaces
7. `directives/AUDIT.md` — Verification protocol, halt conditions
8. `directives/TESTING.md` — Quality gate thresholds, four-dimension scoring
9. `directives/ONBOARDING.md` — Developer onboarding protocol
10. `workflow/MODULE-MAP.md` — Module routing table
11. `lessons/halts.md` — Past halt events
12. `lessons/patterns.md` — Recurring failure patterns
13. `lessons/exemplars.md` — High-scoring reference outputs

## Step 2: Confirm Load

After reading all documents, explicitly confirm what was loaded:

```
Loaded: WHITE_PAPER.md, Gemini.md, DEVELOPMENT.md, SECURITY.md,
        UI-UX.md, INTEGRATIONS.md, AUDIT.md, TESTING.md, ONBOARDING.md,
        MODULE-MAP.md, [N] halts, [N] patterns, [N] exemplars. Ready.
```

Do NOT skip this confirmation. It mirrors Governed Development Cycle Step 1.

## Step 3: Conduct Scoping Conversation

Ask the developer all 6 required questions before writing any code:

1. **What is your name?**
2. **Which module are you working on?** (MOD-LAND, MOD-DET, MOD-PLAC, MOD-ANLYT, MOD-CSS, MOD-JS)
3. **What is your branch?** (Should follow `dev/[name]/[module-id]-[description]` format)
4. **What are you working on this session?** (One sentence)
5. **What type of changes?** (Functionality / UI/UX / Bug Fix / Refactor)
6. **List the specific changes you plan to make.**

## Step 4: Summarize and Confirm Scope

Summarize the session scope back to the developer:

```
Session Scope Confirmation:
  Developer:  [Name]
  Branch:     [Branch name]
  Module:     [Module ID] → [File]
  Goal:       [One-sentence task]
  Change Type: [Type]
  Planned Changes:
    1. [Change 1]
    2. [Change 2]
    3. [Change 3]

  Edits outside this scope will be flagged. Proceed? (y/n)
```

Only begin coding after the developer confirms.

## Step 5: Route Directives

After scope is confirmed, bring the module-specific directives into primary focus per `workflow/MODULE-MAP.md`. All other directives remain loaded as background guardrails.

## Enforcement (Hard Blocks)

- **DENY** any write to a file outside the declared module boundary. This is a halt.
- **Cross-module work** requires closing the current session and opening a new one.
- **On ambiguity:** halt and ask the developer for clarification. Never interpret.
- **On completion:** produce a boundary confirmation listing every file touched, and generate a session log entry per Gemini.md Section 9 format.
