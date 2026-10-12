// @vitest-environment jsdom
// This file guarantees docs share identical navigation while identifying the current page.
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { HookSidebar } from "./library/components/hook-sidebar";
import { DocsSidebar, type DocsPage } from "./DocsSidebar";
afterEach(cleanup);
it("keeps the same links and exactly one active page across all docs", () => {
  const view = render(<DocsSidebar current="introduction" />);
  const expected = [
    "/introduction.html",
    "/installation.html",
    "/colors.html",
    "/skills.html",
    "/library",
  ];
  for (const current of [
    "introduction",
    "installation",
    "colors",
    "skills",
  ] as DocsPage[]) {
    view.rerender(<DocsSidebar current={current} />);
    const nav = screen.getByRole("navigation", { name: "Getting started" });
    expect(
      Array.from(nav.querySelectorAll('a:not([href*="#"])'), (a) =>
        a.getAttribute("href"),
      ),
    ).toEqual(expected);
    expect(nav.querySelectorAll('[aria-current="page"]').length).toBe(1);
    expect(
      nav.querySelector('[aria-current="page"]')?.getAttribute("href"),
    ).toBe(`/${current}.html`);
  }
});

it("expands indented Installation sections independently of parent navigation", async () => {
  render(<DocsSidebar current="introduction" />);
  expect(screen.queryByRole("link", { name: "Requirements" })).toBeNull();
  const toggle = screen.getByRole("button", {
    name: "Toggle Installation sections",
  });
  fireEvent.click(toggle);
  expect(toggle.getAttribute("aria-expanded")).toBe("true");
  expect(
    screen.getByRole("link", { name: "Requirements" }).getAttribute("href"),
  ).toBe("/installation.html#requirements");
  expect(
    screen.getByRole("link", { name: "Installation" }).getAttribute("href"),
  ).toBe("/installation.html");
  fireEvent.click(toggle);
  await waitFor(() =>
    expect(screen.queryByRole("link", { name: "Requirements" })).toBeNull(),
  );
});

it("reports controlled expansion without replacing the caller state", () => {
  const onExpandedChange = vi.fn();
  const items = [
    {
      label: "Parent",
      href: "/parent",
      children: [{ label: "Child", href: "/parent#child" }],
    },
  ];
  const view = render(
    <HookSidebar
      items={items}
      expanded={[]}
      onExpandedChange={onExpandedChange}
    />,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Toggle Parent sections" }),
  );
  expect(onExpandedChange).toHaveBeenCalledWith([0]);
  expect(screen.queryByRole("link", { name: "Child" })).toBeNull();
  view.rerender(
    <HookSidebar
      items={items}
      expanded={[0]}
      onExpandedChange={onExpandedChange}
    />,
  );
  expect(screen.getByRole("link", { name: "Child" })).toBeTruthy();
});

it("links to both AI-readable documents from the shared UI", () => {
  render(<DocsSidebar current="colors" />);
  const resources = screen.getByRole("navigation", { name: "AI resources" });
  expect(resources.querySelector('a[href="/llms.txt"]')).toBeTruthy();
  expect(resources.querySelector('a[href="/llms-full.txt"]')).toBeTruthy();
});

it("uses fragment-only links for the current document and full URLs for other documents", () => {
  render(<DocsSidebar current="installation" />);
  expect(
    screen.getByRole("link", { name: "Requirements" }).getAttribute("href"),
  ).toBe("#requirements");
  fireEvent.click(
    screen.getByRole("button", { name: "Toggle Colors sections" }),
  );
  expect(
    screen.getByRole("link", { name: "Color palette" }).getAttribute("href"),
  ).toBe("/colors.html#palette");
});
