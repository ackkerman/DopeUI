import { RepositoryLink } from "./RepositoryLink";
import { useMasonryLayout } from "./use-masonry-layout";
import { HomePage } from "./HomePage";
import { cn } from "./class-names";
import { DetailPage } from "./DetailPage";
import { detailHref, resolveDetail } from "./detail-navigation";
import { navigateTabs } from "./tab-navigation";
// This file guarantees a searchable library with local, independent previews.
import { useEffect, useRef, useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpRight,
  ArrowRight,
  Code2,
  Menu,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  categories,
  demos,
  filterDemos,
  type Category,
  type MotionDemo,
  type SortOrder,
} from "./catalog";
import { MotionPreview } from "./MotionPreview";
import { CodeDialog } from "./CodeDialog";

function LibraryPage() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selected, setSelected] = useState<MotionDemo | null>(null);
  const [docs, setDocs] = useState(false);
  const search = useRef<HTMLInputElement>(null);
  const getStarted = useRef<HTMLButtonElement>(null);
  const sortArea = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        search.current?.focus();
      }
      if (e.key === "Escape") {
        setSortOpen(false);
        setMobileMenu(false);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!sortArea.current?.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);
  const results = filterDemos(query, category, sort);
  const masonryGrid = useMasonryLayout(
    results.map((demo) => demo.id).join(","),
  );
  const openDocs = () => {
    setDocs(true);
    setMobileMenu(false);
  };
  const reset = () => {
    setQuery("");
    setCategory("All");
    setSort("featured");
  };
  return (
    <>
      <a className={cn("skip-link")} href="#library">
        Skip to library
      </a>
      <header className={cn("site-header")}>
        <a className={cn("wordmark")} href="/" aria-label="dope/ui home">
          dope<span>/</span>ui<span className={cn("brand-dot")}>.</span>
        </a>
        <nav className={cn("desktop-nav")} aria-label="Main navigation">
          <a className={cn("nav-active")} href="#library">
            Library
          </a>
          <button onClick={openDocs}>Docs</button>
          <a href="#about">
            About <span className={cn("new-badge")}>New</span>
          </a>

          <a href="/colors.html">Colors</a>
        </nav>
        <div className={cn("header-actions")}>
          <RepositoryLink />
          <div className={cn("search-box")}>
            <Search size={16} />
            <input
              ref={search}
              type="search"
              aria-label="Search library"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd>⌘ K</kbd>
          </div>
          <button
            className={cn("get-started")}
            ref={getStarted}
            onClick={openDocs}
          >
            Get started <ArrowUpRight size={14} />
          </button>
          <button
            className={cn("icon-button mobile-menu-button")}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu((v) => !v)}
          >
            {mobileMenu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {mobileMenu && (
          <nav className={cn("mobile-nav")} aria-label="Mobile navigation">
            <a href="#library" onClick={() => setMobileMenu(false)}>
              Library
            </a>
            <button onClick={openDocs}>Docs</button>
            <a href="/colors.html">Colors</a>
            <a href="#about" onClick={() => setMobileMenu(false)}>
              About
            </a>
          </nav>
        )}
      </header>
      <main id="library">
        <section className={cn("intro")}>
          <h1>
            Library<span className={cn("heading-dot")}>.</span>
          </h1>
          <p>Small interactions. A little more feeling.</p>
        </section>
        <div className={cn("toolbar")}>
          <div className={cn("category-scroll")}>
            <div
              className={cn("categories")}
              role="tablist"
              aria-label="Filter by category"
              onKeyDown={navigateTabs}
            >
              {categories.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={category === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className={cn("toolbar-end")}>
            <span className={cn("result-count")} aria-live="polite">
              {results.length} interactions
            </span>
            <div className={cn("sort-area")} ref={sortArea}>
              <button
                className={cn(
                  `icon-button sort-trigger ${sortOpen ? "selected" : ""}`,
                )}
                aria-label="Sort interactions"
                aria-expanded={sortOpen}
                onClick={() => setSortOpen((v) => !v)}
              >
                <SlidersHorizontal size={16} />
              </button>
              {sortOpen && (
                <div className={cn("sort-menu")}>
                  <span>Sort by</span>
                  {(
                    [
                      ["featured", "Featured"],
                      ["az", "Name: A–Z"],
                      ["za", "Name: Z–A"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      aria-pressed={sort === value}
                      onClick={() => {
                        setSort(value);
                        setSortOpen(false);
                      }}
                    >
                      {label}
                      {sort === value && (
                        <span className={cn("selected-dot")} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <section
          ref={masonryGrid}
          data-category={category}
          className={cn("card-grid")}
          aria-label="Interactive motion library"
        >
          {results.map((d) => (
            <article
              className={cn("motion-card")}
              key={d.id}
              data-frost
              data-frost-components
              data-theme="light"
              data-brand="frost"
            >
              <MotionPreview demo={d} />
              <div className={cn("card-info")}>
                <div>
                  <h2>
                    <a href={detailHref(d.id)}>{d.title}</a>
                  </h2>
                  <p>{d.description}</p>
                </div>
                <div className={cn("card-actions")}>
                  <a
                    className={cn("code-button detail-link")}
                    href={detailHref(d.id)}
                    aria-label={`Open details for ${d.title}`}
                    title="View details"
                  >
                    <ArrowRight size={15} />
                  </a>
                  <button
                    className={cn("code-button")}
                    aria-label={`View code for ${d.title}`}
                    title="View code"
                    onClick={() => setSelected(d)}
                  >
                    <Code2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
        {results.length === 0 && (
          <div className={cn("empty-state")}>
            <Search size={28} />
            <h2>No interactions found.</h2>
            <p>Try another keyword or explore the full collection.</p>
            <button className={cn("demo-button")} onClick={reset}>
              Reset filters <ArrowRight size={14} />
            </button>
          </div>
        )}
        <section id="about" className={cn("about-section")}>
          <span className={cn("eyebrow")}>THE DETAILS MAKE THE DIFFERENCE</span>
          <div className={cn("about-heading")}>
            <h2>Good interfaces have a feeling.</h2>
            <p>
              A thoughtful collection of motion for the moments in between.
              <br />
              Explore it. Tweak it. Make it yours.
            </p>
          </div>
          <div className={cn("about-cards")}>
            <div>
              <Code2 size={20} />
              <h3>Small by design.</h3>
              <p>
                React components. Plain CSS.
                <br />
                Just the code you need to get moving.
              </p>
              <button onClick={openDocs}>
                Explore the docs <ArrowRight size={15} />
              </button>
            </div>
            <div>
              <ArrowDownAZ size={20} />
              <h3>Made to be explored.</h3>
              <p>
                Try every interaction right here.
                <br />
                Find the little detail your interface needs.
              </p>
              <a href="#library">
                Back to the library <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div>
          <a className={cn("wordmark")} href="/">
            dope<span>/</span>ui<span className={cn("brand-dot")}>.</span>
          </a>
          <p>Thoughtful motion for everyday interfaces.</p>
        </div>
        <div className={cn("footer-links")}>
          <a href="#library">Library</a>
          <button onClick={openDocs}>Documentation</button>
          <a href="/colors.html">Colors</a>
          <a href="#about">About</a>
        </div>
        <span className={cn("footer-note")}>
          {demos.length} little interactions. Endless possibilities.
        </span>
      </footer>
      {(selected || docs) && (
        <CodeDialog
          key={selected?.id ?? "docs"}
          demo={selected}
          docs={docs}
          onClose={() => {
            if (docs) getStarted.current?.focus();
            setSelected(null);
            setDocs(false);
          }}
        />
      )}
    </>
  );
}

export function App() {
  if (["/", "/index.html"].includes(window.location.pathname))
    return <HomePage />;
  const isDetail = window.location.pathname === "/detail.html";
  return isDetail ? (
    <DetailPage
      demo={resolveDetail(new URLSearchParams(window.location.search).get("t"))}
    />
  ) : (
    <LibraryPage />
  );
}
