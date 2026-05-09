# KAN-148 — Implementation Plan

## Outcome

**Blocked.** No code changes were made outside `spec/KAN-148/`.

KAN-148 builds painter sections inside the Astro project at
`clients/painters-demo/v1/web/`. That project does not exist on this branch,
and neither does any of the painter content the ticket consumes
(`metadata.json`, `bio.txt`, `gallery_urls[]`, `profile_image_url`,
`article_url`). Producing this work without those inputs would require
fabricating painter data and/or using placeholder image services — both of
which the upstream ticket (KAN-147) and the dependency chain explicitly
prohibit. So the only correct action is to report the blockage and stop.

## Gate evidence

Verified on the current branch (`main`, HEAD `b3000e7`):

- `clients/painters-demo/` — does not exist (entire tree absent).
- `clients/painters-demo/v1/web/src/pages/index.astro` — does not exist.
- `clients/painters-demo/v1/web/src/layouts/Layout.astro` — does not exist.
- `clients/painters-demo/v1/web/package.json` — does not exist.
- `clients/painters-demo/v1/web/astro.config.mjs` — does not exist.
- All five canonical painter `metadata.json` files — absent:
  - `…/karlis_huns_1831_3f3c/metadata.json`
  - `…/jazeps_grosvalds_1891_72b1/metadata.json`
  - `…/voldemars_irbe_1893_f992/metadata.json`
  - `…/karlis_padegs_1911_0e0a/metadata.json`
  - `…/lucia_peka_1912_60db/metadata.json`
- All five corresponding `bio.txt` files — absent.

Recent history confirms this is intentional: commit `8ae08a4`
("chore: drop fabricated painters-demo so KAN-140 chain re-runs on a clean
slate") removed the prior fabricated tree, KAN-147 did not re-create it
(its plan recorded a pre-flight failure), and no commit since has
re-introduced any of the required content.

## Why this ticket cannot proceed in isolation

The ticket's acceptance criteria reference inputs that do not exist:

1. "Each hero background URL exactly matches `profile_image_url` from that
   painter's `metadata.json`." — there is no `metadata.json` to read.
2. "Bio text is verbatim from `bio.txt` with paragraph breaks intact." —
   there is no `bio.txt` to read.
3. "Gallery strip shows 3–6 images per painter sourced from
   `metadata.json` `gallery_urls[]`; zero placeholder service URLs
   (picsum, unsplash, lorem-picsum, plaiceholder, etc.) appear in the
   built HTML." — there are no real `gallery_urls[]` available, and the
   ticket forbids supplying placeholder ones.
4. "`npm run build` completes with no TypeScript errors." — there is no
   Astro project rooted at `clients/painters-demo/v1/web/` to build.

Acceptance criterion 3 is the hard gate: any "scaffold a stub so the page
renders" workaround would require placeholder URLs (picsum / unsplash /
similar), which is exactly what the criterion bans. Producing the page
with synthesized painter prose, fake birth/death years, or invented
Encyclopaedia Latvija article links would violate the same data-integrity
rule that caused KAN-147 to stop.

## What I did this run

1. Read `spec/KAN-148/spec.md` and `CLAUDE.md`.
2. Read `spec/KAN-147/plan.md` and `spec/KAN-147/spec.md` to confirm the
   predecessor's pre-flight outcome.
3. Verified by direct filesystem inspection that `clients/painters-demo/`
   is absent and that no `metadata.json` or `bio.txt` exists anywhere in
   the repo.
4. Wrote this plan and a Jira-facing blocker note to
   `spec/KAN-148/response.md`.
5. Made **no** changes outside `spec/KAN-148/`. In particular I did not:
   - create or modify any file under `clients/painters-demo/`
   - introduce placeholder painter data, bios, or image URLs
   - add the Astro 4 scaffold that KAN-147 was supposed to land
   - run `npm install` or alter the repo-root `package.json` /
     `package-lock.json`

## What is needed before KAN-148 can pass

Re-running the chain in order:

1. A predecessor (KAN-147 or a remediation ticket) must land the Astro 4
   scaffold under `clients/painters-demo/v1/web/`:
   - `package.json` with `npm run build` emitting `dist/`
   - `astro.config.mjs` with `output: 'static'`
   - `tsconfig.json`
   - `src/layouts/Layout.astro` (background `#0c0c0e`, Google Fonts —
     display serif body + sans-serif chrome — `--accent-gold: #c8a96a`)
   - `src/pages/index.astro` minimal skeleton
   - `package-lock.json` committed alongside `package.json`
2. A content ticket must place real, non-fabricated artefacts at:
   - `clients/painters-demo/v1/web/content/painters/<slug>/metadata.json`
     with `name_lv`, `name_en`, `birth_year`, `death_year`,
     `profile_image_url`, `gallery_urls[]` (3–6 entries, no placeholder
     services), `article_url`.
   - `clients/painters-demo/v1/web/content/painters/<slug>/bio.txt`
   …for each of the five canonical slugs (`karlis_huns_1831_3f3c`,
   `jazeps_grosvalds_1891_72b1`, `voldemars_irbe_1893_f992`,
   `karlis_padegs_1911_0e0a`, `lucia_peka_1912_60db`).
3. Then re-run KAN-148. The implementation outline below is what would
   land at that point.

## Planned implementation (deferred until inputs exist)

Inside `clients/painters-demo/v1/web/src/pages/index.astro`:

- At the top of the frontmatter, import the five `metadata.json` files
  directly via TypeScript (`import huns from '../../content/painters/karlis_huns_1831_3f3c/metadata.json'`
  etc.). Read each `bio.txt` with `fs.readFileSync` at build time.
- Build a chronologically ordered array
  `[Hūns, Grosvalds, Irbe, Padegs, Pēka]` and render `<section>`s in that
  order.
- Each `<section class="painter">` contains:
  - `<div class="hero" style={`background-image: url(${m.profile_image_url})`}>`
    — full-viewport (`100vh`); the inner element gets a CSS
    `@keyframes ken-burns` (slow `transform: scale()` + slight translate)
    triggered by adding a class when an `IntersectionObserver` reports
    intersection.
  - `<h2 class="name-lv">{m.name_lv}</h2>` (display serif, large) with a
    sibling `<span class="name-en">{m.name_en}</span>` revealed via
    `:hover` on the section using CSS only (`opacity` / `transform`).
  - `<p class="years">{m.birth_year}–{m.death_year}</p>` muted.
  - Bio: `bioText.split(/\n{2,}/).map(p => <p>{p}</p>)` so paragraph
    breaks survive without HTML interpretation; CSS `max-width: 60ch`
    and generous `line-height`.
  - Gallery strip: `<ul class="gallery">` with one `<li><img
    src={url} alt={…} loading="lazy" /></li>` per entry in
    `m.gallery_urls.slice(0, 6)`. Horizontal scroll via
    `overflow-x: auto; display: flex`. Build-time guard refuses to render
    a section whose `gallery_urls.length < 3` or whose URLs match
    `/(picsum|unsplash|lorem-picsum|plaiceholder)/i`.
  - "Read on Encyclopaedia Latvija →" anchor with
    `href={m.article_url}` and class `read-on` styled in
    `var(--accent-gold)`.
- Header: thin sticky `<header>` with site title "Latvian Painters: Five
  Names That Matter" on the left and five disabled dot anchors on the
  right (`<a href="#painter-N">·</a>`).
- Footer: single line attribution "Bios and photographs courtesy of
  enciklopedija.lv" with a link to the Encyclopaedia Latvija home page.

Inline `<script>` (no external deps): one `IntersectionObserver` watches
`.painter, .hero` and toggles `.in-view` on intersection; CSS handles
fade/slide-in transitions and the ken-burns keyframe via that class.

Validation step before handing back: run `npm run build` from
`clients/painters-demo/v1/web/`, confirm exit 0, no TypeScript errors,
and that `dist/index.html` contains the five painter sections with no
placeholder URLs in `dist/`.

## Risks / notes

- Run kind is `pr`, so the workflow will open a `tdf/kan-148` PR
  containing only the spec-folder updates. That is the contractually
  correct outcome of a blocked dependency: it documents the gap on the
  branch without smuggling in fabricated content.
- Because no HTML or build artefact is produced this run, there is no
  visual rendering to inspect. The implementation outline above will need
  a browser smoke check (hero ken-burns, scroll-triggered fades, gallery
  horizontal scroll on narrow viewports) once the prerequisite scaffold
  and content land.
