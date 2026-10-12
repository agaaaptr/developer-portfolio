# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint on src/ directory
```

## Architecture

Single-page portfolio website built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4. Neobrutalism design, light-only. Design spec: `design.md`.

### Page Structure

- **Single-page application**: All sections rendered on one page with smooth scrolling (Lenis).
- **Dynamic imports**: Sections are dynamically imported with `ssr: false` to avoid hydration issues with `motion` animations.
- **Layout**: Wraps children in `SmoothScroll` (Lenis) and renders `Header` and `ScrollToTopButton` directly.

### Key Directories

- `src/app/` - App Router (layout.tsx, page.tsx, globals.css, /project/all, /project/[slug], /api/cv/[lang])
- `src/components/sections/` - Hero, Expertise, Work, Experience, Contact
- `src/components/layout/` - Header, Footer, SmoothScroll
- `src/components/projects/` - ProjectCard, ProjectFilter, ProjectGrid, ProjectNavigation
- `src/components/ui/` - Accordion, ImageWithFallback, ScrollToTopButton
- `src/lib/hooks/` - useMediaQuery
- `src/data/` - JSON data files for content (personal, experience, expertise, projects)

### Content Management

Content is managed through JSON files in `src/data/`. To update portfolio information, edit the relevant JSON file rather than hardcoding in components.

### Animation System

Uses `motion` (imported from `motion/react`) with per-component animation variants defined inline in each section and page (for example `containerVariants` and `itemVariants` in `src/components/sections/Hero.tsx` and the project pages). There is no shared variants module.

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
