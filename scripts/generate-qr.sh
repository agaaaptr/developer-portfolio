#!/usr/bin/env bash
set -euo pipefail

# Regenerate the social-links QR code (PNG for web, SVG for print).
# Default target: /links on the live site. Override with an argument.
#   bash scripts/generate-qr.sh "https://other-url"
#   npm run qr:generate -- "https://other-url"

URL="${1:-https://aga-putra.vercel.app/links}"
OUT_DIR="public/images"
PKG="qrcode@1.5.4"

npx --yes "$PKG" -t png -w 1024 -q 4 -e M -o "$OUT_DIR/qr-links.png" "$URL"
npx --yes "$PKG" -t svg -w 1024 -q 4 -e M -o "$OUT_DIR/qr-links.svg" "$URL"

echo "Generated:"
echo "  $OUT_DIR/qr-links.png"
echo "  $OUT_DIR/qr-links.svg"
echo "Payload: $URL"
