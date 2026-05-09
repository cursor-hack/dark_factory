# KAN-145: E2E: Latvian painters gallery renders and navigates end-to-end

Generated from Jira on 2026-05-09T21:58:29.030Z.

## Issue Details

| Field | Value |
|---|---|
| Key | KAN-145 |
| Title | E2E: Latvian painters gallery renders and navigates end-to-end |
| Type | Task |
| Status | To Do |
| Priority | Medium |
| Assignee | - |
| Reporter | Roland Abou Younes |
| Labels | dark-factory-generated, dfp-96be59677dc8 |
| Components | - |
| Created | 2026-05-10T00:37:43.918+0300 |
| Updated | 2026-05-10T00:37:44.070+0300 |

## Description

After all three feature PRs are merged to main, run npm ci && npm run build in clients/painters-demo/v1/web/ and serve dist/ locally (e.g. npx serve dist or python -m http.server). Walk the full user journey: scroll through all five painter sections, hover each painter name to confirm the English transliteration appears, click a gallery image to open the lightbox, navigate ← and → with the keyboard, press Esc to close, and observe that the active dot in the sticky header updates throughout. Capture screenshots or a short screen recording covering each of these interactions. Note any broken image URLs or visual regressions in the PR description.

### Acceptance Criteria

- npm ci && npm run build exits 0 with no errors about missing content files
- All five painter sections are visible on scroll: hero background image loads, name, lifespan, bio, gallery strip, and encyclopedia link are each present and correctly attributed
- Hovering a Latvian painter name shows the English transliteration as specified
- Opening a gallery image launches the lightbox; ← / → keyboard navigation and Esc close work as specified
- The active dot in the sticky header changes as the user scrolls between painter sections
- Screenshots or a screen recording covering the full journey are attached to the PR as evidence

### Source Reference

- What this is
- What the page does

### Dependencies

- Scaffold Astro 4 project with global layout and build pipeline
- Implement painter sections: hero, bio, gallery strip, and scroll animations
- Add lightbox and dot-nav scroll tracking

Suggested priority: medium

Estimated complexity: small

## Comments (0)

_No comments._
