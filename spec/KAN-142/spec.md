# KAN-142: Scaffold Astro 4 project with global layout and build pipeline

Generated from Jira on 2026-05-09T21:39:35.265Z.

## Issue Details

| Field | Value |
|---|---|
| Key | KAN-142 |
| Title | Scaffold Astro 4 project with global layout and build pipeline |
| Type | Task |
| Status | To Do |
| Priority | Medium |
| Assignee | - |
| Reporter | Roland Abou Younes |
| Labels | dark-factory-generated, dfp-a8fc4487b3b4 |
| Components | - |
| Created | 2026-05-10T00:37:40.213+0300 |
| Updated | 2026-05-10T00:37:40.386+0300 |

## Description

Create clients/painters-demo/v1/web/ as a self-contained Astro 4 + TypeScript project with static output. Provide package.json (npm run build → dist/), commit package-lock.json, and configure astro.config.mjs for static output. Implement global CSS: near-black background (#0c0c0e), off-white serif body type, sans-serif chrome, warm gold accent (#c8a96a). Add the thin sticky header (site title 'Latvian Painters: Five Names That Matter' + 5-dot nav as static placeholders for now) and the single-line attribution footer crediting enciklopedija.lv. index.astro should render a working skeleton (header + 5 empty section stubs + footer) that passes npm run build and emits dist/index.html. Do not touch the repo root package.json.

### Acceptance Criteria

- npm ci && npm run build in clients/painters-demo/v1/web/ exits 0 and writes dist/index.html
- package-lock.json is committed alongside package.json; the repo root package.json is unmodified
- dist/index.html has the dark background (#0c0c0e), sticky header with the correct site title, and attribution footer visible in a browser
- Gold accent (#c8a96a) and the serif/sans font pairing are present in the global CSS

### Source Reference

- Repo placement (do not deviate)
- Visual direction
- What the page does

### Dependencies

None

Suggested priority: high

Estimated complexity: medium

## Comments (0)

_No comments._
