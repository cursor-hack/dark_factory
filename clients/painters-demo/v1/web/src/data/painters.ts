import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const contentRoot = join(here, "..", "..", "content", "painters");

export interface PainterMetadata {
  archive_id: string;
  name_lv: string;
  name_en: string;
  birth_year: string | null;
  death_year: string | null;
  article_url: string | null;
  profile_image_url: string | null;
  gallery_urls: string[];
}

export interface Painter {
  meta: PainterMetadata;
  bio: string;
}

// Display order — chronological by birth year.
const ORDER = [
  "karlis_huns_1831_3f3c",
  "jazeps_grosvalds_1891_72b1",
  "voldemars_irbe_1893_f992",
  "karlis_padegs_1911_0e0a",
  "lucia_peka_1912_60db",
];

function loadPainter(slug: string): Painter {
  const meta = JSON.parse(
    readFileSync(join(contentRoot, slug, "metadata.json"), "utf8"),
  ) as PainterMetadata;
  const bio = readFileSync(join(contentRoot, slug, "bio.txt"), "utf8");
  return { meta, bio };
}

export const painters: Painter[] = ORDER.map(loadPainter);

export function lifespan(p: PainterMetadata): string {
  if (p.birth_year && p.death_year) return `${p.birth_year}–${p.death_year}`;
  if (p.birth_year) return `b. ${p.birth_year}`;
  return "";
}

export function bioParagraphs(bio: string, name_lv: string): string[] {
  const trimmed = bio.replace(/\r\n/g, "\n").trim();
  const paragraphs = trimmed.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  // Strip the leading "Name (1893–1944)" header line if it duplicates the heading.
  if (paragraphs.length > 0) {
    const first = paragraphs[0]!;
    const looksLikeHeader =
      first.length < 80 && first.includes(name_lv) && /\(\d{4}/.test(first);
    if (looksLikeHeader) paragraphs.shift();
  }
  return paragraphs;
}
