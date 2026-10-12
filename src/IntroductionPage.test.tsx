// @vitest-environment jsdom
// This file guarantees Introduction is a readable document at both public URL forms.
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { App } from "./App";
import { IntroductionPage } from "./IntroductionPage";

afterEach(cleanup);
it("provides a complete introduction with section anchors and installation navigation", () => {
  const { container } = render(<IntroductionPage />);
  expect(
    screen.getByRole("heading", { name: "Introduction", level: 1 }),
  ).toBeTruthy();
  const sidebar = screen.getByRole("navigation", { name: "Getting started" });
  expect(sidebar.querySelector('[aria-current="page"]')?.textContent).toBe(
    "Introduction",
  );
  const toc = screen.getByRole("navigation", { name: "On this page" });
  for (const link of toc.querySelectorAll("a")) {
    expect(container.querySelector(link.getAttribute("href")!)).toBeTruthy();
  }
  expect(screen.getAllByRole("heading", { level: 2 }).length).toBe(5);
  expect(
    screen
      .getAllByRole("link", { name: "Installation" })
      .every((link) => link.getAttribute("href") === "/installation.html"),
  ).toBe(true);
  expect(container.querySelector("dialog")).toBeNull();
});
for (const path of ["/introduction", "/introduction/", "/introduction.html"]) {
  it(`renders Introduction directly at ${path}`, () => {
    const previous = window.location.href;
    try {
      window.history.replaceState(null, "", path);
      render(<App />);
      expect(
        screen.getByRole("heading", { name: "Introduction", level: 1 }),
      ).toBeTruthy();
    } finally {
      window.history.replaceState(null, "", previous);
    }
  });
}
