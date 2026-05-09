# KAN-150 — Blocked: nothing to E2E-test until the painters chain re-lands

This run made **no code changes** outside `spec/KAN-150/`. KAN-150 is the
verification layer over KAN-147 (scaffold), KAN-148 (painter sections),
and KAN-149 (lightbox + dot-nav). All three upstream tickets blocked on
missing painter content and never produced runtime code, so there is
nothing on `main` for a Playwright suite to drive.

## Repo state on `main` (HEAD `4afdda6`)

- `clients/painters-demo/` does not exist. No Astro 4 project at
  `clients/painters-demo/v1/web/` — no `package.json`,
  `astro.config.mjs`, `tsconfig.json`, `Layout.astro`, or `index.astro`.
  No `dist/` to serve.
- All five canonical painter `metadata.json` files are still missing:
  - `clients/painters-demo/v1/web/content/painters/karlis_huns_1831_3f3c/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/jazeps_grosvalds_1891_72b1/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/voldemars_irbe_1893_f992/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/karlis_padegs_1911_0e0a/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/lucia_peka_1912_60db/metadata.json`
- No painter `<section>` headings, no `.gallery-strip` images, no
  `nav.dot-nav` dots, and no `#lightbox` overlay exist anywhere in the
  repository — the test has no DOM to assert against.
- KAN-147, KAN-148, and KAN-149 each recorded the same upstream block
  in their own `response.md`. No subsequent commit re-introduced the
  five painters' canonical metadata.

## Why I stopped instead of shipping a Playwright skeleton

Acceptance criteria require asserting:

- exactly **five section headings** matching `name_lv` from each
  painter's `metadata.json`,
- the corresponding **dot** becoming active per section,
- a **lightbox** opening on a gallery-image click and responding to
  `ArrowRight` / `Escape`,
- **zero placeholder-service hostnames** (picsum / unsplash /
  lorem-picsum / plaiceholder) in the built HTML,
- at least one committed **screenshot or video artefact showing real
  painter names and images** rendered on screen.

None of those preconditions hold on this branch. A test suite written
now would either fail loudly on every run (target selectors and
metadata files do not exist) or be made green via lenient assertions
that no longer enforce the acceptance criteria. Producing the required
screenshot artefact would force me to either fabricate painter data or
run the suite against a page I have not built — both of which breach
the same data-integrity rule that already stopped KAN-147/148/149.

## What needs to happen next

1. Re-land KAN-147: real, non-fabricated `metadata.json` + `bio.txt`
   for the five painters at the canonical slugs, plus the Astro 4
   scaffold under `clients/painters-demo/v1/web/`.
2. Re-land KAN-148: hero / bio / gallery-strip painter sections,
   sticky header with 5 dots, attribution footer.
3. Re-land KAN-149: lightbox overlay + `IntersectionObserver`-driven
   dot-nav per the outline already recorded in `spec/KAN-149/plan.md`.
4. Re-run KAN-150. The full Playwright plan is recorded in
   `spec/KAN-150/plan.md` and is ready to execute once the
   prerequisites exist:
   - `@playwright/test` added only to
     `clients/painters-demo/v1/web/package.json` (not the repo root).
   - `playwright.config.ts` with a `webServer` block that builds and
     previews `dist/`, single Chromium project, `video` and `trace` on
     failure.
   - `tests/e2e/painters.spec.ts` covering: five-headings-in-source-order,
     scroll → dot active, click → ArrowRight → Escape lightbox flow,
     and a string-level ban-list check against the served HTML.
   - One real screenshot or video artefact captured from a green run,
     committed under `tests/e2e/__artefacts__/`.

## What changed in this PR

Only `spec/KAN-150/plan.md` and `spec/KAN-150/response.md`. No runtime
code, no Playwright configuration, no `clients/**` files, no changes to
the repo root `package.json` or `package-lock.json`, and no new npm
dependencies.

## Risks

None to the repository. The deliberate non-action here is the safe
outcome: KAN-150 cannot be honestly satisfied before its dependency
chain lands, and this run documents the gap without smuggling in dead
test code or a fabricated screenshot artefact.
