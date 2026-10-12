import ts from "typescript";
import { describe, expect, it } from "vitest";
import { demos, filterDemos } from "./catalog";
import { libraryEntries } from "./library/registry";
import { reactComponentName } from "./react-demo-source";
import { getDemoSource } from "./demo-source";

describe("library discovery", () => {
  it("combines category and case-insensitive trimmed search", () => {
    // Given a query with whitespace, when category also applies, then both must match.
    const found = filterDemos("  dRoPdOwN  ", "Essential", "featured");
    expect(found.map((d) => d.id)).toEqual(["dropdown"]);
  });
  it("returns an empty collection for an unknown query", () => {
    expect(filterDemos("unfindable", "All", "featured")).toEqual([]);
  });
  it("sorts by title while preserving the curated catalogue", () => {
    const before = demos.map((d) => d.id);
    const sorted = filterDemos("", "All", "az");
    expect(
      sorted.every(
        (demo, index) =>
          index === 0 || sorted[index - 1].title.localeCompare(demo.title) <= 0,
      ),
    ).toBe(true);
    expect(filterDemos("", "All", "za").map((d) => d.id)).toEqual(
      sorted.map((d) => d.id).reverse(),
    );
    expect(demos.map((d) => d.id)).toEqual(before);
  });
  it("provides unique entries with complete runnable source tabs", async () => {
    expect(demos.some((demo) => demo.id === "notification-pop")).toBe(false);
    expect(new Set(demos.map((d) => d.id)).size).toBe(demos.length);
    for (const demo of demos) {
      const source = await getDemoSource(demo);
      expect(source.React).toContain("export default function");
      expect(source.CSS).toContain("prefers-reduced-motion");
      expect(source.React).not.toContain("demo.css");
    }
  });
});

describe("React implementation examples", () => {
  it("provides syntactically valid TSX and matching CSS for all demos", async () => {
    for (const demo of demos) {
      const source = await getDemoSource(demo);
      const result = ts.transpileModule(source.React, {
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
        fileName: `${demo.id}.tsx`,
        reportDiagnostics: true,
      });
      expect(result.diagnostics, demo.id).toEqual([]);
      expect(source.React).toContain("export default function");
      expect(source.React).toContain("twMerge(clsx(values))");
      expect(source.React).not.toContain("./demo.css");
      expect(source.CSS).toContain(`.dui-${demo.id}`);
    }
  }, 15000);
});

it("keeps related roles adjacent in the curated order and after category filtering", () => {
  const ids = filterDemos("", "All", "featured").map((demo) => demo.id);
  for (const family of [
    ["pulsating-button", "interactive-hover-button", "rainbow-button"],
    ["hook-sidebar", "rail-toc", "scroll-progress"],
    ["number-flow", "animated-counter"],
    ["shine-border", "border-beam", "card"],
    ["dotted-map", "globe"],
    ["safari", "iphone", "android"],
  ]) {
    const start = ids.indexOf(family[0]);
    expect(ids.slice(start, start + family.length)).toEqual(family);
  }
  const essentials = filterDemos("", "Essential", "featured").map(
    (demo) => demo.id,
  );
  const start = essentials.indexOf("hook-sidebar");
  expect(essentials.slice(start, start + 3)).toEqual([
    "hook-sidebar",
    "rail-toc",
    "scroll-progress",
  ]);
  expect(new Set(ids).size).toBe(demos.length);
});

it("keeps public labels and download names consistent for every component", () => {
  // Given the catalogue, when a component is downloaded, then its name matches its label.
  expect(new Set(demos.map((demo) => demo.title)).size).toBe(demos.length);
  for (const demo of demos) {
    expect(demo.title, demo.id).toMatch(
      /^(?:[A-Z0-9][A-Za-z0-9]*|iPhone)(?: (?:[A-Z0-9][A-Za-z0-9]*|iPhone|of))*$/,
    );
    expect(demo.title, demo.id).not.toMatch(/Demo$/);
    const componentName = demo.title
      .replaceAll(" ", "")
      .replace(/^3D/, "ThreeD")
      .replace(/^iPhone/, "IPhone");
    expect(libraryEntries[demo.id].filename).toBe(`${componentName}.tsx`);
    expect(reactComponentName(demo.id)).toBe(componentName);
  }
});
