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

This is a single-page portfolio website built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS.

### Page Structure

- **Single-page application**: All sections rendered on one page with smooth scrolling navigation
- **Dynamic imports**: All sections are dynamically imported with `ssr: false` to avoid hydration issues with framer-motion animations
- **Client-side rendering**: Root layout wraps content in client components for state management (loading overlay, background manager, scroll tracking)

### Key Directories

- `src/app/` - Next.js App Router (layout.tsx, page.tsx, globals.css)
- `src/components/sections/` - Hero, About, Skills, Experience, Projects, Capabilities, Contact
- `src/components/layout/` - Header, Footer, RootLayoutClient, BodyWrapper, LoadingOverlay, BackgroundManager
- `src/components/ui/` - Reusable UI components (Button, Card, GradientCard, ShowMoreButton, ScrollToTopButton)
- `src/lib/animations/variants.ts` - Shared framer-motion animation variants
- `src/lib/hooks/` - Custom hooks (useSectionTracker, useMediaQuery, useTouchDevice, useAutofill)
- `src/data/` - JSON data files for content (personal, skills, experience, projects, capabilities)

### Content Management

Content is managed through JSON files in `src/data/`. To update portfolio information, edit the relevant JSON file rather than hardcoding in components.

### Animation System

Uses framer-motion with shared variants defined in `variants.ts`:
- `containerVariants` - For parent containers with staggered children
- `itemVariants` - Standard fade-in with Y translation
- `cardItemVariants` - For cards with entrance/exit animations

**Important**: When adding animations with `type: "spring"`, use `as const` assertion for TypeScript compatibility with React 19:
```typescript
transition: { type: "spring" as const, stiffness: 300, damping: 20 }
```

### Styling

- **Tailwind CSS** for utility classes
- **Custom theme**: Extended colors in `tailwind.config.js` (primary, secondary, accent)
- **CSS animations**: Custom keyframes in `globals.css` (gradientShift, text-glow, pattern-pan)
- **Dark mode**: Uses `darkMode: 'class'` configuration

### Icon Conventions

Uses lucide-react ^1.7.0 (see package.json). GitHub, LinkedIn, and Instagram brand icons are locally defined SVG components (`GithubIcon`, `LinkedinIcon`, `InstagramIcon`), not lucide imports, so there are no lucide brand-icon names to migrate.

### Section Tracking

The `useSectionTracker` hook manages scroll-based section tracking for the "Return to Previous Section" button. It tracks sections defined in the `sectionMap` object within the hook.

### Touch Device Handling

The project includes touch device detection via `useTouchDevice` hook. Touch devices have certain hover effects disabled via CSS media queries (`@media (hover: none)`).
