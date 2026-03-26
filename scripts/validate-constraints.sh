#!/bin/bash
# =============================================================
# SideCar — Constitutional Constraint Validation
# Scans staged files for common constraint violations.
# Called by .githooks/pre-commit
# =============================================================

set -e

VIOLATIONS=0

# Get staged files (excluding deleted files)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=d)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

# --- C-02: No fetch() calls ---
for FILE in $STAGED_FILES; do
  case "$FILE" in
    *.html|*.js)
      # Check staged content (not working copy) for fetch(
      MATCHES=$(git diff --cached -U0 "$FILE" 2>/dev/null | grep -n '^\+.*fetch(' | grep -v '^\+\+\+' || true)
      if [ -n "$MATCHES" ]; then
        echo ""
        echo "  HALT: C-02 violation in $FILE"
        echo "  No fetch() calls allowed. All data must route through SideCarAdapter."
        echo "  Phase 1A runs from file:// protocol — fetch() will fail."
        echo ""
        echo "  Matching lines in diff:"
        echo "$MATCHES" | sed 's/^/    /'
        echo ""
        VIOLATIONS=$((VIOLATIONS + 1))
      fi
      ;;
  esac
done

# --- C-01: No import/export statements ---
for FILE in $STAGED_FILES; do
  case "$FILE" in
    *.html|*.js)
      MATCHES=$(git diff --cached -U0 "$FILE" 2>/dev/null | grep -n '^\+.*\(^import \|^export \)' | grep -v '^\+\+\+' || true)
      if [ -n "$MATCHES" ]; then
        echo ""
        echo "  HALT: C-01 violation in $FILE"
        echo "  No ES modules (import/export). Phase 1A is flat files from file://."
        echo ""
        echo "  Matching lines in diff:"
        echo "$MATCHES" | sed 's/^/    /'
        echo ""
        VIOLATIONS=$((VIOLATIONS + 1))
      fi
      ;;
  esac
done

# --- C-11: No hardcoded hex values outside :root (CSS files only) ---
for FILE in $STAGED_FILES; do
  case "$FILE" in
    *.css)
      # Check for hex color values in added lines (not in :root context)
      MATCHES=$(git diff --cached -U0 "$FILE" 2>/dev/null | grep -n '^\+.*#[0-9a-fA-F]\{3,8\}' | grep -v '^\+\+\+' | grep -v ':root' || true)
      if [ -n "$MATCHES" ]; then
        echo ""
        echo "  HALT: C-11 violation in $FILE"
        echo "  No hardcoded hex values outside :root."
        echo "  Use CSS custom properties: var(--color-...)"
        echo ""
        echo "  Matching lines in diff:"
        echo "$MATCHES" | sed 's/^/    /'
        echo ""
        VIOLATIONS=$((VIOLATIONS + 1))
      fi
      ;;
  esac
done

# --- C-04: No CSS nesting, @layer, @container ---
for FILE in $STAGED_FILES; do
  case "$FILE" in
    *.css)
      MATCHES=$(git diff --cached -U0 "$FILE" 2>/dev/null | grep -n '^\+.*\(@layer\|@container\)' | grep -v '^\+\+\+' || true)
      if [ -n "$MATCHES" ]; then
        echo ""
        echo "  HALT: C-04 violation in $FILE"
        echo "  No @layer or @container. NMCI browsers (Chrome 110+) may not support them."
        echo ""
        echo "  Matching lines in diff:"
        echo "$MATCHES" | sed 's/^/    /'
        echo ""
        VIOLATIONS=$((VIOLATIONS + 1))
      fi
      ;;
  esac
done

if [ $VIOLATIONS -gt 0 ]; then
  echo "  ============================================"
  echo "  $VIOLATIONS constraint violation(s) found."
  echo "  Fix the violations above and try again."
  echo "  ============================================"
  echo ""
  exit 1
fi

exit 0
