// @vitest-environment jsdom
// This file guarantees installation provides the current public commands and navigation.
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { App } from "./App";
import { InstallationPage } from "./InstallationPage";

afterEach(cleanup);
it("shows requirements, copyable install commands and an active Getting started link", () => {
  const view = render(<InstallationPage />);
  expect(
    screen.getByRole("heading", { name: "Installation", level: 1 }),
  ).toBeTruthy();
  const navigation = screen.getByRole("navigation", {
    name: "Getting started",
  });
  expect(
    navigation.querySelector('[aria-current="page"]')?.getAttribute("href"),
  ).toBe("/installation.html");
  expect(
    Array.from(view.container.querySelectorAll("pre code")).some(
      (code) =>
        code.textContent ===
        "npx shadcn@latest add https://ui.0xdope.com/r/like.json",
    ),
  ).toBe(true);
  for (const language of ["tsx", "javascript", "css", "json", "bash"]) {
    expect(
      view.container.querySelector(`.language-${language} .token`),
    ).toBeTruthy();
  }
  expect(view.container.textContent).toContain("React 19 and Tailwind CSS v4");
  expect(view.container.textContent).not.toContain("THIRD_PARTY_NOTICES");
  expect(screen.getAllByRole("button", { name: "Copy code" }).length).toBe(9);
});

it("renders installation at the extensionless URL used by Cloudflare Pages", () => {
  // Given Pages redirects the HTML entry, when App loads, then the guide remains visible.
  const previous = window.location.href;
  try {
    window.history.replaceState(null, "", "/installation");
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Installation", level: 1 }),
    ).toBeTruthy();
  } finally {
    window.history.replaceState(null, "", previous);
  }
});
