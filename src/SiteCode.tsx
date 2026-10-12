// This file guarantees site code panels use the public CodeSnippet and preserve complete source.
import { isValidElement, type ReactNode } from "react";
import { CodeSnippet, type CodeFile } from "./library/components/code-block";
import type { CodeLanguage } from "./demo-source";
import type { CodeBlockProps } from "./library/primitives/code-block";

/** Reads explicit source from legacy JSX without executing display components. */
function codeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(codeText).join("");
  if (isValidElement<{ code?: string; children?: ReactNode }>(node))
    return node.props.code ?? codeText(node.props.children);
  return "";
}
const LANGUAGES: Record<string, CodeFile["language"]> = {
  React: "tsx",
  CSS: "css",
  HTML: "html",
  JavaScript: "javascript",
  JSON: "json",
  Shell: "bash",
};
export function SiteCode({
  code,
  children,
  className,
  preProps,
  copyLabel,
  copyDisabled,
  language,
  filename,
}: CodeBlockProps & {
  language?: CodeFile["language"] | CodeLanguage;
  filename?: string;
}) {
  const originalLanguage = isValidElement<{ language?: string }>(children)
    ? children.props.language
    : undefined;
  const selectedLanguage = language
    ? (LANGUAGES[language] ?? (language as CodeFile["language"]))
    : undefined;
  const lang =
    selectedLanguage ??
    (originalLanguage ? LANGUAGES[originalLanguage] : "bash");
  return (
    <div
      id={preProps?.id}
      role={preProps?.role}
      aria-labelledby={preProps?.["aria-labelledby"]}
    >
      <CodeSnippet
        code={code ?? codeText(children)}
        copyLabel={copyLabel ?? "Copy code"}
        copyDisabled={copyDisabled}
        language={lang}
        filename={
          filename ??
          (lang === "tsx"
            ? "example.tsx"
            : lang === "css"
              ? "styles.css"
              : lang === "json"
                ? "components.json"
                : "Terminal")
        }
        command={lang === "bash"}
        maxHeight={preProps?.style?.maxHeight ?? 440}
        className={className ? `site-code ${className}` : "site-code"}
      />
    </div>
  );
}
