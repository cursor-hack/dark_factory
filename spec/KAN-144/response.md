# KAN-144 — Lightbox + dot-nav scroll tracking

Implemented both interactive features in `clients/painters-demo/v1/web/` as vanilla TS in `<script>` blocks — no frameworks added.

## What changed

- **`src/pages/index.astro`**
  - Each gallery `<img>` is now wrapped in a `<button class="gallery-trigger">` for click + keyboard activation. The parent `.gallery-strip` carries `data-painter-slug` so the lightbox cycles only that painter's works.
  - Added a single shared `.lightbox` overlay (image, caption, prev/next/close buttons, `role="dialog"`, `aria-modal`).
  - Added a script that opens the lightbox on trigger click, navigates with on-screen prev/next or ←/→ keys (wrapping at ends), closes on ✕, Esc, or backdrop click, and restores focus to the originating thumbnail.
  - Added a second script that uses an `IntersectionObserver` with a thin band just below the sticky header (`rootMargin: -56px 0 -70% 0`) to detect the dominant painter section and toggle `.is-active` on the matching dot.
- **`src/components/SiteHeader.astro`** — each dot anchor now carries `data-target="section-N"` so the script can map sections to dots.
- **`src/styles/global.css`**
  - `.dot-nav a.is-active .dot` paints in `--accent` (#c8a96a).
  - `html { scroll-behavior: smooth }` (auto under `prefers-reduced-motion`); `.painter-section` gets `scroll-margin-top: var(--header-h)` so dot-anchored jumps land below the sticky header.
  - Reset styles for `.gallery-trigger` (button → block, no border, `cursor: zoom-in`, focus-visible outline, hover image dim).
  - Full lightbox styling (overlay, image, caption, circular ←/→/✕ buttons, `body.lightbox-open` to lock scroll).

## Why

Acceptance criteria from the ticket: open lightbox on image click, ←/→ navigation, Esc closes, dot updates on scroll, smooth-scroll on dot click. All five are wired up; behavior degrades gracefully when `IntersectionObserver` isn't available (dot tracking simply stays inactive; clicks still anchor-jump).

## Risks / unverified

- Dev server was not run in this environment, so the rendered visuals are unverified. Logic and selectors mirror existing patterns; structure should be safe.
- The IO band (`rootMargin: -56px 0 -70% 0`) is tuned heuristically. On very tall sections at small viewports it's possible no section overlaps the band momentarily — in that case the previously active dot stays active, which is the desired UX.
- Lightbox uses native focus on the close button when opening; there is no full focus trap. Tabbing past the buttons can land on background content. If a stricter trap is required we can add one in a follow-up.
