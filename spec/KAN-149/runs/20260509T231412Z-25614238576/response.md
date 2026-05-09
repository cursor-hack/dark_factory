# KAN-149 — Blocked: no painter DOM exists to attach lightbox / dot-nav to

This run made **no code changes** outside `spec/KAN-149/`. The ticket's
own dependency ("Implement painter sections: hero, bio, gallery strip,
and scroll animations" — KAN-148) has not landed, and its prerequisite
(KAN-147 scaffold) also blocked, so there is nothing on `main` for
KAN-149 to enhance.

## Repo state on `main` (HEAD `adf5446`)

- `clients/painters-demo/` does not exist. No Astro 4 project at
  `clients/painters-demo/v1/web/` — no `package.json`,
  `astro.config.mjs`, `tsconfig.json`, `Layout.astro`, or `index.astro`.
- All five canonical painter `metadata.json` files are still missing:
  - `clients/painters-demo/v1/web/content/painters/karlis_huns_1831_3f3c/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/jazeps_grosvalds_1891_72b1/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/voldemars_irbe_1893_f992/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/karlis_padegs_1911_0e0a/metadata.json`
  - `clients/painters-demo/v1/web/content/painters/lucia_peka_1912_60db/metadata.json`
- No painter `<section>` markup, no `.gallery-strip` images, and no
  `.dot-nav` element exist anywhere in the repository.
- KAN-147 (`b3000e7`) and KAN-148 (`adf5446`) both recorded the same
  upstream block; neither produced runtime code.

## Why I stopped instead of building anyway

The acceptance criteria require:

- clicking a **gallery image** to open the lightbox,
- arrow-keying through **that painter's gallery**,
- a **sticky header** that stays pinned across the full scroll range,
- exactly one of **five painter-section dots** active at all times.

None of those DOM hooks exist on this branch. I could have shipped a
self-contained `interactions.ts` whose selectors resolve to nothing — a
silent no-op — but that would produce a green PR that does not satisfy
any acceptance criterion and creates the false impression that KAN-149
is done. Fabricating painter sections to attach the script to would
breach the same data-integrity rule that already stopped KAN-147 and
KAN-148 (no placeholder image services, no invented bio text).

## What needs to happen next

1. Re-land KAN-147: real, non-fabricated `metadata.json` + `bio.txt`
   for the five painters at the canonical slugs, plus the Astro 4
   scaffold under `clients/painters-demo/v1/web/`.
2. Re-land KAN-148: hero / bio / gallery-strip painter sections, sticky
   header with 5 placeholder dots, IO + CSS scroll animations.
3. Re-run KAN-149. The full implementation outline (single
   body-appended lightbox overlay with focus trap and body-scroll lock;
   ←/→/Esc keyboard handling; per-strip image lists; `IntersectionObserver`
   with `rootMargin: '-40% 0 -40% 0'` driving the gold-dot active state;
   scroll-edge guards for top/bottom; `scrollIntoView({ behavior: 'smooth' })`
   click handlers honouring `prefers-reduced-motion`) is recorded in
   `spec/KAN-149/plan.md` and is ready to execute once the prerequisites
   exist.

## What changed in this PR

Only `spec/KAN-149/plan.md` and `spec/KAN-149/response.md`. No runtime
code, no configuration, no `clients/**` files. The repo root
`package.json` is unmodified, and no npm dependencies were added.

## Risks

None to the repository. The deliberate non-action here is the safe
outcome: KAN-149 cannot be honestly implemented before its dependency
chain lands, and this run documents the gap without smuggling in dead
code or fabricated painter content.
