import { CodeBlock } from "./library/primitives/code-block";
import { libraryEntries } from "./library/registry";
import { cn } from "./class-names";
import { useDemoSource } from "./use-demo-source";
import { SyntaxCode } from "./SyntaxCode";
import { navigateTabs } from "./tab-navigation";
// This file guarantees native modal focus handling and honest clipboard feedback.
import { useEffect, useRef, useState } from "react";
import { X, ArrowUpRight, ArrowRight } from "lucide-react";
import type { MotionDemo } from "./catalog";
import { type SnippetLanguage } from "./demo-source";

export function CodeDialog({
  demo,
  docs,
  onClose,
}: {
  demo: MotionDemo | null;
  docs: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [language, setLanguage] = useState<SnippetLanguage>("React");
  useEffect(() => {
    const node = dialog.current;
    const active = document.activeElement;
    opener.current =
      active instanceof HTMLElement && active !== document.body ? active : null;
    node?.showModal();
    return () => {
      node?.close();
    };
  }, []);
  const closeDialog = () => {
    dialog.current?.close();
    onClose();
    // Preserve the actual trigger when it still exists; parents retain their mobile-menu fallback.
    if (opener.current?.isConnected) opener.current.focus();
  };
  const { source, loading, error } = useDemoSource(demo);
  return (
    <dialog
      ref={dialog}
      className={cn(`code-dialog ${docs ? "docs-dialog" : ""}`)}
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDialog();
      }}
      aria-labelledby="dialog-title"
    >
      <div className={cn("dialog-header")}>
        <div>
          <span className={cn("eyebrow")}>
            {docs ? "GETTING STARTED" : demo?.category}
          </span>
          <h2 id="dialog-title">{docs ? "Introduction" : demo?.title}</h2>
        </div>
        <button
          className={cn("icon-button")}
          aria-label="Close dialog"
          onClick={closeDialog}
        >
          <X size={20} />
        </button>
      </div>
      {docs ? (
        <div className={cn("docs-content")}>
          <p className={cn("docs-lead")}>
            Small interactions, ready for your app.
          </p>
          <p>
            Explore interactive previews, then copy the React source into your
            own project. Built for React and Tailwind CSS v4.
          </p>
          <ol className={cn("introduction-steps")}>
            <li>
              <span
                className={cn("introduction-step-number")}
                aria-hidden="true"
              >
                1
              </span>
              <span>Try an interaction in the library.</span>
            </li>
            <li>
              <span
                className={cn("introduction-step-number")}
                aria-hidden="true"
              >
                2
              </span>
              <span>Open its detail page and copy the source.</span>
            </li>
            <li>
              <span
                className={cn("introduction-step-number")}
                aria-hidden="true"
              >
                3
              </span>
              <span>Follow Use in React to install and customize it.</span>
            </li>
          </ol>
          <a
            className={cn("introduction-action")}
            href="/detail.html?t=card-resize#usage"
            onClick={closeDialog}
          >
            Use in React <ArrowRight size={16} aria-hidden />
          </a>
          <a
            className={cn("introduction-action")}
            href="/installation.html"
            onClick={closeDialog}
          >
            Installation <ArrowRight size={16} aria-hidden />
          </a>
          <div className={cn("introduction-license")}>
            <p>
              Original dope/ui code is MIT licensed. Include LICENSE and
              applicable third-party notices when redistributing copied
              components.
            </p>
            <a
              className={cn("reference-link")}
              href="https://github.com/ackkerman/DopeUI/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
            >
              Read the license <ArrowUpRight size={14} aria-hidden />
            </a>
            <a
              className={cn("reference-link")}
              href="https://github.com/ackkerman/DopeUI/blob/main/THIRD_PARTY_NOTICES.txt"
              target="_blank"
              rel="noreferrer"
            >
              Third-party notices <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </div>
      ) : (
        <>
          <p className={cn("dialog-description")}>
            {demo && (
              <code>{`npm install ${libraryEntries[demo.id].dependencies.join(" ")}`}</code>
            )}
            <br />
            {demo?.description} A React component for Tailwind CSS v4, ready to
            adapt to your next interface.
          </p>
          <div className={cn("code-toolbar")}>
            <div
              role="tablist"
              aria-label="Code language"
              onKeyDown={navigateTabs}
            >
              {(["React", "CSS"] as const).map((l) => (
                <button
                  key={l}
                  role="tab"
                  id={`tab-${l}`}
                  aria-selected={language === l}
                  aria-controls="code-panel"
                  onClick={() => {
                    setLanguage(l);
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <CodeBlock
            copyDisabled={!source || loading || Boolean(error)}
            code={
              language === "React" && loading
                ? "Loading component source…"
                : (source?.[language] ?? "")
            }
            preProps={{
              id: "code-panel",
              role: "tabpanel",
              "aria-labelledby": `tab-${language}`,
              tabIndex: 0,
            }}
          >
            <SyntaxCode
              code={
                language === "React" && loading
                  ? "Loading component source…"
                  : (source?.[language] ?? "")
              }
              language={language}
            />
          </CodeBlock>
          <div className={cn("code-footer")}>
            <span>React 19 · Tailwind CSS v4 · cn</span>
            <a href="/library/foundation.css" download>
              Foundation CSS
            </a>
            <span role="status">{error}</span>
          </div>
        </>
      )}
    </dialog>
  );
}
