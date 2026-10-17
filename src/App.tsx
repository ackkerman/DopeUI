import { SkillsPage } from "./SkillsPage";
import { SiteHeader } from "./SiteHeader";
import { GlideMenu } from "./library/primitives/glide-menu";
import { SiteSearch } from "./SiteSearch";
import { SiteTabs } from "./SiteTabs";
import { Button } from "./library/primitives/button";
import { IntroductionPage } from "./IntroductionPage";
import { InstallationPage } from "./InstallationPage";
import { useMasonryLayout } from "./use-masonry-layout";
import { HomePage } from "./HomePage";
import { cn } from "./class-names";
import { DetailPage } from "./DetailPage";
import { detailHref, isDetailPath, resolveDetail } from "./detail-navigation";

// This file guarantees a searchable library with local, independent previews.
import { useEffect, useRef, useState } from "react";
import {
  ArrowDownAZ,
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
  const search = useRef<HTMLInputElement>(null);
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
      <SiteHeader
        navigation={
          <>
            <a className={cn("nav-active")} href="#library">
              Library
            </a>
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
                label="Search library"
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
              aria-label="Toggle navigation"
              aria-expanded={mobileMenu}
              onClick={() => setMobileMenu((v) => !v)}
            >
              {mobileMenu ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </>
        }
        mobileNav={
          mobileMenu && (
            <nav className={cn("mobile-nav")} aria-label="Mobile navigation">
              <a href="#library" onClick={() => setMobileMenu(false)}>
                Library
              </a>
              <Button variant="quiet" size="sm" href="/introduction.html">
                Docs
              </Button>
              <a href="/colors.html">Colors</a>
            </nav>
          )
        }
      />
      <main id="library">
        <section className={cn("intro")}>
          <h1>
            Library<span className={cn("heading-dot")}>.</span>
          </h1>
          <p>Small interactions. A little more feeling.</p>
        </section>
        <div className={cn("toolbar")}>
          <div className={cn("category-scroll")}>
            <SiteTabs
              items={categories}
              value={category}
              onValueChange={setCategory}
              label="Filter by category"
              className="categories"
            />
          </div>
          <div className={cn("toolbar-end")}>
            <span className={cn("result-count")} aria-live="polite">
              {results.length} interactions
            </span>
            <div className={cn("sort-area")} ref={sortArea}>
              <Button
                variant="quiet"
                size="sm"
                className={cn(
                  `icon-button sort-trigger ${sortOpen ? "selected" : ""}`,
                )}
                aria-label="Sort interactions"
                aria-expanded={sortOpen}
                onClick={() => setSortOpen((v) => !v)}
              >
                <SlidersHorizontal size={16} />
              </Button>
              {sortOpen && (
                <GlideMenu className="sort-menu" rowSelector="button">
                  <span>Sort by</span>
                  {(
                    [
                      ["featured", "Featured"],
                      ["az", "Name: A–Z"],
                      ["za", "Name: Z–A"],
                    ] as const
                  ).map(([value, label]) => (
                    <Button
                      variant="quiet"
                      size="sm"
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
                    </Button>
                  ))}
                </GlideMenu>
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
                  <Button
                    variant="quiet"
                    size="sm"
                    className={cn("code-button")}
                    aria-label={`View code for ${d.title}`}
                    title="View code"
                    onClick={() => setSelected(d)}
                  >
                    <Code2 size={16} />
                  </Button>
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
            <Button
              variant="quiet"
              size="sm"
              className={cn("demo-button")}
              onClick={reset}
            >
              Reset filters <ArrowRight size={14} />
            </Button>
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
              <Button variant="quiet" size="sm" href="/introduction.html">
                Explore the docs <ArrowRight size={15} />
              </Button>
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
          <Button variant="quiet" size="sm" href="/introduction.html">
            Documentation
          </Button>
          <a href="/colors.html">Colors</a>
          <a href="#about">About</a>
        </div>
        <span className={cn("footer-note")}>
          {demos.length} little interactions. Endless possibilities.
        </span>
      </footer>
      {selected && (
        <CodeDialog
          key={selected.id}
          demo={selected}
          docs={false}
          onClose={() => {
            setSelected(null);
          }}
        />
      )}
    </>
  );
}

export function App() {
  if (
    ["/skills", "/skills/", "/skills.html"].includes(window.location.pathname)
  )
    return <SkillsPage />;
  if (
    ["/introduction", "/introduction/", "/introduction.html"].includes(
      window.location.pathname,
    )
  )
    return <IntroductionPage />;
  // Pages canonicalizes static HTML URLs to extensionless paths.
  if (
    ["/installation", "/installation/", "/installation.html"].includes(
      window.location.pathname,
    )
  )
    return <InstallationPage />;
  if (["/", "/index.html"].includes(window.location.pathname))
    return <HomePage />;
  const isDetail = isDetailPath(window.location.pathname);
  return isDetail ? (
    <DetailPage
      demo={resolveDetail(new URLSearchParams(window.location.search).get("t"))}
    />
  ) : (
    <LibraryPage />
  );
}
