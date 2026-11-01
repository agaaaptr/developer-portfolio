# Portfolio UI Overhaul — Design (2026-10-30)

## Intent & why

The portfolio is a single-page Next.js 16 site (App Router, React 19, TypeScript, Tailwind 4,
motion/react, Lenis) in a light-only neobrutalism style. The user wants four improvements plus two
bug fixes. All visual changes adapt the *reference* portfolios' behavior to our neobrutalism system;
nothing is cloned dark-for-dark.

Reference sites were inspected live (Playwright/Puppeteer, 2026-10-30):

- **arih.ai.id** "Technology Stack" section = a centered heading plus **two infinite marquee rows of
  pill chips** running in opposite directions (`.marquee-content` `scroll-left` 36s and
  `marquee-reverse` `scroll-right` 40s; pills ~46px tall). **There is no "fandeck" of rotated cards**
  — an earlier CSS-only analysis claimed one, but the live DOM has none.
- **alfari.my.id** hero renders a 3D lanyard ID badge on a `lanyard-canvas` (3200×2880) plus a
  `particles-canvas` background. It is vanilla three.js (the React Bits "Lanyard" pattern): an
  extruded card with a punched hole, rope strap, metal ring, pointer drag/throw, and click-to-flip.
  Card text/photo is baked into a canvas texture, not DOM.

## Goals

1. Rebuild the hero's tech-stack area as two neobrutalist marquee rows of brand-logo cards.
2. Replace the fixed bottom lime bar's content with status · role · location (more informative now
   that tech stack moved up).
3. Add a 3D ID card (three.js lanyard) to the hero with a placeholder person photo.
4. Make the site icon "AP_." with a blinking underscore (tab + header wordmark).
5. Add a GitHub contribution graph section between Experience and Contact.
6. Apply the arih.ai.id "blur reveal" animation to every section and the project pages.

## Non-goals

- Not copying the reference sites' dark themes; keep light-only neobrutalism.
- Not adding a test suite (the repo has none; verification gate is `lint` + `build` + manual browser).
- Not touching the deferred security upgrade (Next 16.4.0 → 16.4.3), a separate task.
- Not restyling sections other than the ones listed.

## Anti-goals (would make this fail)

- Inventing portfolio claims or metrics (standing user rule) — the bottom bar and tech list must use
  only data already in `src/data/personal.json` or confirmed by the user.
- Breaking `prefers-reduced-motion` or accessibility on any new animation.
- Making the hero feel templated or off the neobrutalism vocabulary.

## Constraints

- Stack: Next 16 (App Router), React 19, TS, Tailwind 4 (CSS-first `@theme`), `motion/react`, Lenis.
- Design tokens live in `src/app/globals.css` `@theme` (ink/surface/card/border/lime/violet,
  `--shadow-neo`, `--radius-base`). Light-only.
- Hover/press = plain CSS snap (`transition-all hover:translate-* hover:shadow-none`), never motion
  springs (except existing `whileHover` in ScrollToTopButton). Reveal = motion variants declared
  inline per component, sections dynamically imported with `ssr:false`.
- Content is JSON-driven (`src/data/*.json`), never hardcoded.
- No `use cache`, no server actions in this repo (verified) — keep it that way.
- Real brand logos via `simple-icons` (new dependency, tree-shaken). Items without a brand icon get a
  monogram fallback.

## Locked decisions (with user, 2026-10-30)

1. Tech-stack visuals: **real brand logos** (simple-icons), two marquee rows.
2. Bottom lime bar content: **status · role · location**.
3. 3D ID card: **three.js lanyard** (like the reference), placeholder photo the user swaps later.
4. Favicon blink: **tab + header logo**; header wordmark changes to "AP_.".

## Feature designs

### A. Hero tech stack → two marquee rows of brand cards

- **Data** — new `src/data/techstack.json`:
  ```json
  { "rows": [
      { "direction": "left",  "duration": 36, "items": ["Angular","React","Next.js","TypeScript","Tailwind CSS","Node.js","Vite","HTML5","CSS3"] },
      { "direction": "right", "duration": 40, "items": ["Go","REST APIs","Claude Code","OpenCode","GitHub","Git","Linux","Docker"] }
  ]}
  ```
  `items` are keys into a logo map (simple-icons slug) with a monogram/text fallback for non-brand
  items ("REST APIs", "Claude Code", "OpenCode"). The exact list is in **"To confirm"** below.
- **Component** — new `src/components/sections/TechStack.tsx` (client), rendered inside Hero where the
  `skillCards` block sits (Hero.tsx ~249–259). Remove `skillCards` (Hero.tsx 12–19).
- **Mechanics** — pure CSS: each row is a duplicated track (`flex w-max whitespace-nowrap`), two
  copies, `@keyframes` translateX −50% (right row reversed), `animation-duration` from JSON,
  `linear infinite`. Pause the whole block on hover/focus. Under `prefers-reduced-motion`, render a
  single static row (no duplication). Duplicate copies `aria-hidden`.
- **Card chrome** (neobrutalism): each pill = `rounded-base border-2 border-ink bg-card shadow-neo`,
  an icon in a small `bg-lime` tile (or `bg-violet` alternating) + a `font-mono` label, matching the
  site's existing icon-box pattern.

### B. Bottom lime bar content

- Keep the existing fixed bar chrome and CSS marquee + scroll fade
  (`fixed inset-x-0 bottom-0 z-20 … bg-lime`, `heroMarquee`, `isMarqueeVisible`), change only the
  item list.
- New content (all real values from `personal.json`): **"● Open to work" · "Software Engineer" ·
  "Sleman, Yogyakarta, Indonesia"**, separated by `✦`. "Open to work" already appears as the hero
  badge pill, so it is a confirmed value. Confirm it is still accurate (see To confirm).

### C. GitHub contribution graph

- **Component** — new `src/components/sections/Contributions.tsx` (client), inserted in `page.tsx`
  between `ExperienceSection` and `ContactSection` via the existing `dynamic(…, { ssr:false })`
  pattern. Renumber: Contributions = `05`, Contact = `06` (update `Contact.tsx` label and
  `Header.tsx` `navItems`). New `id="contributions"` must match the Header nav entry for scroll-spy.
- **Data** — Jogruber API `https://github-contributions-api.jogruber.de/v4/{username}`, token-free,
  CORS `*`, username from `personalData.socials.github` (`agaaaptr`). Client-side fetch with loading
  and error states.
- **Render** — hand-rolled heatmap (zero new dependency, matches the reference's hand-rolled grid),
  **trailing 12 months** (decided):
  weeks × 7 grid of square cells, each cell `border border-ink bg-surface` with a 5-level lime ramp
  (`#f0f0f0` → `#eaffa8` → `#d8ff63` → `#c6ff34` → `#8fbf00`); `aria-label` "N contributions on
  YYYY-MM-DD"; month labels + weekday labels + legend + total count; `title` attribute for hover
  (no JS tooltip). No tokens required. Graceful fallback text if the API is down.
- **Note** — this repo is a single-page site whose page component is `"use client"`; the fetch stays
  client-side, no route handler needed.

### D. 3D ID card (three.js lanyard)

- **Dependency** — add `three` (latest 0.186.x). **Not** `@react-three/fiber` (the reference is
  vanilla three; skipping fiber+drei avoids ~100KB extra).
- **Component** — new `src/components/ui/IdCard.tsx` (client), mounted in Hero. Hero becomes
  two-column at `lg` (text left, card right); the rotating circular badge (Hero.tsx ~178) is removed
  to free that column. On `<lg` the card sits below the CTAs.
- **Port** — reproduce the reference's lanyard: `ExtrudeGeometry` rounded card with a punched hole,
  4-joint rope strap, metal ring, pointer drag/throw with inertia, click-to-flip. Card art baked to a
  1024px canvas texture. **Placeholder photo** = "AP" initials on a neutral silhouette (drawn, no
  real face); the real photo replaces it later at `public/images/id-photo.jpg`. Card fields: name
  "Aga Putra", role "Software Engineer", location, and a violet "Open to work" status chip — all
  from `personal.json`.
- **Fallbacks** — `prefers-reduced-motion` or WebGL unavailable → render a static neobrutalist DOM
  card (same info) instead of the canvas. `ssr:false` is already satisfied because Hero is
  dynamically imported.
- **Cost** — ~149KB gzip added. This is the highest-risk item; treat as a spike first, keep the
  interaction minimal (drag + flip), and cut any rope physics that proves fragile.

### E. Favicon "AP_." + header wordmark

- **Header** — wordmark "AgaPutra._" → "AP_." with the underscore blinking via a small CSS keyframe
  on the `_` span (cross-browser).
- **Favicon (tab)** — animated tab favicons are native only in Firefox, so use the reliable JS
  frame-swap:
  - Static fallback: `public/favicon.ico` (underscore visible) + `src/app/apple-icon.png` (180×180,
    iOS never animates tab icons).
  - New `src/components/layout/FaviconBlink.tsx` (client), mounted once in `layout.tsx` body:
    pre-render two PNG frames ("AP_" and "AP_.") to data URLs on one canvas once, swap a single
    `link[rel=icon]` `href` every 500ms, skip while `document.hidden`, return early under
    `prefers-reduced-motion`, restore on unmount. Own exactly one explicit icon link to avoid
    Chrome's multi-icon ambiguity.
- **Art** — lime `#c6ff34` rounded square, 4px black inset border, chunky black "A" + "P" sharing a
  baseline, blinking underscore.

### F. Bug fixes (already applied this session — recorded for completeness)

- Navigator preview blink: `ProjectNavigation.tsx` buttons had `hover:translate-*` on the same
  element that owns `onMouseEnter/Leave`; the transform moved the hit-area at the edge, oscillating
  enter/leave. Changed to `active:translate-*` + kept `hover:bg-lime`.
- Always-on scrollbar: deleted the `::-webkit-scrollbar` block from `globals.css` (custom scrollbar
  styling forces classic/always-visible mode in WebKit/Blink). Native overlay scrollbar restored.

### G. Section reveal animation (blur) — everywhere, including project pages

- **Mechanism** (measured live from arih.ai.id): an IntersectionObserver toggles `data-reveal-state`
  `pending → visible`. The reveal is `filter: blur(10px) → 0`, `opacity: 0 → 1`,
  `translateY(16px) → 0`, one eased transition, ~0.1s stagger between sibling cards.
- **Our port** — keep the existing `motion/react` `whileInView`/variants mechanism (it is
  IntersectionObserver-based) and change the reveal variants to the blur form:
  `hidden: { opacity: 0, y: 16, filter: 'blur(10px)' }` →
  `visible: { opacity: 1, y: 0, filter: 'blur(0px)' }`, ease `[0.22, 1, 0.36, 1]`, ~0.6s, container
  stagger ~0.1s, `viewport={{ once: true }}`.
- **Scope** — every section on the home page, `/project/[slug]`, and `/project/all`. This replaces
  the current per-section `containerVariants`/`itemVariants` and the project pages' variants.
- **Builder call** — introduce one shared `src/lib/motion.ts` exporting the blur variants, imported
  everywhere. The current "per-component inline variants, no shared module" note in CLAUDE.md is the
  one convention this changes; duplicating the same values inline across ~9 files would drift. (If
  the user prefers no shared module, paste the same values inline per file instead.)
- **A11y/perf** — global `prefers-reduced-motion` block already zeroes transitions; keep
  `once: true` so blur runs only on first reveal; no persistent filter.

## Decided (final, confirmed 2026-10-30)

1. **Tech list** — all five extra items are real and included: `Node.js`, `Docker`, `Linux`, `Git`,
   `GitHub`. Final rows are the two lists in §A, unchanged. Non-brand items (REST APIs, Claude Code,
   OpenCode) use monogram chips.
2. **Availability status** — keep **"Open to work"** (bottom bar and ID-card chip).
3. **Graph range** — **trailing 12 months**.
4. **Placeholder photo** — **"AP" initials + neutral silhouette** (drawn, no real face); the real
   photo replaces it later at `public/images/id-photo.jpg`.
5. **Rotating badge** — removed (builder call, reversible).

Builder calls (check while reading): hand-rolled zero-dep heatmap (no `react-github-calendar`);
single explicit favicon link + `public/favicon.ico` + `apple-icon.png`; monogram chips for non-brand
stack items; `three` (vanilla) not R3F; hero becomes two-column at `lg`.

## Left to the builder

Exact marquee keyframe values, heatmap cell/column sizing, the three.js lanyard port details, favicon
art specifics, and any monogram-chip lettering for non-brand items.
