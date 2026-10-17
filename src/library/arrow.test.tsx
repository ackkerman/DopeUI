// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import ArrowDemo, { Arrow, ArrowLayer } from "./components/arrow";
import { arrowPath } from "./components/arrow/arrow-geometry";

let resize: () => void;
const disconnect = vi.fn();
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
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
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});
afterEach(() => {
  cleanup();
  Reflect.deleteProperty(Element.prototype, "scrollIntoView");
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  disconnect.mockClear();
});

it("combines three routes with four appearances and unique endpoint markers", () => {
  // Given matching coordinates, when styles are combined, then every visible arrow has finite geometry and isolated markers.
  const { container } = render(
    <ArrowLayer>
      {(["straight", "curved", "orthogonal"] as const).flatMap((variant) =>
        (["simple", "handdrawn", "bold", "brush"] as const).map(
          (appearance) => (
            <Arrow
              key={`${variant}-${appearance}`}
              from={{ x: 20, y: 30 }}
              to={{ x: 220, y: 150 }}
              variant={variant}
              appearance={appearance}
              startHead="circle"
              label={`${variant} ${appearance}`}
            />
          ),
        ),
      )}
    </ArrowLayer>,
  );
  expect(screen.getAllByRole("img")).toHaveLength(12);
  const ids = Array.from(
    container.querySelectorAll("marker"),
    (node) => node.id,
  );
  expect(new Set(ids).size).toBe(24);
  for (const path of container.querySelectorAll(".dui-arrow-line"))
    expect(path.getAttribute("d")).not.toMatch(/NaN|Infinity/);
  expect(
    container
      .querySelector('[data-appearance="bold"] .dui-arrow-line')
      ?.getAttribute("stroke-width"),
  ).toBe("6");
  expect(
    arrowPath({ x: 0, y: 0 }, { x: 100, y: 50 }, "orthogonal", "simple", 1),
  ).toBe("M 0 0 H 50 V 50 H 100");
});

it("hides invalid endpoints, coincident points and use outside a layer without throwing", () => {
  const { container } = render(
    <>
      <Arrow from={{ x: 0, y: 0 }} to={{ x: 20, y: 20 }} />
      <ArrowLayer>
        <Arrow from="[invalid" to="#absent" />
        <Arrow from={{ x: NaN, y: 0 }} to={{ x: 20, y: 20 }} />
        <Arrow from={{ x: 0, y: 0 }} to={{ x: 0, y: 0 }} />
      </ArrowLayer>
    </>,
  );
  expect(container.querySelectorAll("svg")).toHaveLength(0);
});

it("tracks scoped DOM edges across resize and nested scroll, and releases resources", () => {
  // Given a layer offset and moving endpoints, when geometry changes, then connections use local edges rather than viewport coordinates.
  let targetX = 300;
  const spy = vi
    .spyOn(Element.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: Element) {
      const rect = this.classList.contains("dui-arrow-layer")
        ? { x: 100, y: 50, width: 500, height: 300 }
        : this.id === "from"
          ? { x: 120, y: 80, width: 60, height: 40 }
          : { x: targetX, y: 180, width: 80, height: 40 };
      return {
        ...rect,
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height,
        toJSON() {},
      } as DOMRect;
    });
  const to = createRef<HTMLButtonElement>();
  const { container, unmount } = render(
    <ArrowLayer>
      <button id="from">Source</button>
      <div>
        <button id="to" ref={to}>
          Target
        </button>
      </div>
      <Arrow
        from="#from"
        to={to}
        fromAnchor="right"
        toAnchor="left"
        variant="straight"
      />
    </ArrowLayer>,
  );
  const path = () =>
    container.querySelector(".dui-arrow-line")?.getAttribute("d");
  expect(path()).toContain("M 80 50");
  expect(path()).toContain("200 150");
  targetX = 340;
  act(() => resize());
  expect(path()).toContain("240 150");
  targetX = 360;
  fireEvent.scroll(
    screen.getByRole("button", { name: "Target" }).parentElement!,
  );
  expect(path()).toContain("260 150");
  expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
    "true",
  );
  unmount();
  expect(disconnect).toHaveBeenCalled();
  expect(cancelAnimationFrame).toHaveBeenCalled();
  spy.mockRestore();
});

it("allows explicit anchors, dashed styling and safe width/duration fallbacks", () => {
  const { container } = render(
    <ArrowLayer>
      <Arrow
        from={{ x: 20, y: 20 }}
        to={{ x: 120, y: 120 }}
        strokeWidth={Infinity}
        duration={NaN}
        animated
        line="dashed"
        startHead="diamond"
        endHead="triangle"
        label="A connection"
      />
    </ArrowLayer>,
  );
  expect(screen.getByRole("img", { name: "A connection" })).toBeTruthy();
  expect(
    container
      .querySelector(".dui-arrow-line")
      ?.getAttribute("stroke-dasharray"),
  ).toBe("6 6");
  expect(
    (container.querySelector(".dui-arrow-reveal") as SVGElement).style
      .animationDuration,
  ).toBe("900ms");
});

it("keeps demo nodes clickable and exposes shadcn selection, path, line and replay controls", async () => {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function (this: Element) {
      const x = this.id.endsWith("target") ? 220 : 20;
      return {
        x,
        y: 20,
        left: x,
        top: 20,
        width: 80,
        height: 40,
        right: x + 80,
        bottom: 60,
        toJSON() {},
      } as DOMRect;
    },
  );
  render(<ArrowDemo />);
  fireEvent.click(screen.getByRole("button", { name: /Bold/ }));
  expect(screen.getByRole("img").getAttribute("data-appearance")).toBe("bold");
  const pathTrigger = screen.getByRole("combobox", { name: "Arrow path" });
  expect(pathTrigger.tagName).toBe("BUTTON");
  expect(pathTrigger.getAttribute("data-slot")).toBe("select-trigger");
  fireEvent.keyDown(pathTrigger, { key: "ArrowDown" });
  fireEvent.click(await screen.findByRole("option", { name: "Elbow" }));
  expect(screen.getByRole("img").getAttribute("data-variant")).toBe(
    "orthogonal",
  );
  const lineTrigger = screen.getByRole("combobox", { name: "Arrow line" });
  fireEvent.keyDown(lineTrigger, { key: "ArrowDown" });
  fireEvent.click(await screen.findByRole("option", { name: "Dotted" }));
  fireEvent.click(screen.getByRole("button", { name: "Both ends" }));
  fireEvent.click(screen.getByRole("button", { name: /Something great/ }));
  expect(
    screen
      .getByRole("button", { name: /Something great/ })
      .getAttribute("data-anchor"),
  ).toBe("top");
  fireEvent.click(screen.getByRole("button", { name: "Replay" }));
});

it("keeps curved tangents normal to horizontal, vertical and mixed attachment edges", () => {
  // Given reversed or offset endpoints, when their edges are chosen, then each tangent follows that edge's outward normal.
  const cases = [
    {
      from: { x: 20, y: 120 },
      to: { x: 260, y: 30 },
      start: "right",
      end: "left",
      startNormal: [1, 0],
      endNormal: [-1, 0],
    },
    {
      from: { x: 260, y: 30 },
      to: { x: 20, y: 120 },
      start: "left",
      end: "right",
      startNormal: [-1, 0],
      endNormal: [1, 0],
    },
    {
      from: { x: 20, y: 30 },
      to: { x: 100, y: 260 },
      start: "bottom",
      end: "top",
      startNormal: [0, 1],
      endNormal: [0, -1],
    },
    {
      from: { x: 100, y: 260 },
      to: { x: 20, y: 30 },
      start: "top",
      end: "bottom",
      startNormal: [0, -1],
      endNormal: [0, 1],
    },
    {
      from: { x: 20, y: 30 },
      to: { x: 260, y: 160 },
      start: "right",
      end: "top",
      startNormal: [1, 0],
      endNormal: [0, -1],
    },
  ] as const;
  for (const c of cases) {
    for (const appearance of [
      "simple",
      "handdrawn",
      "bold",
      "brush",
    ] as const) {
      const values = arrowPath(
        c.from,
        c.to,
        "curved",
        appearance,
        0.65,
        c.start,
        c.end,
      )!
        .match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi)!
        .map(Number);
      const startTangent = [values[2] - values[0], values[3] - values[1]];
      const endNormal = [values[4] - values[6], values[5] - values[7]];
      expect(startTangent.map(Math.sign)).toEqual(c.startNormal);
      expect(endNormal.map(Math.sign)).toEqual(c.endNormal);
      // Auto agrees with the specified edge for the four dominant-direction cases.
      if (
        c.startNormal[0] === -c.endNormal[0] &&
        c.startNormal[1] === -c.endNormal[1]
      ) {
        expect(arrowPath(c.from, c.to, "curved", appearance, 0.65)).toBe(
          arrowPath(c.from, c.to, "curved", appearance, 0.65, c.start, c.end),
        );
      }
    }
  }
});

it("connects wide DOM nodes at side centers, then switches to top and bottom for a vertical layout", () => {
  let stacked = false;
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function (this: Element) {
      const rect = this.classList.contains("dui-arrow-layer")
        ? { x: 0, y: 0, width: 700, height: 500 }
        : this.id === "curve-source"
          ? { x: 20, y: 40, width: 180, height: 40 }
          : stacked
            ? { x: 40, y: 300, width: 240, height: 40 }
            : { x: 340, y: 140, width: 240, height: 40 };
      return {
        ...rect,
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height,
        toJSON() {},
      } as DOMRect;
    },
  );
  const { container } = render(
    <ArrowLayer>
      <button id="curve-source">Source</button>
      <button id="curve-target">Target</button>
      <Arrow from="#curve-source" to="#curve-target" />
    </ArrowLayer>,
  );
  const values = () =>
    container
      .querySelector(".dui-arrow-line")!
      .getAttribute("d")!
      .match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi)!
      .map(Number);
  const horizontal = values();
  expect(horizontal.slice(0, 2)).toEqual([200, 60]);
  expect(horizontal.slice(6, 8)).toEqual([340, 160]);
  expect(horizontal[3]).toBe(horizontal[1]);
  expect(horizontal[5]).toBe(horizontal[7]);
  stacked = true;
  act(() => resize());
  const vertical = values();
  expect(vertical.slice(0, 2)).toEqual([110, 80]);
  expect(vertical.slice(6, 8)).toEqual([160, 300]);
  expect(vertical[2]).toBe(vertical[0]);
  expect(vertical[4]).toBe(vertical[6]);
});

it("cycles each node through all four attachment sides without moving either node", () => {
  // Given two fixed nodes, when each is clicked repeatedly, then all sixteen side pairs produce matching endpoint positions and normals.
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function (this: Element) {
      const r = this.classList.contains("dui-arrow-layer")
        ? { x: 0, y: 0, width: 400, height: 230 }
        : this.id.endsWith("source")
          ? { x: 20, y: 60, width: 100, height: 48 }
          : { x: 240, y: 140, width: 130, height: 48 };
      return {
        ...r,
        left: r.x,
        top: r.y,
        right: r.x + r.width,
        bottom: r.y + r.height,
        toJSON() {},
      } as DOMRect;
    },
  );
  render(<ArrowDemo />);
  const source = screen.getByRole("button", { name: "An idea 01" });
  const target = screen.getByRole("button", { name: "Something great 02" });
  const sourcePoints = {
    right: [120, 84],
    bottom: [70, 108],
    left: [20, 84],
    top: [70, 60],
  };
  const targetPoints = {
    right: [370, 164],
    bottom: [305, 188],
    left: [240, 164],
    top: [305, 140],
  };
  const normals = {
    right: [1, 0],
    bottom: [0, 1],
    left: [-1, 0],
    top: [0, -1],
  };
  for (const start of ["bottom", "left", "top", "right"] as const) {
    fireEvent.click(source);
    expect(source.getAttribute("data-anchor")).toBe(start);
    for (const end of ["top", "right", "bottom", "left"] as const) {
      fireEvent.click(target);
      expect(target.getAttribute("data-anchor")).toBe(end);
      const values = screen
        .getByRole("img")
        .querySelector(".dui-arrow-line")!
        .getAttribute("d")!
        .match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi)!
        .map(Number);
      expect(values.slice(0, 2)).toEqual(sourcePoints[start]);
      expect(values.slice(6, 8)).toEqual(targetPoints[end]);
      expect([
        Math.sign(values[2] - values[0]),
        Math.sign(values[3] - values[1]),
      ]).toEqual(normals[start]);
      expect([
        Math.sign(values[4] - values[6]),
        Math.sign(values[5] - values[7]),
      ]).toEqual(normals[end]);
    }
  }
  expect(source.style.length).toBe(0);
  expect(target.style.length).toBe(0);
});

it("hides both arrowheads while preserving attachment choices and restores them on request", () => {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function (this: Element) {
      const x = this.id.endsWith("target") ? 220 : 20;
      return {
        x,
        y: 20,
        left: x,
        top: 20,
        right: x + 80,
        bottom: 60,
        width: 80,
        height: 40,
        toJSON() {},
      } as DOMRect;
    },
  );
  const { container } = render(<ArrowDemo />);
  const stage = () => container.querySelector(".dui-arrow-stage")!;
  const both = screen.getByRole("button", { name: "Both ends" });
  fireEvent.click(both);
  fireEvent.click(screen.getByRole("button", { name: "An idea 01" }));
  const path = stage().querySelector(".dui-arrow-line")!.getAttribute("d");
  expect(stage().querySelectorAll("marker")).toHaveLength(2);
  const toggle = screen.getByRole("button", { name: "Arrowhead" });
  fireEvent.click(toggle);
  expect(toggle.getAttribute("aria-pressed")).toBe("false");
  expect((both as HTMLButtonElement).disabled).toBe(true);
  expect(stage().querySelectorAll("marker")).toHaveLength(0);
  const line = stage().querySelector(".dui-arrow-line")!;
  expect(line.getAttribute("marker-start")).toBeNull();
  expect(line.getAttribute("marker-end")).toBeNull();
  expect(line.getAttribute("d")).toBe(path);
  fireEvent.click(toggle);
  expect((both as HTMLButtonElement).disabled).toBe(false);
  expect(stage().querySelectorAll("marker")).toHaveLength(2);
  expect(stage().querySelector(".dui-arrow-line")!.getAttribute("d")).toBe(
    path,
  );
});
