// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import DecorativeArrowDemo, {
  DecorativeArrow,
} from "./components/decorative-arrow";
afterEach(cleanup);

it("renders four standalone shapes with isolated markers and accessible names", () => {
  const { container } = render(
    <>
      {(["straight", "arc", "loop", "swoosh"] as const).map((shape) => (
        <DecorativeArrow key={shape} shape={shape} label={shape} animated />
      ))}
    </>,
  );
  expect(screen.getAllByRole("img")).toHaveLength(4);
  const ids = Array.from(container.querySelectorAll("[id]"), (e) => e.id);
  expect(new Set(ids).size).toBe(ids.length);
  const paths = Array.from(
    container.querySelectorAll(".dui-decorative-arrow-line"),
    (e) => e.getAttribute("d"),
  );
  expect(new Set(paths).size).toBe(4);
  for (const svg of screen.getAllByRole("img"))
    expect(svg.getAttribute("viewBox")).toBe("0 0 200 120");
});

it("preserves arbitrary caller positioning, color, dimensions and drawing transforms", () => {
  const { container } = render(
    <DecorativeArrow
      width={220}
      height={140}
      rotate={30}
      flipX
      flipY
      color="red"
      strokeWidth={5}
      line="dotted"
      className="my-arrow"
      style={{ position: "absolute", left: 24, top: 12 }}
    />,
  );
  const svg = container.querySelector("svg")!;
  expect(svg.classList.contains("my-arrow")).toBe(true);
  expect(svg.getAttribute("width")).toBe("220");
  expect(svg.style.position).toBe("absolute");
  expect(svg.style.left).toBe("24px");
  expect(svg.style.color).toBe("red");
  expect(svg.getAttribute("aria-hidden")).toBe("true");
  expect(svg.querySelector("g")!.getAttribute("transform")).toContain(
    "rotate(30) scale(-1 -1)",
  );
  expect(
    svg
      .querySelector(".dui-decorative-arrow-line")!
      .getAttribute("stroke-dasharray"),
  ).toBe("0 15");
});

it("supports headless drawing and safe fallbacks for invalid animation settings", () => {
  const { container } = render(
    <DecorativeArrow
      rotate={NaN}
      strokeWidth={Infinity}
      duration={-1}
      head="none"
      animated
    />,
  );
  expect(container.querySelector("marker")).toBeNull();
  expect(
    container
      .querySelector(".dui-decorative-arrow-line")!
      .getAttribute("marker-end"),
  ).toBeNull();
  expect(
    container
      .querySelector(".dui-decorative-arrow-line")!
      .getAttribute("stroke-width"),
  ).toBe("3");
  expect(
    (container.querySelector(".dui-arrow-reveal") as SVGElement).style
      .animationDuration,
  ).toBe("900ms");
  expect(container.querySelector("g")!.getAttribute("transform")).toContain(
    "rotate(0)",
  );
});

it("allows shape selection, reflection, rotation, head removal and replay in the demo", () => {
  render(<DecorativeArrowDemo />);
  fireEvent.click(screen.getByRole("button", { name: "Swoosh" }));
  const image = () =>
    screen.getByRole("img", { name: "A freely placed decorative arrow" });
  expect(image().getAttribute("data-shape")).toBe("swoosh");
  fireEvent.click(screen.getByRole("button", { name: "Flip" }));
  fireEvent.click(screen.getByRole("button", { name: "Rotate 0°" }));
  expect(image().querySelector("g")!.getAttribute("transform")).toContain(
    "rotate(90) scale(-1 1)",
  );
  fireEvent.click(screen.getByRole("button", { name: "Arrowhead" }));
  expect(image().querySelector("marker")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Replay" }));
  fireEvent.click(screen.getByRole("button", { name: /Right here/ }));
  expect(image().getAttribute("data-shape")).toBe("swoosh");
});
