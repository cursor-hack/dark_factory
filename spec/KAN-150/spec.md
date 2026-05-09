# KAN-150: E2E: Latvian painters gallery renders and navigates end-to-end

Generated from Jira on 2026-05-09T23:17:20.964Z.

## Issue Details

| Field | Value |
|---|---|
| Key | KAN-150 |
| Title | E2E: Latvian painters gallery renders and navigates end-to-end |
| Type | Task |
| Status | To Do |
| Priority | Medium |
| Assignee | - |
| Reporter | Roland Abou Younes |
| Labels | dark-factory-generated, dfp-724c8e6aeabc |
| Components | - |
| Created | 2026-05-10T02:05:54.720+0300 |
| Updated | 2026-05-10T02:05:54.958+0300 |

## Description

Run a Playwright (or equivalent headless-browser) test against the production build served locally (npx astro preview or a static HTTP server on dist/). The test must: (1) assert exactly five section headings whose text matches the Latvian names from each painter's metadata.json; (2) scroll through all five sections and assert the corresponding dot in the sticky header becomes active; (3) click a gallery image, assert the lightbox opens, press ArrowRight to advance one image, press Escape to close; (4) assert that no image src in the built HTML points to a placeholder service. Commit at least one screenshot or Playwright video recording as a PR artefact proving the page renders with real content.

### Acceptance Criteria

- Test finds exactly five section headings whose text matches name_lv from each painter's metadata.json, in source order.
- Scrolling to each section causes the corresponding dot to become active; the test asserts or screenshots show all five active-dot states.
- Lightbox opens on image click; ArrowRight advances to the next image; Escape closes — each step asserted or captured in a video trace.
- Zero image src values in the built HTML contain picsum, unsplash, lorem-picsum, or plaiceholder hostnames.
- At least one screenshot or Playwright video artefact is committed in the PR showing real painter names and images rendered on screen.

### Source Reference

- What the page does
- Hard pre-flight check (chain MUST enforce — this exists to prevent the previous failure mode)

### Dependencies

- Add lightbox and sticky dot-nav scroll tracking

Suggested priority: medium

Estimated complexity: medium

## Comments (0)

_No comments._
