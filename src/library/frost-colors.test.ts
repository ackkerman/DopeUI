import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import postcss from "postcss";
import {
  getFrostRamp,
  frostShades,
  frostColorFamilies,
  nordColors,
  frostExtensions,
  frostBrands,
  getFrostTokens,
  frostContrast,
  createFrostStylesheet,
  type FrostBrand,
} from "./frost-colors";
const brands = Object.keys(frostBrands) as FrostBrand[];
describe("FROST color contracts", () => {
  it("retains all sixteen official Nord primitives and seven original pastel extensions", () => {
    expect(nordColors).toEqual([
      "#2E3440",
      "#3B4252",
      "#434C5E",
      "#4C566A",
      "#D8DEE9",
      "#E5E9F0",
      "#ECEFF4",
      "#8FBCBB",
      "#88C0D0",
      "#81A1C1",
      "#5E81AC",
      "#BF616A",
      "#D08770",
      "#EBCB8B",
      "#A3BE8C",
      "#B48EAD",
    ]);
    expect(Object.keys(frostExtensions)).toHaveLength(7);
  });
  it("keeps text and action states above 4.5:1 for both modes and every brand", () => {
    for (const theme of ["light", "dark"] as const)
      for (const brand of brands) {
        const tokens = getFrostTokens(theme, brand);
        for (const role of ["primary", "secondary", "accent"]) {
          for (const state of ["", "-hover", "-pressed"])
            expect(
              frostContrast(tokens[role + state], tokens[role + "-foreground"]),
              `${theme}/${brand}/${role}${state}`,
            ).toBeGreaterThanOrEqual(4.5);
        }
        for (const role of ["success", "warning", "danger"]) {
          expect(
            frostContrast(tokens[role], tokens[role + "-foreground"]),
            `${theme}/${brand}/${role}`,
          ).toBeGreaterThanOrEqual(4.5);
          for (const surface of ["background", "surface"])
            expect(
              frostContrast(tokens[role + "-text"], tokens[surface]),
            ).toBeGreaterThanOrEqual(4.5);
        }
        for (const surface of ["background", "surface", "surface-raised"]) {
          expect(
            frostContrast(tokens.foreground, tokens[surface]),
          ).toBeGreaterThanOrEqual(4.5);
          expect(
            frostContrast(tokens["foreground-muted"], tokens[surface]),
          ).toBeGreaterThanOrEqual(4.5);
          expect(
            frostContrast(tokens["focus-ring"], tokens[surface]),
          ).toBeGreaterThanOrEqual(3);
          expect(
            frostContrast(tokens["control-border"], tokens[surface]),
          ).toBeGreaterThanOrEqual(3);
        }
      }
  });
  it("changes brand actions without changing Nord surfaces", () => {
    for (const theme of ["light", "dark"] as const)
      for (const brand of brands) {
        const tokens = getFrostTokens(theme, brand),
          base = getFrostTokens(theme);
        for (const key of [
          "background",
          "surface",
          "surface-raised",
          "foreground",
          "border",
        ])
          expect(tokens[key]).toBe(base[key]);
        expect(tokens.accent).toBe(frostBrands[brand].fill);
      }
  });
  it("keeps generated browser CSS synchronized and scopes generic aliases", () => {
    const normalize = (css: string) => {
      const rules: Record<string, Record<string, string>> = {};
      postcss.parse(css).walkRules((rule) => {
        const values: Record<string, string> = {};
        rule.walkDecls((decl) => {
          values[decl.prop] = decl.value.replace(/#[a-f0-9]{6}/gi, (hex) =>
            hex.toUpperCase(),
          );
        });
        rules[rule.selector] = values;
      });
      return rules;
    };
    const css = readFileSync("src/library/frost-colors.css", "utf8");
    expect(normalize(css)).toEqual(normalize(createFrostStylesheet()));
    postcss
      .parse(css)
      .walkRules((rule) =>
        rule.walkDecls("--background", () =>
          expect(rule.selector.startsWith("[data-frost]")).toBe(true),
        ),
      );
  });
  it("rejects malformed HEX values instead of returning misleading contrast", () => {
    expect(() => frostContrast("red", "#FFFFFF")).toThrow("six-digit HEX");
    expect(frostContrast("#000000", "#FFFFFF")).toBe(21);
  });
});

it("preserves the base shade and progressively darkens each color family", () => {
  for (const family of Object.values(frostColorFamilies)) {
    const ramp = getFrostRamp(family.value);
    expect(ramp[500]).toBe(family.value);
    let previous = 21;
    for (const shade of frostShades) {
      const contrast = frostContrast(ramp[shade], "#000000");
      expect(contrast).toBeLessThanOrEqual(previous);
      previous = contrast;
    }
  }
});
