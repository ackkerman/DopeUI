// This file guarantees shadcn payloads distribute canonical sources without evaluating them.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { buildLlms } from "./build-llms.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const parse = (file) =>
  ts.createSourceFile(
    file,
    read(file),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
const packageName = (specifier) =>
  specifier.startsWith("@")
    ? specifier.split("/").slice(0, 2).join("/")
    : specifier.split("/")[0];

/** Reads the site's declared source paths and dependencies without importing preview components. */
export function readRegistryEntries() {
  const source = parse("src/library/registry.ts");
  const entries = [];
  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      node.name.getText(source) === "libraryEntries"
    ) {
      if (!ts.isObjectLiteralExpression(node.initializer))
        throw new Error("libraryEntries must be an object literal");
      for (const property of node.initializer.properties) {
        const name = ts.isStringLiteral(property.name)
          ? property.name.text
          : property.name.getText(source);
        const fields = new Map(
          property.initializer.properties.map((field) => [
            field.name.getText(source),
            field.initializer,
          ]),
        );
        const imports = [];
        function findImport(child) {
          if (
            ts.isCallExpression(child) &&
            child.expression.kind === ts.SyntaxKind.ImportKeyword
          )
            imports.push(child.arguments[0].text);
          ts.forEachChild(child, findImport);
        }
        findImport(fields.get("loadSource"));
        if (imports.length !== 1 || !imports[0].endsWith(".tsx?raw"))
          throw new Error(`${name}: expected one canonical TSX raw import`);
        const sourcePath = path.posix.join(
          "src/library",
          imports[0].replace(/\?raw$/, ""),
        );
        if (!sourcePath.startsWith("src/library/distribution/"))
          throw new Error(
            `${name}: distribution source escapes library directory`,
          );
        entries.push({
          name,
          sourcePath,
          filename: fields.get("filename").text,
          dependencies: fields
            .get("dependencies")
            .elements.map((item) => item.text),
        });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (!entries.length) throw new Error("No library entries found");
  return entries;
}

/** Fails on undeclared runtime imports or internal files absent from the distribution. */
export function verifyImports(entry) {
  const source = parse(entry.sourcePath);
  function visit(node) {
    let specifier;
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier
    )
      specifier = node.moduleSpecifier.text;
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword
    )
      specifier = node.arguments[0]?.text;
    if (specifier) {
      if (
        specifier.startsWith(".") ||
        specifier.startsWith("/") ||
        specifier.startsWith("@/")
      )
        throw new Error(
          `${entry.name}: distribution contains unresolved local import ${specifier}`,
        );
      const dependency = packageName(specifier);
      // Type-only imports also need declarations in the consumer; validate them equally.
      if (!entry.dependencies.includes(dependency))
        throw new Error(`${entry.name}: undeclared dependency ${dependency}`);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

/** Uses catalogue titles for public labels while keeping stable install ids. */
function readCatalogTitles() {
  const source = parse("src/catalog.ts");
  const titles = new Map();
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const fields = new Map(
        node.properties
          .filter(ts.isPropertyAssignment)
          .map((field) => [field.name.getText(source), field.initializer]),
      );
      const id = fields.get("id");
      const title = fields.get("title");
      if (id && title && ts.isStringLiteral(id) && ts.isStringLiteral(title))
        titles.set(id.text, title.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return titles;
}

export function createRegistryItems() {
  const titles = readCatalogTitles();
  const pkg = JSON.parse(read("package.json"));
  const versions = { ...pkg.dependencies, ...pkg.devDependencies };
  const sharedFiles = [
    {
      path: "foundation.css",
      type: "registry:file",
      target: "components/dope-ui/foundation.css",
      content: read("src/library/foundation.txt"),
    },
    {
      path: "LICENSE.txt",
      type: "registry:file",
      target: "components/dope-ui/LICENSE.txt",
      content: read("LICENSE"),
    },
  ];
  return readRegistryEntries().map((entry) => {
    verifyImports(entry);
    return {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: entry.name,
      type: "registry:component",
      title: titles.get(entry.name) ?? entry.filename.replace(/\.tsx$/, ""),
      description:
        "Editable dope/ui React component with shared Tailwind v4 styles and redistribution notices.",
      author: "dope/ui contributors",
      dependencies: [...new Set([...entry.dependencies, "shadow-plugin"])].map(
        (name) => {
          if (!versions[name])
            throw new Error(
              `${entry.name}: dependency ${name} has no supported version`,
            );
          return `${name}@${versions[name]}`;
        },
      ),
      devDependencies: entry.dependencies
        .map((name) => `@types/${name.replace(/^@/, "").replace("/", "__")}`)
        .filter((name) => pkg.devDependencies[name])
        .map((name) => `${name}@${pkg.devDependencies[name]}`),
      files: [
        {
          path: entry.sourcePath,
          type: "registry:component",
          content: read(entry.sourcePath),
        },
        ...sharedFiles,
      ],
      docs: "Requires React 19 and Tailwind CSS v4. Import components/dope-ui/foundation.css once from your global CSS (adjust the relative path). The component is installed under your components alias.",
      meta: { license: "MIT", source: entry.sourcePath },
    };
  });
}

function writeIfChanged(file, content) {
  if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== content)
    fs.writeFileSync(file, content);
}
export function buildRegistry() {
  const items = createRegistryItems();
  const output = path.join(root, "public/r");
  fs.mkdirSync(output, { recursive: true });
  for (const item of items)
    writeIfChanged(
      path.join(output, `${item.name}.json`),
      JSON.stringify(item, null, 2) + "\n",
    );
  const index = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "dope-ui",
    homepage: "https://ui.0xdope.com",
    items: items.map(({ files, ...item }) => ({
      ...item,
      files: files.map(({ content, ...file }) => file),
    })),
  };
  writeIfChanged(
    path.join(output, "registry.json"),
    JSON.stringify(index, null, 2) + "\n",
  );
  // Remove only previously generated item JSON; retired ids must not remain installable.
  const current = new Set([
    "registry.json",
    ...items.map((item) => `${item.name}.json`),
  ]);
  for (const file of fs.readdirSync(output))
    if (file.endsWith(".json") && !current.has(file))
      fs.unlinkSync(path.join(output, file));
  console.log(`Built ${items.length} shadcn registry items in public/r.`);
  buildLlms();
  return items;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  buildRegistry();
