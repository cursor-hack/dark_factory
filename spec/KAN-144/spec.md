# KAN-144: Add lightbox and dot-nav scroll tracking

Generated from Jira on 2026-05-09T21:53:19.841Z.

## Issue Details

| Field | Value |
|---|---|
| Key | KAN-144 |
| Title | Add lightbox and dot-nav scroll tracking |
| Type | Task |
| Status | To Do |
| Priority | Medium |
| Assignee | - |
| Reporter | Roland Abou Younes |
| Labels | dark-factory-generated, dfp-e7fbdbd9c745 |
| Components | - |
| Created | 2026-05-10T00:37:42.729+0300 |
| Updated | 2026-05-10T00:37:42.859+0300 |

## Description

Implement two interactive JavaScript features. (1) Lightbox: clicking any gallery-strip image opens a full-screen overlay showing that image; the ← and → arrow keys (plus visible on-screen buttons) cycle through the painter's gallery_urls[]; pressing Esc closes the lightbox. (2) Dot-nav: the 5-dot sticky header uses an Intersection Observer to detect the dominant painter section in the viewport and highlights that dot in gold (#c8a96a); clicking a dot smooth-scrolls to the corresponding section. All interactivity should be vanilla JS in a small <script> block or .ts module — no frameworks.

### Acceptance Criteria

- Clicking a gallery image opens the full-screen lightbox showing that image
- ← and → keys navigate between images in the same painter's gallery; wrapping at the ends is acceptable
- Pressing Esc closes the lightbox
- As the user scrolls, the active dot in the sticky header updates to reflect the painter section nearest the top of the viewport
- Clicking a dot scrolls the page smoothly to the corresponding painter section

### Source Reference

- What the page does

### Dependencies

- Implement painter sections: hero, bio, gallery strip, and scroll animations

Suggested priority: medium

Estimated complexity: medium

## Comments (0)

_No comments._
