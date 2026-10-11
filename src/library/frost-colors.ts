// This file guarantees stable Nord primitives and accessible, scoped FROST semantic colors.
export const nordColors = [
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
] as const;
export const frostExtensions = {
  ice: "#B5E8F7",
  lavender: "#B8A5F8",
  mint: "#91E6C3",
  rose: "#F5A9C6",
  peach: "#FFBFA3",
  lemon: "#F6E58D",
  coral: "#FF8E98",
} as const;
/** A brand changes action and selection colors while retaining Nord surfaces. */
export type FrostBrand = "frost" | "lavender" | "mint" | "rose" | "peach";
/** A theme selects surface and text contrast independently from its brand. */
export type FrostTheme = "light" | "dark";
export const frostBrands: Record<
  FrostBrand,
  { label: string; fill: string; lightPrimary: string }
> = {
  frost: { label: "Frost", fill: nordColors[8], lightPrimary: "#416C91" },
  lavender: {
    label: "Lavender",
    fill: frostExtensions.lavender,
    lightPrimary: "#6753A6",
  },
  mint: { label: "Mint", fill: frostExtensions.mint, lightPrimary: "#28694F" },
  rose: { label: "Rose", fill: frostExtensions.rose, lightPrimary: "#974966" },
  peach: {
    label: "Peach",
    fill: frostExtensions.peach,
    lightPrimary: "#925039",
  },
};
export const frostSwatches = [
  { name: "Polar Night", hex: nordColors[0] },
  { name: "Deep Slate", hex: nordColors[1] },
  { name: "Frost Blue", hex: nordColors[8] },
  { name: "Arctic Sky", hex: nordColors[9] },
  { name: "Ice", hex: frostExtensions.ice },
  { name: "Lavender", hex: frostExtensions.lavender },
  { name: "Mint", hex: frostExtensions.mint },
  { name: "Rose", hex: frostExtensions.rose },
  { name: "Peach", hex: frostExtensions.peach },
  { name: "Lemon", hex: frostExtensions.lemon },
  { name: "Coral", hex: frostExtensions.coral },
  { name: "Snow", hex: nordColors[6] },
] as const;
function channels(hex: string): number[] {
  if (!/^#[\da-f]{6}$/i.test(hex))
    throw new Error(`Frost requires a six-digit HEX color: ${hex}`);
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}
/** Mixes opaque colors in sRGB; no derived value replaces an original primitive. */
export function mixFrostColor(a: string, b: string, amount: number): string {
  const left = channels(a),
    right = channels(b);
  return (
    "#" +
    left
      .map((v, i) =>
        Math.round(v + (right[i] - v) * amount)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
      .toUpperCase()
  );
}
/** Returns the WCAG relative luminance contrast ratio of two opaque HEX colors. */
export function frostContrast(a: string, b: string): number {
  const luminance = (hex: string) =>
    channels(hex)
      .map((v) => {
        const s = v / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      })
      .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
/** Complete resolved semantic tokens for an opt-in FROST scope. */
export type FrostTokens = Record<string, string>;
export function getFrostTokens(
  theme: FrostTheme = "light",
  brand: FrostBrand = "frost",
): FrostTokens {
  const dark = theme === "dark",
    palette = frostBrands[brand];
  const primary = dark ? palette.fill : palette.lightPrimary;
  return {
    background: dark ? nordColors[0] : nordColors[6],
    surface: dark ? nordColors[1] : "#FFFFFF",
    "surface-raised": dark ? nordColors[2] : nordColors[5],
    border: dark ? nordColors[3] : nordColors[4],
    foreground: dark ? nordColors[6] : nordColors[0],
    "foreground-muted": dark ? nordColors[4] : "#59687D",
    primary,
    "primary-foreground": dark ? nordColors[0] : "#FFFFFF",
    "primary-hover": mixFrostColor(
      primary,
      dark ? "#FFFFFF" : nordColors[0],
      dark ? 0.12 : 0.1,
    ),
    "primary-pressed": mixFrostColor(
      primary,
      nordColors[0],
      dark ? 0.12 : 0.25,
    ),
    secondary: frostExtensions.lavender,
    "secondary-foreground": nordColors[0],
    "secondary-hover": mixFrostColor(frostExtensions.lavender, "#FFFFFF", 0.12),
    "secondary-pressed": mixFrostColor(
      frostExtensions.lavender,
      nordColors[0],
      0.12,
    ),
    accent: palette.fill,
    "accent-foreground": nordColors[0],
    "accent-hover": mixFrostColor(palette.fill, "#FFFFFF", 0.12),
    "accent-pressed": mixFrostColor(palette.fill, nordColors[0], 0.12),
    "focus-ring": dark ? palette.fill : palette.lightPrimary,
    "control-border": dark ? nordColors[9] : nordColors[3],
    success: frostExtensions.mint,
    "success-foreground": nordColors[0],
    "success-text": dark ? frostExtensions.mint : "#28694F",
    warning: frostExtensions.lemon,
    "warning-foreground": nordColors[0],
    "warning-text": dark ? frostExtensions.lemon : "#6B5612",
    danger: frostExtensions.coral,
    "danger-foreground": nordColors[0],
    "danger-text": dark ? frostExtensions.coral : "#9D3348",
    "disabled-background": dark ? nordColors[2] : nordColors[5],
    "disabled-foreground": dark ? nordColors[4] : "#59687D",
    "chart-1": nordColors[8],
    "chart-2": frostExtensions.lavender,
    "chart-3": frostExtensions.mint,
    "chart-4": frostExtensions.rose,
    "chart-5": frostExtensions.peach,
    "chart-6": frostExtensions.lemon,
  };
}
/** Produces browser-ready CSS with semantic aliases only inside data-frost containers. */
export function createFrostStylesheet(): string {
  const lines = [
    "/* FROST / 02 — shared color primitives and semantic extensions. */",
    ":root {",
  ];
  nordColors.forEach((hex, i) => lines.push(`  --nord-${i}: ${hex};`));
  Object.entries(frostExtensions).forEach(([key, hex]) =>
    lines.push(`  --frost-${key}: ${hex};`),
  );
  for (const [name, family] of Object.entries(frostColorFamilies))
    for (const [shade, hex] of Object.entries(getFrostRamp(family.value)))
      lines.push(`  --frost-${name}-${shade}: ${hex};`);
  lines.push("}");
  for (const theme of ["light", "dark"] as const)
    for (const brand of Object.keys(frostBrands) as FrostBrand[]) {
      const selector =
        theme === "light" && brand === "frost"
          ? "[data-frost]"
          : `[data-frost][data-theme="${theme}"][data-brand="${brand}"]`;
      lines.push(`${selector} {`, `  color-scheme: ${theme};`);
      Object.entries(getFrostTokens(theme, brand)).forEach(([key, hex]) =>
        lines.push(`  --frost-${key}: ${hex};`),
      );
      lines.push("}");
    }
  lines.push('[data-frost][data-theme="dark"]:not([data-brand]) {');
  Object.entries(getFrostTokens("dark")).forEach(([key, hex]) =>
    lines.push(`  --frost-${key}: ${hex};`),
  );
  lines.push("  color-scheme: dark;", "}", "[data-frost] {");
  for (const alias of [
    "background",
    "surface",
    "surface-raised",
    "border",
    "foreground",
    "foreground-muted",
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "accent",
    "accent-foreground",
    "focus-ring",
  ])
    lines.push(`  --${alias}: var(--frost-${alias});`);
  lines.push("}");
  return (lines.join("\n") + "\n").replace(/#[a-f0-9]{6}/gi, (hex) =>
    hex.toLowerCase(),
  );
}

/** Eleven documented tones keep the supplied pastel color at 500. */
export const frostShades = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;
export type FrostShade = (typeof frostShades)[number];
export const frostColorFamilies = {
  blue: { label: "Frost Blue", value: nordColors[8] },
  ice: { label: "Ice", value: frostExtensions.ice },
  lavender: { label: "Lavender", value: frostExtensions.lavender },
  mint: { label: "Mint", value: frostExtensions.mint },
  rose: { label: "Rose", value: frostExtensions.rose },
  peach: { label: "Peach", value: frostExtensions.peach },
  lemon: { label: "Lemon", value: frostExtensions.lemon },
  coral: { label: "Coral", value: frostExtensions.coral },
} as const;
/** Tints and shades interpolate toward white and Polar Night; official Nord primitives stay intact. */
export function getFrostRamp(base: string): Record<FrostShade, string> {
  const blends = [0.97, 0.91, 0.78, 0.59, 0.3, 0, 0.2, 0.4, 0.62, 0.82, 0.94];
  return Object.fromEntries(
    frostShades.map((shade, i) => [
      shade,
      shade === 500
        ? base
        : mixFrostColor(
            base,
            shade < 500 ? "#FFFFFF" : nordColors[0],
            blends[i],
          ),
    ]),
  ) as Record<FrostShade, string>;
}
