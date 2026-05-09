import { test, expect, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHOTS_DIR = process.env.SCREENSHOTS_DIR
  ? resolve(process.env.SCREENSHOTS_DIR)
  : resolve(__dirname, "..", "screenshots");

mkdirSync(SHOTS_DIR, { recursive: true });

const PAINTERS = [
  { id: "section-1", lv: "Janis Rozentāls",   en: "Janis Rozentals",   birth: 1866, death: 1916 },
  { id: "section-2", lv: "Vilhelms Purvītis", en: "Vilhelms Purvitis", birth: 1872, death: 1945 },
  { id: "section-3", lv: "Johans Valters",    en: "Johann Walter",     birth: 1869, death: 1932 },
  { id: "section-4", lv: "Jāzeps Grosvalds",  en: "Jazeps Grosvalds",  birth: 1891, death: 1920 },
  { id: "section-5", lv: "Kārlis Padegs",     en: "Karlis Padegs",     birth: 1911, death: 1940 },
];

async function reduceMotion(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
}

test.describe.configure({ mode: "serial" });

test.describe("Latvian painters gallery — end-to-end journey", () => {
  test("build artefact loads and renders all five painter sections", async ({ page }) => {
    await reduceMotion(page);
    await page.goto("/");
    await expect(page).toHaveTitle(/Latvian Painters/);

    for (const p of PAINTERS) {
      const sec = page.locator(`#${p.id}`);
      await sec.scrollIntoViewIfNeeded();
      await expect(sec, `section ${p.id} visible`).toBeVisible();

      // Hero background image is set via inline style
      const hero = sec.locator(".painter-hero");
      const bgImage = await hero.evaluate((el) => getComputedStyle(el).backgroundImage);
      expect(bgImage, `hero bg for ${p.id}`).toMatch(/url\(.+\)/);

      await expect(sec.locator(".painter-name .name-lv")).toHaveText(p.lv);
      await expect(sec.locator(".painter-years")).toContainText(`${p.birth}`);
      await expect(sec.locator(".painter-years")).toContainText(`${p.death}`);
      await expect(sec.locator(".painter-bio")).not.toBeEmpty();

      const imgs = sec.locator(".gallery-strip .gallery-trigger img");
      await expect(imgs).toHaveCount(4);
      const firstSrc = await imgs.first().getAttribute("src");
      expect(firstSrc, `first gallery img src for ${p.id}`).toMatch(/^https?:\/\//);
      // Lazy-loaded image — give the network up to 20s to actually deliver the bytes.
      await expect
        .poll(
          () => imgs.first().evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
          { timeout: 20_000, message: `first gallery image must load for ${p.id}` },
        )
        .toBe(true);

      const link = sec.locator(".painter-link");
      await expect(link).toContainText("Encyclopaedia Latvija");
      const href = await link.getAttribute("href");
      expect(href, `article href for ${p.id}`).toMatch(/^https?:\/\//);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${SHOTS_DIR}/01-hero-rozentals.png`, fullPage: false });
  });

  test("hovering each painter name reveals the English transliteration", async ({ page }) => {
    await reduceMotion(page);
    await page.goto("/");

    for (const p of PAINTERS) {
      const sec = page.locator(`#${p.id}`);
      await sec.scrollIntoViewIfNeeded();
      const nameEl = sec.locator(".painter-name");
      const en = nameEl.locator(".name-en");

      await expect(en, `transliteration text matches for ${p.id}`).toHaveText(p.en);
      // At rest the English overlay is hidden
      await expect(en).toHaveCSS("opacity", "0");

      await nameEl.hover();
      await expect(en, `transliteration appears on hover for ${p.id}`).toHaveCSS("opacity", "1");

      // Move pointer away so the next iteration starts clean
      await page.mouse.move(0, 0);
    }

    // Capture evidence on the first painter
    const sec = page.locator(`#${PAINTERS[0].id}`);
    await sec.scrollIntoViewIfNeeded();
    await sec.locator(".painter-name").hover();
    await page.screenshot({ path: `${SHOTS_DIR}/02-hover-transliteration.png`, fullPage: false });
  });

  test("lightbox opens, ←/→ navigate, Esc closes", async ({ page }) => {
    await reduceMotion(page);
    await page.goto("/");

    const lightbox = page.locator("#lightbox");
    await expect(lightbox).toHaveAttribute("aria-hidden", "true");

    const sec = page.locator(`#${PAINTERS[0].id}`);
    await sec.scrollIntoViewIfNeeded();

    const triggers = sec.locator(".gallery-trigger");
    await triggers.first().click();

    await expect(lightbox).toHaveAttribute("aria-hidden", "false");
    await expect(lightbox).toHaveClass(/is-open/);

    const img = lightbox.locator(".lightbox-image");
    const initialSrc = await img.getAttribute("src");
    expect(initialSrc, "initial lightbox image src").toBeTruthy();

    await page.screenshot({ path: `${SHOTS_DIR}/03-lightbox-opened.png`, fullPage: false });

    // → advances
    await page.keyboard.press("ArrowRight");
    await expect.poll(async () => img.getAttribute("src")).not.toBe(initialSrc);
    const nextSrc = await img.getAttribute("src");
    await page.screenshot({ path: `${SHOTS_DIR}/04-lightbox-arrow-right.png`, fullPage: false });

    // ← reverses
    await page.keyboard.press("ArrowLeft");
    await expect.poll(async () => img.getAttribute("src")).toBe(initialSrc);
    expect(await img.getAttribute("src")).not.toBe(nextSrc);
    await page.screenshot({ path: `${SHOTS_DIR}/05-lightbox-arrow-left.png`, fullPage: false });

    // Esc closes
    await page.keyboard.press("Escape");
    await expect(lightbox).toHaveAttribute("aria-hidden", "true");
    await expect(lightbox).not.toHaveClass(/is-open/);
  });

  test("active dot in sticky header tracks scroll position", async ({ page }) => {
    await reduceMotion(page);
    await page.goto("/");

    const dot = (id: string) => page.locator(`.dot-nav a[data-target="${id}"]`);

    // Start: section-1 active by default
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(dot("section-1")).toHaveClass(/is-active/);

    // Anchor-click to each section in turn and confirm its dot becomes active
    for (const p of PAINTERS) {
      await dot(p.id).click();
      // Smooth scroll completes; observer fires.
      await expect(dot(p.id), `dot active for ${p.id}`).toHaveClass(/is-active/);

      // No other dot is concurrently active
      for (const other of PAINTERS.filter((x) => x.id !== p.id)) {
        await expect(dot(other.id), `other dots inactive while on ${p.id}`).not.toHaveClass(/is-active/);
      }
    }

    // Land on the middle section for the screenshot
    await dot("section-3").click();
    await expect(dot("section-3")).toHaveClass(/is-active/);
    await page.screenshot({ path: `${SHOTS_DIR}/06-dotnav-active-section-3.png`, fullPage: false });
  });

  test("captures full-page snapshots for each section as evidence", async ({ page }) => {
    await reduceMotion(page);
    await page.goto("/");

    for (const p of PAINTERS) {
      const sec = page.locator(`#${p.id}`);
      await sec.scrollIntoViewIfNeeded();
      // Allow lazy images a moment to swap in
      await page.waitForLoadState("networkidle").catch(() => {});
      await sec.screenshot({ path: `${SHOTS_DIR}/section-${p.id}.png` });
    }
  });
});
