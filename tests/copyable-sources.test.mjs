// This file guarantees sharing runtime modules never leaves unresolved copy imports.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { composeCopyableSource } from "../scripts/build-copyable-sources.mjs";

function fixture(t, files) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "dope-copy-graph-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(directory, name)), { recursive: true });
    fs.writeFileSync(path.join(directory, name), content);
  }
  return { rootDirectory: directory };
}

test("all distributions are derived from the current canonical graph", async () => {
  for (const file of fs
    .readdirSync("src/library/components")
    .filter((f) => f.endsWith(".tsx"))) {
    const expected = await composeCopyableSource(
      `src/library/components/${file}`,
    );
    assert.equal(
      fs.readFileSync(`src/library/distribution/${file}`, "utf8"),
      expected,
      file,
    );
    assert.doesNotMatch(expected, /from ["']\.{1,2}\//);
  }
});

test("shared imports and types are merged once while root exports survive", async (t) => {
  const options = fixture(t, {
    "src/library/components/example.tsx":
      'import { useState, type ReactNode } from "react"; import { Shared } from "../primitives/shared"; export default function Example({children}:{children:ReactNode}) { const [value]=useState(0); return <Shared>{children}{value}</Shared>; }',
    "src/library/primitives/shared.tsx":
      'import type { ReactNode } from "react"; export function Shared({children}:{children:ReactNode}) { return <div>{children}</div>; }',
  });
  const source = await composeCopyableSource(
    "src/library/components/example.tsx",
    options,
  );
  assert.equal((source.match(/from "react"/g) ?? []).length, 1);
  assert.match(source, /function Shared/);
  assert.match(source, /export default function Example/);
  assert.doesNotMatch(source, /export function Shared|from "\.\./);
});

test("cycles and conflicting declarations fail instead of emitting invalid copy code", async (t) => {
  const cycle = fixture(t, {
    "src/library/components/a.tsx":
      'import { b } from "../primitives/b"; export const a = b;',
    "src/library/primitives/b.tsx":
      'import { a } from "../components/a"; export const b = a;',
  });
  await assert.rejects(
    composeCopyableSource("src/library/components/a.tsx", cycle),
    /dependency cycle/,
  );
  const collision = fixture(t, {
    "src/library/components/a.tsx":
      'import { b } from "../primitives/b"; const common = 1; export const a = b + common;',
    "src/library/primitives/b.tsx":
      "const common = 2; export const b = common;",
  });
  await assert.rejects(
    composeCopyableSource("src/library/components/a.tsx", collision),
    /duplicate declaration common/,
  );
});
