// @vitest-environment jsdom
// This file guarantees docs share identical navigation while identifying the current page.
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { DocsSidebar, type DocsPage } from "./DocsSidebar";
afterEach(cleanup);
it("keeps the same links and exactly one active page across all docs", () => {
  const view = render(<DocsSidebar current="introduction" />);
  const expected = [
    "/introduction.html",
    "/installation.html",
    "/colors.html",
    "/library",
  ];
  for (const current of [
    "introduction",
    "installation",
    "colors",
  ] as DocsPage[]) {
    view.rerender(<DocsSidebar current={current} />);
    const nav = screen.getByRole("navigation", { name: "Getting started" });
    expect(
      Array.from(nav.querySelectorAll("a"), (a) => a.getAttribute("href")),
    ).toEqual(expected);
    expect(nav.querySelectorAll('[aria-current="page"]').length).toBe(1);
    expect(
      nav.querySelector('[aria-current="page"]')?.getAttribute("href"),
    ).toBe(`/${current}.html`);
  }
});
