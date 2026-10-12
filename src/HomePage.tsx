import { SiteHeader } from "./SiteHeader";
import Modal from "./library/components/modal";
import { SiteSearch } from "./SiteSearch";
import { SiteTabs } from "./SiteTabs";
import { Button } from "./library/primitives/button";
import { SiteCode } from "./SiteCode";
// This file guarantees the homepage presents working compositions and keeps component discovery accessible.
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Code2, Layers, X } from "lucide-react";
import { cn } from "./class-names";
import { demos } from "./catalog";
import { detailHref } from "./detail-navigation";
import { libraryEntries } from "./library/registry";

import {
  exampleCategories,
  filterExamples,
  type ExampleCategory,
  type ShowcaseExample,
} from "./showcase/examples";
import "./HomePage.css";
const Preview = lazy(() =>
  import("./showcase/ShowcasePreviews").then((module) => ({
    default: ({ id }: { id: string }) => {
      const Component = module.examplePreviews[id];
      return <Component />;
    },
  })),
);
function ExampleStage({
  example,
  eager = false,
}: {
  example: ShowcaseExample;
  eager?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(
    () => eager || typeof IntersectionObserver === "undefined",
  );
  useEffect(() => {
    if (visible || !host.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "180px" },
    );
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [visible]);
  return (
    <div
      ref={host}
      className={cn("home-example-stage", `home-stage-${example.id}`)}
    >
      {visible ? (
        <Suspense
          fallback={<div className={cn("home-loading")}>Loading example…</div>}
        >
          <Preview id={example.id} />
        </Suspense>
      ) : (
        <div className={cn("home-loading")} aria-hidden>
          Example preview
        </div>
      )}
    </div>
  );
}
/** Opening an example retains its selected view and returns focus to the initiating card. */
interface ExampleSelection {
  example: ShowcaseExample;
  view: "Preview" | "React";
}
function ExampleDialog({
  selection,
  onClose,
}: {
  selection: ExampleSelection;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [view, setView] = useState<"Preview" | "React" | "CSS" | "Components">(
    selection.view,
  );
  const [sources, setSources] = useState<{ React: string; CSS: string } | null>(
    null,
  );
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    const loaders = import.meta.glob<string>("./showcase/components/*.tsx", {
      query: "?raw",
      import: "default",
    });
    const load =
      loaders[`./showcase/components/${selection.example.exportName}.tsx`];
    if (!load) return;
    Promise.all([load(), import("./showcase/showcase-previews.css?raw")])
      .then(([React, CSS]) => {
        if (!cancelled) setSources({ React, CSS: CSS.default });
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "Could not load the example source. Close and reopen to retry.",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [selection.example.exportName]);

  const close = () => {
    setOpen(false);
    onClose();
  };
  const pieces = selection.example.components
    .map((id) => demos.find((demo) => demo.id === id))
    .filter((demo) => demo !== undefined);
  const dependencies = [
    ...new Set([
      ...selection.example.components.flatMap(
        (id) => libraryEntries[id]?.dependencies ?? [],
      ),
      ...(selection.example.exportName === "AnalyticsPanel"
        ? ["recharts"]
        : []),
    ]),
  ];
  return (
    <Modal
      open={open}
      showTrigger={false}
      title={selection.example.title}
      dialogClassName="home-example-dialog"
      className="site-modal-host"
      onOpenChange={(next) => {
        if (!next) close();
      }}
    >
      <div className={cn("home-dialog-header")}>
        <div>
          <small>{selection.example.category}</small>
          <h2 id="home-example-title">{selection.example.title}</h2>
        </div>
        <Button
          variant="quiet"
          size="sm"
          type="button"
          aria-label="Close example"
          onClick={close}
        >
          <X size={19} />
        </Button>
      </div>
      <div className={cn("home-dialog-toolbar")}>
        <SiteTabs
          items={["Preview", "React", "CSS", "Components"] as const}
          value={view}
          onValueChange={setView}
          label="Example view"
        />
      </div>
      <div className={cn("home-dialog-body")}>
        {view === "Preview" ? (
          <>
            <p className={cn("home-dialog-description")}>
              {selection.example.description} Try its controls.
            </p>
            <ExampleStage example={selection.example} eager />
            <div className={cn("home-dialog-pieces")}>
              {pieces.map((piece) => (
                <a key={piece.id} href={detailHref(piece.id)}>
                  {piece.title}
                  <ArrowRight size={11} />
                </a>
              ))}
            </div>
          </>
        ) : view === "Components" ? (
          <>
            <p className={cn("home-dialog-description")}>
              Real components, shared application state. Explore the pieces
              behind this example.
            </p>
            <div className={cn("home-component-list")}>
              {pieces.map((piece) => (
                <a href={detailHref(piece.id)} key={piece.id}>
                  <div>
                    <strong>{piece.title}</strong>
                    <span>{piece.description}</span>
                  </div>
                  <ArrowRight size={16} />
                </a>
              ))}
            </div>
            <h3>Set up the pieces</h3>
            <p>
              Use React 19 and Tailwind CSS v4. Copy the linked component files
              into <code>src/library/components</code>, load the shared
              foundation once, and save the React tab in{" "}
              <code>src/showcase/components</code> and the CSS tab in{" "}
              <code>src/showcase</code>.
            </p>
            <SiteCode code={dependencies.join(" ")} />
            <a
              href="/library/foundation.css"
              download
              className={cn("home-text-link")}
            >
              Download the shared foundation <ArrowRight size={12} />
            </a>
          </>
        ) : (
          <>
            <p className={cn("home-dialog-description")}>
              {view === "React" ? (
                <>
                  Save this example in src/showcase/components. Render{" "}
                  <code>{selection.example.exportName}</code>; keep its
                  stylesheet and copy the components listed in the Components
                  tab.
                </>
              ) : (
                <>
                  Save as <code>showcase-previews.css</code> beside the React
                  file. These layout styles accompany the shared Tailwind
                  foundation.
                </>
              )}
            </p>
            {sources ? (
              <SiteCode
                code={sources[view]}
                preProps={{ className: cn("home-source-code") }}
                language={view}
              />
            ) : (
              <div className={cn("home-loading")}>
                {error || "Loading source…"}
              </div>
            )}
          </>
        )}
        <p role="status" className={cn("home-dialog-status")}>
          {error}
        </p>
      </div>
    </Modal>
  );
}
export function HomePage() {
  const [category, setCategory] = useState<ExampleCategory>("All examples");
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<ExampleSelection | null>(null);
  const results = filterExamples(query, category);
  const grid = useRef<HTMLDivElement>(null);
  const resultKey = results.map((example) => example.id).join(",");
  useEffect(() => {
    const cards = Array.from(grid.current?.children ?? []) as HTMLElement[];
    // Keep natural card heights, including lazy content and interaction states.
    const measure = (card: HTMLElement) => {
      const span = Math.ceil(card.getBoundingClientRect().height + 18);
      card.style.gridRowEnd = `span ${span}`;
    };
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => measure(entry.target as HTMLElement));
    });
    cards.forEach((card) => {
      measure(card);
      observer.observe(card);
    });
    return () => observer.disconnect();
  }, [resultKey]);
  return (
    <div className={cn("home-page")}>
      <a className={cn("skip-link")} href="#examples">
        Skip to examples
      </a>
      <SiteHeader
        navigation={
          <>
            <a href="#examples">Examples</a>
            <a href="/library">Components</a>
            <a href="/introduction.html">Docs</a>
            <a href="/colors.html">Colors</a>
          </>
        }
        actions={
          <>
            <Button variant="primary" href="/library" className="get-started">
              Get started <ArrowRight size={13} />
            </Button>
          </>
        }
      />
      <main className={cn("home-main")}>
        <section className={cn("home-hero")}>
          <a className={cn("home-eyebrow")} href="/library">
            <Layers size={12} />
            {demos.length} components. Endless possibilities.
            <ArrowRight size={11} />
          </a>
          <h1>
            Small components.
            <br />
            Real interfaces.
          </h1>
          <p>
            A collection of thoughtful UI, brought together.
            <br />
            Explore the possibilities. Make the details yours.
          </p>
          <div className={cn("home-hero-actions")}>
            <a href="#examples" className={cn("home-primary-link")}>
              Explore examples <ArrowRight size={14} />
            </a>
            <a href="/library" className={cn("home-secondary-link")}>
              Browse components <ArrowRight size={14} />
            </a>
          </div>
        </section>
        <section id="examples" aria-label="Application examples">
          <div className={cn("home-gallery-toolbar")}>
            <SiteTabs
              items={exampleCategories}
              value={category}
              onValueChange={setCategory}
              label="Example category"
              className="home-example-filters"
            />
            <label className={cn("home-example-search")}>
              <SiteSearch
                value={query}
                onValueChange={setQuery}
                label="Search examples"
                placeholder="Find an example…"
              />
            </label>
          </div>
          <div ref={grid} className={cn("home-examples-grid")}>
            {results.map((example, i) => (
              <article
                key={example.id}
                className={cn(
                  "home-example-card",
                  example.featured && "home-example-wide",
                )}
                aria-label={example.title}
              >
                <ExampleStage example={example} eager={i < 2} />
                <div className={cn("home-example-meta")}>
                  <div>
                    <Button
                      variant="quiet"
                      size="sm"
                      type="button"
                      className={cn("home-example-title")}
                      onClick={() => setSelection({ example, view: "Preview" })}
                    >
                      {example.title}
                      <ArrowRight size={13} />
                    </Button>
                    <p>{example.description}</p>
                  </div>
                  <Button
                    variant="quiet"
                    size="sm"
                    type="button"
                    className={cn("home-code-trigger")}
                    aria-label={`View ${example.title} code`}
                    onClick={() => setSelection({ example, view: "React" })}
                  >
                    <Code2 size={15} />
                  </Button>
                </div>
                <div className={cn("home-example-components")}>
                  {example.components.slice(0, 3).map((id) => (
                    <a href={detailHref(id)} key={id}>
                      {demos.find((demo) => demo.id === id)?.title ?? id}
                    </a>
                  ))}
                  {example.components.length > 3 ? (
                    <Button
                      variant="quiet"
                      size="sm"
                      type="button"
                      onClick={() => setSelection({ example, view: "Preview" })}
                    >
                      +{example.components.length - 3}
                    </Button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          {!results.length ? (
            <div className={cn("home-empty")}>
              <h2>No examples found.</h2>
              <p>Try another search, or start with the full collection.</p>
              <Button
                variant="quiet"
                size="sm"
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("All examples");
                }}
              >
                Show all examples
              </Button>
            </div>
          ) : null}
        </section>
        <section className={cn("home-component-cta")}>
          <div>
            <span className={cn("home-section-label")}>
              THE PIECES BEHIND THE POSSIBILITIES
            </span>
            <h2>
              Start small.
              <br />
              Make it yours.
            </h2>
            <p>
              Explore the components, find the feeling,
              <br />
              and bring it into your next interface.
            </p>
          </div>
          <a href="/library" className={cn("home-primary-link")}>
            Explore {demos.length} components <ArrowRight size={14} />
          </a>
        </section>
      </main>
      <footer className={cn("home-footer")}>
        <a className={cn("wordmark")} href="/">
          dope<span>/</span>ui<span className={cn("brand-dot")}>.</span>
        </a>
        <p>Thoughtful motion for everyday interfaces.</p>
        <div>
          <a href="/library">Components</a>
          <a href="/introduction.html">Docs</a>
          <a href="/colors.html">Colors</a>
          <a href="https://github.com/ackkerman/DopeUI/blob/main/LICENSE">
            MIT licensed <ArrowUpRight size={11} />
          </a>
        </div>
      </footer>
      {selection ? (
        <ExampleDialog
          key={selection.example.id}
          selection={selection}
          onClose={() => setSelection(null)}
        />
      ) : null}
    </div>
  );
}
