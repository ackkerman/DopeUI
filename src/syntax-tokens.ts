// This file guarantees that supported examples are tokenized without evaluating their code.
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import type { CodeLanguage } from "./demo-source";
export const grammarNames: Record<CodeLanguage, string> = {
  React: "tsx",
  CSS: "css",
  HTML: "markup",
  JavaScript: "javascript",
};
export function tokenizeSource(
  code: string,
  language: CodeLanguage,
): (string | Prism.Token)[] {
  return Prism.tokenize(code, Prism.languages[grammarNames[language]]);
}
