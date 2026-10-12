// This file guarantees every served registry item preserves its source and redistribution contract.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  buildRegistry,
  readRegistryEntries,
  verifyImports,
} from "../scripts/build-registry.mjs";

test("all registry sources, dependencies and license files survive generation and production build", () => {
  const entries = readRegistryEntries();
  assert.equal(
    fs.readFileSync("public/THIRD_PARTY_NOTICES.txt", "utf8"),
    fs.readFileSync("THIRD_PARTY_NOTICES.txt", "utf8"),
  );
  const index = JSON.parse(fs.readFileSync("public/r/registry.json", "utf8"));
  assert.equal(index.items.length, entries.length);
  assert.equal(index.homepage, "https://ui.0xdope.com");
  assert.ok(
    index.items.every((item) =>
      item.files.every((file) => !("content" in file)),
    ),
  );
  assert.equal(
    new Set(index.items.map((item) => item.name)).size,
    entries.length,
  );
  for (const entry of entries) {
    const raw = fs.readFileSync(`public/r/${entry.name}.json`, "utf8");
    const item = JSON.parse(raw);
    assert.equal(item.name, entry.name);
    assert.equal(item.type, "registry:component");
    assert.equal(
      item.title
        .replaceAll(" ", "")
        .replace(/^3D/, "ThreeD")
        .replace(/^iPhone/, "IPhone"),
      entry.filename.replace(/\.tsx$/, ""),
    );
    assert.ok(!item.title.endsWith("Demo"));
    assert.equal(
      item.files[0].content,
      fs.readFileSync(entry.sourcePath, "utf8"),
    );
    assert.deepEqual(
      item.files.slice(1).map((file) => file.target),
      [
        "components/dope-ui/foundation.css",
        "components/dope-ui/LICENSE.txt",
      ],
    );
    for (const [target, source] of [
      ["foundation.css", "src/library/foundation.txt"],
      ["LICENSE.txt", "LICENSE"],
    ]) {
      assert.equal(
        item.files.find((file) => file.path === target).content,
        fs.readFileSync(source, "utf8"),
      );
    }
    assert.ok(
      item.dependencies.some((dependency) =>
        dependency.startsWith("shadow-plugin@"),
      ),
    );
    verifyImports(entry);
    assert.equal(
      fs.readFileSync(`dist/client/r/${entry.name}.json`, "utf8"),
      raw,
    );
  }
});

test("regeneration does not rewrite unchanged payloads", () => {
  const before = fs.statSync("public/r/like.json").mtimeMs;
  buildRegistry();
  assert.equal(fs.statSync("public/r/like.json").mtimeMs, before);
});

test("missing runtime dependencies fail with an actionable component name", () => {
  const entry = readRegistryEntries().find((entry) => entry.name === "like");
  assert.throws(
    () => verifyImports({ ...entry, dependencies: [] }),
    /like: undeclared dependency react/,
  );
});
