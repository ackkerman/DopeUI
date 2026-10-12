"use client";
// This file guarantees readable, escaped code with file tabs and full-source copying.
import { useId, useState, type CSSProperties, type ReactNode } from "react";
import Prism from "prismjs";
import { FileCode2, Terminal } from "lucide-react";
import { CodeBlock } from "../primitives/code-block";
import { cn } from "../../class-names";

/** A file retains its complete source independently of line numbers and highlighting. */
export interface CodeFile {
  filename: string;
  code: string;
  language?:
    | "javascript"
    | "typescript"
    | "tsx"
    | "css"
    | "html"
    | "json"
    | "bash"
    | "python";
  label?: string;
  highlightedLines?: readonly number[];
}
/** Renders a source or a selectable file collection without evaluating its contents. */
export interface CodeSnippetProps {
  code?: string;
  filename?: string;
  language?: CodeFile["language"];
  files?: readonly CodeFile[];
  lineNumbers?: boolean;
  highlightedLines?: readonly number[];
  maxHeight?: CSSProperties["maxHeight"];
  className?: string;
  command?: boolean;
}

const CODE_PAINT: Record<string, string> = {
  comment: "text-[#7c818b]",
  keyword: "text-[#c24c61]",
  string: "text-[#27765a]",
  function: "text-[#7450a3]",
  number: "text-[#a55b20]",
  boolean: "text-[#c24c61]",
  property: "text-[#285e9a]",
  tag: "text-[#285e9a]",
  operator: "text-[#c24c61]",
};
const EXTRA_GRAMMARS: Record<string, Prism.Grammar> = {
  json: {
    property: { pattern: /"(?:\\.|[^"\\])*"(?=\s*:)/, greedy: true },
    string: { pattern: /"(?:\\.|[^"\\])*"/, greedy: true },
    boolean: /\b(?:true|false|null)\b/,
    number: /\b-?\d+(?:\.\d+)?\b/,
    punctuation: /[{}[\],:]/,
  },
  bash: {
    comment: /#.*/,
    string: /(["'])(?:\\.|(?!\1)[^\\])*\1/,
    function: /\b(?:npm|npx|pnpm|yarn|bun|install|add|init)\b/,
    operator: /&&|\|\||[|]/,
  },
  python: {
    comment: /#.*/,
    string: /(["'])(?:\\.|(?!\1)[^\\])*\1/,
    keyword: /\b(?:def|class|return|import|from|if|else|for|in|print|self)\b/,
    boolean: /\b(?:True|False|None)\b/,
    number: /\b\d+(?:\.\d+)?\b/,
  },
};
function paintToken(token: string | Prism.Token, key: string): ReactNode {
  if (typeof token === "string") return token;
  const content =
    typeof token.content === "string"
      ? token.content
      : Array.isArray(token.content)
        ? token.content.map((child, index) =>
            paintToken(child, `${key}-${index}`),
          )
        : paintToken(token.content, `${key}-nested`);
  return (
    <span key={key} className={CODE_PAINT[token.type]}>
      {content}
    </span>
  );
}
function CodeLine({
  text,
  language,
}: {
  text: string;
  language: CodeFile["language"];
}) {
  // Built-in grammars keep the distribution independent of site-only Prism registration.
  const grammarName =
    language === "tsx" || language === "typescript"
      ? "javascript"
      : language === "html"
        ? "markup"
        : (language ?? "javascript");
  const grammar =
    EXTRA_GRAMMARS[language ?? ""] ??
    Prism.languages[grammarName] ??
    Prism.languages.javascript;
  return (
    <>
      {Prism.tokenize(text, grammar).map((token, index) =>
        paintToken(token, String(index)),
      )}
    </>
  );
}
export function CodeSnippet({
  code = "",
  filename = "index.tsx",
  language = "tsx",
  files,
  lineNumbers = false,
  highlightedLines = [],
  maxHeight = 320,
  className,
  command = false,
}: CodeSnippetProps) {
  const id = useId();
  const [selected, setSelected] = useState<string>();
  const options = files?.length
    ? files
    : [{ filename, code, language, highlightedLines }];
  // Removed files must never leave stale source selected or copied.
  const active =
    options.find((file) => file.filename === selected) ?? options[0];
  const activeIndex = options.indexOf(active);
  const lines = active.code.split("\n");
  const emphasized = active.highlightedLines ?? highlightedLines;
  return (
    <div
      className={cn(
        "dui-code-viewer w-full min-w-0 overflow-hidden rounded-[8px] border border-[#e5e7eb] bg-white text-[#24262b]",
        className,
      )}
    >
      {options.length > 1 && (
        <div
          role="tablist"
          aria-label={command ? "Package manager" : "Code files"}
          className="flex min-h-10 gap-1 overflow-x-auto border-b border-[#e5e7eb] bg-[#f8f9fa] px-2"
          onKeyDown={(event) => {
            const direction =
              event.key === "ArrowRight"
                ? 1
                : event.key === "ArrowLeft"
                  ? -1
                  : 0;
            if (!direction && event.key !== "Home" && event.key !== "End")
              return;
            event.preventDefault();
            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? options.length - 1
                  : (activeIndex + direction + options.length) % options.length;
            setSelected(options[next].filename);
            event.currentTarget
              .querySelectorAll<HTMLButtonElement>('[role="tab"]')
              .item(next)
              ?.focus();
          }}
        >
          {options.map((file, index) => (
            <button
              type="button"
              role="tab"
              key={file.filename}
              id={`${id}-tab-${index}`}
              aria-controls={`${id}-panel`}
              aria-selected={file === active}
              tabIndex={file === active ? 0 : -1}
              onClick={() => setSelected(file.filename)}
              className={cn(
                "shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#5e81ac]",
                file === active
                  ? "border-[#24262b] text-[#24262b]"
                  : "border-transparent text-[#666b75]",
              )}
            >
              {file.label ?? file.filename}
            </button>
          ))}
        </div>
      )}
      <div
        role={options.length > 1 ? "tabpanel" : undefined}
        id={`${id}-panel`}
        aria-labelledby={
          options.length > 1 ? `${id}-tab-${activeIndex}` : undefined
        }
      >
        <div className="flex h-10 items-center gap-2 border-b border-[#e5e7eb] bg-[#f8f9fa] px-4 pr-12 font-mono text-xs text-[#535861]">
          {command ? (
            <Terminal size={14} aria-hidden />
          ) : (
            <FileCode2 size={14} aria-hidden />
          )}
          <span className="truncate">
            {command ? "Terminal" : active.filename}
          </span>
        </div>
        <CodeBlock
          code={active.code}
          tone="surface"
          copyLabel={`Copy ${command ? (active.label ?? active.filename) : active.filename}`}
          className="mb-0! [&>.dui-code-copy]:-top-9! [&>.dui-code-copy]:right-2! [&>.dui-code-copy]:text-[#535861]!"
          preProps={{
            tabIndex: 0,
            "aria-label": `${active.filename} source`,
            style: { maxHeight },
            className:
              "m-0! rounded-none! bg-transparent! p-0! font-mono text-xs! leading-6! text-inherit!",
          }}
        >
          <code className="grid min-w-max py-4">
            {lines.map((text, index) => (
              <span
                key={index}
                data-code-line={index + 1}
                data-highlighted={emphasized.includes(index + 1) || undefined}
                className={cn(
                  "block min-h-6 whitespace-pre px-4",
                  emphasized.includes(index + 1) && "bg-[#eef2ff]",
                )}
              >
                {lineNumbers && (
                  <span
                    aria-hidden
                    className="mr-5 inline-block w-5 select-none text-right text-[#9b9fa7]"
                  >
                    {index + 1}
                  </span>
                )}
                <CodeLine text={text} language={active.language ?? language} />
              </span>
            ))}
          </code>
        </CodeBlock>
      </div>
    </div>
  );
}

export type CodeBlockVariant =
  | "Default"
  | "Scrollable"
  | "Background"
  | "Highlighted"
  | "Files"
  | "Languages"
  | "Command";
const EXAMPLE =
  'import { useState } from "react";\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count: {count}\n    </button>\n  );\n}';
const DEMO_FILES: CodeFile[] = [
  { filename: "counter.tsx", code: EXAMPLE, language: "tsx" },
  {
    filename: "styles.css",
    code: "button {\n  border-radius: 8px;\n  padding: 8px 16px;\n  color: #2e3440;\n}",
    language: "css",
  },
];
const COMMAND_FILES: CodeFile[] = [
  {
    filename: "pnpm",
    label: "pnpm",
    code: "pnpm dlx shadcn@latest add @dope-ui/code-block",
    language: "bash",
  },
  {
    filename: "npm",
    label: "npm",
    code: "npx shadcn@latest add @dope-ui/code-block",
    language: "bash",
  },
  {
    filename: "yarn",
    label: "yarn",
    code: "yarn dlx shadcn@latest add @dope-ui/code-block",
    language: "bash",
  },
  {
    filename: "bun",
    label: "bun",
    code: "bunx shadcn@latest add @dope-ui/code-block",
    language: "bash",
  },
];
/** The demo exposes variants without changing the independent CodeSnippet API. */
export interface CodeBlockDemoProps extends CodeSnippetProps {
  variant?: CodeBlockVariant;
}
export default function CodeBlockDemo({
  className,
  variant: controlledVariant,
  ...props
}: CodeBlockDemoProps) {
  const [selected, setSelected] = useState<CodeBlockVariant>("Default");
  const variant = controlledVariant ?? selected;
  const files =
    variant === "Files"
      ? DEMO_FILES
      : variant === "Languages"
        ? [
            {
              filename: "counter.js",
              label: "JavaScript",
              code: "const increment = (count) => count + 1;\n\nconsole.log(increment(0));",
              language: "javascript" as const,
            },
            {
              filename: "counter.py",
              label: "Python",
              code: "def increment(count):\n    return count + 1\n\nprint(increment(0))",
              language: "python" as const,
            },
            {
              filename: "counter.tsx",
              label: "React",
              code: EXAMPLE,
              language: "tsx" as const,
            },
          ]
        : variant === "Command"
          ? COMMAND_FILES
          : undefined;
  return (
    <div
      className={cn(
        "dui-code-viewer-demo flex w-full min-w-0 flex-col items-center justify-center gap-4 px-4 py-6",
        className,
      )}
      data-component-layout="content"
    >
      <CodeSnippet
        key={variant}
        code={EXAMPLE}
        filename="counter.tsx"
        files={files}
        lineNumbers={variant !== "Default" && variant !== "Command"}
        highlightedLines={variant === "Highlighted" ? [4, 7, 8] : []}
        maxHeight={variant === "Scrollable" ? 176 : 320}
        command={variant === "Command"}
        className={cn(
          "max-w-[680px]",
          variant === "Background" && "bg-[#f5f7fb]!",
        )}
        {...props}
      />
      <div className="dui-demo-controls" aria-label="Code Block variants">
        {(
          [
            "Default",
            "Scrollable",
            "Background",
            "Highlighted",
            "Files",
            "Languages",
            "Command",
          ] as const
        ).map((name) => (
          <button
            type="button"
            key={name}
            aria-pressed={variant === name}
            onClick={() => setSelected(name)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
