# Latvian painters gallery website

## Ticket Metadata

- Jira key: KAN-140
- Status: To Do
- Priority: Medium
- Assignee: -
- Reporter: Pavel Koifman
- Labels: -
- Components: -

## Requirements

# Latvian Painters: Five Names That Matter

A scroll-driven gallery for a Cursor Hackathon demo.

## What this is

A single-page static site showcasing five Latvian painters — Hūns, Grosvalds, Irbe, Padegs, Pēka — as a scroll-driven narrative spanning a century of Latvian art (1830s–1940s). Built once, viewed at the demo, then archived. Optimise for visual impact, not production hardening.

## Repo placement (do not deviate)

- Repo: `cursor-hack/dark_factory`.
- All deliverables live at `clients/painters-demo/v1/web/`.
- `clients/painters-demo/v1/web/package.json` MUST define `npm run build` that emits `clients/painters-demo/v1/web/dist/`.
- `clients/painters-demo/v1/web/package-lock.json` MUST be committed (the deploy workflow uses `npm ci`).
- Self-contained — do not modify the root `package.json` of the repo.
- Stack: Astro 4 with TypeScript, static output. Astro's default `dist/` output target satisfies the contract.

## Content (already pre-committed by the operator)

Five painter folders live at `clients/painters-demo/v1/web/content/painters/<archive_id>/`:

- `karlis_huns_1831_3f3c/`
- `jazeps_grosvalds_1891_72b1/`
- `voldemars_irbe_1893_f992/`
- `karlis_padegs_1911_0e0a/`
- `lucia_peka_1912_60db/`

Each folder contains:

- `metadata.json` with fields `archive_id`, `name_lv`, `name_en`, `birth_year`, `death_year`, `article_url`, `profile_image_url`, `gallery_urls[]`.
- `bio.txt` — Latvian prose, plain text.

Import the JSON files directly via TypeScript imports at build time. No ingest pipeline, no schema validation, no normalisation. Trust the shape.

Image strategy: use the remote `enciklopedija.lv` URLs directly. Do not download or proxy.

## What the page does

A single full-bleed scroll-driven page at `clients/painters-demo/v1/web/src/pages/index.astro` with five painter sections stacked vertically. Each section:

- Full-viewport hero with the painter's `profile_image_url` as the section background, with a subtle ken-burns slow zoom triggered when the section enters the viewport.
- Name in large display serif (Latvian, `name_lv`); lifespan beneath in smaller muted type; English transliteration shown on hover.
- Bio rendered as readable prose (max-width 60ch, generous line-height, museum-quality serif body type).
- A horizontal scrolling strip of gallery images (3–6 per painter) under the bio. Click any image opens a full-screen lightbox with ←/→/Esc keyboard navigation.
- A "Read on Encyclopaedia Latvija →" link to the painter's `article_url`.
- Smooth fade/slide-in animations on enter using Intersection Observer + CSS transitions. Do not pull in heavy animation libraries.

Top of the page: a thin sticky header with the site title ("Latvian Painters: Five Names That Matter") and a 5-dot in-page navigation showing scroll position.

Bottom of the page: an attribution footer crediting `enciklopedija.lv` and the museums named in the bios. Single line, small, muted.

## Visual direction

- Dark background (near-black, e.g. `#0c0c0e`).
- Off-white serif typography for body, sans-serif for chrome.
- Generous whitespace; museum-gallery feel, not blog feel.
- Images dominate; text restrained.
- One accent colour (warm gold, `#c8a96a`) for links and the active section indicator.

## What we are NOT doing

- No multi-page routing, no per-painter routes.
- No JSON Schema, no Zod, no ingest CLI, no validation.
- No SEO meta per painter (one site-level `<title>` + `<meta description>` is fine).
- No CMS, no analytics, no auth, no comments.
- No A11y deep-dive beyond basic alt text on images and keyboard nav inside the lightbox.
- No language switcher (Latvian-first; English names appear on hover only).
- No deploy automation in the chain — see "Out of scope" below.

## Hosting

GitHub Pages (Source: GitHub Actions, already configured at the repo level).

Deploy is **out of scope for the chain**. After the Epic transitions to In Review (i.e. all chain PRs merged to `main`), the operator clicks a separate Jira automation button — "Deploy product to GitHub Pages" — on the Epic. That fires `repository_dispatch: jira_deploy_product` with `client=painters-demo` and `delivery=v1`, which runs `.github/workflows/jira-product-deploy.yml`. The workflow checks out `main`, runs `npm ci` and `npm run build` in `clients/painters-demo/v1/web/`, and publishes the resulting `dist/` to GitHub Pages.

Live URL after deploy: `https://cursor-hack.github.io/dark_factory/`.

## Plan budget

The generated plan MUST contain at most 3 development tasks total. Subtasks count toward this cap. The planner is expected to add one E2E task on top of those 3 (per the existing planner E2E mandate) — the chain will therefore run 4 hops.

## Comments

_No comments._
