import { cn } from "./class-names";
// This file guarantees highlighting that preserves the original text and React's HTML escaping.
import { useMemo, type ReactNode } from "react";
import type Prism from "prismjs";
import type { CodeLanguage } from "./demo-source";
import { grammarNames, tokenizeSource } from "./syntax-tokens";

function renderToken(token: string | Prism.Token, key: string): ReactNode {
  if (typeof token === "string") return token;
  const alias =
    typeof token.alias === "string" ? [token.alias] : (token.alias ?? []);
  const content =
    typeof token.content === "string"
      ? token.content
      : Array.isArray(token.content)
        ? token.content.map((child, i) => renderToken(child, `${key}-${i}`))
        : renderToken(token.content, `${key}-nested`);
  return (
    <span key={key} className={cn(["token", token.type, ...alias].join(" "))}>
      {content}
    </span>
  );
}
export function SyntaxCode({
  code,
  language,
}: {
  code: string;
  language: CodeLanguage;
}) {
  // Large foundations and artwork licenses remain complete in Copy/download; bound DOM token count.
  const displayed =
    code.length > 24000
      ? code.slice(0, 24000) +
        "\n/* Preview shortened. Copy or download the complete source. */"
      : code;
  const tokens = useMemo(
    () => tokenizeSource(displayed, language),
    [displayed, language],
  );
  return (
    <code className={cn(`syntax-code language-${grammarNames[language]}`)}>
      {tokens.map((token, i) => renderToken(token, String(i)))}
    </code>
  );
}
