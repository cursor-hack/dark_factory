# KAN-150 — Implementation Plan

> **Status: BLOCKED on the same upstream gap that stopped KAN-147 / KAN-148 / KAN-149.**
> No code or configuration changes were made outside `spec/KAN-150/` on
> this run. See `response.md` for the Jira-facing summary.

## Ticket recap

Land an end-to-end Playwright test of the Latvian painters page, run
against the production build served locally (e.g. `npx astro preview` or
a static HTTP server on `dist/`). The test must assert all of:

1. Exactly five section headings whose text matches `name_lv` from each
   painter's `metadata.json`, in source order.
2. Scrolling to each section makes the corresponding sticky-header dot
   active; all five active-dot states asserted or screenshotted.
3. Clicking a gallery image opens the lightbox; `ArrowRight` advances
   one image; `Escape` closes — each step asserted or captured in a
   video trace.
4. Zero image `src` values in the built HTML reference `picsum`,
   `unsplash`, `lorem-picsum`, or `plaiceholder` hostnames.
5. At least one screenshot or Playwright video artefact is committed in
   the PR showing real painter names and images rendered on screen.

## Why this run is blocked

KAN-150 is the verification layer over KAN-147 (scaffold), KAN-148
(painter sections), and KAN-149 (lightbox + dot-nav). All three upstream
tickets blocked on missing painter content and never landed runtime
code. On this branch (HEAD `4afdda6`):

- `clients/painters-demo/` does not exist. No Astro 4 project at
  `clients/painters-demo/v1/web/` — no `package.json`, `astro.config.mjs`,
  `tsconfig.json`, `Layout.astro`, or `index.astro`. There is nothing to
  build, nothing to preview, and no `dist/` to serve.
- The five canonical painter `metadata.json` files are still absent at
  their required slugs:
  - `clients/painters-demo/v1/web/content/painters/karlis_huns_1831_3f3c/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/jazeps_grosvalds_1891_72b1/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/voldemars_irbe_1893_f992/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/karlis_padegs_1911_0e0a/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/lucia_peka_1912_60db/metadata.json`
- No `<section>` headings carrying `name_lv`, no `.gallery-strip img`,
  no lightbox overlay, and no `nav.dot-nav` exist anywhere in the
  repository — so there are no selectors for the test to drive.
- No real `profile_image_url` / `gallery_urls[]` exist — so even a
  passing "no placeholder hostnames" assertion would be vacuous, and
  the required "real painter names and images" screenshot cannot be
  produced honestly.

A self-contained Playwright suite that targets selectors which resolve
to nothing would either fail noisily on every CI run (no value) or be
silently skipped via lenient assertions (false green). Committing a
fabricated screenshot to satisfy the artefact requirement would breach
the same data-integrity rule that stopped KAN-147/148/149.

## What needs to happen first

1. Re-land KAN-147: real `metadata.json` + `bio.txt` for the five
   painters at the canonical slugs, plus the Astro 4 scaffold under
   `clients/painters-demo/v1/web/`.
2. Re-land KAN-148: hero/bio/gallery-strip painter sections with a
   sticky header carrying `nav.dot-nav` and 5 dots, attribution footer.
3. Re-land KAN-149: lightbox overlay + dot-nav `IntersectionObserver`
   wiring per the outline already recorded in `spec/KAN-149/plan.md`.
4. Re-run KAN-150 against that DOM. The test plan below is ready to
   execute as soon as the prerequisites exist.

## Test plan (to execute once unblocked)

### A. Tooling and placement

- Add `@playwright/test` as a **devDependency** of
  `clients/painters-demo/v1/web/package.json` (not the repo root, per
  CLAUDE.md). Pin to a major already supported by the project's Node
  version. Run `npx playwright install --with-deps chromium` in CI.
- New files in `clients/painters-demo/v1/web/`:
  - `playwright.config.ts` — base URL `http://127.0.0.1:4321`,
    `webServer` block running `npm run build && npx astro preview`
    (or `npx http-server dist -p 4321 -s`); single Chromium project;
    `video: 'retain-on-failure'`, `trace: 'retain-on-failure'`.
  - `tests/e2e/painters.spec.ts` — the suite below.
  - `tests/e2e/fixtures/load-painters.ts` — small helper that reads the
    five `metadata.json` files at build/test time (chronological order:
    Hūns, Grosvalds, Irbe, Padegs, Pēka) and exports an array of
    `{ slug, nameLv, profileImageUrl, galleryUrls }`. The order MUST be
    derived from filesystem reads, not hard-coded, so divergence
    between metadata and DOM still fails the test.
- Add an npm script `"test:e2e": "playwright test"`. Wire it into the
  existing build/CI surface only if CLAUDE.md's quality-bar test gate
  already runs per-client scripts; otherwise leave invocation to the
  ticket workflow.
- Commit one Playwright artefact (screenshot or `video.webm`) under
  `clients/painters-demo/v1/web/tests/e2e/__artefacts__/` from a green
  local run, named after the slug it depicts (e.g.
  `karlis_huns_overview.png`). Add `__artefacts__/.gitkeep` so the
  folder ships even when empty in CI.

### B. Suite outline (`tests/e2e/painters.spec.ts`)

```ts
import { test, expect } from '@playwright/test';
import { loadPainters } from './fixtures/load-painters';

const painters = loadPainters(); // chronological order from metadata

test.describe('Latvian painters page', () => {
  test('renders exactly five painter section headings in source order', async ({ page }) => {
    await page.goto('/');
    const headings = page.locator('section.painter-section h1, section.painter-section h2');
    await expect(headings).toHaveCount(5);
    for (const [i, p] of painters.entries()) {
      await expect(headings.nth(i)).toHaveText(p.nameLv);
    }
  });

  test('scroll-tracking activates exactly the matching dot per section', async ({ page }) => {
    await page.goto('/');
    for (const p of painters) {
      await page.locator(`#painter-${p.slug}`).scrollIntoViewIfNeeded();
      // Wait one IO tick + a frame.
      await page.waitForTimeout(150);
      const dots = page.locator('nav.dot-nav .dot');
      await expect(dots.locator('.active')).toHaveCount(1);
      await expect(page.locator(`nav.dot-nav .dot[data-target="painter-${p.slug}"]`))
        .toHaveClass(/(^|\s)active(\s|$)/);
      await page.screenshot({
        path: `tests/e2e/__artefacts__/dot-active-${p.slug}.png`,
        fullPage: false,
      });
    }
  });

  test('lightbox: click → ArrowRight → Escape', async ({ page }) => {
    await page.goto('/');
    const firstStrip = page.locator('section.painter-section .gallery-strip').first();
    const firstImg = firstStrip.locator('img').first();
    const firstSrc = await firstImg.getAttribute('src');

    await firstImg.click();
    const lightbox = page.locator('#lightbox');
    await expect(lightbox).toBeVisible();
    await expect(lightbox.locator('img.lightbox__img')).toHaveAttribute('src', firstSrc!);

    await page.keyboard.press('ArrowRight');
    const advancedSrc = await lightbox.locator('img.lightbox__img').getAttribute('src');
    expect(advancedSrc).not.toBe(firstSrc);

    await page.keyboard.press('Escape');
    await expect(lightbox).toBeHidden();
  });

  test('built HTML has zero placeholder-service image URLs', async ({ request }) => {
    const html = await (await request.get('/')).text();
    const banned = ['picsum', 'unsplash', 'lorem-picsum', 'plaiceholder'];
    for (const host of banned) {
      expect(html.toLowerCase(), `placeholder host "${host}" leaked into built HTML`)
        .not.toContain(host);
    }
  });
});
```

Notes:

- The fifth assertion is intentionally string-based against the served
  HTML so it covers `<img>`, CSS `background-image: url(...)`, and any
  `srcset` entries without parsing the DOM.
- Headings use `section.painter-section h1, h2` to stay tolerant of
  KAN-148's exact display-serif element choice. Tighten once KAN-148
  ships.

### C. Verification (once prerequisites land)

- `npm install` then `npx playwright install --with-deps chromium` in
  `clients/painters-demo/v1/web/`.
- `npm run build` exits 0; `dist/index.html` contains five painter
  sections.
- `npm run test:e2e` exits 0 locally and in CI.
- Commit a single static artefact from the green run that visually
  shows real painter names and a real `gallery_urls` image — chosen by
  hand, not generated by a script — to satisfy the "screenshot or
  video" acceptance criterion.
- Confirm no new dependency is added to the repo root `package.json`;
  Playwright belongs only to the per-delivery `web/package.json`.

### D. Risks / unverified at plan-write time

- Selector contract (`section.painter-section`, `id="painter-<slug>"`,
  `nav.dot-nav .dot[data-target="..."]`, `#lightbox`) mirrors KAN-148
  /KAN-149's planned markup. Once those tickets land, reconcile any
  drift before merging KAN-150.
- The dot-tracking test relies on a 150 ms settle after
  `scrollIntoViewIfNeeded`. If KAN-149 ships with smooth-scroll on by
  default, raise the wait to 400 ms or poll `await expect(dot)
  .toHaveClass(/active/)` instead.
- `astro preview` vs static `http-server` on `dist/`: pick whichever
  works under the CI runner's available ports; the suite is agnostic
  as long as `baseURL` matches.
- The committed artefact is a real screenshot from a green run; it is
  not produced or verifiable on this run because the page does not yet
  exist.

## What changed in this run

Only `spec/KAN-150/plan.md` and `spec/KAN-150/response.md`. No runtime
code, no Playwright configuration, no `clients/**` files, no changes to
the repo root `package.json` or `package-lock.json`, and no new npm
dependencies.
