import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type Prism from "prismjs";
import { SyntaxCode } from "./SyntaxCode";
import { tokenizeSource } from "./syntax-tokens";
import { demos } from "./catalog";
import { getDemoSource, type CodeLanguage } from "./demo-source";

function plainText(token: string | Prism.Token): string {
  if (typeof token === "string") return token;
  if (typeof token.content === "string") return token.content;
  if (Array.isArray(token.content))
    return token.content.map(plainText).join("");
  return plainText(token.content);
}

describe("syntax highlighting", () => {
  it.each<[CodeLanguage, string, string]>([
    [
      "React",
      "export default function Demo() { return <div>Hello</div>; }",
      "keyword",
    ],
    ["CSS", ".card { color: red; }", "property"],
    ["HTML", '<button class="demo">Animate</button>', "tag"],
    ["JavaScript", "const active = true;", "keyword"],
  ])("highlights %s with its own grammar", (language, code, token) => {
    expect(
      renderToStaticMarkup(<SyntaxCode code={code} language={language} />),
    ).toContain(`token ${token}`);
  });
  it("preserves all original sample text, whitespace, and line breaks", async () => {
    const verified = new Set<string>();
    for (const demo of demos) {
      const source = await getDemoSource(demo);
      for (const language of ["React", "CSS"] as const) {
        if (verified.has(source[language])) continue;
        verified.add(source[language]);
        expect(
          tokenizeSource(source[language], language).map(plainText).join(""),
        ).toBe(source[language]);
      }
    }
  });
  it("renders source markup as escaped text rather than executable elements", () => {
    const html = renderToStaticMarkup(
      <SyntaxCode
        code={'<script>alert("x")</script><img src="x" onerror="alert(1)">'}
        language="HTML"
      />,
    );
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;");
  });
});

it("bounds the highlighted preview without changing its source value", () => {
  const source = "const value = 1;\n".repeat(2000);
  const html = renderToStaticMarkup(
    <SyntaxCode code={source} language="React" />,
  );
  expect(html).toContain("Preview shortened");
  expect(source.length).toBe(34000);
});
