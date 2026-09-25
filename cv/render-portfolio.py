#!/usr/bin/env python3
"""Render the portfolio companion PDF from cv/portfolio.typ.

Compiles the Typst source with the `typst` Python binding that ships as a
RenderCV dependency (no system Typst/pandoc/LaTeX/Chromium required), using the
font families bundled in `rendercv_fonts` so the build is reproducible and needs
no downloads.

Project screenshots are downscaled to 1200px wide before embedding, which keeps
the PDF near 1 MB instead of pulling in the multi-megabyte originals.

Usage: python3 cv/render-portfolio.py   (or: npm run portfolio:render)
"""

import pathlib
import shutil
import subprocess
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
SOURCE = REPO / "cv" / "portfolio.typ"
OUTPUT = REPO / "public" / "documents" / "Gagah-Putra-Anugrah-Portfolio.pdf"
BUILD_DIR = pathlib.Path("/tmp/rcv-portfolio")
IMAGE_WIDTH_PX = 1200

# Source screenshot per project entry, in the order they appear in portfolio.typ.
# The .webp originals go through sips; PNGs are resized in place to a copy.
IMAGES = {
    "noir.png": "project-noir-3.png",
    "tembusin.png": "project-tembusin-1.webp",
    "owow.png": "project-owow-1.webp",
    "dietpro.png": "project-dietpro-1.webp",
}


def prepare_images(destination: pathlib.Path) -> None:
    """Downscale each screenshot into the build folder."""
    source_dir = REPO / "public" / "images"
    for name, origin in IMAGES.items():
        source = source_dir / origin
        if not source.exists():
            sys.exit(f"error: missing screenshot {source}")
        subprocess.run(
            [
                "sips",
                "-s", "format", "png",
                "-Z", str(IMAGE_WIDTH_PX),
                str(source),
                "--out", str(destination / name),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )


def main() -> int:
    try:
        import typst
        import rendercv_fonts
    except ImportError as error:
        sys.exit(f"error: {error}. Install RenderCV first (pip install rendercv).")

    if not SOURCE.exists():
        sys.exit(f"error: missing Typst source {SOURCE}")

    shutil.rmtree(BUILD_DIR, ignore_errors=True)
    (BUILD_DIR / "images").mkdir(parents=True)
    prepare_images(BUILD_DIR / "images")
    shutil.copy(SOURCE, BUILD_DIR / "portfolio.typ")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    compiler = typst.Compiler(
        root=BUILD_DIR,
        font_paths=[*rendercv_fonts.paths_to_font_folders],
    )
    compiler.compile(input=BUILD_DIR / "portfolio.typ", format="pdf", output=OUTPUT)

    size_kb = OUTPUT.stat().st_size // 1024
    print(f"✓ public/documents/{OUTPUT.name} ({size_kb} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
