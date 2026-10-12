// @vitest-environment jsdom
// This file guarantees Skills provides real install commands and direct public routes.
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { SkillsPage } from "./SkillsPage";
import { App } from "./App";
afterEach(cleanup);
it("shows copyable install commands and the published skill definition", () => {
  const view = render(<SkillsPage />);
  expect(
    screen.getByRole("heading", { name: "Skills", level: 1 }),
  ).toBeTruthy();
  expect(
    Array.from(
      view.container.querySelectorAll("pre code"),
      (code) => code.textContent,
    ),
  ).toContain("npx skills add ackkerman/DopeUI --skill dope-ui");
  expect(screen.getAllByRole("button", { name: "Copy code" }).length).toBe(3);
  expect(
    screen
      .getByRole("link", { name: "Download SKILL.md" })
      .getAttribute("href"),
  ).toBe("/skills/dope-ui/SKILL.md");
  const nav = screen.getByRole("navigation", { name: "Getting started" });
  expect(nav.querySelector('[aria-current="page"]')?.textContent).toBe(
    "Skills",
  );
});
for (const path of ["/skills", "/skills/", "/skills.html"]) {
  it(`renders the skill guide at ${path}`, () => {
    const previous = window.location.href;
    try {
      window.history.replaceState(null, "", path);
      render(<App />);
      expect(
        screen.getByRole("heading", { name: "Skills", level: 1 }),
      ).toBeTruthy();
    } finally {
      window.history.replaceState(null, "", previous);
    }
  });
}
