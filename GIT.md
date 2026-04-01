# Git Workflow Guide

> Step-by-step guide for every developer on the SideCar team.
> If you've never used Git before, this walks you through everything.

---

## The Big Picture

Your code moves through three stages before it reaches production:

```
dev-1 or dev-2 → qa-staging → main
  (your team)     (QA review)    (Tier 1 merge)
```

Nothing skips a stage. Nothing goes backwards.

---

## One-Time Setup

One command — clone and onboard in one shot:

```bash
git clone https://github.com/DevinnOneill/Project-Sidecar.git && cd Project-Sidecar/sidecar-app && npm install && npm run dev
```

This clones the repo, installs dependencies, and starts the Vite dev server. Open `http://localhost:5173` in Chrome to see the app.

Then switch to your assigned branch:

```bash
git checkout dev-1   # or dev-2 — whichever you're assigned to
git pull origin dev-1
```

---

## Starting a Task

### Step 1: Make sure you're up to date

```bash
git checkout main
git pull origin main
```

### Step 2: Switch to your assigned branch

```bash
git checkout dev-1
git pull origin dev-1
```

**Module IDs:**
| Module ID | File(s) | Description |
|-----------|---------|-------------|
| `MOD-LAND` | `src/Landing/*` | Landing page |
| `MOD-WORK` | `src/Workspace/*` | Detailer Workspace |
| `MOD-MEMBER` | `src/Personnel/*` | Sailor Record View |
| `MOD-CMD` | `src/Command/*` | Command Manning View |
| `MOD-ANLYT` | `src/Analytics/*` | Analytics Dashboard |
| `MOD-SEARCH` | `src/AdvancedSearch/*` | Advanced Search |
| `MOD-CSS` | `src/index.css` + CSS files | Design system |
| `MOD-SVC` | `src/services/*` | Shared logic + data |

### Step 3: Open your IDE and start your session

The AI assistant will ask you scoping questions before you code. Answer them — this creates your edit contract for the session.

---

## While You Work

- Edit ONLY the file(s) in your declared module
- Use CSS tokens (`var(--color-gold-primary)`) not hex values
- Use `SideCarAdapter` for all data — never hardcode
- If you need to touch a different module, finish this session first, then start a new one

---

## Committing Your Work

### Step 1: Check what you changed

```bash
git status
```

This shows you which files were modified. **Make sure you only changed files in YOUR module.**

### Step 2: Stage your files

```bash
# Stage specific files (recommended)
git add sidecar-app/src/Workspace/Workspace.tsx sidecar-app/src/Workspace/Workspace.css

# DON'T do: git add .  (this can accidentally add files outside your module)
```

### Step 3: Commit with the required format

```bash
git commit -m "[SC-2026-0331-001] MOD-WORK: Add comm panel slide-out to Workspace

- Modified: src/Workspace/Workspace.tsx, src/Workspace/Workspace.css
- Task: Implement slide-out communication panel
- Constraints: C-09, C-10, C-11, C-14"
```

**Commit message format:** `[SC-YYYY-MMDD-NNN] MODULE-ID: Brief description`

- `SC-YYYY-MMDD-NNN` = Session ID (date + sequence number)
- `MODULE-ID` = Which module (MOD-DET, MOD-LAND, etc.)

### What happens at commit time

The git hooks automatically run two checks:

1. **Boundary check** — Did you only modify files in your declared module?
2. **Constraint check** — Are there any violations? (no fetch(), no hex outside :root, no CSS nesting, etc.)

**If either check fails, the commit is rejected.** Read the error message — it tells you exactly what's wrong and how to fix it. Fix the issue, re-stage, and commit again.

### Common commit rejections

| Error | What happened | Fix |
|-------|-------------|-----|
| `C-02 violation: fetch()` | You used `fetch()` somewhere | Use `SideCarAdapter` instead |
| `C-11 violation: hardcoded hex` | You wrote a hex color like `#B39F75` in CSS | Use `var(--color-gold-primary)` |
| `C-04 violation: @layer` | You used modern CSS that NMCI can't run | Use flat CSS selectors |
| `Cross-module commit` | You edited files from two different modules | Split into separate commits |
| `Bad commit message format` | Your message doesn't match the template | Use `[SC-YYYY-MMDD-NNN] MODULE-ID: Description` |

---

## Pushing to GitHub

After your commit succeeds:

```bash
git push origin dev-1
```

**This puts your code on GitHub under your team's branch.** It does NOT touch `qa-staging` or `main`.

---

## Opening a Pull Request (PR)

A PR is a request to merge your branch into `qa-staging`. Here's how:

### Option A: GitHub website (easiest)

1. Go to https://github.com/DevinnOneill/Project-Sidecar
2. You'll see a yellow banner: "dev-1 had recent pushes"
3. Click **"Compare & pull request"**
4. Make sure **base** is set to `qa-staging` (NOT main)
5. Make sure **compare** is set to `dev-1` (or `dev-2`)
6. Write a title and description of what you did
7. Click **"Create pull request"**

### Option B: Terminal (if you have `gh` installed)

```bash
gh pr create --base qa-staging --title "MOD-WORK: Add comm panel slide-out" --body "Session: SC-2026-0331-001"
```

---

## What Happens After You Open a PR

### 1. The QA Agent runs automatically

Within 1-2 minutes, a bot will post a comment on your PR with a full report:

```
SideCar QA Agent Report

Quick Brief for Reviewer:
  dev-1 → qa-staging
  3 files changed in MOD-WORK | Merge: clean
  9 passed · 0 failed · 0 warnings

  All clear — safe to merge.
```

The QA Agent checks:
- Can your branch merge cleanly? (no conflicts with existing code)
- Which module did you touch? (flags cross-module work)
- Did you modify shared files? (flags for Tier 1 review)
- All 14 constitutional constraints (C-01 through C-14)
- Navigation links between pages still work
- Design token system is complete

**If the QA Agent finds violations, it blocks the merge.** Fix the issues on your branch, push again, and the QA Agent re-runs automatically.

### 2. A reviewer checks your code

A team lead or QA partner reviews the actual code changes. They may:
- **Approve** — your code is good
- **Request changes** — you need to fix something (they'll tell you what)

### 3. Your code gets merged into qa-staging

Once approved, the reviewer clicks "Merge pull request." Your code is now in `qa-staging`.

### 4. qa-staging gets merged into main

Only Tier 1 can merge from `qa-staging` into `main`. This is the final gate.

---

## Quick Reference Commands

```bash
# See what branch you're on
git branch

# See what files you changed
git status

# See the actual changes (line by line)
git diff

# Stage a file
git add sidecar-app/src/Workspace/Workspace.tsx

# Commit
git commit -m "[SC-2026-0331-001] MOD-WORK: Brief description"

# Push to your assigned branch
git push origin dev-1

# Switch to your assigned branch
git checkout dev-1
git pull origin dev-1

# See recent commits
git log --oneline -10
```

---

## Rules to Remember

1. **Never push to `main` directly.** Everything goes through PRs.
2. **Never push to `qa-staging` directly.** Open a PR targeting it.
3. **Push only to your assigned branch (dev-1 or dev-2).** See `workflow/BRANCH-ASSIGNMENTS.md`.
4. **Do not create new branches.** The four branches (dev-1, dev-2, qa-staging, main) are the only authorized branches.
5. **Always pull your dev branch before starting work.** Keeps you up to date.
6. **If your commit fails, read the error.** The hooks tell you exactly what's wrong.
7. **If the QA Agent fails your PR, fix and push.** It re-runs automatically.
8. **If you're confused, ask.** A halt is better than a mistake in production.

---

*GIT.md — SideCar Developer Workflow Guide*
