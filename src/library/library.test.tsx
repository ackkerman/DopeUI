import AiTaskRows from "./components/ai-task-rows";
import Like from "./components/like";
import SafariDemo from "./components/safari";
import IphoneDemo from "./components/iphone";
import AndroidDemo from "./components/android";
import DottedMapDemo from "./components/dotted-map";
import AnimatedThemeTogglerDemo from "./components/animated-theme-toggler";
import { VideoText } from "./components/video-text";
import ScrollBasedVelocityDemo from "./components/scroll-based-velocity";
import HighlighterDemo from "./components/highlighter";
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement, createRef } from "react";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { cn } from "../class-names";
import { ProgressiveBlur } from "./components/progressive-blur";
import ProgressiveBlurDemo from "./components/progressive-blur";
import DockDemo from "./components/dock";
import HookSidebarDemo from "./components/hook-sidebar";
import NotificationBellDemo from "./components/notification-bell";
import RailTocDemo from "./components/rail-toc";
import ScrollProgressDemo from "./components/scroll-progress";
import { GridReveal } from "./components/grid-reveal";
import CardResize from "./components/card-resize";
import SlidingTabs from "./components/sliding-tabs";
import SpringToggle from "./components/switch";
import { libraryEntries } from "./registry";
import { demos } from "../catalog";

afterEach(cleanup);

describe("copyable component contracts", () => {
  it("uses the composed canonical dependency graph for every copyable source", async () => {
    for (const demo of demos) {
      const entry = libraryEntries[demo.id];
      const actual = readFileSync(
        `src/library/distribution/${demo.id}.tsx`,
        "utf8",
      );
      const source = await entry.loadSource();
      expect(source).toBe(actual);
      const file = ts.createSourceFile(
        entry.filename,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      const imports = file.statements
        .filter(ts.isImportDeclaration)
        .map(
          (n) => (n.moduleSpecifier as import("typescript").StringLiteral).text,
        );
      expect(
        [
          ...new Set(
            imports.map((m) =>
              m
                .split("/")
                .slice(0, m.startsWith("@") ? 2 : 1)
                .join("/"),
            ),
          ),
        ].sort(),
      ).toEqual([...entry.dependencies].sort());
      expect(source.startsWith('"use client";')).toBe(true);
      const html = renderToStaticMarkup(createElement(entry.Component));
      expect(source).not.toMatch(/<style(?:\s|>)/);
      if (demo.id === "dot-loader") {
        const resources = html.match(/<style[^>]*>/g) ?? [];
        expect(
          resources.every(
            (tag) =>
              tag.includes('data-precedence="loading-dev"') &&
              tag.includes('data-href="ld-'),
          ),
        ).toBe(true);
      } else expect(html).not.toContain(`<style`);
      expect(html).toContain(`dui-${demo.id}`);
    }
  }, 60000);
  it("provides a shared Tailwind foundation and resolves conflicting classes", () => {
    const foundation = readFileSync("src/library/foundation.css", "utf8");
    expect(foundation).toContain('@import "tailwindcss"');
    expect(foundation).toContain("prefers-reduced-motion");
    for (const demo of demos) expect(foundation).toContain(`.dui-${demo.id}`);
    expect(cn("p-2 text-sm", false, { "p-4": true })).toBe("text-sm p-4");
  });
  it("keeps independent uncontrolled instances from changing one another or submitting a form", () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    const view = render(
      <form onSubmit={onSubmit}>
        <CardResize data-testid="first" />
        <CardResize data-testid="second" />
      </form>,
    );
    fireEvent.click(
      within(screen.getByTestId("first")).getByRole("button", {
        name: "Animate",
      }),
    );
    expect(
      view.container.querySelector('[data-testid="first"] .compact'),
    ).not.toBeNull();
    expect(
      view.container.querySelector('[data-testid="second"] .compact'),
    ).toBeNull();
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it("notifies controlled state owners without secretly changing their supplied value", () => {
    const changed = vi.fn();
    const view = render(
      <CardResize compact={false} onCompactChange={changed} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Animate" }));
    expect(changed).toHaveBeenCalledWith(true);
    expect(view.container.querySelector(".compact")).toBeNull();
    view.rerender(<CardResize compact onCompactChange={changed} />);
    expect(view.container.querySelector(".compact")).not.toBeNull();
  });
  it("honors disabled controls and exposes switch state", () => {
    const view = render(<SpringToggle disabled />);
    const control = screen.getByRole("switch");
    fireEvent.click(control);
    expect(control.getAttribute("aria-checked")).toBe("false");
    view.rerender(<SpringToggle />);
    fireEvent.click(control);
    expect(control.getAttribute("aria-checked")).toBe("true");
  });
  it("provides keyboard tabs and noncolliding panel IDs for multiple instances", () => {
    render(
      <>
        <SlidingTabs data-testid="a" />
        <SlidingTabs data-testid="b" />
      </>,
    );
    const a = within(screen.getByTestId("a"));
    const b = within(screen.getByTestId("b"));
    const first = a.getByRole("tab", { name: "Design" });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(
      a.getByRole("tab", { name: "Build" }).getAttribute("aria-selected"),
    ).toBe("true");
    expect(a.getByRole("tab", { name: "Build" })).toBe(document.activeElement);
    expect(
      b.getByRole("tab", { name: "Design" }).getAttribute("aria-selected"),
    ).toBe("true");
    expect(a.getByRole("tabpanel").id).not.toBe(b.getByRole("tabpanel").id);
  });
  it("allows an explicit motion override without injecting per-instance CSS", () => {
    const view = render(<CardResize motion="off" />);
    expect(view.container.querySelector("style")).toBeNull();
    expect(
      view.container
        .querySelector(".dui-card-resize")
        ?.getAttribute("data-motion"),
    ).toBe("off");
  });
});

it("forwards a React 19 root ref for composition with host application behavior", () => {
  const ref = createRef<HTMLDivElement>();
  render(<CardResize ref={ref} />);
  expect(ref.current?.classList.contains("dui-card-resize")).toBe(true);
});

it("keeps scroll navigation outside the independently scrollable article", () => {
  // Given either scrolling demo, its control must stay visible as the article scrolls.
  for (const html of [
    renderToStaticMarkup(<RailTocDemo />),
    renderToStaticMarkup(<ScrollProgressDemo />),
  ]) {
    const tree = document.createElement("div");
    tree.innerHTML = html;
    const article = tree.querySelector('[data-slot="scroll-demo-content"]')!;
    const control = tree.querySelector('nav, [data-slot="scroll-progress"]')!;
    expect(article.contains(control)).toBe(false);
    expect(article.parentElement!.contains(control)).toBe(true);
    expect(article.querySelectorAll("section")).toHaveLength(4);
  }
});

it("switches the sidebar article together with the selected item", () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
  try {
    render(<HookSidebarDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Sources" }));
    expect(
      within(
        screen.getByRole("article", { name: "Sources content" }),
      ).getByRole("heading", { name: "Sources" }),
    ).toBeTruthy();
  } finally {
    cleanup();
    vi.unstubAllGlobals();
  }
});

it("scrolls only the embedded article when a progress section is selected", () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
  try {
    const view = render(<ScrollProgressDemo />);
    const article = view.container.querySelector(
      '[data-slot="scroll-demo-content"]',
    ) as HTMLDivElement;
    article.scrollTo = vi.fn();
    fireEvent.click(screen.getByRole("button", { name: "Show sections" }));
    fireEvent.click(screen.getByRole("button", { name: "Review" }));
    expect(article.scrollTo).toHaveBeenCalledOnce();
    expect(
      view.container.querySelector('[data-slot="scroll-demo-frame"]')
        ?.scrollTop,
    ).toBe(0);
  } finally {
    cleanup();
    vi.unstubAllGlobals();
  }
});

it("uses a loaded portrait image ratio when the caller supplies no frame aspect", () => {
  const images: { onload?: () => void }[] = [];
  class PortraitImage {
    naturalWidth = 600;
    naturalHeight = 1200;
    src = "";
    onload?: () => void;
    constructor() {
      images.push(this);
    }
  }
  const context = {
    fillRect: vi.fn(),
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(128 * 128 * 4) })),
  };
  const canvas = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context as unknown as CanvasRenderingContext2D);
  vi.stubGlobal("Image", PortraitImage);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = vi.fn();
      disconnect = vi.fn();
    },
  );
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn(() => 1),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  try {
    const view = render(<GridReveal src="portrait.jpg" />);
    act(() => images[0].onload?.());
    const frame = view.container.querySelector(
      '[data-slot="grid-reveal"]',
    ) as HTMLElement;
    const [width, height = 1] = frame.style.aspectRatio.split("/").map(Number);
    expect(width / height).toBe(0.5);
    expect(frame.classList.contains("shrink-0")).toBe(true);
  } finally {
    cleanup();
    canvas.mockRestore();
    vi.unstubAllGlobals();
  }
});

it("adds and clears bell notifications while preserving a controlled count", () => {
  const view = render(<NotificationBellDemo />);
  fireEvent.click(screen.getByRole("button", { name: "Animate" }));
  expect(
    screen.getByRole("button", { name: "Notifications, 1 unread" }),
  ).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Animate" }));
  expect(
    screen.getByRole("button", { name: "Notifications, 2 unread" }),
  ).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Clear" }));
  expect(screen.getByRole("button", { name: "Notifications" })).toBeTruthy();
  view.rerender(<NotificationBellDemo count={7} />);
  fireEvent.click(screen.getByRole("button", { name: "Animate" }));
  expect(
    screen.getByRole("button", { name: "Notifications, 7 unread" }),
  ).toBeTruthy();
});

it("allows keyboard users to select a labeled Dock action", () => {
  render(<DockDemo disableMagnification />);
  const inbox = screen.getByRole("button", { name: "Inbox" });
  fireEvent.click(inbox);
  expect(inbox.getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByRole("status").textContent).toBe("Inbox");
});

it("renders both blur edges and accepts short or empty blur level arrays", () => {
  const view = render(<ProgressiveBlur position="both" blurLevels={[8]} />);
  expect(
    view.container.querySelectorAll('[data-slot="progressive-blur"]'),
  ).toHaveLength(2);
  expect(view.container.querySelector(".top-0")).not.toBeNull();
  expect(view.container.querySelector(".bottom-0")).not.toBeNull();
  view.rerender(<ProgressiveBlur blurLevels={[]} />);
  expect(
    view.container.querySelector('[data-slot="progressive-blur"]'),
  ).toBeNull();
});
it("changes progressive blur position and allows disabling the overlay", () => {
  const view = render(<ProgressiveBlurDemo />);
  fireEvent.click(screen.getByRole("button", { name: "Top" }));
  expect(
    view.container
      .querySelector('[data-slot="progressive-blur"]')
      ?.classList.contains("top-0"),
  ).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Disable blur" }));
  expect(
    view.container.querySelector('[data-slot="progressive-blur"]'),
  ).toBeNull();
});

it("toggles the preview between light and dark without changing the document theme", () => {
  const before = document.documentElement.className;
  const view = render(<AnimatedThemeTogglerDemo />);
  const button = screen.getByRole("button", { name: "Toggle theme" });
  fireEvent.click(button);
  expect(screen.getByRole("heading", { name: "Night mode" })).toBeTruthy();
  expect(button.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(button);
  expect(screen.getByRole("heading", { name: "Day mode" })).toBeTruthy();
  expect(document.documentElement.className).toBe(before);
  expect(view.container.querySelector(".dark")).toBeNull();
});
it("escapes video text inside its SVG mask and preserves a readable fallback", () => {
  const view = render(<VideoText src="movie.webm">{"<tag> & text"}</VideoText>);
  const mask =
    view.container.querySelector<HTMLElement>("video")!.parentElement!.style
      .maskImage;
  expect(decodeURIComponent(mask)).toContain("&lt;tag&gt; &amp; text");
  expect(view.container.querySelector("tag")).toBeNull();
  expect(view.container.textContent).toContain("<tag> & text");
});
it("can pause and reverse the scroll velocity demo", () => {
  const view = render(<ScrollBasedVelocityDemo />);
  fireEvent.click(screen.getByRole("button", { name: "Pause" }));
  expect(screen.getByRole("button", { name: "Play" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Reverse direction" }));
  expect(
    screen
      .getByRole("button", { name: "Reverse direction" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  expect(view.container.textContent).toContain("SCROLL WITH FEELING");
});
it("switches highlighter annotation styles and removes its generated SVG on cleanup", () => {
  const view = render(<HighlighterDemo />);
  fireEvent.click(screen.getByRole("button", { name: "Underline" }));
  expect(
    screen
      .getByRole("button", { name: "Underline" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  expect(view.container.textContent).toContain("the little details");
  view.unmount();
  expect(view.container.querySelector("svg")).toBeNull();
});

it("keeps device previews empty until a caller supplies media", () => {
  for (const Component of [SafariDemo, IphoneDemo, AndroidDemo]) {
    const markup = renderToStaticMarkup(<Component />);
    expect(markup).not.toMatch(/<image\b|<video\b|<img\b/);
    expect(markup).toContain("<svg");
    expect(markup).not.toContain("dope/ui preview");
  }
});
it("gives every device instance distinct SVG ids", () => {
  for (const Component of [SafariDemo, IphoneDemo, AndroidDemo]) {
    const view = render(
      <>
        <Component />
        <Component />
      </>,
    );
    const ids = Array.from(
      view.container.querySelectorAll("[id]"),
      (element) => element.id,
    );
    expect(new Set(ids).size).toBe(ids.length);
    view.unmount();
  }
});
it("uses explicit visible map dots and preserves a caller color override", () => {
  const view = render(<DottedMapDemo mapSamples={20} />);
  expect(view.container.querySelector("svg circle")?.getAttribute("r")).toBe(
    "0.38",
  );
  expect(view.container.querySelector("svg circle")?.getAttribute("fill")).toBe(
    "#3b4252",
  );
  view.rerender(<DottedMapDemo mapSamples={20} dotColor="#123456" />);
  expect(view.container.querySelector("svg circle")?.getAttribute("fill")).toBe(
    "#123456",
  );
});

it("bursts eight heart-centred rays only on liking and restarts them on the next like", () => {
  const onPressedChange = vi.fn();
  const view = render(<Like onPressedChange={onPressedChange} />);
  const button = screen.getByRole("button", { name: "Like" });
  fireEvent.click(button);
  expect(button.getAttribute("aria-pressed")).toBe("true");
  expect(view.container.querySelectorAll(".dui-like-rays i")).toHaveLength(8);
  const first = view.container.querySelector(".dui-like-rays");
  fireEvent.click(button);
  expect(button.getAttribute("aria-pressed")).toBe("false");
  expect(view.container.querySelector(".dui-like-rays")).toBeNull();
  fireEvent.click(button);
  expect(view.container.querySelector(".dui-like-rays")).not.toBe(first);
  expect(onPressedChange.mock.calls.map(([value]) => value)).toEqual([
    true,
    false,
    true,
  ]);
});
it("keeps Like state controlled and omits its celebration when motion is off", () => {
  const onPressedChange = vi.fn();
  const view = render(
    <Like pressed={false} onPressedChange={onPressedChange} motion="off" />,
  );
  const button = screen.getByRole("button", { name: "Like" });
  fireEvent.click(button);
  expect(onPressedChange).toHaveBeenCalledWith(true);
  expect(button.getAttribute("aria-pressed")).toBe("false");
  expect(view.container.querySelector(".dui-like-rays")).toBeNull();
  view.rerender(<Like disabled onPressedChange={onPressedChange} />);
  fireEvent.click(button);
  expect(onPressedChange).toHaveBeenCalledTimes(1);
});

it("keeps long task labels and metadata available in both row variants", () => {
  const onToggleRow = vi.fn();
  const rows = [
    {
      key: "long",
      label: "Review every supplier onboarding document",
      amount: "12 suppliers",
      status: "done" as const,
      details: [
        {
          label: "Validate international registration information",
          meta: "12/12",
        },
      ],
    },
  ];
  const view = render(<AiTaskRows rows={rows} onToggleRow={onToggleRow} />);
  fireEvent.click(
    screen.getByRole("button", {
      name: /Review every supplier onboarding document/,
    }),
  );
  expect(onToggleRow).toHaveBeenCalledWith("long", true);
  expect(view.container.textContent).toContain(
    "Validate international registration information",
  );
  fireEvent.click(screen.getByRole("button", { name: "List" }));
  expect(view.container.textContent).toContain("12 suppliers");
  expect(view.container.textContent).toContain("Completed");
  expect(
    screen
      .getByRole("button", {
        name: /Review every supplier onboarding document/,
      })
      .getAttribute("aria-expanded"),
  ).toBe("true");
});
