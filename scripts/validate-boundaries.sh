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
    sidecar-app/src/Landing/*)         MODULE="MOD-LAND" ;;
    sidecar-app/src/Workspace/*)       MODULE="MOD-WORK" ;;
    sidecar-app/src/Personnel/*)       MODULE="MOD-MEMBER" ;;
    sidecar-app/src/Command/*)         MODULE="MOD-CMD" ;;
    sidecar-app/src/Analytics/*)       MODULE="MOD-ANLYT" ;;
    sidecar-app/src/AdvancedSearch/*)  MODULE="MOD-SEARCH" ;;
    sidecar-app/src/index.css)         MODULE="MOD-CSS" ;;
    sidecar-app/src/services/*)        MODULE="MOD-SVC" ;;
    sidecar-app/src/components/*)      MODULE="MOD-SHARED" ;;
    sidecar-app/src/models/*)          MODULE="MOD-SHARED" ;;
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
    sidecar-app/public/*|.cursorrules|.cursor/*|.githooks/*|scripts/*|workflow/*|.vscode/*|.gitignore|docs/*|task.md|walkthrough.md|implementation_plan.md|governance_compliance_audit.md)
      continue
      ;;
    # Vite/React config files are plumbing, exempt
    sidecar-app/package.json|sidecar-app/package-lock.json|sidecar-app/tsconfig*.json|sidecar-app/vite.config.ts|sidecar-app/index.html)
      continue
      ;;
    # App-level plumbing files exempt
    sidecar-app/src/App.tsx|sidecar-app/src/main.tsx|sidecar-app/src/vite-env.d.ts)
      continue
      ;;
    # Root index.html is plumbing, exempt
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
