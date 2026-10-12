// This file guarantees public AI docs match the current component distribution and survive the build.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { buildLlms } from "../scripts/build-llms.mjs";

test("AI docs include every public component and its complete canonical source", () => {
  const entries = buildLlms();
  const index = fs.readFileSync("public/llms.txt", "utf8");
  const full = fs.readFileSync("public/llms-full.txt", "utf8");
  for (const entry of entries) {
    const item = JSON.parse(
      fs.readFileSync(`public/r/${entry.id}.json`, "utf8"),
    );
    assert.ok(index.includes(`detail.html?t=${entry.id}`));
    assert.ok(
      full.includes(
        item.files.find((file) => file.type === "registry:component").content,
      ),
    );
    assert.ok(
      full.includes(
        `npx shadcn@latest add https://ui.0xdope.com/r/${entry.id}.json`,
      ),
    );
  }
  assert.ok(index.includes("/introduction"));
  assert.ok(index.includes("/llms-full.txt"));
  assert.ok(full.includes("foundation.css"));
  for (const name of ["llms.txt", "llms-full.txt"]) {
    assert.equal(
      fs.readFileSync(`dist/client/${name}`, "utf8"),
      fs.readFileSync(`public/${name}`, "utf8"),
    );
  }
});
test("unchanged AI docs are not rewritten", () => {
  const before = fs.statSync("public/llms-full.txt").mtimeMs;
  buildLlms();
  assert.equal(fs.statSync("public/llms-full.txt").mtimeMs, before);
});
