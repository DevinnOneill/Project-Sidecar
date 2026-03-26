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
echo "    MOD-LAND  — app/landing.html (Landing / Role Selection)"
echo "    MOD-DET   — app/detailer.html (Detailer Dashboard)"
echo "    MOD-PLAC  — app/placement.html (Placement Coordinator)"
echo "    MOD-ANLYT — app/analytics.html (Analytics Dashboard)"
echo "    MOD-CSS   — app/style.css (Covenant Design System)"
echo "    MOD-JS    — app/app.js (Shared Logic + Data + Adapter)"
echo ""
read -p "  Which module? " MODULE

# Validate module
case "$MODULE" in
  MOD-LAND|MOD-DET|MOD-PLAC|MOD-ANLYT|MOD-CSS|MOD-JS) ;;
  *)
    echo "  ERROR: Invalid module ID. Must be one of: MOD-LAND, MOD-DET, MOD-PLAC, MOD-ANLYT, MOD-CSS, MOD-JS"
    exit 1
    ;;
esac

# Prompt for developer info
read -p "  Developer name: " DEVELOPER
read -p "  What is your branch? (dev/name/module-description): " BRANCH

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
