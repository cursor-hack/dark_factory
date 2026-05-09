# KAN-143: Implement painter sections: hero, bio, gallery strip, and scroll animations

Generated from Jira on 2026-05-09T21:44:46.597Z.

## Issue Details

| Field | Value |
|---|---|
| Key | KAN-143 |
| Title | Implement painter sections: hero, bio, gallery strip, and scroll animations |
| Type | Task |
| Status | To Do |
| Priority | Medium |
| Assignee | - |
| Reporter | Roland Abou Younes |
| Labels | dark-factory-generated, dfp-e813c2415ef3 |
| Components | - |
| Created | 2026-05-10T00:37:41.566+0300 |
| Updated | 2026-05-10T00:37:41.725+0300 |

## Description

Populate index.astro by importing the five metadata.json files directly via TypeScript at build time and reading each bio.txt. For each painter render a full-viewport section with: (a) profile_image_url as the CSS background with a ken-burns slow-zoom CSS animation triggered by an Intersection Observer when the section enters the viewport; (b) name_lv in large display serif, birth_year–death_year in smaller muted type beneath, name_en revealed on hover via CSS; (c) bio prose at max-width 60ch with generous line-height in serif body; (d) a horizontally scrolling gallery strip of gallery_urls[] images with descriptive alt text; (e) a gold 'Read on Encyclopaedia Latvija →' link pointing to article_url. Apply fade/slide-in entrance animations via Intersection Observer and CSS transitions only — no external animation libraries.

### Acceptance Criteria

- All five painter sections render with correct data sourced from the pre-committed metadata.json files; bio.txt content appears as readable prose
- Each section's hero background shows the painter's profile image; the ken-burns zoom starts when the section scrolls into view
- Hovering the Latvian name reveals the English transliteration; it is hidden at rest
- The gallery strip scrolls horizontally and shows the correct images for each painter, each with non-empty alt text
- Sections fade or slide in on viewport entry using only CSS transitions and the Intersection Observer API

### Source Reference

- Content (already pre-committed by the operator)
- What the page does
- Visual direction

### Dependencies

- Scaffold Astro 4 project with global layout and build pipeline

Suggested priority: high

Estimated complexity: large

## Comments (0)

_No comments._
