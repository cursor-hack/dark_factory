# KAN-148: Implement painter sections: hero, bio, gallery strip, and scroll animations

Generated from Jira on 2026-05-09T23:11:08.435Z.

## Issue Details

| Field | Value |
|---|---|
| Key | KAN-148 |
| Title | Implement painter sections: hero, bio, gallery strip, and scroll animations |
| Type | Task |
| Status | To Do |
| Priority | Medium |
| Assignee | - |
| Reporter | Roland Abou Younes |
| Labels | dark-factory-generated, dfp-f8d7fec0d93e |
| Components | - |
| Created | 2026-05-10T02:05:51.969+0300 |
| Updated | 2026-05-10T02:05:52.126+0300 |

## Description

Populate index.astro by importing the five metadata.json files directly via TypeScript at build time and reading each bio.txt via Node fs. Render the five painters in chronological order (Hūns, Grosvalds, Irbe, Padegs, Pēka). Each painter section: (a) full-viewport hero with profile_image_url as the CSS background-image and a CSS ken-burns slow-zoom keyframe animation triggered by an Intersection Observer on entry; (b) name_lv in large display serif, birth_year–death_year in smaller muted type, name_en revealed on hover via CSS only; (c) bio prose from bio.txt rendered as plain text preserving paragraph breaks — no Markdown or HTML interpretation — at max-width 60ch with generous line-height; (d) a horizontally scrolling gallery strip of 3–6 images from metadata.json gallery_urls[] with alt text (no placeholder service URLs); (e) a warm-gold 'Read on Encyclopaedia Latvija →' link to article_url. Add fade/slide-in entrance animations for all sections using Intersection Observer + CSS transitions only — no external animation libraries. Add a thin sticky header with the site title ('Latvian Painters: Five Names That Matter') and 5-dot nav placeholders, and a single-line attribution footer crediting enciklopedija.lv.

### Acceptance Criteria

- All five painter sections appear in source order; each hero background URL exactly matches profile_image_url from that painter's metadata.json.
- Bio text is verbatim from bio.txt with paragraph breaks intact; no Markdown rendering or HTML escaping artifacts are visible.
- Gallery strip shows 3–6 images per painter sourced from metadata.json gallery_urls[]; zero placeholder service URLs (picsum, unsplash, lorem-picsum, plaiceholder, etc.) appear in the built HTML.
- Fade/slide-in animations fire on viewport entry using only Intersection Observer and CSS transitions — no animation library imports.
- Ken-burns zoom on hero entry uses CSS keyframe animation on transform/scale only.
- npm run build completes with no TypeScript errors.

### Source Reference

- What the page does
- Content (must exist on main BEFORE chain starts)
- Visual direction
- What we are NOT doing

### Dependencies

- Pre-flight check and Astro 4 project scaffold

Suggested priority: high

Estimated complexity: large

## Comments (0)

_No comments._
