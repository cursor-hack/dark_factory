import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const script = join(root, ".github", "scripts", "jira-product-deploy.mjs");

test("prepare-outputs normalises and validates slugs", () => {
  const out = mkdtempSync(join(tmpdir(), "ghout-"));
  const outFile = join(out, "gh.txt");
  const r = spawnSync(
    process.execPath,
    [script, "prepare-outputs"],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        GITHUB_OUTPUT: outFile,
        ISSUE_KEY_IN: "kan-99",
        CLIENT_IN: "Example",
        DELIVERY_IN: "demo",
      },
    },
  );
  assert.equal(r.status, 0, r.stderr);
  const body = readFileSync(outFile, "utf8");
  assert.match(body, /issue_key=KAN-99/);
  assert.match(body, /client_slug=example/);
  assert.match(body, /delivery_slug=demo/);
  assert.match(body, /env_name=product-deploy-example-demo/);
  assert.match(body, /web_root=clients\/example\/demo\/web/);
});

test("prepare-outputs rejects bad issue key", () => {
  const out = mkdtempSync(join(tmpdir(), "ghout-"));
  const outFile = join(out, "gh2.txt");
  const r = spawnSync(process.execPath, [script, "prepare-outputs"], {
    encoding: "utf8",
    env: {
      ...process.env,
      GITHUB_OUTPUT: outFile,
      ISSUE_KEY_IN: "bad",
      CLIENT_IN: "a",
      DELIVERY_IN: "b",
    },
  });
  assert.notEqual(r.status, 0);
});
