// This file guarantees AI-readable docs stay aligned with the catalogue and canonical Registry sources.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = "https://ui.0xdope.com";
function catalog() {
  const file = ts.createSourceFile(
    "catalog.ts",
    fs.readFileSync(path.join(root, "src/catalog.ts"), "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const entries = [];
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const item = {};
      for (const field of node.properties) {
        if (
          ts.isPropertyAssignment(field) &&
          ts.isStringLiteral(field.initializer)
        )
          item[field.name.getText(file)] = field.initializer.text;
      }
      if (item.id && item.title && item.category) entries.push(item);
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  return entries;
}
const overview = `# dope/ui

> Editable React components with thoughtful motion and shared styles.

Built for React 19 and Tailwind CSS v4. Add components with the shadcn CLI or copy their React source. Components live in your project and can be customized. Install the dependencies listed for each component and load the shared foundation once.

## Documentation

- [Introduction](${base}/introduction): Overview, editable code, composition, styles and motion.
- [Installation](${base}/installation): Project setup, shadcn CLI, shared styles and manual installation.
- [Colors](${base}/colors.html): FROST palette, semantic tokens and theme examples.
- [Library](${base}/library): Interactive component previews.
- [Registry](${base}/r/registry.json): Machine-readable component sources and dependencies.
- [Full documentation](${base}/llms-full.txt): Setup instructions and complete component source.
`;
const installation = `## Installation

1. Prepare a React 19 project with Tailwind CSS v4 configured for your framework.
2. If components.json does not exist, run \`npx shadcn@latest init\`.
3. Install a component, for example:

\`\`\`sh
npx shadcn@latest add ${base}/r/like.json
\`\`\`

4. Import the installed foundation.css once from your global CSS. With src/components as the components alias and src/index.css as the entry:

\`\`\`css
@import "./components/dope-ui/foundation.css";
\`\`\`

The foundation includes Tailwind and shadow-plugin; avoid duplicate Tailwind imports. Adjust the path to your components alias. Follow the component's exports and props in its source. Keep the use client directive for Next.js. The Registry includes required runtime and development dependencies plus LICENSE.txt.

For manual use, save the component source below as a TSX file, install its dependencies, download [foundation.css](${base}/library/foundation.css), and import the foundation once. Keep the included license when redistributing. Shared style tokens are documented on the Colors page. Reduced-motion handling and keyboard interaction should be preserved when customizing.
`;
export function buildLlms() {
  const entries = catalog();
  let index = overview;
  for (const category of [...new Set(entries.map((entry) => entry.category))]) {
    index += `\n## ${category}\n\n`;
    for (const entry of entries.filter((entry) => entry.category === category))
      index += `- [${entry.title}](${base}/detail.html?t=${entry.id}): ${entry.description ?? "Editable React component."}\n`;
  }
  let full = `${overview}\n${installation}\n## Components\n`;
  for (const entry of entries) {
    const item = JSON.parse(
      fs.readFileSync(path.join(root, `public/r/${entry.id}.json`), "utf8"),
    );
    const source = item.files.find(
      (file) => file.type === "registry:component",
    );
    if (!source?.content)
      throw new Error(`llms-full: missing canonical source for ${entry.id}`);
    full += `\n### ${entry.title}\n\n${entry.description ?? item.description}\n\nCategory: ${entry.category}\n\nPreview: ${base}/detail.html?t=${entry.id}\nRegistry: ${base}/r/${entry.id}.json\n\nInstall: \`npx shadcn@latest add ${base}/r/${entry.id}.json\`\n\nRuntime dependencies: ${item.dependencies.join(", ")}\nDevelopment dependencies: ${(item.devDependencies ?? []).join(", ") || "None"}\n\n${item.docs}\n\n#### Source: ${path.basename(source.path)}\n\n\`\`\`tsx\n${source.content}\n\`\`\`\n`;
  }
  for (const [name, content] of [
    ["llms.txt", index],
    ["llms-full.txt", full],
  ]) {
    const target = path.join(root, "public", name);
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== content)
      fs.writeFileSync(target, content);
  }
  return entries;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  buildLlms();
