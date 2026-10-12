"use client";
// This file guarantees complete code copying with an accessible fallback independent of highlighting.
import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../../class-names";

/** Owns the copy operation; code is the full source even when children display a shortened preview. */
export interface CodeBlockProps extends ComponentProps<"div"> {
  code?: string;
  children?: ReactNode;
  preProps?: ComponentProps<"pre">;
  copyDisabled?: boolean;
  copyLabel?: string;
  tone?: "code" | "surface";
  header?: ReactNode;
}
function readableOutput(node: HTMLPreElement | null) {
  if (!node) return "";
  const copy = node.cloneNode(true) as HTMLPreElement;
  // Animated terminal text exposes its complete accessible text alongside a visual duplicate.
  copy
    .querySelectorAll('[aria-hidden="true"]')
    .forEach((element) => element.remove());
  const lines = copy.querySelector("code.grid");
  if (lines)
    return Array.from(lines.children)
      .map((element) => element.textContent ?? "")
      .join("\n");
  return copy.textContent ?? "";
}
export function CodeBlock({
  code,
  children,
  preProps,
  copyDisabled = false,
  copyLabel = "Copy code",
  tone = "code",
  header,
  className,
  ...props
}: CodeBlockProps) {
  const pre = useRef<HTMLPreElement>(null);
  const alive = useRef(false);
  const operation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [feedback, setFeedback] = useState<{
    source?: string;
    state: "idle" | "copying" | "copied" | "error";
    full: string;
  }>({ state: "idle", full: "" });
  const state = feedback.source === code ? feedback.state : "idle";
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      operation.current += 1;
      clearTimeout(timer.current);
    };
  }, []);
  const copy = async () => {
    const current = ++operation.current;
    const full = code ?? readableOutput(pre.current);
    clearTimeout(timer.current);
    setFeedback({ source: code, state: "copying", full });
    try {
      await navigator.clipboard.writeText(full);
      if (!alive.current || current !== operation.current) return;
      setFeedback({ source: code, state: "copied", full });
      timer.current = setTimeout(() => {
        if (alive.current) setFeedback({ source: code, state: "idle", full });
      }, 2000);
    } catch {
      if (alive.current && current === operation.current)
        setFeedback({ source: code, state: "error", full });
    }
  };
  const copyControl = (
    <button
      type="button"
      className={cn(
        "dui-code-copy",
        header && "static! shrink-0 text-inherit!",
      )}
      aria-label={state === "copied" ? "Copied" : copyLabel}
      title={state === "copied" ? "Copied" : copyLabel}
      disabled={copyDisabled || state === "copying"}
      onClick={copy}
    >
      {state === "copied" ? (
        <Check size={16} aria-hidden="true" />
      ) : (
        <Copy size={16} aria-hidden="true" />
      )}
    </button>
  );
  return (
    <div
      {...props}
      className={cn("dui-code-block", className)}
      data-code-tone={tone}
    >
      {header ? (
        <div className="dui-code-header flex min-h-10 items-center justify-between gap-3 border-b border-[#e5e7eb] bg-[#f8f9fa] py-1 pl-4 pr-2 font-mono text-xs text-[#535861]">
          {header}
          {copyControl}
        </div>
      ) : (
        copyControl
      )}
      <pre
        {...preProps}
        ref={pre}
        className={cn("dui-code-block-pre", preProps?.className)}
        style={preProps?.style}
      >
        {children ?? <code>{code}</code>}
      </pre>
      <span className="sr-only" role="status">
        {state === "copied"
          ? "Code copied."
          : state === "error"
            ? "Clipboard unavailable. Copy the full source manually below."
            : ""}
      </span>
      {state === "error" && (
        <div className="dui-code-manual">
          <label>
            Copy the full source manually
            <textarea
              aria-label="Code to copy manually"
              readOnly
              value={feedback.full}
              ref={(node) => {
                if (node) {
                  node.focus();
                  node.select();
                }
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
}
