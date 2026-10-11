// This file guarantees copyable TSX preserves the canonical dependency graph without local imports.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import prettier from "prettier";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Inlines named local dependencies while retaining TS types and public root exports. */
export async function composeCopyableSource(
  filename,
  { rootDirectory = root } = {},
) {
  const visited = new Set();
  const visiting = new Set();
  const imports = new Map();
  const bindings = new Map();
  const declarations = new Map();
  const bodies = [];
  function claim(name, identity) {
    if (bindings.has(name) && bindings.get(name) !== identity)
      throw new Error(`${filename}: conflicting import binding ${name}`);
    bindings.set(name, identity);
  }
  function visit(file, isRoot = false) {
    if (visiting.has(file))
      throw new Error(`${filename}: local dependency cycle at ${file}`);
    if (visited.has(file)) return;
    // Copy distribution is limited to the library's implementation graph and shared cn.
    if (!file.startsWith("src/library/") && file !== "src/class-names.ts")
      throw new Error(`${filename}: local dependency outside library: ${file}`);
    visiting.add(file);
    const source = ts.createSourceFile(
      file,
      fs.readFileSync(path.join(rootDirectory, file), "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const body = [];
    for (const statement of source.statements) {
      if (ts.isImportDeclaration(statement)) {
        const specifier = statement.moduleSpecifier.text;
        const clause = statement.importClause;
        if (specifier.startsWith(".")) {
          if (
            !clause ||
            clause.name ||
            !clause.namedBindings ||
            !ts.isNamedImports(clause.namedBindings) ||
            clause.namedBindings.elements.some((e) => e.propertyName)
          )
            throw new Error(
              `${file}: local imports must use unaliased named bindings`,
            );
          const base = path.posix.normalize(
            path.posix.join(path.posix.dirname(file), specifier),
          );
          const dependency = [base, `${base}.ts`, `${base}.tsx`].find(
            (candidate) =>
              fs.existsSync(path.join(rootDirectory, candidate)) &&
              fs.statSync(path.join(rootDirectory, candidate)).isFile(),
          );
          if (!dependency)
            throw new Error(`${file}: missing local dependency ${specifier}`);
          visit(dependency);
          continue;
        }
        if (!clause)
          throw new Error(
            `${file}: unsupported side-effect import ${specifier}`,
          );
        const group = imports.get(specifier) ?? { named: new Map() };
        if (clause.name) {
          claim(clause.name.text, `${specifier}:default`);
          group.defaultName = clause.name.text;
        }
        if (
          clause.namedBindings &&
          ts.isNamespaceImport(clause.namedBindings)
        ) {
          claim(clause.namedBindings.name.text, `${specifier}:*`);
          group.namespace = clause.namedBindings.name.text;
        } else if (clause.namedBindings) {
          for (const entry of clause.namedBindings.elements) {
            const local = entry.name.text;
            const imported = entry.propertyName?.text ?? local;
            claim(local, `${specifier}:${imported}`);
            const typeOnly = clause.isTypeOnly || entry.isTypeOnly;
            group.named.set(local, {
              imported,
              typeOnly: group.named.has(local)
                ? group.named.get(local).typeOnly && typeOnly
                : typeOnly,
            });
          }
        }
        imports.set(specifier, group);
        continue;
      }
      if (
        ts.isExpressionStatement(statement) &&
        ts.isStringLiteral(statement.expression) &&
        statement.expression.text === "use client"
      )
        continue;
      if (
        (ts.isExportDeclaration(statement) &&
          (!isRoot || statement.moduleSpecifier)) ||
        (ts.isExportAssignment(statement) && !isRoot)
      )
        throw new Error(
          `${file}: re-exports/default expressions require explicit integration`,
        );
      if (
        !isRoot &&
        statement.modifiers?.some(
          (m) => m.kind === ts.SyntaxKind.DefaultKeyword,
        )
      )
        throw new Error(
          `${file}: shared dependencies must expose named declarations`,
        );
      const names = ts.isVariableStatement(statement)
        ? statement.declarationList.declarations.map((d) =>
            d.name.getText(source),
          )
        : statement.name
          ? [statement.name.getText(source)]
          : [];
      for (const name of names) {
        if (declarations.has(name))
          throw new Error(
            `${filename}: duplicate declaration ${name} in ${file} and ${declarations.get(name)}`,
          );
        declarations.set(name, file);
      }
      const text = statement.getFullText(source);
      body.push(
        isRoot
          ? text
          : text.replace(
              /\bexport\s+(?=(?:async\s+)?(?:function|const|let|class|type|interface|enum)\b)/,
              "",
            ),
      );
    }
    visiting.delete(file);
    visited.add(file);
    bodies.push(body.join("\n"));
  }
  visit(filename, true);
  const importText = [];
  for (const [specifier, group] of imports) {
    const named = [...group.named]
      .map(
        ([local, entry]) =>
          `${entry.typeOnly ? "type " : ""}${entry.imported}${entry.imported === local ? "" : ` as ${local}`}`,
      )
      .join(", ");
    if (group.namespace)
      importText.push(
        `import * as ${group.namespace} from ${JSON.stringify(specifier)};`,
      );
    if (group.defaultName || named)
      importText.push(
        `import ${[group.defaultName, named ? `{ ${named} }` : undefined].filter(Boolean).join(", ")} from ${JSON.stringify(specifier)};`,
      );
  }
  return prettier.format(
    `"use client";\n// Generated from the canonical library dependency graph. Edit components/primitives instead.\n${importText.join("\n")}\n${bodies.join("\n")}`,
    { parser: "typescript" },
  );
}

export async function buildCopyableSources() {
  const output = path.join(root, "src/library/distribution");
  fs.mkdirSync(output, { recursive: true });
  const files = fs
    .readdirSync(path.join(root, "src/library/components"))
    .filter((f) => f.endsWith(".tsx"));
  for (const name of files) {
    const content = await composeCopyableSource(
      `src/library/components/${name}`,
    );
    const target = path.join(output, name);
    // Deterministic regeneration must not reset an interactive Vite preview.
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== content)
      fs.writeFileSync(target, content);
  }
  for (const name of fs.readdirSync(output))
    if (name.endsWith(".tsx") && !files.includes(name))
      fs.unlinkSync(path.join(output, name));
  console.log(
    `Composed ${files.length} standalone TSX sources from shared library modules.`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await buildCopyableSources();
