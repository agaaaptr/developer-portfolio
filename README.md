# Developer Portfolio

Single-page portfolio for Aga Putra (Gagah Putra Anugrah), full-stack software engineer. Neobrutalism design, light-only. Design spec: [design.md](./design.md).

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript 6 · Tailwind CSS 4
- `motion` (framer-motion) for entrance animations · `lenis` for smooth scroll
- `three` and `@dimforge/rapier3d-compat` for the interactive hero lanyard
- `lucide-react` for icons

## Commands

```bash
npm run dev       # dev server (localhost:3000)
npm run build     # production build
npm run start     # production server
npm run lint      # eslint src/
npm test          # lanyard unit tests
npm run test:e2e  # Playwright viewport and interaction tests
npm run cv:render            # rebuild CV PDFs (scripts/render.sh)
npm run portfolio:render     # rebuild the portfolio PDF
npm run future-resume:render # rebuild the Future Resume PDFs
```

Install the Playwright browser once with `npx playwright install chromium`.
The E2E suite starts the dev server if needed; set `PLAYWRIGHT_BASE_URL` to use
an already running server instead. To run only desktop checks, use
`npm run test:e2e -- --project=desktop`. Open the screenshots and report with
`npx playwright show-report playwright/report`.

## Structure

- `src/app/(site)/` — home page and project routes with the main site chrome
- `src/app/links/` — isolated QR link hub
- `src/components/sections/` — Hero (incl. HeroLanyard), Expertise, TechStack, Contributions, Work, Experience, Contact
- `src/components/layout/` — Header, Footer, SmoothScroll
- `src/components/projects/` — ProjectCard, ProjectFilter, ProjectGrid, ProjectNavigation
- `src/components/ui/` — Accordion, ImageWithFallback, ScrollToTopButton
- `src/data/*.json` — content (personal, experience, expertise, projects, techstack)
- `src/lib/lanyard-*.ts` — Three.js + Rapier lanyard (scene, physics, strap, geometry, textures)
- `src/lib/hooks/` — useMediaQuery
- `scripts/` — QR, CV, and portfolio document rendering
- `tests/` — unit tests; `tests/e2e/` — Playwright specs

## Content

Edit `src/data/*.json` to update portfolio content — never hardcode in components.
The hero lanyard uses the name, title, location, and `profileImage` from
`src/data/personal.json`. Profile images in `public/images/` are publicly served.
The lanyard's front uses the locally prepared transparent portrait; its back
reuses `public/images/qr-links.png` for `/links`. Regenerate the QR assets with
`npm run qr:generate` if the destination changes. Drag the badge to swing it or
tap it to show the QR and pause automatic movement; tap again to return to the
front. The badge is keyboard-operable, reduced motion keeps manual flip
available, and a static two-sided fallback is shown only when 3D is unavailable.
The [overhaul guide](./docs/superpowers/plans/2026-11-01-lanyard-overhaul.md)
records the behavior, acceptance criteria, and verification limits.

## Design system

Tokens live in `src/app/globals.css` (`@theme`): ink `#000`, surface `#f0f0f0`, card `#fff`, lime `#c6ff34`, violet `#7f3aed`, hard shadows (`4px 4px 0`), 5px radius. Fonts: Archivo Black (display), Space Grotesk (body), JetBrains Mono (labels), Caveat (handwritten annotations).
