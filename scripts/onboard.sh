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
  echo -e "    ${DIM}git clone https://github.com/matthewcla/SideCar-Concept.git${RESET}"
  echo ""
  exit 1
fi

# ─── Verify project structure ────────────────────────────────
if [ ! -f WHITE_PAPER.md ] || [ ! -d directives ] || [ ! -d app ]; then
  echo ""
  echo -e "  ${RED}ERROR:${RESET} Project structure doesn't look right."
  echo "  Expected WHITE_PAPER.md, directives/, and app/ in the project root."
  echo "  Make sure you're in the SideCar-Concept directory."
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
echo -e "    ${CYAN}5.${RESET} Creating your personal branch"
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
echo "    Your code goes to YOUR branch first, then to a"
echo "    review branch, then to production. Nobody's code"
echo "    goes straight to production."
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
  if ! ls app/fonts/*${FONT}* 1>/dev/null 2>&1; then
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
CORE_FILES=("app/landing.html" "app/detailer.html" "app/placement.html" "app/analytics.html" "app/style.css" "app/app.js")
CORE_OK=true
MISSING_CORE=""

for FILE in "${CORE_FILES[@]}"; do
  if [ ! -f "$FILE" ]; then
    CORE_OK=false
    MISSING_CORE="${MISSING_CORE} ${FILE}"
  fi
done

if [ "$CORE_OK" = true ]; then
  print_check "Verified all application files present" "Landing, Detailer Dashboard, Placement, Analytics"
else
  print_fail "Some files missing:${MISSING_CORE}" "Check the app/ directory"
fi

echo ""
echo "  All good!"

wait_for_enter


# ═══════════════════════════════════════════════════════════════
# SCREEN 5: YOUR PERSONAL BRANCH
# ═══════════════════════════════════════════════════════════════

clear_screen
print_header "YOUR PERSONAL BRANCH"

echo "  In this project, everyone works on their OWN copy of the"
echo "  code called a \"branch.\" Think of it like your own workspace"
echo "  that doesn't affect anyone else until your work is reviewed."
echo ""

BRANCH_NAME="dev/${DEV_NAME_CLEAN}/onboarding-setup"

# Create or switch to branch
if git show-ref --verify --quiet "refs/heads/${BRANCH_NAME}" 2>/dev/null; then
  git checkout "$BRANCH_NAME" --quiet
  print_check "Switched to existing branch: ${BRANCH_NAME}" ""
else
  git checkout -b "$BRANCH_NAME" --quiet
  print_check "Branch created: ${BRANCH_NAME}" ""
fi

echo ""
echo -e "  ${BOLD}HOW CHANGES REACH PRODUCTION:${RESET}"
echo ""
echo -e "    ${GOLD}Your Branch${RESET}  →  ${CYAN}QA Review${RESET}  →  ${GREEN}Production${RESET}"
echo -e "      ${DIM}(you)          (team)        (approved)${RESET}"
echo ""
echo "  Nobody's code goes straight to production. Ever."

wait_for_enter


# ═══════════════════════════════════════════════════════════════
# SCREEN 6: LAUNCHING SIDECAR
# ═══════════════════════════════════════════════════════════════

clear_screen
print_header "LAUNCHING SIDECAR"

echo "  Opening SideCar in your browser now..."
echo ""

LANDING_PATH="${PROJECT_ROOT}/app/landing.html"
BROWSER_OPENED=false

if [ -f "$LANDING_PATH" ]; then
  if command -v open &>/dev/null; then
    open "$LANDING_PATH"
    BROWSER_OPENED=true
  elif command -v xdg-open &>/dev/null; then
    xdg-open "$LANDING_PATH"
    BROWSER_OPENED=true
  elif command -v start &>/dev/null; then
    start "$LANDING_PATH"
    BROWSER_OPENED=true
  fi
fi

if [ "$BROWSER_OPENED" = true ]; then
  print_check "Opened: app/landing.html" ""
  echo ""
  read -r -p "  > Did the SideCar landing page open in your browser? (y/n): " BROWSER_VERIFY
  if [[ ! "$BROWSER_VERIFY" =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "  ${RED}Wait!${RESET} We need to make sure you can see the app before we continue."
    echo "  Please open this file manually: ${DIM}file://${LANDING_PATH}${RESET}"
    wait_for_enter
  fi
else
  print_fail "Could not open browser automatically" ""
  echo -e "  Open this file manually: ${DIM}file://${LANDING_PATH}${RESET}"
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

# Question 1: Framework
read -r -p "  1. Are you allowed to install React, Vue, or Tailwind? (y/n): " ANS1
if [[ "$ANS1" =~ ^[Nn]$ ]]; then
  print_check "Correct" "Vanilla HTML, CSS, and JS only."
  SCORE=$((SCORE+1))
else
  print_fail "Incorrect" "No frameworks allowed. SideCar must be dependency-free for NMCI."
fi
echo ""

# Question 2: fetch()
read -r -p "  2. Can you use fetch() to get data from an API? (y/n): " ANS2
if [[ "$ANS2" =~ ^[Nn]$ ]]; then
  print_check "Correct" "Always use the SideCarAdapter in app/app.js."
  SCORE=$((SCORE+1))
else
  print_fail "Incorrect" "No fetch() calls. SideCar must work offline from file:// protocol."
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
echo -e "  ${GOLD}RULE 1 of 7:${RESET} ${BOLD}No fetch() calls${RESET}"
echo -e "  ${DIM}────────────────────────────${RESET}"
echo "  All data comes through the SideCarAdapter in app/app.js."
echo "  Never call fetch() directly in your code."
echo ""
echo -e "  ${CYAN}WHY:${RESET} SideCar must work from local files on Navy (NMCI)"
echo "  computers with no internet access. fetch() would break that."

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

echo -e "  ${GOLD}RULE 3 of 7:${RESET} ${BOLD}No npm, no frameworks${RESET}"
echo -e "  ${DIM}────────────────────────────${RESET}"
echo "  No React, no Vue, no Tailwind, no npm install."
echo "  Vanilla HTML, CSS, and JavaScript only."
echo ""
echo -e "  ${CYAN}WHY:${RESET} Navy NMCI computers can't run Node.js or npm."
echo "  The whole app is a folder you can put on a USB drive."

wait_for_enter

# --- Rule 4 ---
clear_screen
print_header "THE RULES OF THE ROAD"

echo -e "  ${GOLD}RULE 4 of 7:${RESET} ${BOLD}One module per session${RESET}"
echo -e "  ${DIM}────────────────────────────${RESET}"
echo "  Working on detailer.html? Don't edit style.css too."
echo "  Need to change another file? Start a new session."
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
echo "  All data goes through the SideCarAdapter. Never"
echo "  access data arrays directly from page code."
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
echo -e "    ${DIM}MOD-LAND${RESET}   →  app/landing.html    ${DIM}(Landing page)${RESET}"
echo -e "    ${DIM}MOD-DET${RESET}    →  app/detailer.html   ${DIM}(Detailer Dashboard)${RESET}"
echo -e "    ${DIM}MOD-PLAC${RESET}   →  app/placement.html  ${DIM}(Placement Coordinator)${RESET}"
echo -e "    ${DIM}MOD-ANLYT${RESET}  →  app/analytics.html  ${DIM}(Analytics Dashboard)${RESET}"
echo -e "    ${DIM}MOD-CSS${RESET}    →  app/style.css       ${DIM}(Design system)${RESET}"
echo -e "    ${DIM}MOD-JS${RESET}     →  app/app.js          ${DIM}(Shared logic + data)${RESET}"
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
echo -e "    ${DIM}git add app/detailer.html${RESET}"
echo ""
echo -e "  ${BOLD}Commit your work:${RESET}"
echo -e "    ${DIM}git commit -m \"[SC-2026-0327-001] MOD-DET: Your description\"${RESET}"
echo ""
echo -e "  ${BOLD}Push to GitHub:${RESET}"
echo -e "    ${DIM}git push -u origin dev/${DEV_NAME_CLEAN}/your-branch-name${RESET}"
echo ""
echo -e "  ${BOLD}Start a new task (new branch):${RESET}"
echo -e "    ${DIM}git checkout main${RESET}"
echo -e "    ${DIM}git pull origin main${RESET}"
echo -e "    ${DIM}git checkout -b dev/${DEV_NAME_CLEAN}/mod-det-new-task${RESET}"
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
print_check "Branch created: ${BRANCH_NAME}" ""
if [ "$FONTS_OK" = true ]; then
  print_check "Fonts verified" ""
else
  echo -e "  ${RED}✗${RESET} Fonts missing (non-blocking — system fallbacks will work)"
fi
if [ "$CORE_OK" = true ]; then
  print_check "Application files verified" ""
fi
if [ "$BROWSER_OPENED" = true ]; then
  print_check "SideCar is open in your browser" ""
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
echo "  3. Create your task branch:"
echo -e "       ${DIM}git checkout main${RESET}"
echo -e "       ${DIM}git pull origin main${RESET}"
echo -e "       ${DIM}git checkout -b dev/${DEV_NAME_CLEAN}/mod-det-your-task-name${RESET}"
echo ""
echo -e "  ${GOLD}── REMEMBER ───────────────────────────────────────────────${RESET}"
echo ""
echo "  • One file per session"
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
