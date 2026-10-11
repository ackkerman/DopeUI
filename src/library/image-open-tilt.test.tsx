// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import ImageOpenTilt from "./components/image-open-tilt";

const disconnected = vi.fn();
beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {
        disconnected();
      }
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});
it("opens in place, closes with Escape and permits an outside-stage close", () => {
  const changed = vi.fn();
  const view = render(<ImageOpenTilt onOpenChange={changed} />);
  fireEvent.click(screen.getByRole("button", { name: "Open image" }));
  expect(
    screen
      .getByRole("button", { name: "Close image" })
      .getAttribute("aria-expanded"),
  ).toBe("true");
  fireEvent.keyDown(screen.getByRole("button", { name: "Close image" }), {
    key: "Escape",
  });
  expect(screen.getByRole("button", { name: "Open image" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Open image" }));
  fireEvent.pointerDown(view.container.querySelector(".dui-image-tilt-stage")!);
  expect(changed.mock.calls.map((args) => args[0])).toEqual([
    true,
    false,
    true,
    false,
  ]);
  view.unmount();
  expect(disconnected).toHaveBeenCalledOnce();
});
it("notifies controlled owners and never opens a disabled image", () => {
  const changed = vi.fn();
  const view = render(<ImageOpenTilt open={false} onOpenChange={changed} />);
  fireEvent.click(screen.getByRole("button", { name: "Open image" }));
  expect(changed).toHaveBeenCalledWith(true);
  expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe(
    "false",
  );
  view.rerender(<ImageOpenTilt disabled onOpenChange={changed} />);
  fireEvent.click(screen.getByRole("button"));
  expect(changed).toHaveBeenCalledTimes(1);
});
it("provides a failure fallback and recovers when the caller changes the image", () => {
  const view = render(<ImageOpenTilt src="bad.jpg" alt="Example photo" />);
  fireEvent.error(screen.getByRole("img", { name: "Example photo" }));
  expect(screen.getByText("Image unavailable")).toBeTruthy();
  expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
  view.rerender(<ImageOpenTilt src="good.jpg" alt="Example photo" />);
  expect(screen.getByRole("img", { name: "Example photo" }).tagName).toBe(
    "IMG",
  );
  expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(
    false,
  );
});
it("fits a tall natural image and invalid sizes without stretching or decorative tilt in motion-off mode", () => {
  const view = render(
    <ImageOpenTilt
      motion="off"
      thumbnailWidth={Number.NaN}
      expandedWidth={Number.NaN}
      alt="Tall photo"
    />,
  );
  const image = screen.getByRole("img", { name: "Tall photo" });
  Object.defineProperties(image, {
    naturalWidth: { value: 100 },
    naturalHeight: { value: 1000 },
  });
  fireEvent.load(image);
  const plane = view.container.querySelector<HTMLElement>(
    ".dui-image-tilt-plane",
  )!;
  expect(parseFloat(plane.style.width)).toBeCloseTo(19.2);
  fireEvent.click(screen.getByRole("button", { name: "Open image" }));
  expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  expect(screen.getByRole("button").style.transform).not.toContain("rotateX");
});

it("zooms a single natural image without rotation or duplicated bending layers", () => {
  const view = render(<ImageOpenTilt alt="Zoom photo" />);
  expect(view.container.querySelectorAll("img")).toHaveLength(1);
  const source = readFileSync(
    "src/library/components/image-open-tilt.tsx",
    "utf8",
  );
  expect(source).not.toMatch(/rotateX|rotateY|rotateZ|dui-image-tilt-half/);
});
