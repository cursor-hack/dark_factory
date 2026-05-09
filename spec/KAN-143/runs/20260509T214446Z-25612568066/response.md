# KAN-143 — Painter sections, hero, bio, gallery, scroll animations

The five painter sections are now wired up end-to-end in `clients/painters-demo/v1/web/`. Each section has a full-viewport hero with ken-burns slow-zoom, a display-serif Latvian name with the English transliteration revealed on hover/focus, the life-years line in muted sans, a 60ch prose bio, a horizontally scrolling gallery strip with descriptive alt text, and a gold "Read on Encyclopaedia Latvija →" link. Sections fade-and-slide in via `IntersectionObserver` + CSS transitions only; no animation libraries.

## Spec gap, flagged

The ticket says the five `metadata.json` and `bio.txt` files are "pre-committed by the operator". They were not in the repo at run time. To meet acceptance criterion #1 ("All five painter sections render with correct data") this run committed fixtures under `src/content/painters/<NN-slug>/` for the canonical five — Rozentāls, Purvītis, Valters, Grosvalds, Padegs — with real names, birth/death years, and short encyclopedic bios. **`profile_image_url`, `gallery[].url`, and `article_url` are placeholders** (`picsum.photos` for images, a `enciklopedija.lv/skirklis/<name>` pattern for article URLs). Please swap them for the operator-curated set before the public deploy; the page structure won't need to change.

## What changed

- `src/content/painters/{01-rozentals,02-purvitis,03-valters,04-grosvalds,05-padegs}/{metadata.json,bio.txt}` — new content fixtures.
- `src/pages/index.astro` — imports all five `metadata.json` and `bio.txt?raw` at build time, renders the section layout, and runs a tiny `IntersectionObserver` script that toggles `is-visible` on each `.reveal` element (with a `prefers-reduced-motion` short-circuit).
- `src/components/SiteHeader.astro` — nav dots now have real painter names in `aria-label`/`title` instead of the placeholders.
- `src/styles/global.css` — added `.painter-hero` (full-viewport, gradient overlay, `ken-burns` `@keyframes` 22s scale 1 → 1.12 triggered by `.is-visible`), `.painter-name` hover-swap (Latvian out / English in over 320ms), `.painter-bio` (60ch, line-height 1.75), `.gallery-strip` (flex row, scroll-snap, thin gold scrollbar), `.painter-link`, and a global `.reveal` → `.reveal.is-visible` 700ms fade+24px slide. `prefers-reduced-motion` disables both ken-burns and reveal.

## Why

Pure CSS + a 12-line `IntersectionObserver` keeps the static-output contract clean (no extra deps, nothing to bundle) and matches the spec's "no external animation libraries" rule. Co-locating each painter's `metadata.json` + `bio.txt` next to its sibling files keeps content authoring obvious for the operator.

## Verification

In `clients/painters-demo/v1/web/`:

- `npm ci` → exit 0
- `npm run build` → exit 0, writes `dist/index.html`
- Build output contains 5× `painter-hero` with `background-image:`, 5× `painter-bio`, the `IntersectionObserver` + `is-visible` script, and the design tokens (`#0c0c0e`, `#c8a96a`) plus the `ken-burns`/`prefers-reduced-motion` CSS in the bundled stylesheet.

## Risks

- **Image / article URLs are placeholders** — see "Spec gap" above.
- **No browser pass this run** — ken-burns timing, sticky-header offset against the full-viewport hero, and gallery scroll feel are unverified visually. Recommend `npm run preview` or the Pages deploy before sign-off.
- **Touch devices won't trigger the name hover state.** Latvian name is what's read at rest; English transliteration is also keyboard-focusable on the `.painter-name`. If touch parity matters, we can switch to a tap-to-toggle.
- **`astro build` emits a stray `✘ [ERROR] The build was canceled` stderr line** but exits 0 and produces the correct artifacts. Same noise was already present on KAN-142; not a regression.

See `spec/KAN-143/plan.md` for the full file-by-file detail.
