import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, "dist");
mkdirSync(dist, { recursive: true });
writeFileSync(
  join(dist, "index.html"),
  `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><title>Example demo</title></head>
<body><h1>Example / demo</h1><p>Replace this tree with a real product web app. Build must write <code>dist/</code>.</p></body>
</html>`,
  "utf8",
);
