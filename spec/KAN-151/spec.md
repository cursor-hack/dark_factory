# KAN-151: Latvian Painters Gallery

Generated from Jira on 2026-05-09T23:41:02.524Z.

## Issue Details

| Field | Value |
|---|---|
| Key | KAN-151 |
| Title | Latvian Painters Gallery |
| Type | Task |
| Status | To Do |
| Priority | Medium |
| Assignee | - |
| Reporter | Roland Abou Younes |
| Labels | - |
| Components | - |
| Created | 2026-05-10T02:40:12.393+0300 |
| Updated | 2026-05-10T02:40:39.398+0300 |

## Description

# Latvian Painters: Five Names That Matter

A scroll-driven, single-page static gallery for a Cursor Hackathon demo. One Task, one agent run, ends with a live URL.

## Ticket type

Create as a **Task** in `KAN`, no parent. Click the "Dark Factory dispatch" Manual Trigger on this Task — that's the only operator action.

## Repo placement (do not deviate)

- All code lives at `clients/painters-demo/v1/web/`.
- `package.json` defines `npm run build` that emits `clients/painters-demo/v1/web/dist/`.
- `package-lock.json` MUST be committed (the deploy workflow uses `npm ci`).
- Stack: Astro 4 + TypeScript, static output. Astro's default `dist/` satisfies the contract.
- Do NOT modify the repo's root `package.json`.

## Content

Source bundle (Drive export mirrored on LimeWire):

>  

The URL uses client-side fragment decryption — `curl`/`wget` won't get the file. Drive a headless Chromium (Playwright) to download the zip, unzip it, and copy ONLY these five painter folders to `clients/painters-demo/v1/web/content/painters/<archive_id>/`:

- `karlis_huns_1831_3f3c/`
- `jazeps_grosvalds_1891_72b1/`
- `voldemars_irbe_1893_f992/`
- `karlis_padegs_1911_0e0a/`
- `lucia_peka_1912_60db/`

Each folder must contain `metadata.json` (with `name_lv`, `name_en`, `birth_year`, `death_year`, `article_url`, `profile_image_url`, `gallery_urls[]`) and `bio.txt`.

**Hard rules — these prevent the previous failure where Claude invented painters:**

1. If the LimeWire fetch fails after a few retries, STOP. Post a Jira comment naming what failed. Do not proceed.
2. If any of the 5 folders or their required files are missing after extraction, STOP. Post a Jira comment listing what's missing.
3. Do NOT substitute different painters. The five `archive_id` slugs above are the only acceptable selection.
4. Do NOT use placeholder image services (picsum.photos, unsplash, lorem-picsum, etc.). Image URLs come from `metadata.json → profile_image_url` and `gallery_urls[]` (which are `enciklopedija.lv` URLs) — use them directly, no proxy.
5. Bio text comes from each folder's `bio.txt`. Do not rewrite or summarise.

## The page

A single full-bleed scroll-driven page with five painter sections stacked vertically. Each section:

- Full-viewport hero with `profile_image_url` as background, subtle ken-burns slow zoom on enter.
- `name_lv` in large display serif, lifespan beneath in muted smaller type, `name_en` shown on hover.
- Bio prose (max-width 60ch, generous line-height, museum-quality serif). Render plain text — preserve paragraph breaks, do not interpret as Markdown.
- Horizontal gallery strip of 3–6 images per painter; click opens a full-screen lightbox with ←/→/Esc keyboard nav.
- "Read on Encyclopaedia Latvija →" link to `article_url`.
- Fade/slide-in on viewport enter via Intersection Observer + CSS transitions. No heavy animation libraries.

Top: thin sticky header with the title "Latvian Painters: Five Names That Matter" and a 5-dot in-page nav showing scroll position.

Bottom: attribution footer crediting `enciklopedija.lv`, single line, muted.

### Visual direction

- Dark near-black background (`#0c0c0e`).
- Off-white serif body, sans-serif chrome.
- Generous whitespace — museum gallery, not blog.
- Images dominate; text restrained.
- One accent colour (warm gold `#c8a96a`) for links and the active section indicator.

## Deploy

After the build verifies locally (`npm ci && npm run build` produces `dist/index.html`), push directly to `main` and fire the deploy:

```
gh workflow run jira-product-deploy.yml --ref main \
  -f issue_key="$ISSUE_KEY" -f client=painters-demo -f delivery=v1
```

`client=painters-demo` and `delivery=v1` are non-negotiable — defaulting to `example/demo` deploys Pavel's placeholder, which has happened twice already.

If pushing to `main` is rejected (branch protection): push to `tdf/<key>`, open a PR, merge it, then fire the deploy. If both deploy paths fail, post a Jira comment with the commit SHA and "operator: please click Deploy".

After firing, wait for the run to finish (`gh run watch`), then `curl https://cursor-hack.github.io/dark_factory/` and confirm the body contains "Latvian Painters". Post the live URL as the final Jira comment.

## What we are NOT doing

- No multi-page routing, no per-painter routes.
- No JSON Schema, no Zod, no ingest CLI.
- No SEO meta per painter (one site-level `<title>` + `<meta description>` is fine).
- No CMS, no analytics, no auth, no comments.
- No A11y deep-dive beyond image alt text and lightbox keyboard nav.
- No language switcher.
- No PR review gate — push to main, the demo IS the deliverable.

## Done when

The Jira ticket has a comment containing a clickable `https://cursor-hack.github.io/dark_factory/` URL whose live page renders 5 painter sections with real `enciklopedija.lv` images and bundle bios.

## Comments (0)

_No comments._
