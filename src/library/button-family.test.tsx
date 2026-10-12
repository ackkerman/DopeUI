// @vitest-environment jsdom
// This file guarantees button demos preserve action semantics without auxiliary click counters.
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import HoverButton from "./components/interactive-hover-button";
import RainbowButton from "./components/rainbow-button";
import { PulsatingButton } from "./components/pulsating-button";

afterEach(cleanup);
it("disables and re-enables Hover Button and does not count clicks", () => {
  const onClick = vi.fn();
  render(<HoverButton onClick={onClick} />);
  const action = screen.getByRole("button", { name: "Hover me" });
  fireEvent.click(screen.getByRole("button", { name: "Disable" }));
  expect((action as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(action);
  expect(onClick).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Enable" }));
  expect((action as HTMLButtonElement).disabled).toBe(false);
  fireEvent.click(action);
  expect(onClick).toHaveBeenCalledOnce();
  expect(screen.queryByText(/Pressed/)).toBeNull();
});
it("preserves Rainbow action callbacks without a click status", () => {
  const onClick = vi.fn();
  render(<RainbowButton onClick={onClick} />);
  fireEvent.click(screen.getByRole("button", { name: "Explore more" }));
  expect(onClick).toHaveBeenCalledOnce();
  expect(screen.queryByText(/Pressed|Try the interaction/)).toBeNull();
});
it("uses the requested pulse color as the resting button fill", () => {
  render(<PulsatingButton pulseColor="#416c91">Pulse</PulsatingButton>);
  expect(
    screen.getByRole("button", { name: "Pulse" }).style.backgroundColor,
  ).toBe("rgb(65, 108, 145)");
});
