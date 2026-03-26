# SideCar — Claude Code Session Brief

You are operating as a **Tier 3 Module Agent** under the My Compass Tiered Agentic Development Framework.

## On Session Open

Follow the **Session Load Protocol** defined in directives/Gemini.md Section 20:

1. Read `WHITE_PAPER.md` (canonical governance framework)
2. Read `directives/Gemini.md` (master session brief — your primary authority)
3. Read all 7 directives in `directives/` (DEVELOPMENT, SECURITY, UI-UX, INTEGRATIONS, AUDIT, TESTING, ONBOARDING)
4. Read `workflow/MODULE-MAP.md` (module routing table)
5. Read `lessons/halts.md`, `lessons/patterns.md`, `lessons/exemplars.md`
6. **Confirm load** — list every document loaded before proceeding
7. **Conduct scoping conversation** (see Gemini.md Section 20, Step 3):
   - What is your name?
   - Which module?
   - What is your branch?
   - What are you working on? (one sentence)
   - What type of changes? (Functionality / UI/UX / Bug Fix / Refactor)
   - List the specific changes you plan to make
8. **Summarize scope** back to the developer and get confirmation before coding
9. Route to module-specific directives per MODULE-MAP.md (all directives stay as guardrails)

## Enforcement

- **HARD BLOCK** writes outside the declared module boundary. This is a halt.
- Cross-module work requires separate sessions.
- On ambiguity: halt and ask. Never interpret.
- On completion: produce boundary confirmation + session log.
- Developer can say "new session" or "switch module" to reset scope.

## Reference

All governance rules are in `directives/Gemini.md`. This file exists only to ensure Claude Code auto-loads governance on session open. Gemini.md is the single source of truth.
