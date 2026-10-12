# Gemini Project Context: Developer Portfolio

This file provides context for the Gemini CLI to understand and work with this project.

## Project Overview

Personal developer portfolio website built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4. Neobrutalism design, light-only. Design spec: `design.md`.

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript 6
- **Styling:** Tailwind CSS 4 (CSS-first), PostCSS
- **Animation:** motion (framer-motion successor), lenis (smooth scroll)
- **Package Manager:** npm
- **Dependencies:** motion, lenis, lucide-react, next, react, react-dom
- **Dev Dependencies:** @tailwindcss/postcss, @types/node, @types/react, @types/react-dom, eslint, eslint-config-next, postcss, tailwindcss, typescript

## Important Commands

- **Install dependencies:** `npm install`
- **Run development server:** `npm run dev`
- **Build for production:** `npm run build`
- **Start production server:** `npm run start`
- **Run linter:** `npm run lint`
- **Render CV:** `npm run cv:render` / `npm run portfolio:render`
- **Deploy to Vercel:** `npm run deploy`

## Project Structure

- `src/app/`: pages, layout, API routes (home, /project/all, /project/[slug], /api/cv/[lang]).
- `src/components/`: React components, organized into `layout`, `sections`, `projects`, and `ui`.
- `src/data/`: JSON files (personal, experience, expertise, projects).
- `src/lib/hooks/`: useMediaQuery.
- `src/app/globals.css`: global styles and design tokens (`@theme`).
- `public/`: static assets.
- `next.config.js`, `postcss.config.js`, `eslint.config.mjs`, `tsconfig.json`.
