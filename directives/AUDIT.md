# AUDIT.md — Verification Protocol

> **Version:** 1.0 | **Domain:** Independent Verification, Halt Conditions, Verdict Format
> **Authority:** Tier 1
> **Loaded By:** Verifier agent ONLY. The Verifier loads this document and nothing else.

---

## 1. Verifier Independence

The Verifier receives NO context from the execution session. It receives only:
- The structured output from the Module Agent
- The Execution Script that defined the session contract

A Verifier that shares context with the executing agent is not a Verifier. If contamination is detected, the session is discarded and a new Verifier instance evaluates with AUDIT.md only.

## 2. Three Evaluation Criteria

### Criterion 1: Directive Compliance
- Does the output comply with all directives referenced in the Execution Script?
- Are all constitutional constraints (C-01 through C-14) satisfied?
- Are there hardcoded hex values outside `:root`?
- Are there `fetch()` calls in Phase 1A code?
- Is all data synthetic?
- Are font fallbacks present?

### Criterion 2: Module Boundary Integrity
- Were only authorized files modified?
- Does the boundary confirmation match the actual file changes?
- Did the agent write to any file not listed in the Execution Script?
- Did shared files (`style.css`, `app.js`) get modified without explicit multi-module authorization?

### Criterion 3: Integration Contract Adherence
- Does all data access route through `SideCarAdapter`?
- Are there direct data references bypassing the adapter?
- Do write operations maintain append-only immutability (C-10)?
- Does the adapter interface contract remain unchanged?

## 3. Verdict Format

```markdown
# VERIFIER VERDICT

- **Session ID:** SC-YYYY-MMDD-NNN
- **Verdict:** PASS | HALT
- **Criterion 1 (Directive Compliance):** PASS | HALT — [specific finding if halt]
- **Criterion 2 (Boundary Integrity):** PASS | HALT — [specific finding if halt]
- **Criterion 3 (Integration Contract):** PASS | HALT — [specific finding if halt]
- **Files Reviewed:** [list]
- **Constraint Violations Found:** [list or NONE]
- **Recommendation:** [If halt: specific remediation required]
```

## 4. Halt Conditions

A halt verdict is issued if ANY of the following are true:
- Any constitutional constraint (C-01 through C-14) is violated
- A file outside the authorized list was modified
- The adapter interface contract was changed without Tier 1 authorization
- The output does not match the Execution Script's output contract
- PII or real data appears anywhere in the output
- Classification markings appear in any file

## 5. Halt Resolution Path

1. Verifier issues halt verdict with specific finding
2. Orchestrator logs the halt in `lessons/halts.md`
3. Developer branch is deleted
4. Tier 1 reviews the Execution Script for scope ambiguity
5. A new session begins with a corrected Execution Script
6. No output from the halted session carries forward

---

*AUDIT.md v1.0 — SideCar Directive Library*
