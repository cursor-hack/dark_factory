# KAN-147 — Pre-flight FAILED, scaffold not created

The hard pre-flight check defined at the top of this ticket failed. None of
the five canonical painter `metadata.json` files are present on this branch,
so per the ticket's own instructions I did not scaffold the Astro project,
did not run `npm install`, and did not modify any file outside
`spec/KAN-147/`.

## Missing files

All five required paths are absent (the entire `clients/painters-demo/` tree
does not exist):

- `clients/painters-demo/v1/web/content/painters/karlis_huns_1831_3f3c/metadata.json`
- `clients/painters-demo/v1/web/content/painters/jazeps_grosvalds_1891_72b1/metadata.json`
- `clients/painters-demo/v1/web/content/painters/voldemars_irbe_1893_f992/metadata.json`
- `clients/painters-demo/v1/web/content/painters/karlis_padegs_1911_0e0a/metadata.json`
- `clients/painters-demo/v1/web/content/painters/lucia_peka_1912_60db/metadata.json`

## Why they are missing

A prior chore (`8ae08a4 — chore: drop fabricated painters-demo so KAN-140
chain re-runs on a clean slate`) intentionally removed the previous,
fabricated `clients/painters-demo/` content. No subsequent ticket has
re-introduced canonical, non-fabricated painter metadata at these paths.

## What is needed to unblock

A predecessor ticket needs to (re)create the five `metadata.json` files at
the exact canonical paths above with real, non-fabricated painter data
(no placeholder image services). Once they are in place, re-run KAN-147 and
the scaffold work (package.json + npm install + astro.config.mjs +
tsconfig.json + Layout.astro + index.astro emitting `dist/index.html`) can
proceed.

## What changed in this PR

Only `spec/KAN-147/plan.md` and `spec/KAN-147/response.md`. No code, no
configuration, and no `clients/**` files were touched. The repo root
`package.json` is unmodified.

## Risk

None to the repository. The deliberate non-action here is the safe outcome:
the ticket explicitly forbids fabricating painter data or proceeding past the
pre-flight gate, and this run honoured that.
