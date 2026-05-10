# KAN-153 — Latvian Painters Gallery

## What changed

Added a new product web delivery at `clients/painters-demo/v1/web/`:

- Astro 4 + TypeScript, `npm run build` → `dist/` (matches the
  `jira-product-deploy.yml` contract; `package-lock.json` committed for `npm ci`).
- `astro.config.mjs` is configured for the GitHub Pages project URL
  (`base: "/dark_factory/"`).
- Single scroll-driven page:
  - Sticky header with title and a 5-dot in-page nav whose active dot tracks the
    current section via IntersectionObserver.
  - Five painter sections in chronological order with full-viewport hero
    (profile image background, ken-burns zoom on enter), `name_lv` display
    serif, lifespan + `name_en` on hover, 60ch serif bio prose with drop cap,
    horizontal gallery strip, and "Read on Encyclopaedia Latvija →" link.
  - Vanilla-JS lightbox with ←/→/Esc keyboard nav and click-backdrop close.
  - Dark museum styling (`#0c0c0e` background, gold accent `#c8a96a`).

## Where the data came from

The LimeWire bundle was fetched with headless Chromium via Playwright
(`curl`/`wget` couldn't because the URL uses fragment-key decryption). All
five required painter folders (`karlis_huns_1831_3f3c`,
`jazeps_grosvalds_1891_72b1`, `voldemars_irbe_1893_f992`,
`karlis_padegs_1911_0e0a`, `lucia_peka_1912_60db`) were present with
`metadata.json` + `bio.txt`. Those two files were copied verbatim into
`content/painters/<archive_id>/`. Image URLs are taken straight from each
`metadata.json` (`enciklopedija.lv` and `upload.wikimedia.org`) — no
placeholder services, no proxy, no rewriting of bios.

## Caveats

- Two painters (`voldemars_irbe_1893_f992`, `lucia_peka_1912_60db`) ship in the
  bundle with `article_url: null` and an empty `gallery_urls: []`. Per the
  ticket's hard rule 4 (no placeholder image services, no substitute painters),
  their sections render hero + bio only and omit the gallery strip and the
  "Read on Encyclopaedia Latvija" link rather than fabricate content.
- No browser was opened locally during this run, so visual fidelity (typography,
  ken-burns timing, lightbox positioning) will only be confirmable once the
  Pages deploy is live.

## Verification

- `npm ci && npm run build` succeeds on Node 18; `dist/index.html` is 40 KB and
  contains the title "Latvian Painters" and all five painter names.

## Risks / next steps

- The change reaches a `tdf/kan-153` PR. The product deploy workflow always
  builds from `main`, so the PR must merge before
  `gh workflow run jira-product-deploy.yml --ref main -f issue_key=KAN-153 -f client=painters-demo -f delivery=v1`
  will publish the demo. `client=painters-demo` / `delivery=v1` are
  non-negotiable — the previous failure was caused by defaulting to
  `example/demo`.
