# KAN-145 — E2E: Latvian painters gallery renders and navigates end-to-end

## What changed

Added an automated end-to-end verification of `clients/painters-demo/v1/web/` plus the screenshot evidence the ticket asks for.

- New sibling Playwright project at `clients/painters-demo/v1/e2e/` (own `package.json`, `playwright.config.ts`, `tests/painters-journey.spec.ts`, `.gitignore`). Kept out of `web/` so the product-deploy `npm ci` stays lean.
- `playwright.config.ts` builds `web/` and serves `dist/` via `astro preview` on `127.0.0.1:4321`, runs Chromium 131 headless, and persists trace/video on failure.
- Five serial tests, one per acceptance criterion (sections render, hover transliteration, lightbox keyboard nav, sticky-dot scroll tracking, full per-section snapshots).
- 11 PNG screenshots committed to `spec/KAN-145/screenshots/` as PR evidence (hero, hover state, lightbox open / →  / ←, dot-nav on section-3, one full snapshot per painter).
- No changes inside `web/` — the KAN-142/143/144 deliverable is verified, not modified.

## Why

The ticket is a pure verification pass following the three implementation PRs. A manual walk-through can't be reproduced from CI, so the suite both records the AC walk and locks regression coverage on the deliverable. Run with `cd clients/painters-demo/v1/e2e && npm install && npm run install-browsers && npm test`.

## Verification result

- `npm ci` in `web/`: clean (333 packages).
- `npm run build` in `web/`: **exit 0**, 1 page built. The `✘ [ERROR] The build was canceled` line on stderr is pre-existing esbuild noise documented in KAN-143 — exit code is 0 and `dist/index.html` is produced.
- Playwright: **5/5 passed in 19.1 s** on Chromium 131 headless.
- All five painter heroes + 4 gallery images per painter load (HTTP 200, non-zero `naturalWidth`). No broken image URLs observed.
- No visual regressions vs. the KAN-143/144 design intent across the eleven captured PNGs.

## Risks / notes

- **Image source is `picsum.photos`** (placeholder). The first run was image-load-flaky against that host; the suite now polls `img.complete && naturalWidth > 0` up to 20 s before failing, which absorbs typical jitter. Vendoring real painter art is a separate content ticket.
- **Chromium-only**. Adding Firefox/WebKit is a one-line change to `playwright.config.ts`; deferred until cross-browser regressions actually surface.
- Mobile / `pointer:coarse` hover behaviour is not covered by this suite.
- **Screenshot weight**: 11 PNGs (~9.8 MB) live under `spec/KAN-145/screenshots/`. Acceptable as a one-time evidence trail; if this becomes per-ticket the screenshots should move to CI artifacts rather than the repo.

See `spec/KAN-145/plan.md` for the full file-by-file plan and AC↔assertion mapping.
