// @vitest-environment jsdom
// This file guarantees the delete demo reports deletion only after confirmation.
import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import DeleteButtonDemo from "./components/delete-button";

afterEach(cleanup);

it("opens confirmation without deleting and reports a confirmed deletion", () => {
  // Given an idle demo, when its trigger opens, then no deletion has occurred.
  render(<DeleteButtonDemo />);
  const trigger = screen.getByRole("button", { name: "Delete" });
  fireEvent.click(trigger);
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  expect(screen.queryByText("Demo item deleted")).toBeNull();
  // When the user confirms, then the demo reports the deletion and restores focus.
  fireEvent.click(screen.getByRole("button", { name: "Confirm delete" }));
  expect(screen.getByText("Demo item deleted")).toBeTruthy();
  expect(document.activeElement).toBe(trigger);
});

it("keeps the demo item when confirmation is cancelled", () => {
  render(<DeleteButtonDemo />);
  fireEvent.click(screen.getByRole("button", { name: "Delete" }));
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.queryByText("Demo item deleted")).toBeNull();
});
