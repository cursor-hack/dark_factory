# KAN-145 Implementation Plan

## Goal

E2E verification of the Latvian painters static site (`clients/painters-demo/v1/web/`) per the acceptance criteria in the ticket: build cleanly, render five painter sections, hover-to-transliterate, lightbox keyboard nav, sticky-header dot tracking — with screenshot evidence attached to the PR.

This run is the **verification ticket** that follows the implementation tickets KAN-142 (scaffold), KAN-143 (sections/animations) and KAN-144 (lightbox + dot-nav). The implementation already lives on `main`; this PR adds an automated, reproducible E2E suite and captures the screenshot evidence the ticket requests.

## Approach

A pure manual walk-through is not reproducible from CI. The smallest correct change that satisfies the ticket *and* protects the deliverable from future regressions is a Playwright suite that drives a real Chromium against the production build (`astro build` → `astro preview`) and asserts every acceptance criterion. The same run dumps PNG screenshots into `spec/KAN-145/screenshots/` so the PR diff carries the evidence.

### Why a sibling `e2e/` package, not a `web/` devDependency

The product-deploy workflow (`jira-product-deploy.yml`) runs `npm ci` inside `clients/<client>/<delivery>/web/`. Adding Playwright (~120 MB browser cache + deps) as a devDependency of `web/` would slow every product deploy for no production gain. Instead the suite lives at `clients/painters-demo/v1/e2e/` with its own `package.json`. The `web/` package is unchanged.

## Files

### New
- `clients/painters-demo/v1/e2e/package.json` — Playwright devDependency + `test`, `test:headed`, `install-browsers` scripts.
- `clients/painters-demo/v1/e2e/playwright.config.ts` — chromium project; `webServer` builds `web/` and serves `dist/` via `astro preview` on `127.0.0.1:4321`; baseURL wired to that port; HTML reporter; trace / video on failure.
- `clients/painters-demo/v1/e2e/tests/painters-journey.spec.ts` — five serial tests covering each acceptance criterion (see Coverage below). Writes screenshot evidence to `SCREENSHOTS_DIR` (defaults to `e2e/screenshots/`; the run uses `spec/KAN-145/screenshots/`).
- `clients/painters-demo/v1/e2e/.gitignore` — `node_modules/`, `playwright-report/`, `test-results/`, `screenshots/`.
- `clients/painters-demo/v1/e2e/package-lock.json` — locked at Playwright 1.49.1.
- `spec/KAN-145/screenshots/*.png` — committed evidence (11 PNGs, ~9.8 MB).

### Unchanged
- Everything under `clients/painters-demo/v1/web/`. The deliverable shipped by KAN-142/143/144 is verified, not modified.

## Coverage vs. Acceptance Criteria

| AC | Test | Assertion |
|---|---|---|
| `npm ci && npm run build` exits 0 with no missing-content errors | webServer step in `playwright.config.ts` | Playwright fails fast if the build doesn't produce a serving `dist/`. Verified in this run — exit 0; only `astro build` stderr is a known esbuild "build was canceled" line carried over from KAN-143. |
| Five sections visible: hero bg, name, lifespan, bio, gallery, encyclopedia link | `build artefact loads and renders all five painter sections` | For each `#section-N`: visible; `.painter-hero` has a non-empty CSS `background-image`; `.name-lv` text matches metadata; `.painter-years` contains both years; bio non-empty; 4 gallery `<img>` with `https://` `src`; first image actually loads (`complete && naturalWidth > 0`, polled up to 20 s); `.painter-link` links out via `https://`. |
| Hover Latvian name → English transliteration appears | `hovering each painter name reveals the English transliteration` | For each painter: `.name-en` text equals `name_en`; opacity is `0` at rest; opacity is `1` after `.painter-name` hover. |
| Lightbox opens; ←/→ keyboard nav; Esc closes | `lightbox opens, ←/→ navigate, Esc closes` | Click first `.gallery-trigger` of section-1: lightbox `aria-hidden=false` + `is-open`; ArrowRight changes `.lightbox-image` `src`; ArrowLeft restores original `src`; Escape returns lightbox to `aria-hidden=true` and removes `is-open`. |
| Active dot in sticky header changes on scroll | `active dot in sticky header tracks scroll position` | Default first dot active; clicking each `data-target` activates only its own dot (all others lose `is-active`). |
| Screenshots/recording attached as evidence | `captures full-page snapshots for each section as evidence` + per-test inline `page.screenshot` | Eleven PNGs land in `spec/KAN-145/screenshots/`: hero, hover state, lightbox open + after → + after ←, dot-nav on section-3, plus a per-section snapshot for all five painters. Failure traces/videos auto-attach via Playwright's `retain-on-failure`. |

`emulateMedia({ reducedMotion: 'reduce' })` is set in every test so reveal/ken-burns animations don't race the assertions; the prod page still ships them.

## How to run locally

```bash
cd clients/painters-demo/v1/e2e
npm install
npm run install-browsers       # one-time: Chromium + ffmpeg into ~/.cache/ms-playwright
npm test                       # builds web/, starts astro preview, runs the suite
SCREENSHOTS_DIR=$PWD/screenshots npm test   # to put PNGs somewhere specific
```

Playwright auto-builds `web/` and starts `astro preview` via the `webServer` config, so a fresh checkout only needs the two install steps.

## Verification result for this PR

- **`npm ci`** in `web/`: clean, 333 packages, 0 errors.
- **`npm run build`** in `web/`: exit 0, 1 page built. (`astro build` continues to print one `✘ [ERROR] The build was canceled` line on stderr — pre-existing esbuild noise documented in KAN-143; not a regression and does not affect exit code or output.)
- **Playwright suite**: 5/5 passed in 19.1 s on Chromium 131 headless.
- **Image URLs**: all five painters' hero + 4 gallery images load (HTTP 200, non-zero `naturalWidth`). The first run was flaky against `picsum.photos` for one image — fixed by polling for `complete && naturalWidth > 0` up to 20 s rather than asserting on the first frame.
- **Visual regressions**: none observed in the eleven captured PNGs vs. the design intent in KAN-143/KAN-144.

## Risks / non-goals

- **Network dependence on `picsum.photos`**: hero + gallery images are served from `picsum.photos`. CI flakiness against that host will surface as the per-section image-load assertion timing out. Within scope: 20 s polling absorbs typical jitter. Out of scope for this ticket: vendoring real Latvian painter art into `public/`. That belongs to a content-loading ticket.
- **Single browser**: only Chromium 131 (headless) runs in this suite. Adding Firefox/WebKit projects is a one-line change in `playwright.config.ts`; deferred until cross-browser regressions are actually a concern.
- **Hover under touch / reduced motion**: the hover assertion uses `mouse.hover()`, which is fine for desktop. Mobile / `pointer:coarse` paths aren't covered.
- **Screenshot weight**: 11 PNGs (~9.8 MB) are committed to `spec/KAN-145/screenshots/`. Acceptable for a one-time evidence trail under a ticket folder; if these grow per-ticket they should move to a build artifact rather than being committed.
