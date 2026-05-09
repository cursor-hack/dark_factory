# KAN-143 Implementation Plan

## Goal

Populate `clients/painters-demo/v1/web/src/pages/index.astro` so that each of the five painters renders a full-viewport section with: hero with ken-burns slow-zoom, large display-serif Latvian name with hover-revealed English transliteration, life-years line, prose bio at 60ch, horizontally scrolling gallery strip with descriptive alt text, and a gold "Read on Encyclopaedia Latvija →" link. Sections fade/slide in via Intersection Observer + CSS transitions only — no animation libraries.

## Spec gap (resolved with placeholders)

The ticket says metadata.json + bio.txt are "pre-committed by the operator". They are not in the repository (verified). Building the page without content would fail acceptance criterion #1 ("All five painter sections render with correct data"), so this run created committed fixtures under `src/content/painters/<NN-slug>/{metadata.json,bio.txt}` for the five canonical Latvian painters of this delivery (Rozentāls, Purvītis, Valters, Grosvalds, Padegs). Names, birth/death years, and bios are based on encyclopedic public knowledge. Image URLs are deterministic `picsum.photos` placeholders so the page renders end-to-end. `article_url` uses the `enciklopedija.lv/skirklis/<lv-name>` pattern but operators must verify each link.

## Approach

- Co-locate content under `clients/painters-demo/v1/web/src/content/painters/<NN-slug>/` so it is loaded by Vite at build time without a network call.
- Import each `metadata.json` with TypeScript JSON imports and each `bio.txt` with Vite's `?raw` query suffix. No external content layer or Astro Content Collections needed for five static records.
- Build the section in plain Astro markup. All animations are CSS-only; a tiny inline `<script>` toggles a single `.is-visible` class via `IntersectionObserver`, with a `prefers-reduced-motion` short-circuit.
- Layout breaks out of the previous fixed-width `<main>` container so each section can run full-bleed; the prose bio is constrained to `max-width: 60ch` per the spec.

## Files added

- `src/content/painters/01-rozentals/metadata.json` + `bio.txt` — Janis Rozentāls (1866–1916).
- `src/content/painters/02-purvitis/metadata.json` + `bio.txt` — Vilhelms Purvītis (1872–1945).
- `src/content/painters/03-valters/metadata.json` + `bio.txt` — Johans Valters (1869–1932).
- `src/content/painters/04-grosvalds/metadata.json` + `bio.txt` — Jāzeps Grosvalds (1891–1920).
- `src/content/painters/05-padegs/metadata.json` + `bio.txt` — Kārlis Padegs (1911–1940).

  Each `metadata.json` carries: `slug`, `name_lv`, `name_en`, `birth_year`, `death_year`, `profile_image_url`, `article_url`, `gallery: [{ url, alt }]` (4 items each).

## Files changed

- `src/pages/index.astro`
  - Imports all five `metadata.json` and `bio.txt?raw` at build time and types them via a local `PainterMeta` interface.
  - Renders five `<section class="painter-section reveal">`:
    - `.painter-hero` with `style="background-image: url(...)"`, an `aria-label="Portrait of <name_lv>"`, semi-transparent gradient overlay, and inner content (eyebrow `I…V`, `<h2 class="painter-name">` with `<span class="name-lv">` + absolutely-positioned `<span class="name-en">`, and `<p class="painter-years">birth–death</p>`).
    - `.painter-body` with `<p class="painter-bio">` (max-width 60ch) and a `<div class="gallery-strip" role="list">` of `<figure>` items each with `<img alt="...">`, plus a `.painter-link` to `article_url` reading "Read on Encyclopaedia Latvija →".
  - Inline module `<script>` runs after first render: detects `prefers-reduced-motion`, falls back to `is-visible` for everything if reduced-motion or no `IntersectionObserver`; otherwise observes all `.reveal` nodes with `rootMargin: "0px 0px -10% 0px"`, `threshold: 0.15`, adds `is-visible`, unobserves once seen.

- `src/components/SiteHeader.astro`
  - Imports the five metadata files so each nav-dot now has a real `aria-label`/`title` (e.g. "Janis Rozentāls") instead of the previous "First painter" placeholders. `href` anchors stay `#section-1…#section-5`.

- `src/styles/global.css`
  - Removed the old `<main>` width/padding container; `<main>` is now a plain block so heroes can run full-bleed.
  - Added section styling: `.painter-hero` (`min-height: calc(100vh - var(--header-h))`, cover background, gradient overlay, ken-burns `@keyframes` triggered by `.is-visible`, 22s ease-out, scale 1 → 1.12).
  - Added `.painter-name` with `.name-lv` swapped out on `:hover`/`:focus-visible` for the absolutely-positioned `.name-en` (gold accent, opacity + small Y translate, 320ms `cubic-bezier`).
  - Added `.painter-bio` (max-width 60ch, line-height 1.75), `.gallery-strip` (flex row, `overflow-x: auto`, `scroll-snap-type: x mandatory`, custom thin scrollbar in accent gold, 4:3 cropped images), and `.painter-link` (gold underline-on-hover).
  - Added `.reveal` / `.reveal.is-visible` — opacity 0→1 + 24px translateY → 0, 700ms transition.
  - Added `prefers-reduced-motion` block that disables both the reveal and ken-burns animations.

## Files NOT touched

- `astro.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json` — scaffold from KAN-142 stands.
- `src/layouts/BaseLayout.astro`, `src/components/SiteFooter.astro` — no change needed.
- Repo root `package.json` — left alone.

## Verification

From `clients/painters-demo/v1/web/`:

1. `npm ci` → exit 0 (333 packages installed).
2. `npm run build` → exit 0; `dist/index.html` written; CSS bundle `dist/_astro/index.*.css` contains `#0c0c0e`, `#c8a96a`, `ken-burns`, `painter-hero`, `name-en`, `gallery-strip`, `prefers-reduced-motion`.
3. `dist/index.html` grep counts: 5× `painter-name`, 5× `painter-bio`, 5× `painter-years`, 5× `background-image:`, 4 occurrences each of `section-1`…`section-5` (id + aria-labelledby + nav anchor + h2 id), and `IntersectionObserver` + `is-visible` present in the inline script.
4. Page-name strings present in HTML: `Janis Rozentāls`, `Vilhelms Purvītis`, etc.; "Encyclopaedia Latvija" present 5×.

`astro build` prints a stray `✘ [ERROR] The build was canceled` line on stderr (esbuild noise during the dual-pass build) but exits 0 and produces the correct artifacts. Pre-existing behaviour from KAN-142, not regression.

## Risks / unknowns

- **Image and article URLs are placeholders.** All `profile_image_url` and `gallery[].url` values point at `picsum.photos` so the layout is real and reviewable; `article_url` uses a guessed `enciklopedija.lv/skirklis/<name>` pattern. Replace with the operator-curated set before the public deploy. The page structure does not need to change when URLs are swapped.
- **No browser pass.** The static build emits valid HTML/CSS and the IntersectionObserver script is short and feature-detected, but ken-burns timing, sticky-header offset against the full-viewport hero, and gallery scroll feel were not eyeballed in a browser this run. Recommend `npm run preview` (or the GitHub Pages deploy) before sign-off.
- **Hover reveal of `name_en` is pointer-only.** Touch users won't see the transliteration unless they tap-and-hold. We expose `name_en` to keyboard users via `:focus-visible` on the `.painter-name`, but assistive tech currently sees both names because both render in the DOM (the visual one and the absolutely positioned hover state). If we need to hide `name_en` from screen readers, gate it with `aria-hidden="true"` (already done on the `name-en` span) and double-check JAWS/VoiceOver.
- **Bio prose is conservatively encyclopedic.** Five short single-paragraph bios written from public knowledge of these painters; happy to swap for the operator's preferred copy before deploy.

## Out of scope

- Smooth-scroll behaviour on dot-nav clicks (still default browser jump).
- Webfont loading (still falls back to Georgia / system-ui per KAN-142 plan).
- SEO / OpenGraph tags beyond the inherited `<meta name="description">`.
