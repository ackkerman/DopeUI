import Modal from "./library/components/modal";
import { SiteTabs } from "./SiteTabs";
import { Button } from "./library/primitives/button";
import { SiteCode } from "./SiteCode";
import { libraryEntries } from "./library/registry";
import { cn } from "./class-names";
import { useDemoSource } from "./use-demo-source";

// This file guarantees native modal focus handling and honest clipboard feedback.
import { useState } from "react";
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
  const [open, setOpen] = useState(true);
  const [language, setLanguage] = useState<SnippetLanguage>("React");
  const closeDialog = () => {
    setOpen(false);
    onClose();
  };
  const { source, loading, error } = useDemoSource(demo);
  return (
    <Modal
      open={open}
      showTrigger={false}
      title={docs ? "Introduction" : (demo?.title ?? "Code")}
      dialogClassName={cn(`code-dialog ${docs ? "docs-dialog" : ""}`)}
      className="site-modal-host"
      onOpenChange={(next) => {
        if (!next) closeDialog();
      }}
    >
      <div className={cn("dialog-header")}>
        <div>
          <span className={cn("eyebrow")}>
            {docs ? "GETTING STARTED" : demo?.category}
          </span>
          <h2 id="dialog-title">{docs ? "Introduction" : demo?.title}</h2>
        </div>
        <Button
          variant="quiet"
          size="sm"
          className={cn("icon-button")}
          aria-label="Close dialog"
          onClick={closeDialog}
        >
          <X size={20} />
        </Button>
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
          <div className={cn("introduction-actions")}>
            <Button
              variant="primary"
              className={cn("introduction-action")}
              href="/detail.html?t=card-resize#usage"
              onClick={closeDialog}
            >
              Use in React <ArrowRight size={16} aria-hidden />
            </Button>
            <Button
              variant="primary"
              className={cn("introduction-action")}
              href="/installation.html"
              onClick={closeDialog}
            >
              Installation <ArrowRight size={16} aria-hidden />
            </Button>
          </div>
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
            <SiteTabs
              items={["React", "CSS"] as const}
              value={language}
              onValueChange={setLanguage}
              label="Code language"
              panelId="code-panel"
              tabIdPrefix="tab"
            />
          </div>
          <SiteCode
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
            language={language}
            filename={
              language === "React" && demo
                ? libraryEntries[demo.id].filename
                : "foundation.css"
            }
          />
          <div className={cn("code-footer")}>
            <span>React 19 · Tailwind CSS v4 · cn</span>
            <a href="/library/foundation.css" download>
              Foundation CSS
            </a>
            <span role="status">{error}</span>
          </div>
        </>
      )}
    </Modal>
  );
}
