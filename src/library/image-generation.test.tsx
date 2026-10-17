// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { DEMO_PHOTO } from "./demo-image";
import { demos } from "../catalog";
import ImageGenerationDemo, {
  ImageGeneration,
} from "./components/image-generation";

const preferences = vi.hoisted(() => ({ reduce: true }));
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => preferences.reduce,
}));

beforeEach(() => {
  preferences.reduce = true;
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it("maps all controlled states to accessible status while reserving the media ratio", () => {
  // Given caller-owned status and a media surface, state changes keep its dimensions contract.
  const retry = vi.fn();
  const view = render(
    <ImageGeneration
      status="queued"
      prompt="mountains"
      aspectRatio="4 / 3"
      onRetry={retry}
    />,
  );
  for (const [status, text, busy] of [
    ["queued", "Waiting to generate", true],
    ["generating", "Generating image", true],
    ["refining", "Refining details", true],
    ["complete", "Image ready", false],
    ["error", "Generation failed", false],
  ] as const) {
    act(() =>
      view.rerender(
        <ImageGeneration
          status={status}
          prompt="mountains"
          aspectRatio="4 / 3"
          onRetry={retry}
        />,
      ),
    );
    const img = screen.getByRole("img", { name: `${text}: mountains` });
    expect(img.style.aspectRatio).toBe("4 / 3");
    expect(
      view.container.querySelector("[data-slot]")?.getAttribute("aria-busy"),
    ).toBe(String(busy));
    expect(screen.getByText(text)).toBeTruthy();
    expect(Boolean(screen.queryByRole("button", { name: "Try again" }))).toBe(
      status === "error",
    );
  }
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(retry).toHaveBeenCalledTimes(1);
});

it("keeps the prompt and custom label when status is hidden and retry is absent", () => {
  render(
    <ImageGeneration
      status="error"
      label="Preview"
      prompt="mountains"
      showStatus={false}
      resolution=""
      size="fluid"
    >
      <span>Result</span>
    </ImageGeneration>,
  );
  expect(screen.getByRole("img", { name: "Preview" })).toBeTruthy();
  expect(screen.queryByText("Generation failed")).toBeNull();
  expect(screen.queryByRole("button")).toBeNull();
  expect(screen.getByText("“mountains”")).toBeTruthy();
  expect(
    screen.getByText("Result").parentElement?.getAttribute("aria-hidden"),
  ).toBe("true");
});

it("cancels the simulated run on error and restarts from queued on retry", () => {
  // Given an active local demo, errors persist beyond the original completion deadline.
  preferences.reduce = false;
  vi.useFakeTimers();
  const { container, unmount } = render(<ImageGenerationDemo />);
  const status = () =>
    container.querySelector("[data-slot]")?.getAttribute("data-state");
  expect(status()).toBe("queued");
  act(() => vi.advanceTimersByTime(500));
  expect(status()).toBe("generating");
  act(() => vi.advanceTimersByTime(2500));
  expect(status()).toBe("refining");
  fireEvent.click(screen.getByRole("button", { name: "Show error" }));
  act(() => vi.advanceTimersByTime(6000));
  expect(status()).toBe("error");
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(status()).toBe("queued");
  act(() => vi.advanceTimersByTime(5200));
  expect(status()).toBe("complete");
  fireEvent.click(screen.getByRole("button", { name: "Replay" }));
  expect(status()).toBe("queued");
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it("draws a static reduced-motion field again on resize and disconnects the observer", () => {
  const draw = vi.fn();
  const context = {
    setTransform: vi.fn(),
    clearRect: draw,
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  };
  vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
  let resize: () => void = () => {};
  const disconnect = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe = vi.fn();
      disconnect = disconnect;
    },
  );
  const raf = vi.spyOn(window, "requestAnimationFrame");
  const { unmount } = render(<ImageGeneration status="generating" />);
  const frames = draw.mock.calls.length;
  resize();
  expect(draw.mock.calls.length).toBe(frames + 1);
  expect(raf).not.toHaveBeenCalled();
  unmount();
  expect(disconnect).toHaveBeenCalledOnce();
});

it("cancels an active canvas frame and removes pointer listeners on unmount", () => {
  preferences.reduce = false;
  const context = {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  };
  vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(window, "requestAnimationFrame").mockReturnValue(73);
  const cancel = vi.spyOn(window, "cancelAnimationFrame");
  const { container, unmount } = render(<ImageGeneration />);
  const remove = vi.spyOn(
    container.querySelector("canvas")!,
    "removeEventListener",
  );
  unmount();
  expect(cancel).toHaveBeenCalledWith(73);
  expect(remove.mock.calls.map(([event]) => event)).toEqual(
    expect.arrayContaining(["pointermove", "pointerleave"]),
  );
});

it("shows the shared Grid Reveal photo in the Images category", () => {
  const { container } = render(
    <>
      <ImageGenerationDemo />
      <ImageGenerationDemo />
    </>,
  );
  expect(
    [...container.querySelectorAll("[data-slot]")].map((x) =>
      x.getAttribute("data-state"),
    ),
  ).toEqual(["complete", "complete"]);
  expect(
    [...container.querySelectorAll("img")].map((x) => x.getAttribute("src")),
  ).toEqual([DEMO_PHOTO.src, DEMO_PHOTO.src]);
  expect(demos.find((demo) => demo.id === "image-generation")?.category).toBe(
    "Images",
  );
});
