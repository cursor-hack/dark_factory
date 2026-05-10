---
name: dark-factory-product-web
description: >-
  Repo contract for product web apps under clients/<client>/<delivery>/web/.
  Auto-invoke whenever a task creates, edits, builds, or deploys files inside
  clients/**/web/, touches an npm build script under that path, or mentions
  GitHub Pages product deploy in this repository. Covers required folder
  structure, npm run build → dist/ contract, and the jira_deploy_product
  dispatch flow.
---

# Dark Factory product web delivery

## Repository contract

- **Root:** `clients/<client>/<delivery>/web/` (`client` and `delivery` are lowercase slugs: letters, digits, hyphens).
- **Build:** `package.json` must define `npm run build`.
- **Output:** build must produce static files under **`dist/`** (required for deploy).
- **Deploy:** Jira `jira_deploy_product` dispatch; workflow builds from **`main`**. Merge before expecting Deploy to reflect changes.
- **Hosting:** GitHub Pages — **one site per repo**; last successful deploy wins. If asset URLs break on Pages, check base path and routing for static hosting.

Full detail: [docs/product-deploy.md](../../../docs/product-deploy.md).

## Scaffold

Reference tree: `clients/example/demo/web/` (`build.mjs` writes `dist/index.html`). Replace with a real toolchain (Vite, Astro, etc.) as long as **`npm run build` → `dist/`** holds.

## Agent checklist

- [ ] Changes live under the correct `clients/<client>/<delivery>/web/` path.
- [ ] `npm run build` completes and **`dist/`** contains the shipped HTML/CSS/JS/assets.
- [ ] No secrets in client bundles or repo files.
- [ ] Call out unverified visual or cross-browser risk in the plan or PR notes when not tested locally.

For page quality (layout, performance, accessibility, SEO), use the **landing-page-frontend** skill alongside this one.
