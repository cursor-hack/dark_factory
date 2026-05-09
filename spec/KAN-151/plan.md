# KAN-151 Implementation Plan

## Status: BLOCKED — source bundle URL missing from ticket

The ticket description includes an empty blockquote where the LimeWire URL for
the source bundle should be:

```
Source bundle (Drive export mirrored on LimeWire):

>     <-- blank
```

This is observable in `spec/KAN-151/spec.md` lines 41–44.

The ticket's Hard Rules section is explicit:

> 1. If the LimeWire fetch fails after a few retries, STOP. Post a Jira comment
>    naming what failed. Do not proceed.
> 2. If any of the 5 folders or their required files are missing after
>    extraction, STOP. Post a Jira comment listing what's missing.
> 3. Do NOT substitute different painters.
> 4. Do NOT use placeholder image services …
> 5. Bio text comes from each folder's `bio.txt`. Do not rewrite or summarise.

Without the URL there is no way to:

- download the source zip (rule #1 — fetch impossible, no URL),
- recover the five `archive_id` folders whose names embed bundle-specific
  hashes (`…_3f3c`, `…_72b1`, `…_f992`, `…_0e0a`, `…_60db`),
- obtain the real `metadata.json` and `bio.txt` for each painter.

Inventing content or substituting alternative image sources would violate
rules #3, #4, and #5 — exactly the previous failure mode the ticket calls out.

## Action this run

- No repository changes.
- Update `response.md` to tell Jira clearly what is missing and how to unblock.
- Wait for the operator to edit the Jira description (paste the LimeWire URL
  inside the blockquote) and re-trigger the dispatch.

## Plan for the next run (once the URL is supplied)

1. Scaffold `clients/painters-demo/v1/web/` with Astro 4 + TypeScript, static
   output (default `dist/`). Commit `package-lock.json`. Do not touch the
   repo-root `package.json`.
2. Add a one-shot ingest script (Node + Playwright) that:
   - opens the LimeWire URL with the encryption fragment intact,
   - waits for the in-page download to resolve and saves the zip,
   - unzips into a temp dir, copies ONLY the five listed `archive_id`
     folders into `clients/painters-demo/v1/web/content/painters/<archive_id>/`,
   - asserts each folder has `metadata.json` + `bio.txt`; STOP otherwise.
3. Build the single-page gallery (one Astro page, five sections) per the
   visual spec: dark `#0c0c0e`, gold `#c8a96a` accent, serif body, sticky
   header with 5-dot scroll nav, IO-driven fade/slide-in, ken-burns hero,
   horizontal gallery strip, full-screen lightbox with ←/→/Esc.
4. Read `bio.txt` as plain text (preserve paragraph breaks, no Markdown
   interpretation). Use `profile_image_url` and `gallery_urls[]` as-is — no
   proxy, no placeholder service.
5. Verify locally: `npm ci && npm run build` produces `dist/index.html`
   containing the string "Latvian Painters" and references to
   `enciklopedija.lv` images.
6. Push to `main` (fall back to `tdf/kan-151` PR if branch protection blocks),
   then `gh workflow run jira-product-deploy.yml --ref main -f
   issue_key=KAN-151 -f client=painters-demo -f delivery=v1`.

## Risks for the next run

- LimeWire may rate-limit or change the page; retry with backoff, then STOP.
- `enciklopedija.lv` images may hot-link-block; if so, document and stop —
  do not swap to a placeholder service (rule #4).
- The `dist/` size and image weight: gallery images are loaded directly from
  `enciklopedija.lv`, so build size stays small but page weight depends on
  upstream. Use `loading="lazy"` for non-hero images.
