#!/bin/bash
# =============================================================
# SideCar — Session Initialization
# Run at the start of a development session.
# Usage: bash scripts/session-init.sh
# =============================================================

echo ""
echo "  ============================================"
echo "  SideCar — Session Initialization"
echo "  ============================================"
echo ""

# Check for unclosed session
if [ -f .current-session ]; then
  echo "  WARNING: An unclosed session was found."
  echo "  Previous session:"
  cat .current-session | sed 's/^/    /'
  echo ""
  read -p "  Close previous session and start new? (y/n): " CONFIRM
  if [ "$CONFIRM" != "y" ]; then
    echo "  Aborted. Close the previous session first with: bash scripts/session-close.sh"
    exit 1
  fi
  echo ""
fi

# Prompt for module
echo "  Available modules:"
echo "    MOD-LAND   — src/Landing/        (Landing / Role Selection)"
echo "    MOD-WORK   — src/Workspace/      (Detailer Workspace)"
echo "    MOD-MEMBER — src/Personnel/      (Sailor Record View)"
echo "    MOD-CMD    — src/Command/        (Command Manning View)"
echo "    MOD-ANLYT  — src/Analytics/      (Analytics Dashboard)"
echo "    MOD-SEARCH — src/AdvancedSearch/ (Advanced Search)"
echo "    MOD-CSS    — src/index.css + CSS (Design System)"
echo "    MOD-SVC    — src/services/       (Shared Logic + Data)"
echo ""
read -p "  Which module? " MODULE

# Validate module
case "$MODULE" in
  MOD-LAND|MOD-WORK|MOD-MEMBER|MOD-CMD|MOD-ANLYT|MOD-SEARCH|MOD-CSS|MOD-SVC) ;;
  *)
    echo "  ERROR: Invalid module ID. Must be one of: MOD-LAND, MOD-WORK, MOD-MEMBER, MOD-CMD, MOD-ANLYT, MOD-SEARCH, MOD-CSS, MOD-SVC"
    exit 1
    ;;
esac

# Prompt for developer name
read -p "  Developer name: " DEVELOPER

# Auto-detect current branch and validate against fixed branch model
BRANCH=$(git branch --show-current 2>/dev/null)

if [ -z "$BRANCH" ]; then
  echo "  ERROR: Could not detect current git branch."
  echo "  Make sure you are in a git repository."
  exit 1
fi

# Validate branch — only dev-1, dev-2, and qa-staging are allowed
case "$BRANCH" in
  dev-1|dev-2)
    echo "  Branch detected: $BRANCH"
    ;;
  qa-staging)
    echo "  Branch detected: $BRANCH (Tier 1)"
    ;;
  *)
    echo ""
    echo "  ERROR: You are on branch '$BRANCH', which is not an assigned dev branch."
    echo ""
    echo "  Allowed branches:"
    echo "    dev-1       — Development Team 1"
    echo "    dev-2       — Development Team 2"
    echo "    qa-staging  — QA / Tier 1 only"
    echo ""
    echo "  Switch to your assigned branch first:"
    echo "    git checkout dev-1    (or dev-2)"
    echo ""
    exit 1
    ;;
esac

# Prompt for task scope
read -p "  What are you working on? (one sentence): " TASK
echo ""
echo "  What type of changes are you making?"
echo "    1) Functionality (new features, logic changes)"
echo "    2) UI/UX (layout, styling, visual components)"
echo "    3) Bug fix (correcting existing behavior)"
echo "    4) Refactor (restructuring without changing behavior)"
read -p "  Enter number (1-4): " CHANGE_TYPE_NUM

case "$CHANGE_TYPE_NUM" in
  1) CHANGE_TYPE="Functionality" ;;
  2) CHANGE_TYPE="UI/UX" ;;
  3) CHANGE_TYPE="Bug Fix" ;;
  4) CHANGE_TYPE="Refactor" ;;
  *) CHANGE_TYPE="Unspecified" ;;
esac

echo ""
echo "  List the specific changes you plan to make."
echo "  (Enter each change on its own line. Type 'done' when finished.)"
CHANGES=""
CHANGE_NUM=1
while true; do
  read -p "    $CHANGE_NUM. " CHANGE_LINE
  if [ "$CHANGE_LINE" = "done" ] || [ -z "$CHANGE_LINE" ]; then
    break
  fi
  CHANGES="${CHANGES}    ${CHANGE_NUM}. ${CHANGE_LINE}\n"
  CHANGE_NUM=$((CHANGE_NUM + 1))
done

# Generate session ID
TODAY=$(date +%Y-%m%d)
TODAY_DATE=$(date +%Y-%m-%d)
COUNT=$(ls sessions/${TODAY_DATE}_SC-*.md 2>/dev/null | wc -l | tr -d ' ')
NNN=$(printf "%03d" $((COUNT + 1)))
SESSION_ID="SC-${TODAY}-${NNN}"

# Write session file (use heredoc with quoting to preserve multi-line CHANGES)
STARTED_TIME=$(date -u +%Y-%m-%dT%H:%M:%S)
cat > .current-session << SESSIONEOF
SESSION_ID=$SESSION_ID
MODULE=$MODULE
DEVELOPER=$DEVELOPER
BRANCH=$BRANCH
TASK=$TASK
CHANGE_TYPE=$CHANGE_TYPE
PLANNED_CHANGES="$(echo -e "$CHANGES")"
STARTED=$STARTED_TIME
SESSIONEOF

echo ""
echo "  ============================================"
echo "  Session Scope Confirmation"
echo "  ============================================"
echo "  Session ID:   $SESSION_ID"
echo "  Developer:    $DEVELOPER"
echo "  Branch:       $BRANCH"
echo "  Module:       $MODULE"
echo "  Goal:         $TASK"
echo "  Change Type:  $CHANGE_TYPE"
echo "  Planned Changes:"
echo -e "$CHANGES"
echo ""
echo "  Edits outside this scope will be flagged."
echo ""
echo "  Commit format:"
echo "    [$SESSION_ID] $MODULE: Your description here"
echo ""
echo "  When done, run: bash scripts/session-close.sh"
echo "  ============================================"
echo ""
