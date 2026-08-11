#!/usr/bin/env bash
# anti-slop.sh — advisory copy-quality report for English article content.
#
# Usage:
#   scripts/anti-slop.sh                       # every English insight
#   scripts/anti-slop.sh --diff BASE HEAD      # only what a PR touched
#
# ALWAYS EXITS 0. This is a report, not a gate. It prints a markdown table so
# CI can pipe it straight into $GITHUB_STEP_SUMMARY, and the reviewer decides
# whether a number is worth acting on. Vale cannot tell a genuine rhetorical
# tic from a literal quotation of somebody else's three-item list, so a hard
# fail here would block correct copy on a regular basis.
#
# Scope is English only, on purpose. The ai-tells rules are written against
# English; running them over src/content/insights/pl/ would score Polish prose
# against rules that do not describe it.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Above this many hits per 100 words, the file is worth a human read. Below it,
# the copy reads as written rather than generated. The site has historically
# sat between 0.9 and 1.9.
THRESHOLD="${ANTI_SLOP_THRESHOLD:-5.0}"
REVIEW_AT="${ANTI_SLOP_REVIEW_AT:-2.0}"

CONTENT_DIR="src/content/insights"

collect_full() {
  find "$CONTENT_DIR" -maxdepth 1 -type f -name '*.mdx' 2>/dev/null | sort
}

collect_diff() {
  git diff --name-only --diff-filter=d "$1" "$2" 2>/dev/null \
    | grep -E "^${CONTENT_DIR}/[^/]+\.mdx$" || true
}

if [[ "${1:-}" == "--diff" && -n "${2:-}" && -n "${3:-}" ]]; then
  FILES="$(collect_diff "$2" "$3")"
  MODE="changed files"
else
  FILES="$(collect_full)"
  MODE="all English insights"
fi

if [[ -z "$FILES" ]]; then
  echo "### Anti-slop lint"
  echo
  echo "No English article content in this change. Nothing to report."
  exit 0
fi

if ! command -v vale >/dev/null 2>&1; then
  echo "### Anti-slop lint"
  echo
  echo "Vale is not installed, so no density was measured. This check is advisory and does not block."
  exit 0
fi

echo "### Anti-slop lint"
echo
echo "Advisory only. Nothing here blocks the merge."
echo
echo "Scope: ${MODE}. Review above ${REVIEW_AT} hits per 100 words, investigate above ${THRESHOLD}."
echo
echo "| file | words | hits | per 100 words | em dashes |"
echo "|---|---:|---:|---:|---:|"

worst="0"
flagged=""

while IFS= read -r file; do
  [[ -f "$file" ]] || continue

  words=$(wc -w < "$file" | tr -d ' ')
  [[ "$words" -gt 0 ]] || continue

  # --no-exit keeps Vale's own findings from deciding this script's fate.
  #
  # stderr is captured rather than discarded, and a runtime error is reported
  # as "err" instead of falling through to zero. Swallowing it once already
  # produced a full table of 0.0 densities that looked like immaculate copy
  # and was really Vale failing to parse a single file.
  vale_err="$(mktemp)"
  vale_out="$(vale --no-exit --output=line "$file" 2>"$vale_err")"
  if grep -qE 'Runtime error|E[0-9]{3}' "$vale_err"; then
    reason="$(tr -d '\r' < "$vale_err" | grep -v '^\s*$' | tail -1 | sed 's/|/ /g')"
    rm -f "$vale_err"
    echo "| \`${file#"$CONTENT_DIR"/}\` | ${words} | err | err ⚠️ | ? |"
    flagged="${flagged}${file} (vale error: ${reason})\n"
    continue
  fi
  rm -f "$vale_err"
  hits=$(printf '%s' "$vale_out" | grep -c ':' || true)
  hits=${hits:-0}

  # Exact character match. No rule engine, no false positives: the tone of
  # voice bans U+2014 outright, and en dashes in ranges are left alone.
  emdash=$(grep -o '—' "$file" 2>/dev/null | wc -l | tr -d ' ')

  density=$(awk -v h="$hits" -v w="$words" 'BEGIN { printf "%.1f", (w > 0 ? h * 100 / w : 0) }')

  mark=""
  if awk -v d="$density" -v t="$THRESHOLD" 'BEGIN { exit !(d > t) }'; then
    mark=" ⚠️"
    flagged="${flagged}${file} (${density})\n"
  elif awk -v d="$density" -v r="$REVIEW_AT" 'BEGIN { exit !(d > r) }'; then
    mark=" ·"
  fi
  if [[ "$emdash" -gt 0 ]]; then
    mark="${mark} ⚠️"
    flagged="${flagged}${file} (${emdash} em dash)\n"
  fi

  echo "| \`${file#"$CONTENT_DIR"/}\` | ${words} | ${hits} | ${density}${mark} | ${emdash} |"

  if awk -v d="$density" -v w="$worst" 'BEGIN { exit !(d > w) }'; then
    worst="$density"
  fi
done <<< "$FILES"

echo
if [[ -n "$flagged" ]]; then
  echo "Worth a look before merging:"
  echo
  printf '%b' "$flagged" | sed 's/^/- /'
  echo
  echo "Vale flags rhetorical patterns, not errors. A literal quotation of somebody else's three-item list will trip \`VerbTricolon\` and should stay exactly as it is. Read the hit before rewriting the sentence."
else
  # Deliberately names the investigate line, not the review line. Files marked
  # with a middle dot sit above the review line and still land here, so saying
  # "nothing above the review line" would contradict the table.
  echo "Highest density in scope: ${worst} hits per 100 words. Nothing above the ${THRESHOLD} investigate line. A middle dot in the table marks a file above ${REVIEW_AT}, which is worth reading but not a problem on its own."
fi

exit 0
