# Realistic lanyard overhaul: implementation and verification guide

Date: 2026-11-01

## Goal and scope

Rebuild the home hero's interactive lanyard as an original neobrutalist design:
a thin, two-sided badge with the complete supplied portrait, connected strap and
metal hardware, physically plausible motion, and a scannable link-hub QR.
The reference at <https://www.alfari.my.id/> informs interaction and staging;
its original artwork and branding are not copied.

The work is to be executed in this session as well as documented here. Record
actual evidence and any unfinished checks below so a later session can resume
without treating a proposed target as a passed test.

## Existing state and root-cause analysis

| Symptom | Evidence in the existing implementation | Direction |
| --- | --- | --- |
| Lanyard cannot cover the hero | `HeroLanyard.tsx` limits its stage to 460px and 400/480/540px; `Hero.tsx` nests it inside the content grid. | Render a hero-sized overlay at the page top, with a projected-card hit target and a reserved responsive layout slot. |
| Hardware looks detached | The original ribbon used a separate Z offset and sleeping rope bodies lagged behind a dragged card. The subsequent revision clamped both the physics target and the viewport, while the ring and clip remained children of the card. | Keep one set of attachment coordinates, allow the tether to stretch during unrestricted dragging, and give the hardware articulated bodies. |
| No actual slot; card is thick | The slot is a black plane; the extruded body and face planes have no hole. The 0.1 depth plus bevel is about 0.17 world units for a 2.4-unit-wide card. | Cut the same slot through body and both face geometries, use thinner edges, and align the ring through it. |
| Portrait is cropped | `getPortraitCrop` uses cover for an 844x1500 image in an 824x700 panel, retaining only about 717 source pixels vertically. | Contain the complete existing image without stretching; do not invent content beyond its bottom edge. |
| Lighting looks flat | Both face artwork and the strap use unlit `MeshBasicMaterial`. | Use lit materials and restrained reflections on card, strap and metal; keep the QR high-contrast. |
| Motion appears to stop | Physics used damping and sleep, grabbing switched to a kinematic body, and a 1/30s frame cap made the simulation run in slow motion below 30fps. A drag released before the next frame could also lose its final position. | Wake the chain, preserve quick-drag targets, allow bounded fixed-step catch-up, and provide subtle physical movement while enabled. |
| Full-hero canvas could be blurry or corrupt on resize | The original 2.5-million-pixel budget limited a 1440x900 canvas to about DPR 1.39. Resizing an already-uploaded canvas texture also produced WebGL copy warnings. | Use a bounded 6-million-pixel budget and replace/dispose GPU textures when their dimensions change. |
| Back and interactions are incomplete | The back texture has no QR, and there is no deterministic click-to-flip, idle hint, pause control, or reduced-motion back-face access. | Add a single physical flip authority, QR asset, explicit controls and accessible fallback. |

Baseline evidence: the existing 13 Node tests passed before this overhaul. The
PNG QR was independently decoded locally to `https://aga-putra.vercel.app/links`
at 74, 111, 148, 185, 256, 512 and 1024 pixels using nearest-neighbor
resampling. This is a digital image test, not a physical-camera scan of the
finished 3D badge. Earlier reference observations covered desktop, tablet and
mobile viewports, but the latest automated reference interaction probe did not
complete; do not claim full reference E2E coverage from it.

## Decisions and constraints

- Preserve the uncommitted lanyard and `/links` work, including the staged route
  moves into `src/app/(site)`. Do not stage, reset, or commit mixed work.
- `/links` stays outside `(site)`, without the main site's Header, Lenis or
  scroll-to-top. Reuse `public/images/qr-links.png` or its SVG and its existing
  generator; do not replace the target or regenerate it unnecessarily.
- The latest feedback overrides the earlier provisional behavior: the badge is
  above hero content only; the navbar, menus, dropdowns and other site chrome
  remain above it. Dragging is not constrained to the viewport or a fixed
  tether length. The idle hint starts after eight seconds and holds the back
  for half a second; a manually selected back remains open for scanning.
- The area below the badge contains a stable hint, not a row of controls. The
  badge itself remains keyboard- and touch-operable. A discoverable way to
  stop automatic motion must remain available, including on touch devices;
  reduced motion suppresses the entrance, sway and automatic hint while
  preserving a manual front/back action and a link-hub alternative.
- The full overlay must not intercept page interactions away from the badge.
  Respect vertical page scrolling and pinch zoom on touch devices.
- Do not add GSAP solely for this feature. GSAP timelines are useful for
  interruptible authored sequences, but this project already has `motion` and
  Rapier. A small state controller can drive physical targets without another
  runtime animation engine. Reconsider GSAP if future choreography requires
  substantially more coordinated timelines; never tween a Three.js transform
  independently while Rapier also controls it.

## Implementation tasks

### 1. Test the contracts first

- [x] Replace crop expectations in `tests/lanyard-photo.test.mjs` with
  aspect-preserving, fully contained placement tests, including invalid input.
- [x] Add targeted tests for a real through-hole, matching face/body geometry,
  attachment error, deterministic flip, pause and reduced-motion behavior.
- [x] Test quality limits for a hero-sized canvas rather than only a 460px stage.
- [x] Run the focused tests and observe the expected failures before changing
  implementation.

### 2. Physical assembly and choreography

- [x] Keep Rapier as the single source of badge pose and use fixed-timestep
  simulation. Align the last strap point and hardware with the same card-local
  attachment. Keep constraints stable during drag, release and flip.
- [x] Make strap geometry twist with the badge instead of remaining
  camera-facing. Ensure the metal loop passes through the actual slot.
- [x] Add an interruptible physical flip target; click/tap is distinguished
  from drag by a movement threshold. Preserve a manual back-facing hold for
  scanning. Entrance falls from above; ambient sway and idle hint can be paused.
- [x] Stop work while the document or hero is not visible; release pointer
  capture on cancellation, context loss and unmount. Avoid a jump on resume.

### 3. Card, photo, QR and lighting

- [x] Redesign the front as original neobrutalist artwork using existing ink,
  surface, lime and violet tokens, hierarchy and layered typography. The
  supplied transparent portrait is shown in full, without distortion.
- [x] Draw the existing QR on the back with its white quiet zone intact,
  nearest-neighbor sampling and sufficient contrast; include a stable
  back-facing state.
- [x] Make the card thin and add the genuine through-hole. Use lighting-aware
  card/strap materials and reflective metal; verify that reflections do not
  prevent the QR from being read.
- [x] Keep texture resolution and canvas DPR high enough for sharp output on
  capable devices, with a bounded rendering budget.

### 4. Hero integration and accessibility

- [x] Place the transparent canvas from the hero's upper edge across the hero,
  above the other visual layers, while limiting pointer interception to the
  projected badge. Keep responsive reserved space for content and controls.
- [x] Make the badge itself keyboard-operable with focus styling and a
  link-hub alternative. Selecting the QR side pauses automatic movement; a
  failed portrait displays initials, and WebGL/context failure shows a static
  two-sided fallback.
- [ ] Ensure the existing CTAs, menu, CV dropdown, scroll, pinch zoom and
  `/links` isolation still work. Do not disturb unrelated route changes.

### 5. Verify and record results

- [ ] Run `npm test`, `npm run lint`, `npx tsc --noEmit` and `npm run build`.
- [x] Provide reproducible browser E2E checks for the user to run. At minimum
  cover 320x700, 375x812, 390x844 and landscape phone; 768x1024 and 1024x768
  tablet; 1440x900 desktop; test DPR 1 and 2 where supported.
- [ ] Exercise mouse, touch and keyboard: initial fall, idle flip, manual
  front/back, drag versus click, release, cancellation, automatic-motion
  pause/resume, reduced-motion, resize, offscreen/hidden state and WebGL
  fallback.
- [ ] Verify QR payload from the rendered back, not only the source asset.
  Aim for at least 4 device pixels per 37-module QR including quiet zone
  (148 pixels across) as an engineering target, not a scanning guarantee.
  Test real camera scans from representative phones, angles and lighting when
  physical devices are available; record any limitation honestly.
- [ ] Verify `/`, `/links`, `/project/all` and a project detail route; no
  horizontal overflow or console/page errors caused by the feature.
- [ ] Capture actual outcomes, device/browser limitations and unresolved work
  below instead of checking off an unexecuted test.

## Acceptance criteria

1. The strap starts at the hero's upper boundary. The badge is above hero
   content, and only its projected hit region captures input. Navbar, menus,
   dropdowns and site chrome remain above the badge.
2. The thin badge has an actual visible hole on both sides; the loop, clip and
   strap remain attached during drag and flip without a visible gap or
   discontinuity. The smaller loop and clip articulate independently of the
   card; the strap stretches for drags in any direction, including beyond the
   viewport. Its width frame remains continuous through a half-turn.
3. Every nontransparent pixel of the existing portrait fits inside its panel
   without stretching; only fully transparent margins are trimmed. The result
   does not imply the original photo contains more of the subject than it
   actually does.
4. Lighting visibly responds to pose while the original neobrutalist colors,
   front typography and high-contrast QR remain readable.
5. Click/tap flips without accidentally dragging; drag follows the pointer,
   releases smoothly and can be interrupted. The initial fall and flip are
   faster than the preceding version. Idle hints start after eight seconds and
   return after half a second; the manual back remains still enough to scan.
6. Reduced motion, keyboard navigation, page scrolling, pinch zoom, navigation
   and WebGL/photo fallback remain functional. Nothing is drawn in the badge
   area while 3D is loading; a static badge appears only on actual failure.
7. The QR decodes to the existing `/links` destination from the rendered back.
   The route remains isolated, and existing project routes continue to work.
8. Automated unit tests, lint, type-check and production build pass. The user
   runs the supplied cross-viewport E2E suite and physical-camera checks;
   unexecuted checks are not reported as passing.

## Revision tasks

- [x] Add regression tests for half-second hints, taller geometry, unrestricted
  drag, continuous strap attachments and rotation-frame continuity.
- [x] Replace the fixed tether with a stretchable physical chain and separate
  articulated ring and clip. Keep the strap attached even while its endpoints
  are far apart, and extend its upper end beyond the clipped hero boundary.
- [x] Fix strap twist discontinuities, shorten the entrance and flip, and
  retain interruptible movement and reduced-motion behavior.
- [x] Redesign the taller badge and strap as original neobrutalist artwork,
  using the supplied reference's photo-led hierarchy, the full existing
  portrait and the existing QR. Adjust responsive framing and PBR lighting.
- [x] Correct stacking, loading and fallback states; replace the control row
  with a stable hint and an accessible touch/keyboard motion-stop mechanism.
- [ ] Update the user-run Playwright suite and documentation. Run unit tests,
  lint, type-check and build; do not execute E2E in this revision. The suite,
  documentation and non-build checks are complete; the build is sandbox-blocked.

## User-run E2E guide

1. Install the browser once: `npx playwright install chromium`.
2. Run all seven viewport projects: `npm run test:e2e`. To check desktop
   first, use `npm run test:e2e -- --project=desktop`.
3. If a development server is already running on another port, set
   `PLAYWRIGHT_BASE_URL` to its URL before running the suite.
4. Open screenshots, traces and failures with
   `npx playwright show-report playwright/report`. Test output is stored
   under the ignored `playwright/` directory.
5. On physical phones and tablets, check vertical and horizontal drags,
   pointer release outside the browser, page scrolling away from the badge,
   pinch zoom and QR scanning under different lighting and viewing angles.

The QR's half-second automatic preview begins once the back actually faces the
camera. Tap or press Enter/Space on the badge to hold the back for scanning and
pause automatic sway and hints; activate it again to return to the front.
Reduced-motion users get an immediate manual flip without the automatic hint.

## Research

- [Rapier joints](https://rapier.rs/docs/user_guides/javascript/joints/):
  spherical joints constrain attachment points while allowing rotation.
- [Three.js curve frames](https://threejs.org/docs/pages/Curve.html):
  a transported frame can follow a curve without independently choosing a new
  width direction at each sample. Unwrap the tip twist across half-turns.
- [Three.js MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html):
  physically based materials benefit from an environment map and cost more
  per pixel; use their advanced properties deliberately.
- [Three.js Texture](https://threejs.org/docs/pages/Texture.html): after first
  use, replace and dispose a texture rather than changing its dimensions.
- [GSAP timelines](https://gsap.com/docs/v3/GSAP/Timeline/): timelines can
  sequence, pause and reverse authored animation.
- [WCAG 2.2.2: Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html):
  qualifying automatically moving content needs a persistent user control.
- [MDN touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action):
  touch behavior is determined at gesture start; preserve browser zoom.

## Execution log

- 2026-11-01: the installed Rapier 0.12 runtime panicked when two spring
  joints shared a chain; a one-joint reproduction succeeded. The revision
  applies damped, tension-only impulses to the same Rapier bodies at 120 Hz
  instead. The ring and clip use independent spherical joints and damped
  torsional coupling, so the strap follows the card without rigidly locking
  the hardware.
- 2026-11-01: the previous identity-to-card quaternion interpolation produced
  opposite mid-ribbon width vectors immediately across 180 degrees (dot
  product approximately -1). A transported frame and unwrapped connector
  twist replace that interpolation, with regression tests for the half-turn,
  equivalent quaternion signs and degenerate tangents.
- 2026-11-01: all 53 unit tests, ESLint and TypeScript passed after the
  revision. Playwright discovery found 91 viewport cases; they were not
  executed at the user's request. The source QR decoded in a local raster
  simulation at badge widths of 176, 240 and 480 pixels, not from a rendered
  WebGL screenshot.
- 2026-11-01: `npm run build` was blocked when Turbopack tried to bind a
  port (`Operation not permitted`, sandbox policy). Next.js also displayed a
  security-upgrade recommendation. The build was not retried and no dependency
  upgrade was made; rerun the build after the sandbox policy is updated.
- 2026-11-01: planning and baseline research recorded. Implementation and
  final verification are pending.
- 2026-11-01: targeted tests established that a kinematic drag left sleeping
  rope links behind; waking the links and bounding the tether fixed the test.
  The first integrated unit run passed 24 tests; browser and final checks remain.
- 2026-11-01: Chromium launch through the local Playwright process failed
  because the sandbox denied its macOS Mach-port registration. The already
  running integrated browser remains available, but a normal local E2E run
  needs an updated sandbox policy. No physical-camera scan has been claimed.
- 2026-11-01: the reference's desktop drag used pointer capture and clicking
  the card revealed its QR back; touch dragging also captured the pointer at
  375x812. Tablet and desktop canvas sizes were inspected. These are selected
  interaction probes, not a claim that every reference behavior was tested.
- 2026-11-01: an isolated browser fixture using the actual hero/lanyard source
  verified tap, drag, keyboard flip, CV dropdown, idle hint, reduced motion,
  touch scrolling, offscreen pause/resume and WebGL context-loss fallback.
  At 320x700, 375x812, 390x844, 768x1024, 1024x768, 1440x900 and 844x390,
  the rendered QR decoded to the expected URL and the fixture had no horizontal
  overflow. A landscape clipping defect, pause-during-entrance defect and
  texture-resize WebGL warnings were fixed and retested. The fixture mocks
  Next Image and animation wrappers, so it is not a substitute for real-app E2E.
- 2026-11-01: `npm run test:e2e -- --list` discovered 56 cases across seven
  Chromium viewport projects; discovery does not execute them. The real home
  page did not hydrate in the integrated browser while its dev HMR WebSocket
  failed. The link hub's five labels and isolated chrome were inspected, and
  `/`, `/links`, `/project/all` and `/project/noir` returned HTTP 200.
