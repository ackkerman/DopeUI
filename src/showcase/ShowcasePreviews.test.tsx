// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import {
  PricingPlans,
  ProjectChecklist,
  AccountPreferences,
} from "./ShowcasePreviews";
afterEach(cleanup);
it("connects task completion to the visible project progress", () => {
  const view = render(<ProjectChecklist />);
  fireEvent.click(screen.getByRole("checkbox", { name: "Review the layout" }));
  expect(
    view.container.querySelector(".sc-project-summary .sr-only")?.textContent,
  ).toBe("2");
  expect(
    (view.container.querySelector(".sc-progress-track i") as HTMLElement).style
      .width,
  ).toBe("50%");
});
it("changes the price when yearly billing is selected", () => {
  const view = render(<PricingPlans />);
  fireEvent.click(screen.getByRole("switch"));
  expect(view.container.querySelector(".sc-price")?.textContent).toContain(
    "15",
  );
  expect(
    view.container.querySelector(".resize-card")?.classList.contains("compact"),
  ).toBe(true);
});
it("saves preferences and marks later edits as unsaved", () => {
  render(<AccountPreferences />);
  fireEvent.click(screen.getByRole("button", { name: "Save preferences" }));
  expect(
    screen.getByRole("button", { name: "Preferences saved" }),
  ).toBeTruthy();
  const group = screen.getByLabelText("Product updates");
  fireEvent.click(within(group).getByRole("switch"));
  expect(screen.getByRole("button", { name: "Save preferences" })).toBeTruthy();
});
