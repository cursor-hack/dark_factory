# KAN-142 — Astro 4 scaffold ready for review

Scaffolded `clients/painters-demo/v1/web/` as a self-contained Astro 4 + TypeScript static site. The repo root `package.json` was not touched.

## What changed

- Added `clients/painters-demo/v1/web/` with:
  - `package.json` (Astro `^4.16.18`, TypeScript `^5.6.3`, `npm run build` → `astro build`)
  - `package-lock.json` (committed for `npm ci`)
  - `astro.config.mjs` configured for `output: "static"` (directory format)
  - `tsconfig.json` extending `astro/tsconfigs/strict`
  - `.gitignore` for `node_modules/`, `dist/`, `.astro/`
- Source under `src/`:
  - `styles/global.css` — design tokens (`--bg #0c0c0e`, `--fg #efe9dd`, `--accent #c8a96a`), serif body / sans-serif chrome pairing, sticky-header + 5-dot-nav + attribution-footer rules
  - `layouts/BaseLayout.astro` — imports global CSS and wraps header/main/footer
  - `components/SiteHeader.astro` — sticky header with site title `Latvian Painters: Five Names That Matter` and 5 placeholder nav dots
  - `components/SiteFooter.astro` — single-line credit to `enciklopedija.lv`
  - `pages/index.astro` — header + 5 empty section stubs (I–V) + footer

## Why

Matches the product-deploy contract in `docs/product-deploy.md` (one-shot `npm ci && npm run build` → `dist/`). Astro 4 was specified in the ticket and gives us static output, TypeScript out of the box, and a clean component model for the painter sections that come next.

## Verification

In `clients/painters-demo/v1/web/`:

- `npm ci` → exit 0 (333 packages)
- `npm run build` → exit 0, writes `dist/index.html`
- `dist/index.html` contains `#0c0c0e`, `#c8a96a`, the full site title, and the `enciklopedija.lv` attribution.

## Risks

- Visual rendering was not browser-verified in this run; layout/sticky-header behaviour should be eyeballed via the GitHub Pages deploy or `npm run preview` before sign-off.
- Display fonts (Cormorant Garamond / Inter) fall back to system stacks — webfonts can be added later if needed.
- Nav dots are static placeholders by design; painter content lands in follow-up tickets.

See `spec/KAN-142/plan.md` for full file-by-file detail.
