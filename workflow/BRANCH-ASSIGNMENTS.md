# Branch Assignments — Locked Access Model

> **Authority:** Tier 1 only. Changes to branch assignments require Tier 1 authorization.
> **Amended:** 2026-03-31 — Transition from open branching to fixed branch model.

---

## Branch Structure

```
dev-1  (Team 1)  ──PR──>  qa-staging  ──PR──>  main
dev-2  (Team 2)  ──PR──>  qa-staging  ──PR──>  main
                           (Tier 1)           (Tier 1)
```

**Only 4 branches exist in this repo.** No other branches are authorized. Creating an unauthorized branch triggers a governance violation alert.

---

## Assignments

| Branch | Developers | Role |
|--------|-----------|------|
| `dev-1` | `CoolCatCoding`, `DevvOneill` | Development Team 1 |
| `dev-2` | `Abbiera`, `brown-water` | Development Team 2 |
| `qa-staging` | `DevinnOneill` (Tier 1) | QA gate — reviews and merges dev PRs |
| `main` | `DevinnOneill` (Tier 1) | Production — final merge authority |

## Rules

1. **You push to your assigned branch only.** If you are assigned to `dev-1`, you cannot push to `dev-2`, `qa-staging`, or `main`.
2. **No new branches.** Do not create `dev/yourname/anything`. The 4 branches above are the only authorized branches.
3. **PRs flow one direction:** `dev-1` or `dev-2` → `qa-staging` → `main`. No lateral PRs between dev branches.
4. **Shared branches require coordination.** If two developers share `dev-1`, only one works on it at a time. Use the session protocol (`scripts/session-init.sh`) to declare your active session.
5. **Sync before working.** Always `git pull origin dev-1` before starting a session to pick up your partner's commits.

## How to Get Assigned

Contact Tier 1 (DevinnOneill). Tier 1 updates this file, `BRANCH-ASSIGNMENTS.json`, and the GitHub Rulesets.

## Adding a New Branch

When the team grows beyond 4 developers:
1. Tier 1 creates `dev-3` from `main`
2. Tier 1 adds a GitHub Ruleset for `dev-3`
3. Tier 1 updates `BRANCH-ASSIGNMENTS.json` and this file
4. Tier 1 updates `scripts/onboard.sh` branch map
5. Tier 1 updates `qa-agent.yml` to accept `dev-3` as a valid PR source

---

*BRANCH-ASSIGNMENTS.md v1.0 — SideCar Governed Development Framework*
