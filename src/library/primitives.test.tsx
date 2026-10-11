// @vitest-environment jsdom
// This file guarantees shared upstream primitives preserve native controls and composition.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Button } from "./primitives/button";
import { GlideMenu } from "./primitives/glide-menu";
import { EntityChip } from "./primitives/entity-chip";
import { ValuePill } from "./primitives/value-pill";

afterEach(cleanup);

describe("shared library primitives", () => {
  it("keeps action buttons from submitting forms, honors disabled, and merges overrides", () => {
    // Given a shared Button composed inside a consumer form.
    const submit = vi.fn((event) => event.preventDefault());
    const click = vi.fn();
    const view = render(
      <form onSubmit={submit}>
        <Button className="p-2" onClick={click}>
          Approve
        </Button>
      </form>,
    );
    const button = screen.getByRole("button", { name: "Approve" });
    // When pressed, it is a native action and the consumer's spacing wins.
    fireEvent.click(button);
    expect(click).toHaveBeenCalledOnce();
    expect(submit).not.toHaveBeenCalled();
    expect(button.className).toContain("p-2");
    expect(button.className).not.toContain("px-4");
    view.rerender(
      <Button disabled onClick={click}>
        Approve
      </Button>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(click).toHaveBeenCalledOnce();
  });

  it("tracks keyboard focus on menu rows and clears the highlight when focus leaves", () => {
    // Given a composed menu with native keyboard controls.
    const view = render(
      <GlideMenu>
        <button data-menu-row>First</button>
        <button data-menu-row>Second</button>
      </GlideMenu>,
    );
    const container = view.container.firstElementChild as HTMLElement;
    const row = screen.getByRole("button", { name: "Second" });
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      top: 10,
    } as DOMRect);
    vi.spyOn(row, "getBoundingClientRect").mockReturnValue({
      top: 42,
      height: 28,
    } as DOMRect);
    // When the row receives focus, the one shared layer follows its measured bounds.
    fireEvent.focus(row);
    const highlight = container.querySelector("[aria-hidden]") as HTMLElement;
    expect(highlight.style.top).toBe("32px");
    expect(highlight.style.height).toBe("28px");
    expect(highlight.style.opacity).toBe("1");
    fireEvent.blur(row, { relatedTarget: null });
    expect(highlight.style.opacity).toBe("0");
  });

  it("composes entity references and semantic values without losing custom labels", () => {
    render(
      <p>
        <EntityChip name="Cone King" monogram="CK" color="#416c91" />
        <ValuePill tone="green">7 days</ValuePill>
      </p>,
    );
    expect(screen.getByText("CK").style.background).toBe("rgb(65, 108, 145)");
    expect(screen.getByText("Cone King")).toBeTruthy();
    expect(screen.getByText("7 days").className).toContain("bg-green-tint");
  });
});
