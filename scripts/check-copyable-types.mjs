// This file guarantees each distributable TSX compiles with React types and declared npm imports only.
import fs from "node:fs";
import ts from "typescript";
const files = fs
  .readdirSync("src/library/distribution")
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => `src/library/distribution/${file}`);
const program = ts.createProgram(files, {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  skipLibCheck: true,
  noEmit: true,
  types: ["react"],
});
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (file) => file,
      getCurrentDirectory: () => process.cwd(),
      getNewLine: () => "\n",
    }),
  );
  process.exitCode = 1;
} else
  console.log(
    `Independent React typecheck passed: ${files.length} component files.`,
  );
