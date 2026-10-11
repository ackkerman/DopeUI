// This file guarantees that production assets ship the original upstream license texts.
import {
  readFileSync,
  mkdirSync,
  writeFileSync,
  existsSync,
  readdirSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// Identical generated files must not reset interactive Vite previews during checks.
function writeIfChanged(file, content) {
  if (existsSync(file) && readFileSync(file, "utf8") === content) return;
  writeFileSync(file, content);
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");
const upstream = [
  ["loading-dev", "MIT", "LICENSE.md"],
  ["svg-dotted-map", "MIT", "LICENSE"],
  ["cobe", "MIT", "LICENSE"],
  ["phenomenon", "MIT", "LICENSE"],
  ["class-variance-authority", "Apache-2.0", "LICENSE"],
  ["rough-notation", "MIT", "LICENSE"],
  ["clsx", "MIT", "license"],
  ["tailwind-merge", "MIT", "LICENSE.md"],
  ["tailwindcss", "MIT", "LICENSE"],
  ["shadow-plugin", "MIT", "LICENSE"],
  ["glimm", "MIT", "LICENSE"],
  ["motion", "MIT", "LICENSE.md"],
  ["framer-motion", "MIT", "LICENSE.md"],
  ["motion-dom", "MIT", "LICENSE.md"],
  ["motion-utils", "MIT", "LICENSE.md"],
  ["flubber", "MIT", "LICENSE"],
  ["@radix-ui/react-slot", "MIT", "LICENSE"],
  ["@radix-ui/react-compose-refs", "MIT", "LICENSE"],
  ["recharts", "MIT", "LICENSE"],
  ["react", "MIT", "LICENSE"],
  ["react-dom", "MIT", "LICENSE"],
  ["scheduler", "MIT", "LICENSE"],
  ["prismjs", "MIT", "LICENSE"],
  ["lucide-react", "ISC and MIT (Feather-derived icons)", "LICENSE"],
  ["@fontsource/inter", "SIL Open Font License 1.1", "LICENSE"],
  ["vite", "MIT and bundled notices", "LICENSE.md"],
];
const knownNames = new Set(upstream.map(([name]) => name));
for (const name of readdirSync("node_modules/@radix-ui")) {
  const packageName = `@radix-ui/${name}`;
  if (
    !knownNames.has(packageName) &&
    existsSync(`node_modules/${packageName}/LICENSE`)
  ) {
    upstream.push([packageName, "MIT", "LICENSE"]);
  }
}
mkdirSync(publicRoot, { recursive: true });
writeIfChanged(
  path.join(publicRoot, "LICENSE.txt"),
  readFileSync(path.join(root, "LICENSE"), "utf8"),
);
let notices =
  "Third-party notices for dope/ui\n\nThe MIT license in LICENSE.txt applies to original dope/ui code.\nThird-party code, icon geometry and font software retain the licenses below.\n\n";
for (const [name, license, filename] of upstream) {
  const folder = path.join(root, "node_modules", name);
  const metadata = JSON.parse(
    readFileSync(path.join(folder, "package.json"), "utf8"),
  );
  const text = readFileSync(path.join(folder, filename), "utf8");
  notices += `\n${"=".repeat(72)}\n${name}@${metadata.version} — ${license}\n${"=".repeat(72)}\n\n${text}\n`;
}
const documentedSources = JSON.parse(
  readFileSync(path.join(root, "licenses/source-notices.json"), "utf8"),
);
for (const { label, file } of documentedSources)
  notices += `\n${label}\n${readFileSync(path.join(root, file), "utf8")}\n`;
for (const file of [
  "media-notices.txt",
  "code-attributions.txt",
  "component-provenance.json",
])
  notices +=
    "\n" + readFileSync(path.join(root, "licenses", file), "utf8");
notices +=
  "\n" +
  readFileSync(path.join(root, "licenses/component-notices.txt"), "utf8");
writeIfChanged(path.join(root, "THIRD_PARTY_NOTICES.txt"), notices);
writeIfChanged(path.join(publicRoot, "THIRD_PARTY_NOTICES.txt"), notices);
console.log(
  `Prepared MIT license and ${upstream.length} upstream license notices.`,
);

const foundation = [
  "foundation.css",
  "frost-colors.css",
  "frost-components.css",
  "component-system.css",
]
  .map((name) => readFileSync("src/library/" + name, "utf8"))
  .join("\n");
mkdirSync("public/library", { recursive: true });
writeIfChanged("public/library/foundation.css", foundation);
writeIfChanged("src/library/foundation.txt", foundation);
