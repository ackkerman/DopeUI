// @vitest-environment jsdom
// This file guarantees canonical styling remains shared and caller utilities still override defaults.
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import postcss from "postcss";
import { Button } from "./primitives/button";
import QuickActions from "./components/quick-actions";
import { FOLLOW_SPRING, SELECTION_SPRING } from "./motion-presets";

afterEach(cleanup);
it("uses a semantic primary pair and preserves explicit size and disabled props", () => {
  render(
    <Button disabled className="p-0 min-h-11">
      Continue
    </Button>,
  );
  const control = screen.getByRole("button", { name: "Continue" });
  expect(control.hasAttribute("disabled")).toBe(true);
  expect(control.hasAttribute("data-dui-action")).toBe(true);
  expect(control.className).toContain("p-0");
  expect(control.className).not.toContain("py-2.5");
  expect(control.className).toContain("min-h-11");
  cleanup();
  render(<Button variant="primary">Accept</Button>);
  expect(screen.getByRole("button").className).toContain(
    "text-primary-foreground",
  );
  expect(screen.getByRole("button").className).toContain("bg-primary");
  expect(screen.getByRole("button").className).not.toContain("text-white");
});
it("puts legacy demo paint below canonical and utility layers instead of overriding copied components", () => {
  const stylesheet = postcss.parse(readFileSync("src/styles.css", "utf8"));
  const play = stylesheet.nodes
    .flatMap((node) =>
      node.type === "atrule" &&
      node.name === "layer" &&
      node.params === "components"
        ? (node.nodes ?? [])
        : [],
    )
    .find((node) => node.type === "rule" && node.selector === ".play-button");
  expect(play).toBeTruthy();
  const base = stylesheet.nodes.find(
    (node) =>
      node.type === "atrule" && node.name === "layer" && node.params === "base",
  );
  expect(base?.toString()).not.toContain("translateY(1px)");
});
it("distributes role styling with the shared foundation and leaves illustrations outside UI icon sizing", () => {
  const css = readFileSync("src/library/component-system.css", "utf8");
  const delivered = readFileSync("public/library/foundation.css", "utf8");
  expect(delivered).toContain(css);
  const root = postcss.parse(css);
  const iconSelectors: string[] = [];
  root.walkRules((rule) => {
    if (
      rule.nodes.some(
        (node) =>
          node.type === "decl" &&
          node.prop === "width" &&
          node.value === "var(--dui-icon-size)",
      )
    )
      iconSelectors.push(rule.selector);
  });
  expect(iconSelectors).toHaveLength(1);
  expect(iconSelectors[0]).toContain("button");
  expect(iconSelectors[0]).toContain("data-dui-icon");
  expect(iconSelectors[0]).not.toContain("svg {");
  expect(css).toContain("@media (prefers-reduced-motion: reduce)");
});
it("keeps selection and following profiles shared by runtime sources and composed copies", () => {
  expect(SELECTION_SPRING.stiffness).toBeGreaterThan(FOLLOW_SPRING.stiffness);
  for (const id of [
    "hook-sidebar",
    "gooey-nav",
    "card-stack-hover",
    "animated-list",
  ]) {
    expect(readFileSync(`src/library/components/${id}.tsx`, "utf8")).toContain(
      "SELECTION_SPRING",
    );
    const copy = readFileSync(`src/library/distribution/${id}.tsx`, "utf8");
    expect(copy).toContain("const SELECTION_SPRING");
    expect(copy).not.toContain('from "../motion-presets"');
  }
});

it("keeps demo helpers borderless while retaining a visible keyboard focus ring", () => {
  const root = postcss.parse(
    readFileSync("src/library/component-system.css", "utf8"),
  );
  let borderless = false;
  let focusRing = false;
  root.walkRules((rule) => {
    if (
      rule.selector.includes(".play-button") &&
      !rule.selector.includes(":hover") &&
      !rule.selector.includes(":disabled")
    ) {
      borderless ||= rule.nodes.some(
        (node) =>
          node.type === "decl" && node.prop === "border" && node.value === "0",
      );
    }
    if (rule.selector.includes(":focus-visible"))
      focusRing ||= rule.nodes.some(
        (node) =>
          node.type === "decl" &&
          node.prop === "outline" &&
          node.value.includes("2px solid"),
      );
  });
  expect(borderless).toBe(true);
  expect(focusRing).toBe(true);
});

it("keeps collapsed floating actions out of the accessible controls and closes after selection", () => {
  const view = render(<QuickActions />);
  const trigger = screen.getByRole("button", { name: "Toggle quick actions" });
  const children =
    view.container.querySelectorAll<HTMLButtonElement>(".quick-action");
  expect(children).toHaveLength(3);
  for (const child of children) {
    expect(child.disabled).toBe(true);
    expect(child.getAttribute("aria-hidden")).toBe("true");
    expect(child.tabIndex).toBe(-1);
  }
  expect(screen.queryByRole("button", { name: "Create file" })).toBeNull();
  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole("button", { name: "Create file" }));
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(view.container.textContent).toContain("File created");
});
