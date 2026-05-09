# KAN-147: Pre-flight check and Astro 4 project scaffold

Generated from Jira on 2026-05-09T23:08:36.344Z.

## Issue Details

| Field | Value |
|---|---|
| Key | KAN-147 |
| Title | Pre-flight check and Astro 4 project scaffold |
| Type | Task |
| Status | To Do |
| Priority | Medium |
| Assignee | - |
| Reporter | Roland Abou Younes |
| Labels | dark-factory-generated, dfp-2129adcbcaea |
| Components | - |
| Created | 2026-05-10T02:05:50.504+0300 |
| Updated | 2026-05-10T02:05:50.668+0300 |

## Description

FIRST: check that all five painter metadata.json files exist at their exact canonical paths before doing any other work:
- clients/painters-demo/v1/web/content/painters/karlis_huns_1831_3f3c/metadata.json
- clients/painters-demo/v1/web/content/painters/jazeps_grosvalds_1891_72b1/metadata.json
- clients/painters-demo/v1/web/content/painters/voldemars_irbe_1893_f992/metadata.json
- clients/painters-demo/v1/web/content/painters/karlis_padegs_1911_0e0a/metadata.json
- clients/painters-demo/v1/web/content/painters/lucia_peka_1912_60db/metadata.json

If any are missing: write the error (naming each missing file) to RESPONSE_FILE, exit the task with a non-zero status, and stop. Do NOT fabricate painter data, do NOT use placeholder image services, do NOT continue.

If all five are present: scaffold the Astro 4 project at clients/painters-demo/v1/web/. Create package.json (with npm run build emitting dist/), run npm install and commit package-lock.json, configure astro.config.mjs for static output, add tsconfig.json, and create Layout.astro with the dark background (#0c0c0e), Google Fonts (display serif for body, sans-serif for chrome), and a --accent-gold CSS custom property (#c8a96a). index.astro should render a minimal working skeleton (header + footer) that passes npm run build and emits dist/index.html. Do not modify the repo root package.json.

### Acceptance Criteria

- If any of the five metadata.json files are absent, the task writes a clear error naming each missing file to RESPONSE_FILE and exits non-zero — no further scaffold or content work is done.
- When all five files are present, npm ci && npm run build in clients/painters-demo/v1/web/ exits 0 and writes dist/index.html.
- package-lock.json is committed alongside package.json; the repo root package.json is unmodified.
- astro.config.mjs sets output: 'static'.
- Layout.astro renders a valid HTML shell with the dark background colour, font imports, and --accent-gold set to #c8a96a.

### Source Reference

- Hard pre-flight check (chain MUST enforce — this exists to prevent the previous failure mode)
- Repo placement (do not deviate)
- Visual direction

### Dependencies

None

Suggested priority: high

Estimated complexity: small

## Comments (0)

_No comments._
