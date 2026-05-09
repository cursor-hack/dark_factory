# KAN-147 — Implementation Plan

## Outcome

Pre-flight check **failed**. Astro scaffold was deliberately **not** created.
No files outside `spec/KAN-147/` were modified.

## Pre-flight result

The ticket requires that all five canonical painter `metadata.json` files exist
before any scaffolding work begins. None of them are present in the working
tree on this branch:

- `clients/painters-demo/v1/web/content/painters/karlis_huns_1831_3f3c/metadata.json` — missing
- `clients/painters-demo/v1/web/content/painters/jazeps_grosvalds_1891_72b1/metadata.json` — missing
- `clients/painters-demo/v1/web/content/painters/voldemars_irbe_1893_f992/metadata.json` — missing
- `clients/painters-demo/v1/web/content/painters/karlis_padegs_1911_0e0a/metadata.json` — missing
- `clients/painters-demo/v1/web/content/painters/lucia_peka_1912_60db/metadata.json` — missing

The entire `clients/painters-demo/` tree is absent. The most recent change
touching this area was commit `8ae08a4` ("chore: drop fabricated painters-demo
so KAN-140 chain re-runs on a clean slate"), which intentionally removed the
prior fabricated content. No subsequent ticket has re-created the canonical
painter metadata.

The ticket explicitly forbids fabricating painter data, using placeholder image
services, or continuing past this gate. So the only correct action is to
report the failure and stop.

## What I did this run

1. Read `spec/KAN-147/spec.md`.
2. Verified absence of every listed `metadata.json` path with the filesystem.
3. Confirmed via `git log` that `clients/painters-demo/` was deliberately
   removed and has not been re-introduced.
4. Wrote this plan and a Jira-facing error to `spec/KAN-147/response.md`.
5. Made **no** changes outside `spec/KAN-147/`. In particular:
   - did not create `clients/painters-demo/v1/web/`
   - did not run `npm install`
   - did not modify the repo root `package.json` or `package-lock.json`
   - did not add `astro.config.mjs`, `tsconfig.json`, `Layout.astro`, or `index.astro`

## What is needed before KAN-147 can pass

A predecessor ticket must (re)create the five canonical painter metadata
files at the exact paths listed above with real, non-fabricated content. Once
those exist on this branch, re-run KAN-147 and the scaffold work in
acceptance criteria 2–5 can proceed:

- create `clients/painters-demo/v1/web/package.json` with an `npm run build`
  script that emits `dist/`
- run `npm install` and commit `package-lock.json` alongside
- add `astro.config.mjs` with `output: 'static'`
- add `tsconfig.json`
- add `src/layouts/Layout.astro` (background `#0c0c0e`, Google Fonts: display
  serif body + sans-serif chrome, `--accent-gold: #c8a96a`)
- add `src/pages/index.astro` rendering a header + footer skeleton
- verify `npm ci && npm run build` exits 0 and writes `dist/index.html`
- leave repo root `package.json` untouched

## Risks / notes

- Because run kind is `pr`, the workflow will open a PR containing only the
  spec-folder updates (plan + response). That PR is the contractually correct
  outcome of a failed pre-flight: it documents the gate failure on the branch
  without introducing any of the forbidden fabricated content.
