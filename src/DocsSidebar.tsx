// This file guarantees every documentation page shares expandable section navigation.
import { HookSidebar } from "./library/components/hook-sidebar";
import "./DocsSidebar.css";

const pages = [
  {
    id: "introduction",
    label: "Introduction",
    href: "/introduction.html",
    children: [
      { label: "Editable code", href: "/introduction.html#editable-code" },
      { label: "Composition", href: "/introduction.html#composition" },
      { label: "Shared styles", href: "/introduction.html#shared-style" },
      { label: "Motion", href: "/introduction.html#motion" },
      { label: "Getting started", href: "/introduction.html#getting-started" },
    ],
  },
  {
    id: "installation",
    label: "Installation",
    href: "/installation.html",
    children: [
      { label: "Requirements", href: "/installation.html#requirements" },
      { label: "Using shadcn", href: "/installation.html#shadcn" },
      { label: "Shared styles", href: "/installation.html#styles" },
      { label: "Registry namespace", href: "/installation.html#namespace" },
      { label: "Manual installation", href: "/installation.html#manual" },
    ],
  },
  {
    id: "colors",
    label: "Colors",
    href: "/colors.html",
    children: [
      { label: "Color palette", href: "/colors.html#palette" },
      { label: "Nord primitives", href: "/colors.html#nord" },
      { label: "Example", href: "/colors.html#example" },
      { label: "Semantic tokens", href: "/colors.html#roles" },
      { label: "Use in React", href: "/colors.html#usage" },
    ],
  },
];
/** Identifies the current document while keeping the full navigation shared. */
export type DocsPage = "introduction" | "installation" | "colors";
export function DocsSidebar({ current }: { current: DocsPage }) {
  const active = pages.findIndex((page) => page.id === current);
  return (
    <aside className="detail-sidebar docs-sidebar">
      <HookSidebar
        key={current}
        items={[...pages, { label: "Components", href: "/library" }]}
        label="Getting started"
        value={active}
        defaultExpanded={[active]}
      />
      <nav className="docs-resources" aria-label="AI resources">
        <span className="sidebar-label">AI resources</span>
        <a href="/llms.txt">llms.txt</a>
        <a href="/llms-full.txt">llms-full.txt</a>
      </nav>
    </aside>
  );
}
