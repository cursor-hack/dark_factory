# KAN-149: Add lightbox and sticky dot-nav scroll tracking

Generated from Jira on 2026-05-09T23:14:12.282Z.

## Issue Details

| Field | Value |
|---|---|
| Key | KAN-149 |
| Title | Add lightbox and sticky dot-nav scroll tracking |
| Type | Task |
| Status | To Do |
| Priority | Medium |
| Assignee | - |
| Reporter | Roland Abou Younes |
| Labels | dark-factory-generated, dfp-4623b9d57341 |
| Components | - |
| Created | 2026-05-10T02:05:53.364+0300 |
| Updated | 2026-05-10T02:05:53.544+0300 |

## Description

Lightbox: clicking any gallery-strip image opens a full-screen overlay displaying that image. The ← / → keyboard keys (and optional on-screen buttons) navigate between that painter's gallery images in order; Esc closes the overlay. The lightbox must be fully keyboard-accessible without mouse. Dot-nav: each of the five dots in the sticky header corresponds to one painter section. The active dot is styled in warm gold (#c8a96a) and updates as sections enter the viewport via Intersection Observer with a rootMargin that ensures exactly one dot is active at any scroll position. Clicking a dot smooth-scrolls to the corresponding section. Implement with vanilla JS in a small script block or .ts module — no external UI or animation library.

### Acceptance Criteria

- Clicking any gallery image opens the lightbox displaying that image full-screen.
- ArrowLeft / ArrowRight navigate between images in the painter's gallery; Escape closes the lightbox — all work without mouse.
- Sticky header stays pinned at the top across the full scroll range of the page.
- Exactly one dot is gold at every scroll position; the active dot changes correctly as the user scrolls between sections.
- Clicking a dot smooth-scrolls the viewport to the corresponding painter section.
- No new npm dependencies are added for lightbox or dot-nav (vanilla JS + CSS only).

### Source Reference

- What the page does
- Visual direction

### Dependencies

- Implement painter sections: hero, bio, gallery strip, and scroll animations

Suggested priority: medium

Estimated complexity: medium

## Comments (0)

_No comments._
