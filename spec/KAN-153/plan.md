# KAN-153 Implementation Plan

## Goal

Ship a scroll-driven static gallery for five Latvian painters, deployable via the
existing `jira-product-deploy` workflow at
`https://cursor-hack.github.io/dark_factory/` under `client=painters-demo`,
`delivery=v1`.

## Scope

- New product web app at `clients/painters-demo/v1/web/`.
- Astro 4 + TypeScript, static output to `dist/` (matches deploy contract).
- Single page, five painter sections, lightbox, sticky in-page nav, dark
  museum-grade styling.

## Source data

- Bundle URL: `https://limewire.com/d/F4KwR#C7UtSXeWjQ` (client-side fragment
  decryption — fetched via Playwright headless Chromium, not curl).
- Five painter folders selected (only these `archive_id` slugs are acceptable per
  the ticket):
  - `karlis_huns_1831_3f3c`
  - `jazeps_grosvalds_1891_72b1`
  - `voldemars_irbe_1893_f992`
  - `karlis_padegs_1911_0e0a`
  - `lucia_peka_1912_60db`
- Each folder has `metadata.json` + `bio.txt` (the only required artefacts; copied
  verbatim into `content/painters/<archive_id>/`). Local image files in the bundle
  are intentionally NOT copied — the page references the encyclopedia URLs from
  `metadata.json` directly per ticket rule 4.
- Two painters (`voldemars_irbe_1893_f992`, `lucia_peka_1912_60db`) have
  `article_url: null` and `gallery_urls: []` in their metadata. Their sections
  render the hero + bio only and omit the gallery strip and "Read on Encyclopaedia
  Latvija" link rather than substitute placeholders.

## Files added

```
clients/painters-demo/v1/web/
├── .gitignore
├── astro.config.mjs              # site + base="/dark_factory/" for GH Pages
├── package.json                  # Astro 4 + TS, scripts: dev/build/preview
├── package-lock.json             # committed (npm ci in deploy workflow)
├── tsconfig.json                 # extends astro/tsconfigs/strict
├── content/painters/<5 folders>/
│   ├── metadata.json
│   └── bio.txt
└── src/
    ├── components/PainterSection.astro
    ├── data/painters.ts          # fs-based loader, ordered by birth year
    ├── pages/index.astro         # head, layout, lightbox + scroll JS
    └── styles/global.css         # dark museum theme
```

The repo-root `package.json` is untouched.

## Page behavior

- Sticky thin header with the title and a 5-dot in-page nav whose active dot
  tracks the section currently in viewport via IntersectionObserver.
- Per painter section:
  - Full-viewport hero with `profile_image_url` as background, slow ken-burns
    scale once the section enters the viewport.
  - Display-serif `name_lv`, lifespan beneath, `name_en` revealed on hover.
  - Prose block (max-width 60ch, serif) rendering bio paragraphs verbatim with a
    drop-cap on the first paragraph. No markdown interpretation.
  - "Read on Encyclopaedia Latvija →" link when `article_url` is non-null.
  - Horizontal scrollable strip of up to 6 thumbnails (only when `gallery_urls`
    is non-empty).
- Lightbox: click a thumb to open, ←/→ to navigate within the same section,
  `Esc` to close, click backdrop to close. Locks body scroll while open. Caption
  shows position.
- Reveal-on-scroll: fade/slide-in via `[data-reveal]` + `IntersectionObserver`.
  Honors `prefers-reduced-motion: reduce`.
- Dark theme: `#0c0c0e` near-black bg, off-white serif body, sans chrome,
  `#c8a96a` accent for links + active nav dot.

## Build + deploy

- `npm ci && npm run build` produces `dist/index.html` (40 KB, 1 page) plus the
  `_astro/` chunk directory. Verified locally on Node 18 — both `npm install`
  (cold) and `npm ci` (lockfile) succeed.
- `astro.config.mjs` sets `site=https://cursor-hack.github.io` and
  `base=/dark_factory/`, matching how `actions/configure-pages@v5` +
  `actions/deploy-pages@v4` publish project Pages.
- The Jira product deploy workflow is invoked by automation. The workflow always
  builds from `main`, so the change must reach `main` before clicking Deploy
  (this run produces a PR; merge then dispatch
  `jira-product-deploy.yml -f client=painters-demo -f delivery=v1`).

## Verification

- Local build: `dist/index.html` body contains "Latvian Painters" and all five
  painter names (`Kārlis Hūns`, `Jāzeps Grosvalds`, `Voldemārs Irbe`,
  `Kārlis Padegs`, `Lucia Peka`).
- Image URLs in the rendered HTML point only to `enciklopedija.lv` and
  `upload.wikimedia.org` — no placeholder services.
- No browser was opened locally — visual rendering risk (typography, ken-burns,
  lightbox positioning) is unverified end-to-end and will be confirmed once the
  Pages deploy is live.

## Out of scope (per ticket)

- No multi-page routing, no per-painter routes, no SEO meta per painter.
- No JSON Schema / Zod, no ingest CLI, no language switcher, no analytics.
- Branch push / PR creation / Pages deploy dispatch / Jira commenting are
  performed by the surrounding workflow, not by this run.
