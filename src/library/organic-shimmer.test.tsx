// @vitest-environment jsdom
// This file guarantees diagonal travel rotates the band and edge light together.
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import OrganicShimmer, {
  OrganicShimmerSurface,
} from "./components/organic-shimmer";

beforeEach(() => {
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn(() => 1),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("rotates a diagonal band and its edge gradient while retaining finite geometry", () => {
  const view = render(<OrganicShimmerSurface active={false} angle={45} />);
  const band = view.container.querySelector("path")!;
  const edge = view.container.querySelector(
    '[gradientUnits="userSpaceOnUse"]',
  )!;
  expect(band.getAttribute("transform")).toBe("rotate(45 70 70)");
  expect(edge.getAttribute("gradientTransform")).toBe("rotate(45 70 70)");
  expect(band.getAttribute("d")).not.toMatch(/NaN|Infinity/);
  expect(view.container.querySelector('[data-angle="45"]')).toBeTruthy();
});
it("offers diagonal directions and preserves the pause control", () => {
  render(<OrganicShimmer />);
  fireEvent.click(screen.getByRole("button", { name: "Diagonal right" }));
  expect(document.querySelector('[data-angle="45"]')).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Pause shimmer" }));
  expect(document.querySelector('[data-active="false"]')).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Diagonal left" }));
  expect(document.querySelector('[data-angle="135"]')).toBeTruthy();
});
it("reports controlled angle changes and treats non-finite angles as horizontal", () => {
  const onAngleChange = vi.fn();
  const view = render(
    <OrganicShimmer angle={0} onAngleChange={onAngleChange} />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Vertical" }));
  expect(onAngleChange).toHaveBeenCalledWith(90);
  expect(document.querySelector('[data-angle="0"]')).toBeTruthy();
  view.rerender(<OrganicShimmerSurface active={false} angle={Infinity} />);
  expect(document.querySelector('[data-angle="0"]')).toBeTruthy();
});
