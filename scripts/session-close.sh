#!/bin/bash
# =============================================================
# SideCar — Session Close
# Generates a session log and closes the current session.
# Usage: bash scripts/session-close.sh
# =============================================================

echo ""
echo "  ============================================"
echo "  SideCar — Session Close"
echo "  ============================================"
echo ""

# Check for active session
if [ ! -f .current-session ]; then
  echo "  ERROR: No active session found."
  echo "  Start a session first with: bash scripts/session-init.sh"
  exit 1
fi

# Load session data
source .current-session

echo "  Closing session: $SESSION_ID"
echo "  Module: $MODULE"
echo "  Developer: $DEVELOPER"
echo "  Task: $TASK"
echo ""

# Collect git log for this session's commits
COMMITS=$(git log --oneline --grep="$SESSION_ID" 2>/dev/null || echo "No commits found for this session")

# Get files modified
FILES_MODIFIED=$(git log --name-only --pretty=format: --grep="$SESSION_ID" 2>/dev/null | sort -u | grep -v '^$' || echo "None")

# Prompt for QA scores
echo "  QA Scores (1-10, ≥7 to pass):"
read -p "    Clarity:          " QA_CLARITY
read -p "    Specificity:      " QA_SPECIFICITY
read -p "    Chain-Readiness:  " QA_CHAIN
read -p "    Output Definition:" QA_OUTPUT
echo ""

# Determine boundary status
read -p "  Boundary confirmation — were any out-of-scope files modified? (y/n): " BOUNDARY_ISSUE
if [ "$BOUNDARY_ISSUE" = "y" ]; then
  BOUNDARY_STATUS="HALT — out-of-scope modification"
else
  BOUNDARY_STATUS="PASS"
fi

# Generate session log
TODAY_DATE=$(date +%Y-%m-%d)
LOG_FILE="sessions/${TODAY_DATE}_${SESSION_ID}.md"

# Handle optional fields (backward compatible with older .current-session files)
BRANCH_LINE=""
if [ -n "$BRANCH" ]; then
  BRANCH_LINE="- **Branch:** $BRANCH"
fi
CHANGE_TYPE_LINE=""
if [ -n "$CHANGE_TYPE" ]; then
  CHANGE_TYPE_LINE="- **Change Type:** $CHANGE_TYPE"
fi

cat > "$LOG_FILE" << EOF
# Session Log: $SESSION_ID

- **Date:** $TODAY_DATE
- **Developer:** $DEVELOPER
$BRANCH_LINE
- **Module:** $MODULE
- **Task:** $TASK
$CHANGE_TYPE_LINE
- **Started:** $STARTED
- **Closed:** $(date -u +%Y-%m-%dT%H:%M:%S)

## Planned Changes (Declared at Session Start)

$(if [ -n "$PLANNED_CHANGES" ]; then echo "$PLANNED_CHANGES"; else echo "_No planned changes recorded (pre-scoping session)_"; fi)

## Files Actually Modified

$FILES_MODIFIED

## Commits

$COMMITS

## Boundary Confirmation

$BOUNDARY_STATUS

## QA Score

| Dimension | Score |
|-----------|-------|
| Clarity | $QA_CLARITY/10 |
| Specificity | $QA_SPECIFICITY/10 |
| Chain-Readiness | $QA_CHAIN/10 |
| Output Definition | $QA_OUTPUT/10 |

EOF

# Log halt if boundary issue
if [ "$BOUNDARY_ISSUE" = "y" ]; then
  echo "" >> lessons/halts.md
  echo "## $SESSION_ID — $TODAY_DATE" >> lessons/halts.md
  echo "- **Module:** $MODULE" >> lessons/halts.md
  echo "- **Developer:** $DEVELOPER" >> lessons/halts.md
  echo "- **Issue:** Out-of-scope file modification" >> lessons/halts.md
  echo "- **Resolution:** Session closed with boundary violation flag" >> lessons/halts.md
  echo "" >> lessons/halts.md
  echo "  Halt logged to lessons/halts.md"
fi

# Log exemplar if any score is 10
if [ "$QA_CLARITY" = "10" ] || [ "$QA_SPECIFICITY" = "10" ] || [ "$QA_CHAIN" = "10" ] || [ "$QA_OUTPUT" = "10" ]; then
  echo "" >> lessons/exemplars.md
  echo "## $SESSION_ID — $TODAY_DATE" >> lessons/exemplars.md
  echo "- **Module:** $MODULE" >> lessons/exemplars.md
  echo "- **Developer:** $DEVELOPER" >> lessons/exemplars.md
  echo "- **Task:** $TASK" >> lessons/exemplars.md
  echo "- **Scores:** C:$QA_CLARITY S:$QA_SPECIFICITY CR:$QA_CHAIN OD:$QA_OUTPUT" >> lessons/exemplars.md
  echo "" >> lessons/exemplars.md
  echo "  Exemplar logged to lessons/exemplars.md"
fi

# Remove session file
rm .current-session

echo ""
echo "  ============================================"
echo "  Session closed: $SESSION_ID"
echo "  Session log: $LOG_FILE"
echo "  ============================================"
echo ""
