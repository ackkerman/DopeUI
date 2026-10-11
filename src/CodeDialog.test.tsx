// @vitest-environment jsdom
// This file guarantees Introduction stays concise and returns focus to its actual trigger.
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CodeDialog } from "./CodeDialog";

vi.mock("./library/registry", () => ({ libraryEntries: {} }));
vi.mock("./use-demo-source", () => ({
  useDemoSource: () => ({ source: null, loading: false, error: undefined }),
}));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("shows an overview and restores its trigger after the parent focuses a fallback", () => {
  // jsdom lacks native modal methods; preserve its prototype and emulate only their open state.
  const prototype = HTMLDialogElement.prototype;
  const originals = {
    showModal: Object.getOwnPropertyDescriptor(prototype, "showModal"),
    close: Object.getOwnPropertyDescriptor(prototype, "close"),
  };
  Object.defineProperties(prototype, {
    showModal: {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.open = true;
      },
    },
    close: {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.open = false;
      },
    },
  });
  const trigger = document.createElement("button");
  const fallback = document.createElement("button");
  document.body.append(trigger, fallback);
  trigger.focus();
  const onClose = vi.fn(() => fallback.focus());
  try {
    const view = render(<CodeDialog demo={null} docs onClose={onClose} />);
    expect(screen.getByRole("heading", { name: "Introduction" })).toBeTruthy();
    expect(view.container.querySelector("pre")).toBeNull();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(
      screen.getByRole("link", { name: "Use in React" }).getAttribute("href"),
    ).toBe("/detail.html?t=card-resize#usage");
    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(trigger);
  } finally {
    cleanup();
    trigger.remove();
    fallback.remove();
    for (const name of ["showModal", "close"] as const) {
      const descriptor = originals[name];
      if (descriptor) Object.defineProperty(prototype, name, descriptor);
      else Reflect.deleteProperty(prototype, name);
    }
  }
});
