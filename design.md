# Neobrutalism Design System

Status: implemented (2026-10-12). Light-only. This is the single source of truth for the visual system.

## 1. Direction

Neobrutalism / brutalist-editorial: flat concrete canvas, ink text, solid black borders, hard offset shadows (zero blur), loud accent fills, snap motion. Osmo (osmo.supply) is the style reference.

## 2. Tokens (light-only)

Defined in `src/app/globals.css` (`@theme`):

| Token | Value | Use |
| --- | --- | --- |
| ink | #000000 | text, borders, hard shadows |
| surface | #f0f0f0 | page background |
| card | #ffffff | cards, inputs, elevated surfaces |
| border | #000000 | 2px solid borders |
| lime | #c6ff34 | primary CTA, highlight blocks |
| violet | #7f3aed | secondary accent fills |
| violet-bright | #8e51ef | violet text on light (WCAG AA) |
| shadow-neo | 4px 4px 0 #000 | hard offset shadow |
| shadow-neo-lg | 6px 6px 0 #000 | hero / loud elements |
| radius-base | 5px | cards, tiles, inputs |

Contrast: black-on-lime 17.75 · white-on-violet 5.63 — all WCAG AA.

## 3. Conventions

- Border: uniform `border-2` solid black. Radius: 5px (`rounded-base`) for tiles, `rounded-full` (pill) for buttons/badges. No mid radii.
- Shadow: `shadow-neo` (4px) default, `shadow-neo-lg` (6px) for hero emphasis.
- Press: hover `translate(4px,4px)` + `shadow-none`, CSS transition (~150ms). No spring, no active state.
- Focus: inputs get a hard violet offset shadow on focus (`4px 4px 0 #7f3aed`).
- Headings: `font-display` (Archivo Black) uppercase, tight tracking, leading ~0.9.
- Body: `font-body` (Space Grotesk). Labels/meta: `font-mono` (JetBrains Mono). Annotations: `font-hand` (Caveat).
- Motion: `motion` (motion/react) for entrance/scroll-reveal only; hover/press in plain CSS. `lenis` for smooth scroll (respects `prefers-reduced-motion`).

## 4. Color usage

- Lime: primary CTA fills, headline highlight blocks, active filter pills, scroll-to-top.
- Violet: secondary accent fills, kicker labels, links, the handwritten "that's me" annotation.

## 5. Structure

Single-page home (Hero → Expertise → Work → Experience → Contact) + `/project/all` + `/project/[slug]`. Floating pill Header, marquee at hero bottom, floating project navigation on detail pages. Light-only.

## 6. Dependencies (final)

next 16.4.0 · react 19.3.0 · typescript 6.0.3 · tailwindcss 4.3.3 · motion 14.1.0 · lenis 1.3 · lucide-react 1.55 · eslint 10 (flat config). `npm audit` residual: 1 advisory (braces GHSA-vfj7-8cjw-p6xm, no patched release, dev-only DoS) — accepted/suppressed.
