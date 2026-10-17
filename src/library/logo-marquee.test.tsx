// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import LogoMarqueeDemo, { LogoMarquee } from "./components/logo-marquee";

let resize: () => void;
const disconnect = vi.fn();
beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

it("exposes each company once while keeping the repeated visual strip inert", () => {
  // Given a short list, when its viewport grows, then copies fill it without repeated announcements.
  const view = render(
    <LogoMarquee items={[{ name: "Example", src: "logo.svg" }]} />,
  );
  const region = screen.getByRole("region");
  expect(region.getAttribute("data-pause-on-hover")).toBe("false");
  Object.defineProperty(region, "clientWidth", { value: 1000 });
  const original = view.container.querySelector(".dui-marquee-set")!;
  Object.defineProperty(original, "getBoundingClientRect", {
    value: () => ({ width: 120 }),
  });
  act(() => resize());
  expect(screen.getAllByRole("img", { name: "Example" })).toHaveLength(1);
  expect(view.container.querySelectorAll("img")).toHaveLength(16);
  expect(
    view.container
      .querySelector('.dui-marquee-group[aria-hidden="true"]')
      ?.hasAttribute("inert"),
  ).toBe(true);
  view.unmount();
  expect(disconnect).toHaveBeenCalledOnce();
});

it("falls back to company names for failed images and retries a changed source", () => {
  // Given an unavailable logo, when loading fails, then its name remains visible.
  const view = render(
    <LogoMarquee items={[{ name: "Example", src: "bad.svg" }]} />,
  );
  fireEvent.error(screen.getByRole("img", { name: "Example" }));
  expect(screen.queryByRole("img", { name: "Example" })).toBeNull();
  expect(screen.getByRole("listitem").textContent).toBe("Example");
  view.rerender(<LogoMarquee items={[{ name: "Example", src: "good.svg" }]} />);
  expect(screen.getByRole("img", { name: "Example" }).getAttribute("src")).toBe(
    "good.svg",
  );
});

it("handles empty lists and rejects invalid animation dimensions", () => {
  // Given invalid numeric input and no companies, then no invalid CSS or logo is rendered.
  const view = render(<LogoMarquee items={[]} duration={NaN} gap={-10} />);
  const region = screen.getByRole("region");
  expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  expect(region.style.getPropertyValue("--dui-marquee-duration")).toBe("28s");
  expect(region.style.getPropertyValue("--dui-marquee-gap")).toBe("16px");
  view.rerender(<LogoMarquee duration={0} gap={0} pauseOnHover={false} />);
  expect(region.style.getPropertyValue("--dui-marquee-duration")).toBe("28s");
  expect(region.style.getPropertyValue("--dui-marquee-gap")).toBe("0px");
  expect(region.getAttribute("data-pause-on-hover")).toBe("false");
});

it("pauses, resumes, reverses, and adjusts speed and spacing", () => {
  // Given the default strip, when its controls are used, then their pressed state matches the animation.
  render(<LogoMarqueeDemo />);
  const region = screen.getByRole("region");
  const spacing = screen.getByRole("slider", { name: "Logo spacing" });
  fireEvent.change(spacing, { target: { value: "48" } });
  expect(region.style.getPropertyValue("--dui-marquee-gap")).toBe("48px");
  expect(screen.getByText("48px")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Pause" }));
  expect(region.getAttribute("data-paused")).toBe("true");
  fireEvent.click(screen.getByRole("button", { name: "Resume" }));
  expect(region.getAttribute("data-paused")).toBe("false");
  fireEvent.click(screen.getByRole("button", { name: "Reverse" }));
  expect(region.getAttribute("data-direction")).toBe("right");
  fireEvent.click(screen.getByRole("button", { name: "Speed 1×" }));
  expect(region.style.getPropertyValue("--dui-marquee-duration")).toBe("14s");
  expect(
    screen
      .getByRole("button", { name: "Speed 2×" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
});
