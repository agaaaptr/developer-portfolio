#!/bin/bash
# Regenerate both CV PDFs from their YAML sources using RenderCV.
# Usage: bash cv/render.sh   (or: npm run cv:render)
set -e
cd "$(dirname "$0")/.."

render_one() {
  local lang="$1"
  local yaml="cv/Gagah-Putra-Anugrah-Software-Engineer-${lang}.yaml"
  local out="/tmp/rcv-${lang}"
  rendercv render "$yaml" --output-folder "$out" >/dev/null
  cp "$out/Gagah_Putra_Anugrah_CV.pdf" "public/documents/Gagah-Putra-Anugrah-Software-Engineer-${lang}.pdf"
  echo "✓ ${lang}: public/documents/Gagah-Putra-Anugrah-Software-Engineer-${lang}.pdf"
}

render_one "EN"
render_one "ID"
echo "Done."
