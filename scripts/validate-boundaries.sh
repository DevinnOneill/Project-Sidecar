#!/bin/bash
# =============================================================
# SideCar — Module Boundary Validation
# Checks that staged files belong to a single module.
# Called by .githooks/pre-commit
# =============================================================

set -e

# Get staged files (excluding deleted files)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=d)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

# Classify each file into its module
MODULES_FOUND=""

for FILE in $STAGED_FILES; do
  case "$FILE" in
    app/landing.html)       MODULE="MOD-LAND" ;;
    app/workspace.html)     MODULE="MOD-WORK" ;;
    app/member.html)        MODULE="MOD-MEMBER" ;;
    app/command.html)       MODULE="MOD-CMD" ;;
    app/billet.html)        MODULE="MOD-BILLET" ;;
    app/analytics.html)     MODULE="MOD-ANLYT" ;;
    app/style.css)          MODULE="MOD-CSS" ;;
    app/app.js)             MODULE="MOD-JS" ;;
    # Governance files are exempt from module boundary checks
    sessions/*)         continue ;;
    lessons/*)          continue ;;
    CHANGELOG.md)       continue ;;
    .current-session)   continue ;;
    .session-audit-trail) continue ;;
    # Directive modifications warn but don't block
    directives/*)
      echo ""
      echo "  WARNING: Staging directive file: $FILE"
      echo "  Directive modifications require Tier 1 authorization."
      echo ""
      continue
      ;;
    WHITE_PAPER.md|ONBOARDING.md|CLAUDE.md)
      echo ""
      echo "  WARNING: Staging governance file: $FILE"
      echo "  Governance file modifications require Tier 1 authorization."
      echo ""
      continue
      ;;
    # Config, docs, and workflow files are exempt
    app/fonts/*|.cursorrules|.cursor/*|.githooks/*|scripts/*|workflow/*|.vscode/*|.gitignore|docs/*|task.md|walkthrough.md|implementation_plan.md|governance_compliance_audit.md)
      continue
      ;;
    # index.html is plumbing, exempt
    index.html)
      continue
      ;;
    # Unknown files — flag but don't assign a module
    *)
      echo "  NOTE: Unrecognized file staged: $FILE"
      continue
      ;;
  esac

  # Track unique modules
  if [ -z "$MODULES_FOUND" ]; then
    MODULES_FOUND="$MODULE"
  elif ! echo "$MODULES_FOUND" | grep -q "$MODULE"; then
    MODULES_FOUND="$MODULES_FOUND, $MODULE"
  fi
done

if echo "$MODULES_FOUND" | grep -q ","; then
  echo ""
  echo "  NOTE: Cross-module commit detected."
  echo "  Modules: $MODULES_FOUND"
  echo "  Ensure this cross-module scope was authorized."
  echo ""
fi

exit 0
