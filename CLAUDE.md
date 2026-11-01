# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint on src/ directory
npm test             # Lanyard unit tests (node:test)
npm run test:e2e     # Playwright viewport and interaction tests
npm run qr:generate  # Regenerate public/images/qr-links.{svg,png}
npm run cv:render    # Rebuild CV PDFs from YAML (scripts/render.sh)
npm run portfolio:render     # Rebuild the portfolio PDF (scripts/render-portfolio.py)
npm run future-resume:render # Rebuild the Future Resume PDFs (scripts/render-future-resume.sh)
```

## Architecture

Single-page portfolio website built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4. Neobrutalism design, light-only. Design spec: `design.md`.

### Page Structure

- **Single-page application**: All sections rendered on one page with smooth scrolling (Lenis).
- **Dynamic imports**: Sections are dynamically imported with `ssr: false` to avoid hydration issues with `motion` animations.
- **Layout**: `src/app/layout.tsx` is minimal (fonts + global CSS). The site chrome lives in `src/app/(site)/layout.tsx` (`SmoothScroll`, `Header`, `ScrollToTopButton`); `src/app/links/` is an isolated QR hub without that chrome.

### Key Directories

- `src/app/` - App Router: `(site)/` home and project routes with site chrome, `links/` isolated QR hub, `globals.css`
- `src/components/sections/` - Hero (incl. HeroLanyard), Expertise, TechStack, Contributions, Work, Experience, Contact
- `src/components/layout/` - Header, Footer, SmoothScroll
- `src/components/projects/` - ProjectCard, ProjectFilter, ProjectGrid, ProjectNavigation
- `src/components/ui/` - Accordion, ImageWithFallback, ScrollToTopButton
- `src/lib/lanyard-*.ts` - Three.js + Rapier lanyard (scene, physics, strap, geometry, textures, choreography)
- `src/lib/hooks/` - useMediaQuery
- `src/data/` - JSON data files for content (personal, experience, expertise, projects, techstack)
- `scripts/` - asset generation and document rendering (QR, CV, portfolio)
- `tests/` - unit tests; `tests/e2e/` - Playwright specs

### Content Management

Content is managed through JSON files in `src/data/`. To update portfolio information, edit the relevant JSON file rather than hardcoding in components.

### Animation System

Uses `motion` (imported from `motion/react`). Shared variants live in `src/lib/motion.ts` (`containerVariants`, `itemVariants`); sections and pages may also define variants inline.

Hover and press states use plain CSS transitions (snap), not spring animation.

### Styling

- **Tailwind CSS 4** for utility classes, CSS-first (`@import "tailwindcss"`).
- **Design tokens** in `src/app/globals.css` (`@theme`): ink, surface, card, border, lime, violet, violet-bright, shadow-neo, shadow-neo-lg, radius-base.
- **Light-only** (dark mode removed).
- **Fonts** (next/font in layout.tsx): Archivo Black (display), Space Grotesk (body), JetBrains Mono (mono), Caveat (handwritten).

### Icon Conventions

Uses lucide-react ^1.55.0 (see package.json). GitHub, LinkedIn, and Instagram brand icons are locally defined SVG components (`GithubIcon`, `LinkedinIcon`, `InstagramIcon`), not lucide imports.

<!-- noir:context begin -->
@import ".noir/NOIR.md"
<!-- noir:context end -->

<!-- noir:rules begin -->
@import ".noir/rules/RULES.md"
<!-- noir:rules end -->
