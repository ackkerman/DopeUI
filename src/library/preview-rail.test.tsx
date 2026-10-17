// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { PreviewRail, type PreviewRailItem } from "./components/preview-rail";

vi.mock("motion/react", async (original) => ({
  ...(await original<typeof import("motion/react")>()),
  useReducedMotion: () => true,
  AnimatePresence: ({ children }: { children: import("react").ReactNode }) =>
    children,
}));
const items: PreviewRailItem[] = [
  { id: "overview", label: "Overview", description: "Workspace overview" },
  { id: "docs", label: "Documentation", description: "Installation and API" },
  { id: "examples", label: "Examples", description: "Practical examples" },
];
const preview = (container: HTMLElement) =>
  container.querySelector('[data-slot="preview-rail-card"]');
beforeEach(() => {
  vi.stubGlobal(
    "PointerEvent",
    class extends MouseEvent {
      pointerId: number;
      pointerType: string;
      constructor(type: string, init: PointerEventInit = {}) {
        super(type, init);
        this.pointerId = init.pointerId ?? 1;
        this.pointerType = init.pointerType ?? "mouse";
      }
    },
  );
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("previews mouse hover and closes on leave without changing selection", () => {
  // Given a current destination, hover is a temporary preview rather than selection.
  const { container } = render(
    <PreviewRail items={items} defaultActiveId="overview" />,
  );
  const docs = screen.getByRole("button", { name: "Documentation" });
  expect(preview(container)).toBeNull();
  fireEvent.pointerEnter(docs, { pointerType: "mouse", buttons: 0 });
  expect(preview(container)?.textContent).toContain("Installation and API");
  expect(
    screen
      .getByRole("button", { name: "Overview" })
      .getAttribute("aria-current"),
  ).toBe("location");
  fireEvent.pointerLeave(screen.getByRole("navigation"), {
    pointerType: "mouse",
    buttons: 0,
  });
  expect(preview(container)).toBeNull();
});

it("shows keyboard focus previews and dismisses them on Escape or external blur", () => {
  // JSDOM does not preserve keyboard focus-visible modality across Escape.
  const matches = HTMLElement.prototype.matches;
  vi.spyOn(HTMLElement.prototype, "matches").mockImplementation(function (
    this: HTMLElement,
    selector: string,
  ) {
    return selector === ":focus-visible" || matches.call(this, selector);
  });
  const { container } = render(
    <>
      <PreviewRail items={items} />
      <button>Outside</button>
    </>,
  );
  const docs = screen.getByRole("button", { name: "Documentation" });
  fireEvent.pointerEnter(screen.getByRole("button", { name: "Overview" }), {
    pointerType: "mouse",
    buttons: 0,
  });
  act(() => docs.focus());
  expect(preview(container)?.textContent).toContain("Documentation");
  fireEvent.keyDown(docs, { key: "Escape" });
  expect(preview(container)).toBeNull();
  act(() => screen.getByRole("button", { name: "Examples" }).focus());
  expect(preview(container)?.textContent).toContain("Examples");
  act(() => screen.getByRole("button", { name: "Outside" }).focus());
  expect(preview(container)).toBeNull();
});

it("lets the first touch preview a link and the second select it", () => {
  const change = vi.fn();
  const select = vi.fn();
  const { container } = render(
    <PreviewRail
      items={items.map((x) => ({ ...x, href: `#${x.id}` }))}
      onActiveChange={change}
      onItemSelect={select}
    />,
  );
  const docs = screen.getByRole("link", { name: "Documentation" });
  fireEvent.pointerEnter(docs, { pointerType: "touch", buttons: 1 });
  expect(preview(container)).toBeNull();
  fireEvent.pointerDown(docs, { pointerType: "touch", buttons: 1 });
  expect(fireEvent.click(docs)).toBe(false);
  expect(preview(container)?.textContent).toContain("Documentation");
  expect(change).not.toHaveBeenCalled();
  fireEvent.pointerLeave(screen.getByRole("navigation"), {
    pointerType: "touch",
    buttons: 0,
  });
  expect(preview(container)).toBeTruthy();
  fireEvent.pointerDown(docs, { pointerType: "touch", buttons: 1 });
  expect(fireEvent.click(docs)).toBe(true);
  expect(change).toHaveBeenCalledExactlyOnceWith("docs");
  expect(select).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ id: "docs" }),
  );
  expect(docs.getAttribute("aria-current")).toBe("page");
});

it("drops cancelled touch records before keyboard activation and preserves controlled state", () => {
  const change = vi.fn();
  render(
    <PreviewRail
      items={items.map((x) => ({ ...x, href: `#${x.id}` }))}
      activeId="overview"
      onActiveChange={change}
    />,
  );
  const docs = screen.getByRole("link", { name: "Documentation" });
  fireEvent.pointerDown(docs, { pointerType: "touch" });
  fireEvent.pointerCancel(docs, { pointerType: "touch" });
  expect(fireEvent.click(docs)).toBe(true);
  expect(change).toHaveBeenLastCalledWith("docs");
  expect(docs.getAttribute("aria-current")).toBeNull();
  fireEvent.pointerDown(docs, { pointerType: "touch" });
  fireEvent.keyDown(docs, { key: "Enter" });
  expect(fireEvent.click(docs)).toBe(true);
  expect(change).toHaveBeenCalledTimes(2);
});

it("dismisses an outside tap without consuming its activation and removes listeners", () => {
  const click = vi.fn();
  const remove = vi.spyOn(window, "removeEventListener");
  const { container, unmount } = render(
    <>
      <PreviewRail items={items} />
      <button onClick={click}>Outside</button>
    </>,
  );
  const docs = screen.getByRole("button", { name: "Documentation" });
  fireEvent.pointerDown(docs, { pointerType: "touch" });
  fireEvent.click(docs);
  expect(preview(container)).toBeTruthy();
  const outside = screen.getByRole("button", { name: "Outside" });
  fireEvent.pointerDown(outside, { pointerType: "touch" });
  fireEvent.click(outside);
  expect(preview(container)).toBeNull();
  expect(click).toHaveBeenCalledOnce();
  unmount();
  expect(remove.mock.calls.map(([name]) => name)).toEqual(
    expect.arrayContaining(["pointerdown", "keydown"]),
  );
});

it("supports empty and changed items, custom previews, hidden previews and safe link rel", () => {
  const { container, rerender } = render(
    <PreviewRail items={[]} activeId="missing" />,
  );
  expect(screen.queryByRole("button")).toBeNull();
  rerender(
    <PreviewRail
      items={items}
      activeId="missing"
      renderPreview={(item) => <span>Custom {item.label}</span>}
    >
      Child content
    </PreviewRail>,
  );
  expect(
    screen
      .getByRole("button", { name: "Overview" })
      .getAttribute("aria-current"),
  ).toBe("location");
  fireEvent.pointerEnter(screen.getByRole("button", { name: "Examples" }), {
    pointerType: "mouse",
    buttons: 0,
  });
  expect(screen.getByText("Custom Examples")).toBeTruthy();
  rerender(
    <PreviewRail
      items={[
        {
          id: "external",
          label: "External",
          href: "https://example.com",
          target: "_blank",
        },
      ]}
      showPreview={false}
    />,
  );
  const link = screen.getByRole("link", { name: "External" });
  expect(link.getAttribute("rel")).toBe("noreferrer noopener");
  expect(link.getAttribute("aria-current")).toBe("page");
  expect(
    container.querySelector('[data-slot="preview-rail-preview"]'),
  ).toBeNull();
});

it("keeps pen contact separate from hover and releases a pressed mouse hover", () => {
  const { container } = render(<PreviewRail items={items} />);
  const docs = screen.getByRole("button", { name: "Documentation" });
  fireEvent.pointerEnter(docs, {
    pointerType: "pen",
    buttons: 1,
    pointerId: 2,
  });
  fireEvent.pointerDown(docs, { pointerType: "pen", buttons: 1, pointerId: 2 });
  fireEvent.click(docs);
  fireEvent.pointerLeave(screen.getByRole("navigation"), {
    pointerType: "pen",
    buttons: 0,
    pointerId: 2,
  });
  expect(preview(container)).toBeTruthy();
  fireEvent.keyDown(window, { key: "Escape" });
  fireEvent.pointerEnter(docs, {
    pointerType: "mouse",
    buttons: 0,
    pointerId: 3,
  });
  fireEvent.pointerLeave(screen.getByRole("navigation"), {
    pointerType: "mouse",
    buttons: 1,
    pointerId: 3,
  });
  expect(preview(container)).toBeNull();
});
