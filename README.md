# Developer Portfolio

Single-page portfolio for Aga Putra (Gagah Putra Anugrah), full-stack software engineer. Neobrutalism design, light-only. Design spec: [design.md](./design.md).

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript 6 · Tailwind CSS 4
- `motion` (framer-motion) for entrance animations · `lenis` for smooth scroll
- `lucide-react` for icons

## Commands

```bash
npm run dev    # dev server (localhost:3000)
npm run build  # production build
npm run start  # production server
npm run lint   # eslint src/
```

## Structure

- `src/app/` — layout, home page, `/project/all`, `/project/[slug]`, `/api/cv/[lang]`
- `src/components/sections/` — Hero, Expertise, Work, Experience, Contact
- `src/components/layout/` — Header, Footer, SmoothScroll
- `src/components/projects/` — ProjectCard, ProjectFilter, ProjectGrid, ProjectNavigation
- `src/components/ui/` — Accordion, ImageWithFallback, ScrollToTopButton
- `src/data/*.json` — content (personal, experience, expertise, projects)
- `src/lib/hooks/` — useMediaQuery

## Content

Edit `src/data/*.json` to update portfolio content — never hardcode in components.

## Design system

Tokens live in `src/app/globals.css` (`@theme`): ink `#000`, surface `#f0f0f0`, card `#fff`, lime `#c6ff34`, violet `#7f3aed`, hard shadows (`4px 4px 0`), 5px radius. Fonts: Archivo Black (display), Space Grotesk (body), JetBrains Mono (labels), Caveat (handwritten annotations).
