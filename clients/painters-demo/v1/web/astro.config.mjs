import { defineConfig } from "astro/config";

// GitHub Pages project URL: https://cursor-hack.github.io/dark_factory/
export default defineConfig({
  site: "https://cursor-hack.github.io",
  base: "/dark_factory/",
  output: "static",
  trailingSlash: "ignore",
  build: {
    assets: "_astro",
  },
});
