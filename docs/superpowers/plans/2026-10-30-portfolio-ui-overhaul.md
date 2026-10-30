# Portfolio UI Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (native) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the tech-stack marquee, 3D lanyard ID card, GitHub contribution graph, "AP_." favicon, and blur reveal to the neobrutalism portfolio.

**Architecture:** New self-contained components (`TechStackSection`, `ContributionsSection`, `IdCard`, `FaviconBlink`) plus one shared blur-reveal variants module, wired into the existing `dynamic(…, { ssr:false })` section pattern. `three` (vanilla) and `simple-icons` are the only new dependencies.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, motion/react, Lenis, `three` (new), `simple-icons` (new).

**Spec:** `docs/superpowers/specs/2026-10-30-portfolio-ui-overhaul-design.md` — the plan argues from the spec; read both.

## Global Constraints

- Light-only neobrutalism. Tokens from `src/app/globals.css` `@theme` only: ink `#000`, surface `#f0f0f0`, card `#fff`, lime `#c6ff34`, violet `#7f3aed`, `--shadow-neo` 4px, `--shadow-neo-lg` 6px, `--radius-base` 5px.
- Hover/press = CSS snap (`transition-all hover:translate-* hover:shadow-none`); reveal = motion variants; no motion springs for hover.
- Content from `src/data/*.json`; never hardcode. No `use cache`, no server actions (keep it that way).
- **No test framework** (repo has none, deliberately). Verification per task = `npm run lint` + `npm run build` + the stated manual browser check. Do NOT add vitest/jest.
- Import `motion` from `motion/react`. Sections render via `dynamic(…, { ssr:false })`.
- Commit each task on `develop` with a conventional-commit message and the `Co-Authored-By: Claude Code <noreply@anthropic.com>` trailer.

## Review Focus

1. **3D card flattening** — any `filter`/`opacity<1`/`overflow-hidden` on an ancestor between `perspective` and the 3D layers flattens `preserve-3d`. The Hero's blur reveal must not leave a `filter` on the Hero section once revealed. → Task 7 test: after reveal completes, computed `filter` on the Hero section is `none`/`blur(0px)` removed, and the IdCard still tilts.
2. **Marquee seam** — a loop must translate by exactly one copy width with no visible jump, pause on hover, and render a single static row under `prefers-reduced-motion`. → Task 2 test: no layout jump at the wrap point; hovering pauses; reduced-motion shows a static row.
3. **Heatmap empty/error** — Jogruber down, empty, or non-array must render a fallback message, not a blank/broken grid; grid covers exactly trailing 12 months; each cell has `aria-label`. → Task 3 test: block the request (devtools offline) and confirm the fallback text; spot-check a known active date's cell is lime.
4. **Favicon degradation** — reduced-motion must show a static icon; unmount restores/removes the injected link; no duplicate `rel=icon` links. → Task 4 test: toggle reduced-motion emulation and confirm one static icon; confirm a single `link[rel=icon]` in the head.
5. **WebGL unavailable** — the 3D card must fall back to a static DOM card without a console error when WebGL is disabled. → Task 5 test: launch with `--disable-gpu` (or a stub) and confirm the static card renders.

---

## Pre-flight: commit the already-applied changes

The two bug fixes and the docs are uncommitted in the working tree. Commit them first:

```bash
git add src/app/globals.css src/components/projects/ProjectNavigation.tsx \
  docs/superpowers/specs/2026-10-30-portfolio-ui-overhaul-design.md
git commit -m "fix: stop navigator preview blink and always-on scrollbar; add UI overhaul design"
```

---

### Task 1: Shared blur-reveal variants

**Files:**
- Create: `src/lib/motion.ts`

**Interfaces:**
- Produces: `containerVariants: Variants` and `itemVariants: Variants` (from `motion/react`), with the exact values below.

- [ ] **Step 1: Write `src/lib/motion.ts`** exporting two `Variants` from `motion/react`:
  - `containerVariants` = `{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }`
  - `itemVariants` = `{ hidden: { opacity: 0, y: 16, filter: 'blur(10px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }`

- [ ] **Step 2: Verify** — `npm run lint && npm run build`; both exit 0 (unused export is fine, it will be consumed in Task 7).

- [ ] **Step 3: Commit** — `git commit -m "feat: add shared blur-reveal motion variants"`

### Task 2: Tech-stack marquee (data + logos + component)

**Files:**
- Create: `src/data/techstack.json`, `src/lib/techLogos.tsx`, `src/components/sections/TechStack.tsx`
- Modify: `package.json` (add `simple-icons`)

**Interfaces:**
- `techstack.json` shape: `{ "rows": [{ "direction": "left" | "right", "duration": number, "items": string[] }] }`
- Produces: `TechStackSection` (named export, `'use client'`) — renders two marquee rows from `techstack.json`, uses `itemVariants`/`containerVariants` from `src/lib/motion.ts`.
- Produces: `TechLogo({ name }: { name: string })` in `src/lib/techLogos.tsx` — resolves a `simple-icons` icon by name, monogram chip fallback for names without a slug.

- [ ] **Step 1: Install** — `npm i simple-icons` (tree-shaken import: `import { siReact, siAngular } from 'simple-icons'`).

- [ ] **Step 2: Write `src/data/techstack.json`** with exactly:
  - left row, `duration: 36`, items `["Angular","React","Next.js","TypeScript","Tailwind CSS","Node.js","Vite","HTML5","CSS3"]`
  - right row, `duration: 40`, items `["Go","REST APIs","Claude Code","OpenCode","GitHub","Git","Linux","Docker"]`

- [ ] **Step 3: Write `src/lib/techLogos.tsx`** — `TechLogo({ name })`: look up the matching `si*` icon (e.g. `React`→`siReact`, `Next.js`→`siNextdotjs`, `TypeScript`→`siTypescript`, `Tailwind CSS`→`siTailwindcss`, `Go`→`siGo`, `Node.js`→`siNodedotjs`, `GitHub`→`siGithub`, `Git`→`siGit`, `Linux`→`siLinux`, `Docker`→`siDocker`, `HTML5`→`siHtml5`, `CSS3`→`siCss3`, `Vite`→`siVite`, `Angular`→`siAngular`); render its `path` as an SVG `<path fill="currentColor">` sized ~20px. For `REST APIs`, `Claude Code`, `OpenCode` (no slug) render a monogram chip (e.g. first letters in a `bg-violet`/`bg-lime` tile, `font-mono`).

- [ ] **Step 4: Write `src/components/sections/TechStack.tsx`** — `'use client'`; two rows. Each row = a duplicated track: `flex w-max whitespace-nowrap` with the item list rendered twice; a scoped `@keyframes` translating `0 → -50%` (reverse for the right row); `animation-duration` from the row's `duration`; `animation: linear infinite`. Each pill = `inline-flex items-center gap-2 rounded-base border-2 border-ink bg-card shadow-neo px-5 py-3` with `<TechLogo name>` + `font-mono` label. Pause the whole block on hover/focus (`hover:[&_*]:[animation-play-state:paused]` or a group class). Under `prefers-reduced-motion` render a single static row. Duplicate copies `aria-hidden`.

- [ ] **Step 5: Verify** — `npm run lint && npm run build`; then `npm run dev` and confirm the two rows scroll in opposite directions, pause on hover, and no seam jump at the wrap point (Review Focus #2).

- [ ] **Step 6: Commit** — `git commit -m "feat: add tech-stack marquee section with brand logos"`

### Task 3: GitHub contribution graph

**Files:**
- Create: `src/components/sections/Contributions.tsx`
- Modify: `src/app/page.tsx` (import + render between Experience and Contact), `src/components/sections/Contact.tsx` (renumber `05`→`06`), `src/components/layout/Header.tsx` (nav: add `contributions` as `05`, contact `06`)

**Interfaces:**
- Produces: `ContributionsSection` (named export, `'use client'`), id `contributions`.
- Consumes: `personalData.socials.github` (`agaaaptr`) from `@/data/personal.json`; `itemVariants`/`containerVariants` from `src/lib/motion.ts`.

- [ ] **Step 1: Write `src/components/sections/Contributions.tsx`** — `'use client'`. `useEffect` fetch `https://github-contributions-api.jogruber.de/v4/${personalData.socials.github}`; keep `loading` and `error` state. Render a hand-rolled heatmap of the **trailing 12 months**: weeks columns × 7 rows of square cells; each cell `border border-ink bg-surface` whose fill is a 5-level lime ramp by `level` (0→`#f0f0f0`, 1→`#eaffa8`, 2→`#d8ff63`, 3→`#c6ff34`, 4→`#8fbf00`); `aria-label` = `${count} contributions on ${date}`; `title` attr for hover; month labels + weekday labels + a legend + total count. On `error`/empty render a fallback sentence (not a blank grid). Section wrapper follows the existing pattern (`section#contributions`, eyebrow `05 — …`, `bg-surface`).

- [ ] **Step 2: Wire into `src/app/page.tsx`** — add `const ContributionsSection = dynamic(() => import('@/components/sections/Contributions').then(m => m.ContributionsSection), { ssr: false })` and render `<ContributionsSection />` between `<ExperienceSection />` and `<ContactSection />`.

- [ ] **Step 3: Renumber** — in `Contact.tsx` change the eyebrow label `05 — …` to `06 — …`; in `Header.tsx` `navItems` insert `{ id: 'contributions', label: 'contributions', num: '05' }` before contact and set contact `num` to `'06'`.

- [ ] **Step 4: Verify** — `npm run lint && npm run build`; then `npm run dev`, confirm the graph renders with your real contributions, cells are lime-scaled, and a known active date's cell is non-empty. Confirm Review Focus #3: DevTools → offline → reload → fallback text appears.

- [ ] **Step 5: Commit** — `git commit -m "feat: add GitHub contribution graph section"`

### Task 4: "AP_." favicon + header wordmark

**Files:**
- Create: `src/components/layout/FaviconBlink.tsx`, `src/app/apple-icon.png`
- Modify: `src/app/layout.tsx` (mount `FaviconBlink`), `src/components/layout/Header.tsx` (wordmark → "AP_." + blinking `_`)
- Replace: `src/app/favicon.ico` (move static art to `public/favicon.ico`; delete the app-dir one so Next emits no hashed icon link)

**Interfaces:**
- Produces: `FaviconBlink` (named export, `'use client'`) — no props; owns a single `link[rel=icon]`.

- [ ] **Step 1: Create the static art** — hand-write an SVG "AP_." (lime `#c6ff34` rounded square, 4px black inset border, chunky black "A" + "P", underscore visible) and export it to `public/favicon.ico` (multi-size ICO) and `src/app/apple-icon.png` (180×180). Use a small throwaway node script (e.g. `sharp` already transitively present, or a canvas in the existing `/tmp/portfolio-e2e` puppeteer scratch) to rasterize; do not commit the throwaway script.

- [ ] **Step 2: Write `src/components/layout/FaviconBlink.tsx`** — `'use client'`. Early-return under `prefers-reduced-motion`. On mount, pre-render two PNG data-URLs (one with `_`, one without) once via canvas, then every 500ms replace a single `link#favicon-blink[rel=icon]` (recreating the node each tick); skip the tick while `document.hidden`; on unmount clear the interval and remove the link. Mount `<FaviconBlink />` once in `layout.tsx` `<body>`.

- [ ] **Step 3: Header wordmark** — change the wordmark text to `AP_` with the `_` in its own `<span>` animating opacity (`@keyframes` 1s steps, `prefers-reduced-motion` safe via the global block). Keep the existing violet underscore color.

- [ ] **Step 4: Verify** — `npm run lint && npm run build`; then `npm run dev`: confirm the tab icon shows "AP_." and the underscore blinks ~1s in Chrome; the header shows "AP_." with a blinking `_`; DevTools shows exactly one `link[rel=icon]`. Confirm Review Focus #4 (reduced-motion → static icon).

- [ ] **Step 5: Commit** — `git commit -m "feat: add AP_. favicon with blinking underscore and header wordmark"`

### Task 5: 3D ID card (three.js lanyard)

**Files:**
- Create: `src/components/ui/IdCard.tsx`
- Modify: `package.json` (add `three`)

**Interfaces:**
- Produces: `IdCard` (named export, `'use client'`) — no required props; reads `personalData` (name, title, location, status "Open to work"); self-contained canvas. Falls back to a static DOM card when WebGL is unavailable or `prefers-reduced-motion`.

- [ ] **Step 1: Install** — `npm i three`.

- [ ] **Step 2: Write `src/components/ui/IdCard.tsx`** — a vanilla `three` scene in a `useEffect`: `ExtrudeGeometry` rounded card with a punched hole, a 4-joint rope strap and metal ring, pointer drag/throw with inertia, click-to-flip. Bake the card face to a 1024px `CanvasTexture`: "AP" initials + neutral silhouette (drawn; no real face) for the photo, name `Aga Putra`, role `Software Engineer`, location, violet "Open to work" chip — all from `personal.json`. `requestAnimationFrame` render loop, `resize` handling, and `dispose()` on unmount. If WebGL context creation fails or `prefers-reduced-motion`, return a static neobrutalist DOM card (same fields) instead of a canvas.

- [ ] **Step 3: Verify** — `npm run lint && npm run build`; then `npm run dev`: confirm the lanyard card renders, can be dragged and clicked to flip, and disposes cleanly on route change. Confirm Review Focus #5: reload with WebGL off (DevTools → disable) → static card, no console error.

- [ ] **Step 4: Commit** — `git commit -m "feat: add three.js lanyard ID card"`

### Task 6: Hero integration (two-column, marquee, ID card, bottom bar)

**Files:**
- Modify: `src/components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `TechStackSection` (Task 2), `IdCard` (Task 5), `itemVariants`/`containerVariants` (Task 1), `personalData` from `@/data/personal.json`.

- [ ] **Step 1: Bottom bar content** — in `Hero.tsx` replace the `marqueeItems` array usage with the three items `"● Open to work"`, `"Software Engineer"`, `"Sleman, Yogyakarta, Indonesia"` (title/location from `personalData`; keep the existing `heroMarquee` + scroll-fade chrome).

- [ ] **Step 2: Replace skill cards with marquee** — delete the `skillCards` const and its render block; render `<TechStackSection />` in its place.

- [ ] **Step 3: Two-column + ID card** — restructure the hero to a `lg:grid lg:grid-cols-[1fr_auto]` (text left, card right); mount `<IdCard />` in the right column; remove the rotating circular badge. On `<lg` the card sits below the CTAs.

- [ ] **Step 4: Verify** — `npm run lint && npm run build`; then `npm run dev`: hero shows the marquee, the ID card on the right (desktop), the correct bottom-bar text, no badge, and the layout does not overflow at phone width.

- [ ] **Step 5: Commit** — `git commit -m "feat: integrate tech marquee, 3D card and new hero layout"`

### Task 7: Apply blur reveal everywhere

**Files:**
- Modify: `src/components/sections/Hero.tsx`, `Expertise.tsx`, `Work.tsx`, `Experience.tsx`, `Contact.tsx`, `src/app/project/[slug]/page.tsx`, `src/app/project/all/page.tsx` — replace each file's inline `containerVariants`/`itemVariants` with imports from `src/lib/motion.ts`.

- [ ] **Step 1: Swap variants** — in every section and both project pages, delete the local variants and import `{ containerVariants, itemVariants }` from `@/lib/motion`. Keep each file's existing `motion.div`/`whileInView`/`viewport={{ once: true }}` wiring unchanged.

- [ ] **Step 2: Clear the Hero filter after reveal** — the Hero contains the 3D card; a lingering `filter` on the Hero flattens `preserve-3d`. For the Hero only, animate the blur on the inner content (or remove the `filter` style once `visible`), so the Hero section itself ends with no active `filter`. Use `onAnimationComplete` to clear it if needed.

- [ ] **Step 3: Verify** — `npm run lint && npm run build`; then `npm run dev` and confirm every section (home + project + project/all) blurs in on first scroll, no persistent filter, and the 3D card still tilts (Review Focus #1).

- [ ] **Step 4: Commit** — `git commit -m "feat: apply blur reveal animation across all sections and project pages"`

### Task 8: Full-repo verification pass (pre-handoff gate)

**Files:** none (read-only + manual).

- [ ] **Step 1:** `npm run lint && npm run build` — both exit 0.

- [ ] **Step 2:** Manual browser pass: home page (hero + marquee + ID card + contributions + all sections reveal), `/project/all`, one `/project/[slug]` (nav preview stable, reveal), mobile width (no horizontal scroll, card stacks correctly), `prefers-reduced-motion` emulation (marquee static, favicon static, reveals appear instantly), and the two earlier bug fixes (navigator edge hover, scrollbar only-on-scroll).

- [ ] **Step 3:** Report results to the user; do not claim done until every item is checked and green.
