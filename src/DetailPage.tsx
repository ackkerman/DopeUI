import { SiteHeader } from "./SiteHeader";
import Accordion from "./library/components/accordion";
import { SiteSearch } from "./SiteSearch";
import { SiteTabs } from "./SiteTabs";
import { Button } from "./library/primitives/button";
import { SiteCode } from "./SiteCode";
import DotLoader, {
  LoadingPatternGallery,
  LOADING_VARIANTS,
  loadingVariantLabel,
  type LoadingVariant,
} from "./library/components/dot-loader";
import { libraryEntries } from "./library/registry";
import { cn } from "./class-names";
import { useDemoSource } from "./use-demo-source";
import { reactComponentName } from "./react-demo-source";
// This file guarantees directly addressable demo pages with reusable previews and React examples.
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  Link,
  Menu,
  X,
} from "lucide-react";
import { categories, demos, type MotionDemo } from "./catalog";
import { adjacentDemos, detailHref } from "./detail-navigation";
import { MotionPreview } from "./MotionPreview";

type DetailView = "Preview" | "CSS" | "React";
export function DetailPage({ demo }: { demo: MotionDemo | undefined }) {
  const [loadingPaused, setLoadingPaused] = useState(false);
  const [copiedLoading, setCopiedLoading] = useState<LoadingVariant>();
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [view, setView] = useState<DetailView>("Preview");
  const [query, setQuery] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [linkStatus, setLinkStatus] = useState("");
  const [groups, setGroups] = useState<string[]>(() =>
    demo ? [demo.category] : ["Essential"],
  );
  const linkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (
      demo &&
      url.searchParams.has("t") &&
      url.searchParams.get("t") !== demo.id
    ) {
      // Preserve saved links while presenting and copying the canonical merged page URL.
      url.searchParams.set("t", demo.id);
      window.history.replaceState(null, "", url);
    }
    document.title = `${demo?.title ?? "Interaction not found"} — dope/ui`;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        search.current?.focus();
      }
      if (e.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (loadingTimer.current) clearTimeout(loadingTimer.current);
      if (linkTimer.current) clearTimeout(linkTimer.current);
    };
  }, [demo]);
  const { source, loading, error } = useDemoSource(
    demo ?? null,
    view !== "Preview",
  );
  const { previous, next } = demo ? adjacentDemos(demo.id) : {};
  const filtered = demos.filter((d) =>
    `${d.title} ${d.description}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  async function copyLoadingUsage(variant: LoadingVariant) {
    const snippet = `import { LoadingIndicator } from './${reactComponentName("dot-loader")}';\n\nexport default function App() {\n  return <LoadingIndicator variant="${variant}" size={32} />;\n}\n`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedLoading(variant);
    } catch {
      setCopyStatus("Select the React code to copy manually.");
    }
    if (loadingTimer.current) clearTimeout(loadingTimer.current);
    loadingTimer.current = setTimeout(() => setCopiedLoading(undefined), 2000);
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkStatus("Link copied");
    } catch {
      setLinkStatus("Copy the URL from your address bar.");
    }
    if (linkTimer.current) clearTimeout(linkTimer.current);
    linkTimer.current = setTimeout(() => setLinkStatus(""), 2500);
  }
  const navigation = (
    <>
      <div className={cn("sidebar-section")}>
        <span className={cn("sidebar-label")}>Getting started</span>
        <Button variant="quiet" size="sm" href="/introduction.html">
          Introduction
        </Button>
        <a href="/installation.html">Installation</a>
        <a href="#usage" onClick={() => setNavOpen(false)}>
          Use in React
        </a>
        <a href="#accessibility" onClick={() => setNavOpen(false)}>
          Accessibility
        </a>
      </div>
      <span className={cn("sidebar-label transitions-label")}>
        Interactions
      </span>
      {categories
        .filter((c) => c !== "All")
        .map((category) => {
          const entries = filtered.filter((d) => d.category === category);
          if (entries.length === 0) return null;
          const expanded = groups.includes(category) || Boolean(query.trim());
          return (
            <Accordion
              key={category}
              className="site-accordion sidebar-group"
              title={category}
              open={expanded}
              onOpenChange={() =>
                setGroups((current) =>
                  current.includes(category)
                    ? current.filter((c) => c !== category)
                    : [...current, category],
                )
              }
            >
              <div className={cn("sidebar-group-links")}>
                {entries.map((d) => (
                  <a
                    key={d.id}
                    href={detailHref(d.id)}
                    aria-current={d.id === demo?.id ? "page" : undefined}
                  >
                    {d.title}
                  </a>
                ))}
              </div>
            </Accordion>
          );
        })}
      {filtered.length === 0 && (
        <div className={cn("sidebar-empty")}>
          No interactions found.
          <Button variant="quiet" size="sm" onClick={() => setQuery("")}>
            Clear search
          </Button>
        </div>
      )}
    </>
  );
  return (
    <>
      <a className={cn("skip-link")} href="#detail-main">
        Skip to demo
      </a>
      <SiteHeader
        navigation={
          <>
            <a href="/library">Library</a>
            <Button variant="quiet" size="sm" href="/introduction.html">
              Docs
            </Button>
            <a href="/colors.html">Colors</a>
          </>
        }
        actions={
          <>
            <div className={cn("search-box")}>
              <SiteSearch
                value={query}
                onValueChange={setQuery}
                label="Search interactions"
                inputRef={search}
                placeholder="Search"
              />
              <kbd>⌘ K</kbd>
            </div>
            <Button
              variant="primary"
              size="sm"
              className={cn("get-started")}
              href="/introduction.html"
            >
              Get started <ArrowRight size={14} />
            </Button>
            <Button
              variant="quiet"
              size="sm"
              className={cn("icon-button mobile-menu-button")}
              aria-label="Browse interactions"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((n) => !n)}
            >
              {navOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </>
        }
      />
      <div className={cn("mobile-detail-links")}>
        <a href="/library">Library</a>
        <a href="#usage">Use in React</a>
        <a href="#accessibility">Accessibility</a>
      </div>
      {navOpen && (
        <nav
          className={cn("mobile-detail-nav")}
          aria-label="Browse all interactions"
        >
          {navigation}
        </nav>
      )}
      <div className={cn("detail-shell")}>
        <aside className={cn("detail-sidebar")}>
          <nav aria-label="Interaction navigation">{navigation}</nav>
        </aside>
        <main id="detail-main" className={cn("detail-main")}>
          {demo ? (
            <>
              <div className={cn("detail-heading")}>
                <div>
                  <h1>{demo.title}</h1>
                  <p>{demo.description}</p>
                </div>
                <div className={cn("detail-pager")}>
                  {previous ? (
                    <a
                      href={detailHref(previous.id)}
                      className={cn("icon-button")}
                      aria-label={`Previous interaction: ${previous.title}`}
                    >
                      <ArrowLeft size={16} />
                    </a>
                  ) : (
                    <Button
                      variant="quiet"
                      size="sm"
                      className={cn("icon-button")}
                      disabled
                      aria-label="Previous interaction"
                    >
                      <ArrowLeft size={16} />
                    </Button>
                  )}
                  {next ? (
                    <a
                      href={detailHref(next.id)}
                      className={cn("icon-button")}
                      aria-label={`Next interaction: ${next.title}`}
                    >
                      <ArrowRight size={16} />
                    </a>
                  ) : (
                    <Button
                      variant="quiet"
                      size="sm"
                      className={cn("icon-button")}
                      disabled
                      aria-label="Next interaction"
                    >
                      <ArrowRight size={16} />
                    </Button>
                  )}
                </div>
              </div>
              <div className={cn("mobile-demo-picker")}>
                <select
                  aria-label="Choose interaction"
                  value={demo.id}
                  onChange={(e) => {
                    window.location.href = detailHref(e.target.value);
                  }}
                >
                  {categories
                    .filter((c) => c !== "All")
                    .map((c) => (
                      <optgroup label={c} key={c}>
                        {demos
                          .filter((d) => d.category === c)
                          .map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.title}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                </select>
                <ChevronDown size={14} />
              </div>
              <div className={cn("detail-toolbar")}>
                <SiteTabs
                  items={["Preview", "CSS", "React"] as const}
                  value={view}
                  onValueChange={(next) => {
                    setView(next);
                    setCopyStatus("");
                  }}
                  label="Demo view"
                  panelId="detail-panel"
                  tabIdPrefix="view"
                  className="detail-tabs"
                />
                <div className={cn("detail-actions")}>
                  <Button
                    variant="quiet"
                    size="sm"
                    className={cn("demo-button")}
                    onClick={copyLink}
                  >
                    {linkStatus === "Link copied" ? (
                      <Check size={14} />
                    ) : (
                      <Link size={14} />
                    )}{" "}
                    {linkStatus === "Link copied" ? "Link copied" : "Copy link"}
                  </Button>
                  {view === "Preview" ? (
                    <Button
                      variant="quiet"
                      size="sm"
                      className={cn("demo-button")}
                      onClick={() => setView("React")}
                    >
                      <Code2 size={14} />
                      View code
                    </Button>
                  ) : null}
                </div>
              </div>
              <div
                id="detail-panel"
                data-frost={view === "Preview" ? "" : undefined}
                data-frost-components={view === "Preview" ? "" : undefined}
                data-theme="light"
                data-brand="frost"
                role="tabpanel"
                aria-labelledby={`view-${view}`}
                className={cn(
                  view === "Preview" ? "detail-preview" : "detail-code",
                )}
              >
                {view === "Preview" ? (
                  demo.id === "dot-loader" ? (
                    <DotLoader
                      className={cn("preview preview-dots")}
                      paused={loadingPaused}
                      onPausedChange={setLoadingPaused}
                    />
                  ) : (
                    <MotionPreview key={demo.id} demo={demo} />
                  )
                ) : (
                  <SiteCode
                    copyDisabled={!source || loading || Boolean(error)}
                    code={
                      view === "React" && loading
                        ? "Loading component source…"
                        : (source?.[view] ?? "")
                    }
                    preProps={{ tabIndex: 0 }}
                    language={view}
                    filename={
                      view === "React"
                        ? libraryEntries[demo.id].filename
                        : "foundation.css"
                    }
                  />
                )}
              </div>
              <div className={cn("detail-status")} role="status">
                {error ||
                  (copyStatus && copyStatus !== "Copied"
                    ? copyStatus
                    : linkStatus && linkStatus !== "Link copied"
                      ? linkStatus
                      : "")}
              </div>
              {demo.id === "dot-loader" && view === "Preview" && (
                <section
                  className={cn("loading-pattern-section")}
                  data-frost
                  data-frost-components
                  data-theme="light"
                  data-brand="frost"
                  aria-labelledby="loading-pattern-title"
                >
                  <div className={cn("loading-pattern-heading")}>
                    <div>
                      <span className={cn("eyebrow")}>ALL PATTERNS</span>
                      <h2 id="loading-pattern-title">Every way to wait.</h2>
                      <p>
                        {LOADING_VARIANTS.length} indicators, ready to compare.
                      </p>
                    </div>
                    <Button
                      variant="quiet"
                      size="sm"
                      type="button"
                      className={cn("demo-button")}
                      aria-pressed={loadingPaused}
                      onClick={() => setLoadingPaused((v) => !v)}
                    >
                      {loadingPaused ? "Play all" : "Pause all"}
                    </Button>
                  </div>
                  <LoadingPatternGallery
                    playState={loadingPaused ? "paused" : "running"}
                    onCopySnippet={copyLoadingUsage}
                    copiedVariant={copiedLoading}
                  />
                  <p className={cn("loading-pattern-status")} role="status">
                    {copiedLoading
                      ? `${loadingVariantLabel(copiedLoading)} usage copied`
                      : ""}
                  </p>
                </section>
              )}
              <section id="usage" className={cn("detail-usage")}>
                <span className={cn("eyebrow")}>MAKE IT YOURS</span>
                <h2>Use it in React.</h2>
                <p>
                  Add the editable source with the shadcn CLI. Initialize shadcn
                  in your React 19 / Tailwind CSS v4 project first.
                </p>
                <SiteCode
                  code={`npx shadcn@latest add ${window.location.origin}/r/${demo.id}.json`}
                  preProps={{ className: cn("registry-command") }}
                />
                <p>
                  Import <code>components/dope-ui/foundation.css</code> once
                  from your global CSS, adjusting the relative path. The CLI
                  installs the component under your components alias and its npm
                  dependencies. Keep the included <code>LICENSE.txt</code> when
                  redistributing.
                </p>
                <p>
                  <a href={`/r/${demo.id}.json`} download>
                    Download registry JSON
                  </a>
                  {" · "}
                  <a href="/r/registry.json">Browse registry</a>
                </p>
                <p>
                  To install manually, save the React example as one{" "}
                  <code>.tsx</code> file, then import it into your app. Load the
                  shared Tailwind foundation once. Local UI helpers and
                  interaction logic are included.
                </p>
                <SiteCode
                  code={`import ${reactComponentName(demo.id)} from './${reactComponentName(demo.id)}';\n\nexport default function App() {\n  return <${reactComponentName(demo.id)} />;\n}`}
                  language={"React"}
                />
                <p>
                  <a href="/library/foundation.css" download>
                    Download foundation.css
                  </a>{" "}
                  and import it in your app entry. Configure Tailwind CSS v4
                  with <code>@tailwindcss/vite</code> (Vite) or{" "}
                  <code>@tailwindcss/postcss</code> (Next.js), and install{" "}
                  <code>shadow-plugin</code>.
                </p>
                <SiteCode
                  code={`npm install ${libraryEntries[demo.id].dependencies.join(" ")}`}
                />
                <p className={cn("usage-note")}>
                  Requires React 19 and Tailwind CSS v4. The{" "}
                  <code>'use client'</code> directive is included for Next.js.
                  The CSS tab shows the shared foundation for installation and
                  customization.
                </p>
              </section>
              <section
                id="accessibility"
                className={cn("detail-accessibility")}
              >
                <span className={cn("eyebrow")}>CONSIDERED BY DEFAULT</span>
                <h2>Motion for everyone.</h2>
                <div>
                  <span>
                    <Check size={14} />
                    Reduced-motion CSS included
                  </span>
                  <span>
                    <Check size={14} />
                    Native, keyboard-friendly controls
                  </span>
                  <span>
                    <Check size={14} />
                    Dependencies listed per component
                  </span>
                </div>
              </section>
              <div className={cn("detail-bottom-nav")}>
                {previous ? (
                  <a href={detailHref(previous.id)}>
                    <span>Previous interaction</span>
                    <strong>
                      <ArrowLeft size={14} />
                      {previous.title}
                    </strong>
                  </a>
                ) : (
                  <a href="/library">
                    <span>Explore the collection</span>
                    <strong>
                      <ArrowLeft size={14} />
                      Back to library
                    </strong>
                  </a>
                )}
                {next && (
                  <a href={detailHref(next.id)}>
                    <span>Next interaction</span>
                    <strong>
                      {next.title}
                      <ArrowRight size={14} />
                    </strong>
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className={cn("detail-not-found")}>
              <h1>Interaction not found.</h1>
              <p>
                This interaction isn’t in the collection. Explore the library to
                find your next idea.
              </p>
              <a className={cn("demo-button")} href="/library">
                <ArrowLeft size={14} />
                Back to library
              </a>
            </div>
          )}
        </main>
      </div>
      <footer className={cn("detail-footer")}>
        <div>
          <a className={cn("wordmark")} href="/">
            dope<span>/</span>ui<span className={cn("brand-dot")}>.</span>
          </a>
          <p>Thoughtful motion for everyday interfaces.</p>
        </div>
        <div className={cn("footer-links")}>
          <a href="/library">Library</a>
          <Button variant="quiet" size="sm" href="/introduction.html">
            Documentation
          </Button>
          <a href="/colors.html">Colors</a>
          <a href="/#about">About</a>
        </div>
      </footer>
    </>
  );
}
