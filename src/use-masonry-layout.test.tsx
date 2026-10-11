// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { masonryRowSpan, useMasonryLayout } from "./use-masonry-layout";

function Harness({ heights }: { heights: Record<string, number> }) {
  const grid = useMasonryLayout(Object.keys(heights).join(","));
  return (
    <section ref={grid}>
      {Object.entries(heights).map(([id, height]) => (
        <article key={id} data-height={height}>
          {id}
        </article>
      ))}
    </section>
  );
}
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("reserves the complete card height and the gap beneath it", () => {
  expect(masonryRowSpan(100)).toBe(116);
  expect(masonryRowSpan(200.2)).toBe(217);
});
it("remeasures changed cards and releases observers when results change", () => {
  const disconnect = vi.fn();
  const observe = vi.fn();
  let notify: ResizeObserverCallback = () => {};
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: ResizeObserverCallback) {
        notify = callback;
      }
      observe = observe;
      disconnect = disconnect;
    },
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      return { height: Number(this.dataset.height ?? 0) } as DOMRect;
    },
  );
  const view = render(<Harness heights={{ first: 100, second: 180 }} />);
  const cards = view.container.querySelectorAll("article");
  expect(cards[0].style.gridRowEnd).toBe("span 116");
  expect(cards[1].style.gridRowEnd).toBe("span 196");
  expect(view.container.querySelector("section")?.dataset.masonry).toBe("true");
  view.rerender(<Harness heights={{ first: 200, second: 180 }} />);
  act(() =>
    notify(
      [
        {
          target: cards[0],
          contentRect: cards[0].getBoundingClientRect(),
          borderBoxSize: [],
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        },
      ],
      {} as ResizeObserver,
    ),
  );
  expect(cards[0].style.gridRowEnd).toBe("span 216");
  view.rerender(<Harness heights={{ second: 180 }} />);
  expect(disconnect).toHaveBeenCalledTimes(1);
  expect(view.container.textContent).toBe("second");
  view.unmount();
  expect(disconnect).toHaveBeenCalledTimes(2);
});
it("leaves unsupported browsers in the ordinary responsive grid", () => {
  vi.stubGlobal("ResizeObserver", undefined);
  const view = render(<Harness heights={{ first: 100 }} />);
  expect(
    view.container.querySelector("section")?.dataset.masonry,
  ).toBeUndefined();
  expect(view.container.querySelector("article")?.style.gridRowEnd).toBe("");
});
