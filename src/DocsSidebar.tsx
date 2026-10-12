// This file guarantees every documentation page uses the same navigation and active-page semantics.
import { Button } from "./library/primitives/button";
import "./DocsSidebar.css";

const pages = [
  { id: "introduction", label: "Introduction", href: "/introduction.html" },
  { id: "installation", label: "Installation", href: "/installation.html" },
  { id: "colors", label: "Colors", href: "/colors.html" },
] as const;

/** Identifies the current document without changing the shared navigation structure. */
export type DocsPage = (typeof pages)[number]["id"];
export function DocsSidebar({ current }: { current: DocsPage }) {
  return (
    <aside className="detail-sidebar docs-sidebar">
      <nav className="sidebar-section" aria-label="Getting started">
        <span className="sidebar-label">Getting started</span>
        {pages.map((page) => (
          <Button
            key={page.id}
            variant="quiet"
            size="sm"
            href={page.href}
            aria-current={current === page.id ? "page" : undefined}
          >
            {page.label}
          </Button>
        ))}
        <Button variant="quiet" size="sm" href="/library">
          Components
        </Button>
      </nav>
    </aside>
  );
}
