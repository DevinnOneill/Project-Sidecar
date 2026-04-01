#!/bin/bash
# =============================================================
# SideCar — Onboarding Agent v2.0
# Interactive walkthrough for new developers.
# Run once after cloning: bash scripts/onboard.sh
#
# This script follows the White Paper's Developer Onboarding
# protocol (Section VIII) and directives/ONBOARDING.md.
#
# Designed for NON-DEVELOPERS. Every step is explained.
# =============================================================

set -e

# Prevent post-checkout hook from re-triggering during onboarding
export SIDECAR_ONBOARDING=1

# ─── Colors and formatting ───────────────────────────────────
GOLD='\033[0;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

# ─── Helper functions ────────────────────────────────────────
wait_for_enter() {
  echo ""
  echo -e "  ${DIM}Press ENTER to continue...${RESET}"
  read -r
}

clear_screen() {
  # Clear screen but keep scrollback
  printf '\033[2J\033[H'
}

print_header() {
  local title=$1
  echo ""
  echo -e "  ${GOLD}── ${BOLD}${title}${RESET} ${GOLD}────────────────────────────────────────${RESET}"
  echo ""
}

print_check() {
  local description=$1
  local detail=$2
  echo -e "  ${GREEN}✓${RESET} ${description}"
  if [ -n "$detail" ]; then
    echo -e "    ${DIM}${detail}${RESET}"
  fi
}

print_fail() {
  local description=$1
  local detail=$2
  echo -e "  ${RED}✗${RESET} ${description}"
  if [ -n "$detail" ]; then
    echo -e "    ${DIM}${detail}${RESET}"
  fi
}

# ─── Resolve project root ────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# ─── Check if already onboarded ──────────────────────────────
if [ -f .onboarded ]; then
  PREV_NAME=$(grep "^DEVELOPER=" .onboarded 2>/dev/null | cut -d'=' -f2 || echo "developer")
  PREV_DATE=$(grep "^DATE=" .onboarded 2>/dev/null | cut -d'=' -f2 || echo "unknown")
  echo ""
  echo -e "  ${GOLD}You've already been onboarded!${RESET}"
  echo ""
  echo -e "  Developer: ${BOLD}${PREV_NAME}${RESET}"
  echo -e "  Onboarded: ${PREV_DATE}"
  echo ""
  echo "  If you need to re-run onboarding, delete the .onboarded file:"
  echo -e "    ${DIM}rm .onboarded && bash scripts/onboard.sh${RESET}"
  echo ""
  exit 0
fi

# ─── Verify this is a git repo ───────────────────────────────
if [ ! -d .git ]; then
  echo ""
  echo -e "  ${RED}ERROR:${RESET} This doesn't appear to be a git repository."
  echo "  Make sure you've cloned the repo first:"
  echo -e "    ${DIM}git clone https://github.com/DevinnOneill/Project-Sidecar.git${RESET}"
  echo ""
  exit 1
fi

# ─── Verify project structure ────────────────────────────────
if [ ! -f WHITE_PAPER.md ] || [ ! -d directives ] || [ ! -d sidecar-app ]; then
  echo ""
  echo -e "  ${RED}ERROR:${RESET} Project structure doesn't look right."
  echo "  Expected WHITE_PAPER.md, directives/, and sidecar-app/ in the project root."
  echo "  Make sure you're in the Project-Sidecar directory."
  echo ""
  exit 1
fi


# ═══════════════════════════════════════════════════════════════
# SCREEN 1: WELCOME
# ═══════════════════════════════════════════════════════════════

clear_screen

echo ""
echo -e "  ${GOLD}╔═══════════════════════════════════════════════════════════════╗${RESET}"
echo -e "  ${GOLD}║${RESET}                                                               ${GOLD}║${RESET}"
echo -e "  ${GOLD}║${RESET}   ${BOLD}Welcome to SideCar${RESET}                                          ${GOLD}║${RESET}"
echo -e "  ${GOLD}║${RESET}   ${DIM}The Navy's Agentic Distribution Platform${RESET}                     ${GOLD}║${RESET}"
echo -e "  ${GOLD}║${RESET}                                                               ${GOLD}║${RESET}"
echo -e "  ${GOLD}║${RESET}   Navy Personnel Command · NPC Agentic Lab                     ${GOLD}║${RESET}"
echo -e "  ${GOLD}║${RESET}                                                               ${GOLD}║${RESET}"
echo -e "  ${GOLD}╚═══════════════════════════════════════════════════════════════╝${RESET}"
echo ""
echo "  This onboarding agent will walk you through everything you"
echo "  need to get set up. It takes about 5 minutes."
echo ""
echo -e "  Here's what we'll cover:"
echo -e "    ${CYAN}1.${RESET} What SideCar is"
echo -e "    ${CYAN}2.${RESET} How this project works"
echo -e "    ${CYAN}3.${RESET} Setting up your workspace"
echo -e "    ${CYAN}4.${RESET} Knowledge Check (Gate 2 Quiz)"
echo -e "    ${CYAN}5.${RESET} Checking out your team branch"
echo -e "    ${CYAN}6.${RESET} Seeing SideCar in your browser"
echo -e "    ${CYAN}7.${RESET} The 7 Rules"
echo -e "    ${CYAN}8.${RESET} Saving/Committing work"
echo -e "    ${CYAN}9.${RESET} Next steps & Cheat sheet"
echo -e "    ${CYAN}10.${RESET} The Covenant Pledge"

wait_for_enter


# ═══════════════════════════════════════════════════════════════
# SCREEN 2: WHAT IS SIDECAR?
# ═══════════════════════════════════════════════════════════════

clear_screen
print_header "WHAT IS SIDECAR?"

echo "  SideCar modernizes how Navy Personnel Command (NPC)"
echo "  distributes Sailors to assignments. Right now, NPC"
echo "  juggles between multiple tools daily:"
echo ""
echo -e "    ${GOLD}•${RESET} MNA (MyNavy Assignment)"
echo -e "    ${GOLD}•${RESET} NSIPS"
echo -e "    ${GOLD}•${RESET} Outlook"
echo -e "    ${GOLD}•${RESET} Microsoft Tools"
echo -e "    ${GOLD}•${RESET} 1995-Style Excel Sheets"
echo ""
echo "  SideCar unifies all of that into ONE browser-based dashboard."
echo ""
echo -e "  ${BOLD}WHO USES IT:${RESET}"
echo -e "    ${GOLD}•${RESET} EVERY STAKEHOLDER WITHIN NPC"
echo ""

wait_for_enter


# ═══════════════════════════════════════════════════════════════
# SCREEN 3: HOW THIS PROJECT WORKS
# ═══════════════════════════════════════════════════════════════

clear_screen
print_header "HOW THIS PROJECT WORKS"

echo "  This project uses a GOVERNED development framework."
echo "  Here's what that means in plain English:"
echo ""
echo -e "  ${GOLD}✦${RESET} ${BOLD}ONE FILE AT A TIME${RESET}"
echo "    You work on ONE file per session. If your task is on"
echo "    the Detailer Dashboard, you don't touch other files."
echo ""
echo -e "  ${GOLD}✦${RESET} ${BOLD}AN AI ASSISTANT HELPS YOU${RESET}"
echo "    When you open this project in your editor (Cursor,"
echo "    VS Code, or Claude Code), an AI assistant loads"
echo "    automatically. It knows the rules and guides you."
echo ""
echo -e "  ${GOLD}✦${RESET} ${BOLD}GUARDRAILS CATCH MISTAKES${RESET}"
echo "    Git hooks run when you save. If you break a rule —"
echo "    like using a wrong color code — it stops you and"
echo "    tells you exactly how to fix it."
echo ""
echo -e "  ${GOLD}✦${RESET} ${BOLD}CODE REVIEW BEFORE PRODUCTION${RESET}"
echo "    Your code goes to your TEAM branch first, then to"
echo "    qa-staging for review, then to production. Nobody's"
echo "    code goes straight to production."
echo ""
echo -e "  ${GOLD}✦${RESET} ${BOLD}HALTS ARE GOOD${RESET}"
echo -e "    If the system stops you, that's a ${BOLD}guardrail${RESET},"
echo -e "    not a punishment. Read the message, fix it, try again."

wait_for_enter


# ═══════════════════════════════════════════════════════════════
# SCREEN 4: NAME + AUTO-SETUP
# ═══════════════════════════════════════════════════════════════

clear_screen
print_header "SETTING UP YOUR WORKSPACE"

echo "  First, what's your name?"
echo ""
read -r -p "  > " DEV_NAME

# Validate name
if [ -z "$DEV_NAME" ]; then
  echo ""
  echo -e "  ${RED}We need your name to create your branch.${RESET}"
  echo "  Run the script again: bash scripts/onboard.sh"
  echo ""
  exit 1
fi

# Sanitize name for branch (lowercase, replace spaces with hyphens)
DEV_NAME_CLEAN=$(echo "$DEV_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd 'a-z0-9-')

echo ""
echo -e "  Great to have you, ${BOLD}${DEV_NAME}${RESET}! Setting things up..."
echo ""

# ── Step 1: Activate git hooks ────────────────────────────────
git config core.hooksPath .githooks
HOOKS_CHECK=$(git config core.hooksPath)
if [ "$HOOKS_CHECK" = ".githooks" ]; then
  print_check "Git hooks activated" "These catch mistakes before they reach the team"
else
  print_fail "Git hooks failed to activate" "Run manually: git config core.hooksPath .githooks"
fi

# ── Step 2: Pull latest from main ─────────────────────────────
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  git checkout main --quiet 2>/dev/null || true
fi

if git pull origin main --quiet 2>/dev/null; then
  print_check "Pulled latest code from main branch" "You're working with the most current version"
else
  print_check "Using local version of main" "Couldn't reach GitHub — that's okay, using what you have"
fi

# ── Step 3: Verify font files ─────────────────────────────────
FONTS_OK=true
REQUIRED_FONTS=("Verdana" "DMMono")
MISSING_FONTS=""

for FONT in "${REQUIRED_FONTS[@]}"; do
  if ! ls sidecar-app/public/fonts/*${FONT}* 1>/dev/null 2>&1; then
    FONTS_OK=false
    MISSING_FONTS="${MISSING_FONTS} ${FONT}"
  fi
done

if [ "$FONTS_OK" = true ]; then
  print_check "Verified fonts: Verdana, DM Mono" "These are the official SideCar typefaces"
else
  print_fail "Font files not found:${MISSING_FONTS}" "Non-blocking — SideCar uses system fallback fonts"
fi

# ── Step 4: Verify core files ─────────────────────────────────
CORE_FILES=("sidecar-app/package.json" "sidecar-app/src/App.tsx" "sidecar-app/src/index.css")
CORE_OK=true
MISSING_CORE=""

for FILE in "${CORE_FILES[@]}"; do
  if [ ! -f "$FILE" ]; then
    CORE_OK=false
    MISSING_CORE="${MISSING_CORE} ${FILE}"
  fi
done

if [ "$CORE_OK" = true ]; then
  print_check "Verified all application files present" "package.json, App.tsx, index.css"
else
  print_fail "Some files missing:${MISSING_CORE}" "Check the sidecar-app/ directory"
fi

echo ""
echo "  All good!"

wait_for_enter


# ═══════════════════════════════════════════════════════════════
# SCREEN 5: YOUR TEAM BRANCH
# ═══════════════════════════════════════════════════════════════

clear_screen
print_header "YOUR TEAM BRANCH"

echo "  This project uses FIXED branches. Each developer is assigned"
echo "  to a team branch. You do NOT create your own branch."
echo ""
echo -e "  ${BOLD}BRANCH MODEL:${RESET}"
echo -e "    ${GOLD}dev-1${RESET}        →  Development Team 1"
echo -e "    ${GOLD}dev-2${RESET}        →  Development Team 2"
echo -e "    ${GOLD}qa-staging${RESET}   →  QA / Tier 1 only"
echo -e "    ${GOLD}main${RESET}         →  Production (protected)"
echo ""

# Branch assignments (update when team changes)
declare -A BRANCH_MAP
BRANCH_MAP["CoolCatCoding"]="dev-1"
BRANCH_MAP["DevvOneill"]="dev-1"
BRANCH_MAP["Abbiera"]="dev-2"
BRANCH_MAP["brown-water"]="dev-2"
BRANCH_MAP["DevinnOneill"]="qa-staging"

echo "  What is your GitHub username?"
echo ""
read -r -p "  > " GH_USERNAME

ASSIGNED_BRANCH="${BRANCH_MAP[$GH_USERNAME]:-}"

if [ -z "$ASSIGNED_BRANCH" ]; then
  echo ""
  print_fail "You are not assigned to a dev branch." ""
  echo ""
  echo -e "  ${BOLD}Contact Tier 1 (DevinnOneill) to be added to a team.${RESET}"
  echo "  Once assigned, re-run: bash scripts/onboard.sh"
  echo ""
  # Still allow onboarding to complete for orientation purposes
  BRANCH_NAME="unassigned"
  echo -e "  ${DIM}Continuing onboarding for orientation...${RESET}"
else
  # Checkout the assigned branch (do NOT create new branches)
  if git checkout "$ASSIGNED_BRANCH" --quiet 2>/dev/null; then
    print_check "Switched to your assigned branch: ${ASSIGNED_BRANCH}" ""
  else
    # Branch may not exist locally yet — try fetching it
    if git fetch origin "$ASSIGNED_BRANCH" --quiet 2>/dev/null && \
       git checkout "$ASSIGNED_BRANCH" --quiet 2>/dev/null; then
      print_check "Checked out branch from remote: ${ASSIGNED_BRANCH}" ""
    else
      print_fail "Could not checkout ${ASSIGNED_BRANCH}" "Make sure the branch exists on the remote"
    fi
  fi
  BRANCH_NAME="$ASSIGNED_BRANCH"
fi

echo ""
echo -e "  ${BOLD}HOW CHANGES REACH PRODUCTION:${RESET}"
echo ""
echo -e "    ${GOLD}dev-1 / dev-2${RESET}  →  ${CYAN}qa-staging${RESET}  →  ${GREEN}main${RESET}"
echo -e "      ${DIM}(your team)       (review)       (production)${RESET}"
echo ""
echo "  Nobody's code goes straight to production. Ever."

wait_for_enter


# ═══════════════════════════════════════════════════════════════
# SCREEN 6: LAUNCHING SIDECAR
# ═══════════════════════════════════════════════════════════════

clear_screen
print_header "LAUNCHING SIDECAR"

echo "  To launch SideCar locally, run the dev server:"
echo ""
echo -e "    ${DIM}cd sidecar-app && npm install && npm run dev${RESET}"
echo ""

APP_DIR="${PROJECT_ROOT}/sidecar-app"
BROWSER_OPENED=false

if [ -f "$APP_DIR/package.json" ]; then
  print_check "Vite + React app found: sidecar-app/" ""
  echo ""
  echo "  After running 'npm run dev', the app will open at:"
  echo -e "    ${CYAN}http://localhost:5173${RESET}"
  echo ""
  read -r -p "  > Have you launched the dev server? (y/n): " BROWSER_VERIFY
  BROWSER_OPENED=true
  if [[ ! "$BROWSER_VERIFY" =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "  ${RED}Note:${RESET} You can launch the dev server later with:"
    echo -e "    ${DIM}cd sidecar-app && npm run dev${RESET}"
    wait_for_enter
  fi
else
  print_fail "sidecar-app/package.json not found" ""
  echo -e "  Make sure the sidecar-app/ directory exists and run: ${DIM}cd sidecar-app && npm install${RESET}"
  wait_for_enter
fi



# ═══════════════════════════════════════════════════════════════
# SCREEN 4: KNOWLEDGE CHECK (GATE 2)
# ═══════════════════════════════════════════════════════════════

clear_screen
print_header "KNOWLEDGE CHECK (GATE 2)"

echo "  Section VIII of the White Paper requires a Load Confirmation."
echo "  Answer these 6 questions correctly to clear the gate."
echo ""

SCORE=0

# Question 1: Stack
read -r -p "  1. What front-end stack does SideCar use? (react/vue/angular): " ANS1
if [[ "$ANS1" =~ ^[Rr]eact$ ]]; then
  print_check "Correct" "Vite + React + TypeScript."
  SCORE=$((SCORE+1))
else
  print_fail "Incorrect" "SideCar uses Vite + React + TypeScript."
fi
echo ""

# Question 2: fetch()
read -r -p "  2. Can you use fetch() directly to get data from an API? (y/n): " ANS2
if [[ "$ANS2" =~ ^[Nn]$ ]]; then
  print_check "Correct" "Always use the SideCarAdapter in src/services/."
  SCORE=$((SCORE+1))
else
  print_fail "Incorrect" "No direct fetch() calls. All data must route through the SideCarAdapter."
fi
echo ""

# Question 3: Modules
read -r -p "  3. Can you edit multiple files in a single session? (y/n): " ANS3
if [[ "$ANS3" =~ ^[Nn]$ ]]; then
  print_check "Correct" "One file/module per session. Boundary integrity is key."
  SCORE=$((SCORE+1))
else
  print_fail "Incorrect" "One file per session. Start a new session for each module."
fi
echo ""

# Question 4: Ambiguity
read -r -p "  4. What do you do if your Execution Script is ambiguous? (guess/halt): " ANS4
if [[ "$ANS4" =~ ^halt$ ]]; then
  print_check "Correct" "Interpretation is failure. Halt and request clarification."
  SCORE=$((SCORE+1))
else
  print_fail "Incorrect" "Never guess. Interpretation leads to governance violation."
fi
echo ""

# Question 5: Data Source
read -r -p "  5. All data must route through the SideCar_______? (fill blank): " ANS5
if [[ "$ANS5" =~ ^[Aa]dapter$ ]]; then
  print_check "Correct" "The SideCarAdapter decouples UI from the underlying source."
  SCORE=$((SCORE+1))
else
  print_fail "Incorrect" "The SideCarAdapter. Never access raw data arrays directly."
fi
echo ""

# Question 6: QA Threshold
read -r -p "  6. What is the passing threshold for QA dimensions (out of 10)? " ANS6
if [ "$ANS6" = "7" ]; then
  print_check "Correct" "7/10 in all four dimensions (Clarity, Specificity, etc.)"
  SCORE=$((SCORE+1))
else
  print_fail "Incorrect" "The threshold is 7/10. Anything less is a remediation halt."
fi

echo ""
if [ $SCORE -eq 6 ]; then
  echo -e "  ${GREEN}${BOLD}GATE 2 CLEARED:${RESET} Perfect score. You are ready for the rules."
else
  echo -e "  ${RED}${BOLD}GATE 2 FLAG:${RESET} You got $SCORE/6 correct. Read ONBOARDING.md carefully."
fi

wait_for_enter


# ═══════════════════════════════════════════════════════════════
# SCREEN 7: THE 7 RULES OF SIDECAR
# ═══════════════════════════════════════════════════════════════

# --- Rule 1 ---
clear_screen
print_header "THE RULES OF THE ROAD"

echo "  There are 7 rules every developer must follow."
echo "  The system enforces these automatically — but you should"
echo "  know what they are. Let's walk through them."
echo ""
echo -e "  ${GOLD}RULE 1 of 7:${RESET} ${BOLD}No direct fetch() calls${RESET}"
echo -e "  ${DIM}────────────────────────────${RESET}"
echo "  All data comes through the SideCarAdapter in src/services/."
echo "  Never call fetch() directly in your components."
echo ""
echo -e "  ${CYAN}WHY:${RESET} The adapter decouples the UI from data sources."
echo "  Today it uses synthetic data; tomorrow it connects to real APIs."

wait_for_enter

# --- Rule 2 ---
clear_screen
print_header "THE RULES OF THE ROAD"

echo -e "  ${GOLD}RULE 2 of 7:${RESET} ${BOLD}No hardcoded colors${RESET}"
echo -e "  ${DIM}────────────────────────────${RESET}"
echo "  Use CSS tokens like var(--color-gold-primary)."
echo "  Never write hex values like #B88E48 in your CSS."
echo ""
echo -e "  ${CYAN}WHY:${RESET} Keeps the design consistent. Change one token and"
echo "  it updates everywhere across all pages automatically."

wait_for_enter

# --- Rule 3 ---
clear_screen
print_header "THE RULES OF THE ROAD"

echo -e "  ${GOLD}RULE 3 of 7:${RESET} ${BOLD}No unauthorized dependencies${RESET}"
echo -e "  ${DIM}────────────────────────────${RESET}"
echo "  SideCar uses Vite + React + TypeScript. Do NOT add"
echo "  extra packages (Tailwind, MUI, etc.) without Tier 1 approval."
echo ""
echo -e "  ${CYAN}WHY:${RESET} Every dependency must be reviewed for NMCI compliance."
echo "  Keep the bundle lean and approved."

wait_for_enter

# --- Rule 4 ---
clear_screen
print_header "THE RULES OF THE ROAD"

echo -e "  ${GOLD}RULE 4 of 7:${RESET} ${BOLD}One module per session${RESET}"
echo -e "  ${DIM}────────────────────────────${RESET}"
echo "  Working on src/Workspace/? Don't edit src/index.css too."
echo "  Need to change another module? Start a new session."
echo ""
echo -e "  ${CYAN}WHY:${RESET} Prevents conflicts when multiple people work"
echo "  at the same time."

wait_for_enter

# --- Rule 5 ---
clear_screen
print_header "THE RULES OF THE ROAD"

echo -e "  ${GOLD}RULE 5 of 7:${RESET} ${BOLD}Synthetic data only${RESET}"
echo -e "  ${DIM}────────────────────────────${RESET}"
echo "  No real names, SSNs, DODIDs, or command identifiers."
echo "  All data is fabricated with realistic structure."
echo ""
echo -e "  ${CYAN}WHY:${RESET} Phase 1A has no authorization for real data."
echo "  This is a legal requirement."

wait_for_enter

# --- Rule 6 ---
clear_screen
print_header "THE RULES OF THE ROAD"

echo -e "  ${GOLD}RULE 6 of 7:${RESET} ${BOLD}Light mode only${RESET}"
echo -e "  ${DIM}────────────────────────────${RESET}"
echo "  White surfaces with brass gold accents. That's the"
echo "  Covenant design system. No dark mode."
echo ""
echo -e "  ${CYAN}WHY:${RESET} This is the official SideCar design language."
echo "  Consistency across all pages and all users."

wait_for_enter

# --- Rule 7 ---
clear_screen
print_header "THE RULES OF THE ROAD"

echo -e "  ${GOLD}RULE 7 of 7:${RESET} ${BOLD}Adapter pattern only${RESET}"
echo -e "  ${DIM}────────────────────────────${RESET}"
echo "  All data goes through the SideCarAdapter in src/services/."
echo "  Never access data arrays directly from component code."
echo ""
echo -e "  ${CYAN}WHY:${RESET} The adapter swaps between synthetic, CSV, and"
echo "  API data without changing any page code. Today it"
echo "  returns fake data. Tomorrow it connects to real systems."
echo "  Same code, different source."

wait_for_enter


# ═══════════════════════════════════════════════════════════════
# SCREEN 8: HOW TO SAVE YOUR WORK
# ═══════════════════════════════════════════════════════════════

clear_screen
print_header "HOW TO SAVE YOUR WORK"

echo "  When you're ready to save (\"commit\") your code, use this"
echo "  format for your commit message:"
echo ""
echo -e "    ${GOLD}[SC-2026-0327-001] MOD-DET: Add PRD column to dashboard${RESET}"
echo ""
echo -e "  ${BOLD}BREAKING IT DOWN:${RESET}"
echo -e "    ${CYAN}SC-2026-0327-001${RESET}  →  Session ID (today's date + number)"
echo -e "    ${CYAN}MOD-DET${RESET}           →  Which module you worked on"
echo -e "    ${CYAN}Description${RESET}       →  What you did (brief)"
echo ""
echo -e "  ${BOLD}MODULE IDS:${RESET}"
echo -e "    ${DIM}MOD-LAND${RESET}   →  src/Landing/        ${DIM}(Landing / Role Selection)${RESET}"
echo -e "    ${DIM}MOD-WORK${RESET}   →  src/Workspace/      ${DIM}(Detailer Workspace)${RESET}"
echo -e "    ${DIM}MOD-MEMBER${RESET} →  src/Personnel/      ${DIM}(Sailor Record View)${RESET}"
echo -e "    ${DIM}MOD-CMD${RESET}    →  src/Command/        ${DIM}(Command Manning View)${RESET}"
echo -e "    ${DIM}MOD-ANLYT${RESET}  →  src/Analytics/      ${DIM}(Analytics Dashboard)${RESET}"
echo -e "    ${DIM}MOD-SEARCH${RESET} →  src/AdvancedSearch/ ${DIM}(Advanced Search)${RESET}"
echo -e "    ${DIM}MOD-CSS${RESET}    →  src/index.css       ${DIM}(Design System)${RESET}"
echo -e "    ${DIM}MOD-SVC${RESET}    →  src/services/       ${DIM}(Shared Logic + Data)${RESET}"
echo ""
echo "  Don't worry about memorizing this — the AI assistant"
echo "  will help you, and the git hooks catch formatting errors."

wait_for_enter


# ═══════════════════════════════════════════════════════════════
# SCREEN 9: NEXT STEPS & CHEAT SHEET
# ═══════════════════════════════════════════════════════════════

clear_screen
print_header "GIT QUICK REFERENCE"

echo "  Here are the git commands you'll use most often."
echo "  Copy-paste these — no need to memorize."
echo ""
echo -e "  ${BOLD}See what you changed:${RESET}"
echo -e "    ${DIM}git status${RESET}"
echo ""
echo -e "  ${BOLD}Save a file for commit:${RESET}"
echo -e "    ${DIM}git add sidecar-app/src/Workspace/WorkspacePage.tsx${RESET}"
echo ""
echo -e "  ${BOLD}Commit your work:${RESET}"
echo -e "    ${DIM}git commit -m \"[SC-2026-0327-001] MOD-DET: Your description\"${RESET}"
echo ""
echo -e "  ${BOLD}Push to GitHub:${RESET}"
echo -e "    ${DIM}git push origin ${BRANCH_NAME}${RESET}"
echo ""
echo -e "  ${BOLD}Pull latest from your team branch:${RESET}"
echo -e "    ${DIM}git pull origin ${BRANCH_NAME}${RESET}"
echo ""
echo -e "  ${BOLD}See what branch you're on:${RESET}"
echo -e "    ${DIM}git branch${RESET}"
echo ""
echo "  The full reference is in GIT.md — read that next."

wait_for_enter


# ═══════════════════════════════════════════════════════════════
# REFERENCE: WHAT TO READ NEXT
# ═══════════════════════════════════════════════════════════════

clear_screen
print_header "WHAT TO READ NEXT"

echo "  You don't need to memorize everything today. But DO read"
echo "  these documents in this order when you have 30 minutes:"
echo ""
echo -e "    ${GOLD}📖  1.${RESET} ${BOLD}ONBOARDING.md${RESET}            ${DIM}(10 min)${RESET}"
echo "          The rules in plain English. Start here."
echo ""
echo -e "    ${GOLD}📖  2.${RESET} ${BOLD}GIT.md${RESET}                   ${DIM}(10 min)${RESET}"
echo "          Step-by-step git workflow with examples."
echo ""
echo -e "    ${GOLD}📖  3.${RESET} ${BOLD}directives/Gemini.md${RESET}     ${DIM}(10 min)${RESET}"
echo "          Master governance framework."
echo "          (The AI reads this automatically — you should too.)"
echo ""
echo "  The remaining directives in directives/ are reference"
echo "  material. You don't need to read them all on day one."

wait_for_enter


# ═══════════════════════════════════════════════════════════════
# SCREEN 10: THE COVENANT PLEDGE
# ═══════════════════════════════════════════════════════════════

clear_screen
print_header "THE COVENANT PLEDGE"

echo "  Final step. To acknowledge that you understand the rules"
echo "  and our governed development framework, please type"
echo "  exactly \"I AGREE\" to finalize your onboarding."
echo ""

while true; do
  read -r -p "  > " PLEDGE
  if [ "$PLEDGE" = "I AGREE" ]; then
    echo ""
    print_check "Covenant signed. Welcome aboard."
    break
  else
    echo -e "  ${RED}Please type \"I AGREE\" to continue.${RESET}"
  fi
done

wait_for_enter

# ═══════════════════════════════════════════════════════════════
# FINAL STEP: THE GOVERNANCE HANDSHAKE
# ═══════════════════════════════════════════════════════════════

clear_screen
print_header "THE GOVERNANCE HANDSHAKE"

echo "  You have completed the orientation. To finalize your"
echo "  onboarding, you must perform a manual handshake with"
echo "  the SideCar AI Agent."
echo ""
echo -e "  ${BOLD}INSTRUCTIONS:${RESET}"
echo "  1. Copy the text block between the lines below."
echo "  2. Paste it into your AI Agent chat window."
echo "  3. The Agent will verify your signature and walk you through."
echo ""
echo -e "  ${GOLD}┌────────────────────────────────────────────────────────────┐${RESET}"
echo -e "  ${CYAN}I, ${DEV_NAME}, have completed SideCar Onboarding v2.0.${RESET}"
echo -e "  ${CYAN}I acknowledge the 7 Rules of the Road and the My Compass${RESET}"
echo -e "  ${CYAN}Governance Framework. SideCar Agent, please verify my signature${RESET}"
echo -e "  ${CYAN}and begin my loading protocol.${RESET}"
echo -e "  ${GOLD}└────────────────────────────────────────────────────────────┘${RESET}"
echo ""
echo "  The script will stay paused until you have performed"
echo "  this manual submission."
echo ""

wait_for_enter

# ═══════════════════════════════════════════════════════════════
# CREATE SENTINEL FILE
# ═══════════════════════════════════════════════════════════════

cat > .onboarded << EOF
DEVELOPER=${DEV_NAME}
DEVELOPER_CLEAN=${DEV_NAME_CLEAN}
GITHUB_USERNAME=${GH_USERNAME}
BRANCH=${BRANCH_NAME}
DATE=$(date +%Y-%m-%d)
TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF


# ═══════════════════════════════════════════════════════════════
# ONBOARDING COMPLETE
# ═══════════════════════════════════════════════════════════════

clear_screen

echo ""
echo -e "  ${GOLD}╔═══════════════════════════════════════════════════════════════╗${RESET}"
echo -e "  ${GOLD}║${RESET}                                                               ${GOLD}║${RESET}"
echo -e "  ${GOLD}║${RESET}   ${BOLD}You're all set, ${DEV_NAME}! Welcome to the team.${RESET} 🎉             ${GOLD}║${RESET}"
echo -e "  ${GOLD}║${RESET}                                                               ${GOLD}║${RESET}"
echo -e "  ${GOLD}╚═══════════════════════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "  ${BOLD}HERE'S WHAT WE SET UP:${RESET}"
echo ""
if [ "$HOOKS_CHECK" = ".githooks" ]; then
  print_check "Git hooks activated" "catches mistakes automatically"
else
  print_fail "Git hooks (manual setup needed)" ""
fi
print_check "Assigned branch: ${BRANCH_NAME}" ""
if [ "$FONTS_OK" = true ]; then
  print_check "Fonts verified" ""
else
  echo -e "  ${RED}✗${RESET} Fonts missing (non-blocking — system fallbacks will work)"
fi
if [ "$CORE_OK" = true ]; then
  print_check "Application files verified" ""
fi
if [ "$BROWSER_OPENED" = true ]; then
  print_check "Dev server instructions provided" ""
fi
echo ""
echo -e "  ${GOLD}── TO START YOUR FIRST TASK ────────────────────────────────${RESET}"
echo ""
echo "  1. Open this folder in your editor:"
echo -e "       ${DIM}cursor .${RESET}    (Cursor)"
echo -e "       ${DIM}code .${RESET}      (VS Code)"
echo -e "       ${DIM}claude .${RESET}    (Claude Code)"
echo ""
echo "  2. The AI assistant will ask you what you're working on."
echo ""
echo "  3. Make sure you're on your assigned branch:"
echo -e "       ${DIM}git checkout ${BRANCH_NAME}${RESET}"
echo -e "       ${DIM}git pull origin ${BRANCH_NAME}${RESET}"
echo ""
echo -e "  ${GOLD}── REMEMBER ───────────────────────────────────────────────${RESET}"
echo ""
echo "  • One file per session"
echo "  • Push to your assigned branch (${BRANCH_NAME}) — never create new branches"
echo "  • Ask your AI assistant if you're unsure about anything"
echo "  • A halt is a guardrail, not a punishment"
echo "  • Read ONBOARDING.md when you have 10 minutes"
echo "  • Questions? Ask the team or your AI assistant"
echo ""
echo -e "  ${GOLD}═══════════════════════════════════════════════════════════════${RESET}"
echo -e "  ${DIM}  SideCar Onboarding Agent v2.0${RESET}"
echo -e "  ${DIM}  Governed by My Compass Framework v4.0${RESET}"
echo -e "  ${GOLD}═══════════════════════════════════════════════════════════════${RESET}"
echo ""
