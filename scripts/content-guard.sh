#!/usr/bin/env bash
# content-guard.sh — privacy + quality scan for wojciech.io public repo.
#
# Usage:
#   scripts/content-guard.sh            # full scan of tracked files
#   scripts/content-guard.sh --staged   # scan only staged files (pre-commit)
#   scripts/content-guard.sh --diff BASE HEAD  # scan PR diff (CI)
#
# Exit 0 = clean. Exit 1 = violations found (details printed to stderr).

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────

# Client names and internal codenames that must NEVER appear in public files.
# Extend this list when new NDA clients are onboarded.
BANNED_TERMS=(
  # NDA client names — exact matches only (case-insensitive via grep -i)
  "Kadromierz"
  "Crewly"
  "tablica-growth"
  "tablica_growth"
  # Raw secret key patterns (Stripe, generic)
  "sk_live_[A-Za-z0-9]{20}"
  "sk_test_[A-Za-z0-9]{20}"
  "rk_live_[A-Za-z0-9]{20}"
  "rk_test_[A-Za-z0-9]{20}"
  "-----BEGIN RSA PRIVATE KEY-----"
  "-----BEGIN EC PRIVATE KEY-----"
  "-----BEGIN OPENSSH PRIVATE KEY-----"
)

# File extensions to scan for content quality issues.
CONTENT_EXTS=("mdx" "md" "astro" "ts" "tsx" "json")

# Directories that are always excluded from scanning.
EXCLUDE_DIRS=(".git" "node_modules" "dist" ".wrangler" ".astro" "apps/*/node_modules" "apps/*/dist" ".claude" "scripts")

# ── Helpers ───────────────────────────────────────────────────────────────────

RED='\033[0;31m'
YLW='\033[0;33m'
GRN='\033[0;32m'
NC='\033[0m'

violations=0

fail() {
  echo -e "${RED}[FAIL]${NC} $*" >&2
  violations=$((violations + 1))
}

warn() {
  echo -e "${YLW}[WARN]${NC} $*" >&2
}

pass() {
  echo -e "${GRN}[PASS]${NC} $*"
}

# Build the find-exclude args
build_excludes() {
  local args=()
  for d in "${EXCLUDE_DIRS[@]}"; do
    args+=(-not -path "*/${d}/*")
  done
  echo "${args[@]}"
}

# ── File list ─────────────────────────────────────────────────────────────────

MODE="full"
FILES=""

if [[ "${1:-}" == "--staged" ]]; then
  MODE="staged"
  FILES=$(git diff --cached --name-only 2>/dev/null || true)
elif [[ "${1:-}" == "--diff" ]] && [[ -n "${2:-}" ]] && [[ -n "${3:-}" ]]; then
  MODE="diff"
  BASE="${2}"
  HEAD="${3}"
  FILES=$(git diff --name-only "${BASE}" "${HEAD}" 2>/dev/null || true)
else
  MODE="full"
  # Use -prune so directory exclusions work on both GNU and BSD find.
  # On macOS, BSD find's -path treats '*' as not matching '/', so the common
  # '-not -path "*/dir/*"' idiom silently fails for nested paths.
  FILES=$(find . \
    \( \
      -name '.git' -o \
      -name 'node_modules' -o \
      -name 'dist' -o \
      -name '.wrangler' -o \
      -name '.astro' -o \
      -name '.claude' -o \
      -name 'scripts' \
    \) -prune \
    -o \( \
      -type f \
      \( -name '*.mdx' -o -name '*.md' -o -name '*.astro' -o -name '*.ts' -o -name '*.tsx' -o -name '*.json' \) \
      -print \
    \) 2>/dev/null | sed 's|^\./||')
fi

if [[ -z "$FILES" ]]; then
  pass "No files to scan."
  exit 0
fi

echo "Content guard — scanning $(echo "$FILES" | wc -l | tr -d ' ') file(s) [mode: ${MODE}]"
echo "────────────────────────────────────────────────────────"

# ── Check 1: Banned terms ─────────────────────────────────────────────────────

echo ""
echo "1/3  Banned terms (client names, internal codenames, raw secrets)"

found_banned=0
while IFS= read -r file; do
  [[ -f "$file" ]] || continue
  # Skip the guard script itself (it legitimately contains banned terms as config)
  [[ "$file" == scripts/content-guard.sh ]] && continue
  for term in "${BANNED_TERMS[@]}"; do
    if grep -qiE "$term" "$file" 2>/dev/null; then
      matches=$(grep -niE "$term" "$file" 2>/dev/null | head -3)
      fail "  $file — term «${term}»:"
      echo "$matches" | while IFS= read -r line; do
        echo "        $line" >&2
      done
      found_banned=1
    fi
  done
done <<< "$FILES"

if [[ $found_banned -eq 0 ]]; then
  pass "  No banned terms found."
fi

# ── Check 2: Internal path leaks ─────────────────────────────────────────────

echo ""
echo "2/3  Internal path / session leaks"

INTERNAL_PATTERNS=(
  "\.claude/projects/"
  "\.claude/worktrees/"
  "tomaszkalicki90"
  "wojciechluszczynski@gmail"
  "\.conversations\.jsonl"
)

found_internal=0
while IFS= read -r file; do
  [[ -f "$file" ]] || continue
  [[ "$file" == scripts/content-guard.sh ]] && continue
  for pattern in "${INTERNAL_PATTERNS[@]}"; do
    if grep -qE "$pattern" "$file" 2>/dev/null; then
      matches=$(grep -nE "$pattern" "$file" 2>/dev/null | head -2)
      fail "  $file — internal path pattern «${pattern}»:"
      echo "$matches" | while IFS= read -r line; do
        echo "        $line" >&2
      done
      found_internal=1
    fi
  done
done <<< "$FILES"

if [[ $found_internal -eq 0 ]]; then
  pass "  No internal paths leaked."
fi

# ── Check 3: Content quality ──────────────────────────────────────────────────

echo ""
echo "3/3  Content quality (MDX/Astro)"

found_quality=0
while IFS= read -r file; do
  [[ -f "$file" ]] || continue
  ext="${file##*.}"

  # MDX/Astro: <img> without alt
  if [[ "$ext" == "mdx" || "$ext" == "astro" ]]; then
    if grep -qE '<img\b' "$file" 2>/dev/null; then
      bad=$(grep -nE '<img\b(?![^>]*\balt=)[^>]*/>' "$file" 2>/dev/null | head -3 || true)
      if [[ -n "$bad" ]]; then
        warn "  $file — <img> without alt attribute (accessibility):"
        echo "$bad" | while IFS= read -r line; do
          echo "        $line" >&2
        done
        # warn only, not fail
      fi
    fi
  fi

  # MDX: TODO/FIXME/TBD in production content
  if [[ "$ext" == "mdx" ]]; then
    if grep -qiE '\b(TODO|FIXME|TBD|PLACEHOLDER|LOREM IPSUM)\b' "$file" 2>/dev/null; then
      matches=$(grep -niE '\b(TODO|FIXME|TBD|PLACEHOLDER|LOREM IPSUM)\b' "$file" 2>/dev/null | head -3)
      warn "  $file — unresolved placeholder in article content:"
      echo "$matches" | while IFS= read -r line; do
        echo "        $line" >&2
      done
    fi
  fi

done <<< "$FILES"

if [[ $found_quality -eq 0 ]]; then
  pass "  Content quality checks passed."
fi

# ── Summary ───────────────────────────────────────────────────────────────────

echo ""
echo "────────────────────────────────────────────────────────"

if [[ $violations -gt 0 ]]; then
  echo -e "${RED}BLOCKED — ${violations} violation(s) found. Fix before committing.${NC}" >&2
  exit 1
fi

echo -e "${GRN}Clean — no violations found.${NC}"
exit 0
