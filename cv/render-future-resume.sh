#!/bin/bash
# Regenerate both Future Resume PDFs from their HTML templates using headless Chrome.
# Usage: bash cv/render-future-resume.sh   (or: npm run future-resume:render)
# Output goes to $HOME/Downloads unless FUTURE_RESUME_OUTDIR is set.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ ! -x "$CHROME" ]; then
  echo "error: Google Chrome not found at $CHROME" >&2
  exit 1
fi

OUTDIR="${FUTURE_RESUME_OUTDIR:-$HOME/Downloads}"
mkdir -p "$OUTDIR"

render_one() {
  local lang="$1"          # ID or EN
  local html="cv/future-resume.$(echo "$lang" | tr 'A-Z' 'a-z').html"
  local out="$OUTDIR/Future-Resume-Gagah-Putra-Anugrah-$lang.pdf"
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="$out" "file://$PWD/$html" 2>/dev/null
  echo "✓ $lang: $out"
}

render_one "ID"
render_one "EN"
echo "Done."
