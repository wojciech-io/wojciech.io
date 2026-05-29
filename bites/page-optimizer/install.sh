#!/usr/bin/env bash
# Page Optimizer Plugin — instalator dla macOS / Linux
# Uruchom: bash install.sh

PLUGIN_NAME="page-optimizer"
TARGET_DIR="$HOME/.claude/plugins/$PLUGIN_NAME"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "Instalacja pluginu: $PLUGIN_NAME"
echo "Cel: $TARGET_DIR"
echo ""

if [ -d "$TARGET_DIR" ]; then
    echo "Plugin juz istnieje. Nadpisuje..."
    rm -rf "$TARGET_DIR"
fi

cp -r "$SCRIPT_DIR" "$TARGET_DIR"

echo "Gotowe!"
echo ""
echo "Nastepny krok: zrestartuj Claude Code."
echo "Dostepne skille: /audit-page, /optimize-page, /color-review, /responsive-check, /llm-copy, /visual-harmony"
echo ""
