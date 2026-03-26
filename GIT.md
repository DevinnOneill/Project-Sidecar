# Git Workflow Guide

> Step-by-step guide for every developer on the SideCar team.
> If you've never used Git before, this walks you through everything.

---

## The Big Picture

Your code moves through three stages before it reaches production:

```
YOUR BRANCH → qa-staging → main
   (you)        (QA review)    (Tier 1 merge)
```

Nothing skips a stage. Nothing goes backwards.

---

## One-Time Setup (Do This After Cloning)

```bash
# 1. Clone the repo
git clone https://github.com/DevinnOneill/Project-Sidecar.git
cd Project-Sidecar

# 2. Activate the git hooks (catches mistakes before they reach GitHub)
git config core.hooksPath .githooks

# 3. Confirm it worked
git config core.hooksPath
# Should print: .githooks
```

---

## Starting a Task

### Step 1: Make sure you're up to date

```bash
# Pull the latest from main
git checkout main
git pull origin main
```

### Step 2: Create your branch

Branch naming: `dev/[your-name]/[module-id]-[description]`

```bash
git checkout -b dev/abby/mod-det-prd-column
```

**Module IDs:**
| Module ID | File | Description |
|-----------|------|-------------|
| `mod-land` | `app/landing.html` | Landing page |
| `mod-det` | `app/detailer.html` | Detailer Dashboard |
| `mod-plac` | `app/placement.html` | Placement Coordinator |
| `mod-anlyt` | `app/analytics.html` | Analytics Dashboard |
| `mod-css` | `app/style.css` | Design system |
| `mod-js` | `app/app.js` | Shared logic + data |

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
git add app/detailer.html

# DON'T do: git add .  (this can accidentally add files outside your module)
```

### Step 3: Commit with the required format

```bash
git commit -m "[SC-2026-0326-001] MOD-DET: Add PRD tier column to dashboard table

- Modified: app/detailer.html
- Task: Render PRD tiers with semantic color badges
- Constraints: C-11, C-12, C-14"
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
# First time pushing this branch:
git push -u origin dev/abby/mod-det-prd-column

# Subsequent pushes on the same branch:
git push
```

**This puts your code on GitHub under YOUR branch.** It does NOT touch `qa-staging` or `main`.

---

## Opening a Pull Request (PR)

A PR is a request to merge your branch into `qa-staging`. Here's how:

### Option A: GitHub website (easiest)

1. Go to https://github.com/DevinnOneill/Project-Sidecar
2. You'll see a yellow banner: "dev/abby/mod-det-prd-column had recent pushes"
3. Click **"Compare & pull request"**
4. Make sure **base** is set to `qa-staging` (NOT main)
5. Write a title and description of what you did
6. Click **"Create pull request"**

### Option B: Terminal (if you have `gh` installed)

```bash
gh pr create --base qa-staging --title "MOD-DET: Add PRD tier column" --body "Session: SC-2026-0326-001"
```

---

## What Happens After You Open a PR

### 1. The QA Agent runs automatically

Within 1-2 minutes, a bot will post a comment on your PR with a full report:

```
SideCar QA Agent Report

Quick Brief for Reviewer:
  abbieyra is merging dev/abby/mod-det-prd-column → qa-staging
  3 files changed in MOD-DET | Merge: clean
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

Only Tier 1 (Devin) can merge from `qa-staging` into `main`. This is the final gate.

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
git add app/detailer.html

# Commit
git commit -m "[SC-2026-0326-001] MOD-DET: Brief description"

# Push
git push -u origin dev/yourname/mod-det-description

# Switch to a different branch
git checkout main

# Create a new branch from main
git checkout main
git pull origin main
git checkout -b dev/yourname/mod-plac-new-task

# See recent commits
git log --oneline -10
```

---

## Rules to Remember

1. **Never push to `main` directly.** Everything goes through PRs.
2. **Never push to `qa-staging` directly.** Open a PR targeting it.
3. **One module per branch.** `dev/abby/mod-det-table` only touches `app/detailer.html`.
4. **One task per branch.** Finish the task, push, PR. Start a new branch for the next task.
5. **Always pull main before creating a new branch.** Keeps you up to date.
6. **If your commit fails, read the error.** The hooks tell you exactly what's wrong.
7. **If the QA Agent fails your PR, fix and push.** It re-runs automatically.
8. **If you're confused, ask.** A halt is better than a mistake in production.

---

*GIT.md — SideCar Developer Workflow Guide*
