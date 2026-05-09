# KAN-144 Plan: lightbox + dot-nav scroll tracking

## Scope

Two interactive features for `clients/painters-demo/v1/web/`:

1. **Lightbox** for gallery-strip images. Click → full-screen overlay; ←/→ keys + on-screen buttons cycle within the same painter's gallery (wrapping); Esc closes.
2. **Dot-nav scroll tracking**. The 5-dot sticky header highlights the painter section dominant at the top of the viewport in `--accent` (#c8a96a). Clicking a dot smooth-scrolls to the section.

Vanilla JS only. No frameworks.

## Files touched

- `clients/painters-demo/v1/web/src/components/SiteHeader.astro` — add `data-target="section-N"` to each dot anchor.
- `clients/painters-demo/v1/web/src/styles/global.css`
  - `.dot-nav a.is-active .dot` → gold + opaque.
  - `html { scroll-behavior: smooth }` (auto under `prefers-reduced-motion`).
  - `.painter-section { scroll-margin-top: var(--header-h) }` so section tops align below the sticky header.
  - `.gallery-trigger` reset (button styling).
  - `.lightbox` overlay + image + buttons.
- `clients/painters-demo/v1/web/src/pages/index.astro`
  - Wrap each gallery `<img>` in a `<button class="gallery-trigger">` carrying `data-painter-slug` and `data-gallery-index`.
  - Add a single `.lightbox` element after the sections (image, prev/next, close).
  - Append a `<script>` block that:
    - Wires gallery triggers to open the lightbox with the clicked image.
    - Reads gallery items from the clicked image's parent `.gallery-strip` so each painter's lightbox cycles only their own works.
    - Handles ←/→/Esc keyboard navigation, focus restore, and `aria-hidden` toggling.
    - Uses `IntersectionObserver` (rootMargin shrinking the viewport to a thin band just below the header) to mark the current section's dot `.is-active`.

## Out of scope

- No changes to metadata, painters content, or BaseLayout.
- Lightbox is a single shared overlay, not per-section.
- No focus-trap library; we just move focus to the overlay and restore on close.

## Risks / unverified

- I cannot run the Astro dev server here, so visual rendering is unverified. Logic is straightforward DOM JS and standard CSS.
- IntersectionObserver thresholds are tuned heuristically; the band `rootMargin: -56px 0px -70% 0px` should keep a single section active without flicker on typical desktop/mobile heights.
- Smooth-scroll respects `prefers-reduced-motion` via CSS.
