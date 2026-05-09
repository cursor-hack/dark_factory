# KAN-149 — Implementation Plan

> **Status: BLOCKED on upstream prerequisites.** No code changes were made
> outside `spec/KAN-149/` on this run. See `response.md` for the
> Jira-facing summary.

## Ticket recap

Add two interactions to the painters page:

1. **Lightbox** over the gallery strip: click any gallery image → full-screen overlay of that image; ←/→ navigate within that painter's gallery; Esc closes; fully keyboard-accessible.
2. **Sticky dot-nav scroll tracking**: the 5-dot nav in the sticky header tracks the painter section currently in the viewport via `IntersectionObserver`; the active dot is gold (`#c8a96a`); clicking a dot smooth-scrolls to its section; sticky header stays pinned across the full scroll range.

Constraint: vanilla JS + CSS only — no new npm dependencies, no UI/animation library.

## Why this run is blocked

KAN-149 is a behavioural layer on top of KAN-148's painter sections, which depend on KAN-147's Astro 4 scaffold. Both upstream tickets blocked on missing painter content and never landed:

- `clients/painters-demo/v1/web/` does not exist on `main` (HEAD `adf5446`).
  No `package.json`, `astro.config.mjs`, `tsconfig.json`,
  `src/layouts/Layout.astro`, or `src/pages/index.astro`.
- The five canonical painter `metadata.json` files are still absent:
  - `clients/painters-demo/v1/web/content/painters/karlis_huns_1831_3f3c/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/jazeps_grosvalds_1891_72b1/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/voldemars_irbe_1893_f992/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/karlis_padegs_1911_0e0a/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/lucia_peka_1912_60db/metadata.json`
- The corresponding `bio.txt` files are also absent.
- No painter `<section>` elements, no `.gallery-strip img`, and no
  `.dot-nav button` exist anywhere in the repository — so there are no
  hooks to attach the lightbox or `IntersectionObserver` to.

Without the upstream DOM there is nothing meaningful to wire up. Adding a
standalone JS module would either reference selectors that resolve to
nothing (silent dead code) or require fabricating painter sections,
which would breach the same data-integrity rule that blocked KAN-147
and KAN-148.

## What needs to happen first

1. Re-land KAN-147: real `metadata.json` + `bio.txt` for the five
   painters at the canonical slugs, and the Astro 4 scaffold under
   `clients/painters-demo/v1/web/`.
2. Re-land KAN-148: hero/bio/gallery-strip painter sections with the
   sticky header and 5 placeholder dots.
3. Re-run KAN-149 against that DOM. The implementation outline below is
   ready to execute as soon as the prerequisites exist.

## Implementation outline (to execute once unblocked)

Target file: `clients/painters-demo/v1/web/src/scripts/interactions.ts`,
imported once from `Layout.astro` with `<script>` (Astro will bundle and
ship it as a module). Selector contract assumed from KAN-148:

- Each painter section has `id="painter-<slug>"` and class `painter-section`.
- The sticky header contains `nav.dot-nav` with one `<button class="dot" data-target="painter-<slug>">` per painter.
- Gallery strips: `.painter-section .gallery-strip` containing `<img>` elements with `alt` and `src` already populated.

### A. Lightbox

1. On DOMContentLoaded, query all `.gallery-strip` strips. For each strip,
   collect its `<img>` list `(src, alt)` into a per-section array.
2. Inject **one** lightbox overlay element at the end of `<body>`:
   ```html
   <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" hidden>
     <button class="lightbox__close" aria-label="Close">×</button>
     <button class="lightbox__prev"  aria-label="Previous image">‹</button>
     <img class="lightbox__img" alt=""/>
     <button class="lightbox__next" aria-label="Next image">›</button>
   </div>
   ```
3. Click handler on each `.gallery-strip img`:
   - Set internal state `{ images, index }` to that strip's list and the clicked image's index.
   - Render the current image into `.lightbox__img` (set `src`, `alt`).
   - `lightbox.hidden = false`; remember the previously focused element; move focus to `.lightbox__close`.
4. Keyboard handler bound while open: `ArrowRight` → `index = (index + 1) % images.length`, `ArrowLeft` → `(index - 1 + n) % n`, `Escape` → close.
5. Focus trap: keep keyboard focus inside the four interactive elements (`close`, `prev`, `next`, image stays decorative). On close, restore focus to the originally clicked thumbnail and `lightbox.hidden = true`.
6. Buttons (`prev`/`next`/`close`) duplicate the keyboard actions for pointer/touch users; they are reachable via Tab.
7. CSS: full-viewport fixed overlay, `background: rgba(0,0,0,.92)`, image `max-inline-size: 92vw; max-block-size: 92vh; object-fit: contain`. Buttons absolute-positioned with hit areas ≥ 44×44.
8. Body scroll lock while open (`document.documentElement.style.overflow = 'hidden'`; restore on close).

### B. Sticky dot-nav scroll tracking

1. Confirm sticky header CSS (`position: sticky; top: 0; z-index: 50;`) covers the full scroll range — this should already be in KAN-148; if not, add it in `Layout.astro`'s global styles. Acceptance test: scroll to the very bottom; header still pinned.
2. Build the painter section list in source order. For each section, find its dot via `data-target`.
3. `IntersectionObserver` config:
   ```js
   new IntersectionObserver(onIntersect, {
     root: null,
     // Active band ≈ middle 20% of the viewport — guarantees exactly one section qualifies at any time.
     rootMargin: '-40% 0px -40% 0px',
     threshold: 0,
   })
   ```
   On each intersection event, if `entry.isIntersecting`, mark its dot active and clear the others (`dot.classList.toggle('active', dot.dataset.target === entry.target.id)`).
4. Edge guard: at `scrollY ≈ 0` set the first dot active; at the very bottom (`window.innerHeight + scrollY >= document.body.scrollHeight - 4`) set the last dot active. Bind once via `scroll` listener (passive) to cover the rootMargin gap at both extremes.
5. Click handler on each dot:
   ```js
   document.getElementById(dot.dataset.target).scrollIntoView({ behavior: 'smooth', block: 'start' });
   ```
   `prefers-reduced-motion: reduce` → use `'auto'` instead of `'smooth'`.
6. CSS: `.dot { width: 10px; height: 10px; border-radius: 50%; background: #555; } .dot.active { background: #c8a96a; }`. Hit area expanded via padding so taps work on touch.

### C. Verification

- `npm run build` in `clients/painters-demo/v1/web/` exits 0; bundle ships
  no new runtime deps (verify with `git diff package-lock.json`).
- Manual / scripted browser checks:
  - Click each thumbnail → correct image opens, ←/→ cycles within that
    painter's gallery only, Esc closes, focus returns to the clicked
    thumbnail.
  - Tab order reaches all dots and lightbox buttons; everything is
    operable from the keyboard with no mouse.
  - Scrolling top→bottom: exactly one gold dot at every position;
    transitions happen near section midpoints.
  - Click each dot → page smooth-scrolls to that section.
  - Sticky header remains visible from `scrollY = 0` through the bottom
    of the page.

### D. Risks / unverified at plan-write time

- Selector contract above assumes KAN-148's final markup; once that
  ticket lands, confirm the actual `id`/class/`data-` names and adjust
  before merging.
- Visual rendering of the overlay (z-index over header, dot contrast on
  the dark background) is not browser-verifiable on this run because the
  page does not exist yet.
- `rootMargin: '-40% 0px -40% 0px'` is correct for full-viewport hero
  sections. If KAN-148 ships shorter sections, tighten to `-45% / -45%`
  or compute per-section thresholds.

## What changed in this run

Only `spec/KAN-149/plan.md` and `spec/KAN-149/response.md`. No code,
configuration, or `clients/**` files were touched.
