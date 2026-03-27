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
    app/detailer.html)      MODULE="MOD-DET" ;;
    app/placement.html)     MODULE="MOD-PLAC" ;;
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
    # Config and workflow files are exempt
    app/fonts/*|.cursorrules|.cursor/*|.githooks/*|scripts/*|workflow/*|.vscode/*|.gitignore)
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
    # Multiple modules detected — HALT
    echo ""
    echo "  ============================================"
    echo "  HALT: Cross-module commit detected"
    echo "  ============================================"
    echo ""
    echo "  Staged files span multiple modules:"
    echo "  Previously found: $MODULES_FOUND"
    echo "  Now found: $MODULE (from $FILE)"
    echo ""
    echo "  Each module requires its own session and commit."
    echo "  Split your changes into separate commits."
    echo ""
    echo "  See: workflow/MODULE-MAP.md for module boundaries"
    echo "  See: directives/Gemini.md Section 20 for session protocol"
    echo ""
    exit 1
  fi
done

exit 0
