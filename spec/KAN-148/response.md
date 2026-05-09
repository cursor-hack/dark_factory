# KAN-148 — Blocked: prerequisite scaffold and painter content are missing

This run made **no code changes** outside `spec/KAN-148/`. The ticket
cannot be implemented on this branch because both of its hard inputs are
absent.

## What is missing on `main` (HEAD `b3000e7`)

- The Astro 4 project at `clients/painters-demo/v1/web/` does not exist
  — no `package.json`, `astro.config.mjs`, `tsconfig.json`,
  `src/layouts/Layout.astro`, or `src/pages/index.astro`. The entire
  `clients/painters-demo/` tree is absent.
- All five canonical painter `metadata.json` files are missing:
  - `clients/painters-demo/v1/web/content/painters/karlis_huns_1831_3f3c/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/jazeps_grosvalds_1891_72b1/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/voldemars_irbe_1893_f992/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/karlis_padegs_1911_0e0a/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/lucia_peka_1912_60db/metadata.json`
- All five corresponding `bio.txt` files are missing.
- KAN-147 (the upstream "pre-flight + scaffold" ticket) recorded a
  pre-flight failure for the same reason and did not land the scaffold.

## Why I stopped instead of fabricating

KAN-148's acceptance criteria require:

- hero backgrounds drawn from real `profile_image_url` values,
- bio prose verbatim from `bio.txt`,
- gallery strips sourced from real `gallery_urls[]` with **zero**
  placeholder service URLs (picsum, unsplash, lorem-picsum, plaiceholder,
  …) in the built HTML,
- a successful `npm run build` inside an Astro project that doesn't yet
  exist on this branch.

Producing the page with synthesized bios, invented dates, or placeholder
images would directly violate criterion 3 and the same data-integrity
rule that caused KAN-147 to stop, so the only correct action is to
report the gap.

## What needs to happen next

1. Land the Astro 4 scaffold described in KAN-147 under
   `clients/painters-demo/v1/web/` (re-run or remediation ticket).
2. Land real, non-fabricated `metadata.json` + `bio.txt` for all five
   painters at the canonical slugs above.
3. Re-run KAN-148. The implementation outline (chronological order,
   ken-burns hero via IntersectionObserver, hover-reveal English name,
   60ch bio paragraphs preserving `\n\n` breaks, horizontal gallery
   strip, gold "Read on Encyclopaedia Latvija →" link, sticky header
   with 5-dot nav, attribution footer, IO + CSS fade/slide-in only) is
   recorded in `spec/KAN-148/plan.md` and is ready to execute once the
   inputs exist.

## Risks

- The PR opened by the workflow for this run will contain only
  `spec/KAN-148/` updates. That is the correct contractual outcome of a
  blocked dependency — it documents the gap without smuggling in
  fabricated painter content.
