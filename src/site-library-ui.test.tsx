// @vitest-environment jsdom
// This file guarantees the site consumes library contracts without duplicating widget behavior.
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { useState, createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { SiteCode } from "./SiteCode";
import { SiteSearch } from "./SiteSearch";
import { SiteTabs } from "./SiteTabs";
import Accordion from "./library/components/accordion";
import { Button } from "./library/primitives/button";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it("selects every supplied tab and supports keyboard navigation beyond three items", () => {
  const change = vi.fn();
  render(
    <SiteTabs
      items={["All", "Essential", "Agents", "Effects", "Texts"]}
      value="All"
      onValueChange={change}
      label="Categories"
    />,
  );
  fireEvent.keyDown(screen.getByRole("tab", { name: "All" }), { key: "End" });
  expect(change).toHaveBeenCalledWith("Texts");
  expect(document.activeElement).toBe(
    screen.getByRole("tab", { name: "Texts" }),
  );
});
it("uses the reusable search field without a demo reset and preserves the input ref", () => {
  vi.useFakeTimers();
  const ref = createRef<HTMLInputElement>();
  const change = vi.fn();
  render(
    <SiteSearch
      value="theme"
      onValueChange={change}
      label="Search library"
      inputRef={ref}
    />,
  );
  expect(ref.current).toBe(
    screen.getByRole("searchbox", { name: "Search library" }),
  );
  expect(screen.queryByRole("button", { name: "Reset text" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
  act(() => vi.advanceTimersByTime(180));
  expect(change).toHaveBeenCalledWith("");
});
it("renders arbitrary accordion content and keeps its controlled disclosure state", () => {
  function Navigation() {
    const [open, setOpen] = useState(false);
    return (
      <Accordion title="Essential" open={open} onOpenChange={setOpen}>
        <a href="/detail.html?t=like">Like Button</a>
      </Accordion>
    );
  }
  render(<Navigation />);
  const control = screen.getByRole("button", { name: "Essential" });
  fireEvent.click(control);
  expect(control.getAttribute("aria-expanded")).toBe("true");
  expect(
    screen.getByRole("link", { name: "Like Button" }).getAttribute("href"),
  ).toBe("/detail.html?t=like");
});
it("keeps a link action native and attaches a button ref", () => {
  const ref = createRef<HTMLButtonElement>();
  render(
    <>
      <Button href="/installation.html">Installation</Button>
      <Button ref={ref}>Open</Button>
    </>,
  );
  expect(
    screen.getByRole("link", { name: "Installation" }).getAttribute("href"),
  ).toBe("/installation.html");
  expect(ref.current).toBe(screen.getByRole("button", { name: "Open" }));
});
it("places exactly one copy control inside the shared code header and copies the full limited source", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const code = "const value = 1;\n".repeat(2000);
  const view = render(<SiteCode code={code} language="React" />);
  const header = view.container.querySelector(".dui-code-header")!;
  expect(header.querySelectorAll("button")).toHaveLength(1);
  expect(view.container.querySelectorAll(".dui-code-copy")).toHaveLength(1);
  expect(view.container.querySelector("pre")?.textContent).toContain(
    "Preview shortened",
  );
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: "Copy code" })),
  );
  expect(writeText).toHaveBeenCalledWith(code);
});
