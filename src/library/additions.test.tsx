// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { AuroraText } from "./components/aurora-text";
import { AnimatedList } from "./components/animated-list";
import { TypingAnimation } from "./components/terminal";
import { OtpInput } from "./components/otp-input";
import { FluidOrb } from "./components/fluid-orb";
import Toast, { ToastStack } from "./components/toast";
import CardStackHover from "./components/card-stack-hover";
import OrganicShimmer from "./components/organic-shimmer";

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
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("keeps aurora text readable and pauses zero speed without an infinite CSS duration", () => {
  const view = render(
    <AuroraText colors={[]} speed={0}>
      Flow
    </AuroraText>,
  );
  const visual = view.container.querySelector(
    '[aria-hidden="true"]',
  ) as HTMLElement;
  expect(visual.textContent).toBe("Flow");
  expect(visual.style.animationPlayState).toBe("paused");
  expect(visual.style.animationDuration).toBe("10s");
  expect(view.container.querySelector(".sr-only")?.textContent).toBe("Flow");
});
it("pauses list arrivals, resumes once and supports an empty list", () => {
  vi.useFakeTimers();
  const children = [<span key="a">First</span>, <span key="b">Second</span>];
  const view = render(
    <AnimatedList delay={100} paused>
      {children}
    </AnimatedList>,
  );
  act(() => vi.advanceTimersByTime(300));
  expect(view.container.textContent).toBe("First");
  view.rerender(<AnimatedList delay={100}>{children}</AnimatedList>);
  act(() => vi.advanceTimersByTime(100));
  expect(view.container.textContent).toBe("SecondFirst");
  view.unmount();
  const empty = render(<AnimatedList>{[]}</AnimatedList>);
  expect(empty.container.textContent).toBe("");
});
it("types terminal text once and cancels its timers on unmount", () => {
  vi.useFakeTimers();
  const view = render(
    <TypingAnimation duration={10} startOnView={false}>
      Done
    </TypingAnimation>,
  );
  act(() => vi.advanceTimersByTime(0));
  act(() => vi.advanceTimersByTime(60));
  expect(
    view.container.querySelector('[aria-hidden="true"]')?.textContent,
  ).toBe("Done");
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});
it("filters pasted OTP characters and handles backspace in place then moving back", () => {
  const onComplete = vi.fn();
  render(<OtpInput onComplete={onComplete} />);
  const first = screen.getByLabelText("Digit 1 of 6");
  fireEvent.paste(first, { clipboardData: { getData: () => "a1b2c3d4e5f6" } });
  expect(onComplete).toHaveBeenCalledWith("123456");
  const last = screen.getByLabelText("Digit 6 of 6") as HTMLInputElement;
  fireEvent.keyDown(last, { key: "Backspace" });
  expect(last.value).toBe("");
  fireEvent.keyDown(last, { key: "Backspace" });
  expect(
    (screen.getByLabelText("Digit 5 of 6") as HTMLInputElement).value,
  ).toBe("");
  expect(document.activeElement).toBe(screen.getByLabelText("Digit 5 of 6"));
  expect(onComplete).toHaveBeenCalledTimes(1);
});
it("keeps OTP controlled while reporting edits and provides native disabled fields", () => {
  const onChange = vi.fn();
  const view = render(<OtpInput value="123456" onChange={onChange} />);
  fireEvent.keyDown(screen.getByLabelText("Digit 6 of 6"), {
    key: "Backspace",
  });
  expect(onChange).toHaveBeenCalledWith("12345");
  expect(
    (screen.getByLabelText("Digit 6 of 6") as HTMLInputElement).value,
  ).toBe("6");
  view.rerender(<OtpInput disabled />);
  expect(
    (screen.getByLabelText("Digit 1 of 6") as HTMLInputElement).disabled,
  ).toBe(true);
});
it("caps visible toast layers and dismisses a notification without changing the other ids", () => {
  const onDismiss = vi.fn();
  const items = [1, 2, 3, 4].map((index) => ({
    id: String(index),
    title: `Notice ${index}`,
  }));
  const view = render(
    <ToastStack items={items} maxVisible={3} onDismiss={onDismiss} />,
  );
  expect(view.container.querySelectorAll(".dui-stack-toast")).toHaveLength(3);
  fireEvent.mouseEnter(screen.getByRole("log"));
  fireEvent.click(screen.getByRole("button", { name: "Dismiss Notice 2" }));
  expect(onDismiss).toHaveBeenCalledWith("2");
  expect(items.map((item) => item.id)).toEqual(["1", "2", "3", "4"]);
});
it("preserves the single-toast API while allowing a queued stack and clear action", () => {
  const view = render(<Toast />);
  fireEvent.click(screen.getByRole("button", { name: "Toggle toast" }));
  expect(view.container.querySelector(".mini-toast.opened")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Stacked" }));
  const add = screen.getByRole("button", { name: "Add toast" });
  fireEvent.click(add);
  fireEvent.click(add);
  fireEvent.click(add);
  fireEvent.click(add);
  expect(view.container.querySelectorAll(".dui-stack-toast")).toHaveLength(3);
  fireEvent.click(screen.getByRole("button", { name: "Clear notifications" }));
  expect(view.container.querySelectorAll(".dui-stack-toast")).toHaveLength(0);
});
it("omits photo credits and offers a readable fallback when an attachment fails", () => {
  const view = render(<CardStackHover />);
  expect(view.container.querySelectorAll("img")).toHaveLength(3);
  expect(screen.queryByRole("link", { name: "Igor Rand" })).toBeNull();
  fireEvent.error(
    screen.getByRole("img", { name: "Portrait lit by blue and pink light" }),
  );
  expect(view.container.querySelectorAll("img")).toHaveLength(2);
  expect(view.container.textContent).toContain("Portrait");
  fireEvent.click(screen.getByRole("button", { name: "Expand stack" }));
  expect(screen.getByRole("button", { name: "Collapse stack" })).toBeTruthy();
});
it("keeps an orb fallback and a label when WebGL is unavailable", () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  const view = render(<FluidOrb size={180} />);
  expect(screen.getByRole("img", { name: "Fluid orb" })).toBeTruthy();
  expect(
    (view.container.firstChild as HTMLElement).style.backgroundImage,
  ).toContain("radial-gradient");
  expect(
    view.container.querySelector("canvas")?.getAttribute("aria-hidden"),
  ).toBe("true");
});
it("moves the shimmer band and edge together, then pauses and releases its frame", () => {
  const frames: FrameRequestCallback[] = [];
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    }),
  );
  const cancel = vi.fn();
  vi.stubGlobal("cancelAnimationFrame", cancel);
  vi.spyOn(performance, "now").mockReturnValue(0);
  const view = render(<OrganicShimmer />);
  const path = view.container.querySelector("svg > path")!;
  const gradient = view.container.querySelector(
    'linearGradient[gradientUnits="userSpaceOnUse"]',
  )!;
  const before = path.getAttribute("d");
  const edgeBefore = gradient.getAttribute("x1");
  act(() => frames[0](1500));
  expect(path.getAttribute("d")).not.toBe(before);
  expect(gradient.getAttribute("x1")).not.toBe(edgeBefore);
  fireEvent.click(screen.getByRole("button", { name: "Pause shimmer" }));
  const paused = path.getAttribute("d");
  act(() => frames[frames.length - 1](2000));
  expect(path.getAttribute("d")).toBe(paused);
  view.unmount();
  expect(cancel).toHaveBeenCalled();
});
it("ships shared role tokens and keeps Unsplash media licensing separate from MIT code", () => {
  const css = readFileSync("public/library/foundation.css", "utf8");
  for (const token of [
    "--dui-demo-padding",
    "--dui-radius-surface",
    "--dui-control-padding",
    "--dui-duration-standard",
    "--dui-ease-spring",
  ])
    expect(css).toContain(token);
  expect(css).toContain("svg[data-dui-icon]");
  const notices = readFileSync("THIRD_PARTY_NOTICES.txt", "utf8");
  expect(notices).toContain("Card Stack Hover demo photos");
  expect(notices).toContain("Unsplash License (not MIT)");
  expect(notices).toContain("14 components");
});

it("reveals words with staggered delays and preserves pause and replay", async () => {
  const { default: StreamingText, StreamingWords } =
    await import("./components/streaming-text");
  const complete = vi.fn();
  const view = render(
    <StreamingWords text="Ideas become clear" paused onComplete={complete} />,
  );
  const words = view.container.querySelectorAll<HTMLElement>(
    ".dui-streaming-word",
  );
  expect(words).toHaveLength(3);
  expect(words[1].style.animationDelay).toBe("110ms");
  expect(words[2].style.animationPlayState).toBe("paused");
  // jsdom exposes the WebKit animation event name to React when AnimationEvent is absent.
  fireEvent.animationEnd(words[2]);
  fireEvent(words[2], new Event("webkitAnimationEnd", { bubbles: true }));
  expect(complete).toHaveBeenCalledOnce();
  view.rerender(<StreamingWords text="Ideas become clear" motion={false} />);
  expect(view.container.querySelector("p")?.dataset.motion).toBe("false");
  view.unmount();
  const demo = render(<StreamingText text="Hello world" />);
  const first = demo.container.querySelector("p");
  fireEvent.click(screen.getByRole("button", { name: "Pause" }));
  expect(
    demo.container.querySelector<HTMLElement>(".dui-streaming-word")?.style
      .animationPlayState,
  ).toBe("paused");
  fireEvent.click(screen.getByRole("button", { name: "Animate" }));
  expect(demo.container.querySelector("p")).not.toBe(first);
});
it("shows four representative loaders by default and every pattern in the full gallery", async () => {
  const {
    default: DotLoader,
    LoadingPatternGallery,
    LOADING_VARIANTS,
  } = await import("./components/dot-loader");
  const view = render(<DotLoader />);
  expect(
    view.container.querySelectorAll(".dui-loading-indicator"),
  ).toHaveLength(4);
  fireEvent.click(screen.getByRole("button", { name: /Pause/ }));
  expect(view.container.querySelectorAll('[data-paused="true"]')).toHaveLength(
    4,
  );
  view.unmount();
  const copy = vi.fn();
  const grid = render(
    <LoadingPatternGallery onCopySnippet={copy} playState="paused" />,
  );
  expect(
    grid.container.querySelectorAll(".dui-loading-indicator"),
  ).toHaveLength(LOADING_VARIANTS.length);
  expect(LOADING_VARIANTS).toHaveLength(30);
  expect(grid.container.querySelectorAll('[data-paused="true"]')).toHaveLength(
    30,
  );
  fireEvent.click(screen.getAllByRole("button")[0]);
  expect(copy).toHaveBeenCalledWith("matrix");
});
