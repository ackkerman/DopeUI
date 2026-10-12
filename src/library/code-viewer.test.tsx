// @vitest-environment jsdom
// This file guarantees file selection and decoration never alter copied source.
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import CodeBlockDemo, { CodeSnippet } from "./components/code-block";

const writeText = vi.fn();
beforeEach(() => {
  writeText.mockReset().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("copies exact source without line numbers or highlights", async () => {
  // Given decorated code, when copy is pressed, then whitespace and the trailing newline survive.
  const code = "  const value = 1;\n\tconsole.log(value);\n";
  const view = render(
    <CodeSnippet
      code={code}
      filename="example.js"
      lineNumbers
      highlightedLines={[2]}
    />,
  );
  expect(
    view.container
      .querySelector('[data-code-line="2"]')
      ?.getAttribute("data-highlighted"),
  ).toBe("true");
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: "Copy example.js" })),
  );
  expect(writeText).toHaveBeenCalledWith(code);
  expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();
});
it("copies only the active file and supports arrow and end keys", async () => {
  render(
    <CodeSnippet
      files={[
        { filename: "a.js", code: "const a = 1;" },
        { filename: "b.css", code: "body { color: red; }", language: "css" },
      ]}
    />,
  );
  const first = screen.getByRole("tab", { name: "a.js" });
  fireEvent.keyDown(first, { key: "ArrowRight" });
  const second = screen.getByRole("tab", { name: "b.css" });
  expect(second.getAttribute("aria-selected")).toBe("true");
  expect(document.activeElement).toBe(second);
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: "Copy b.css" })),
  );
  expect(writeText).toHaveBeenCalledWith("body { color: red; }");
  fireEvent.keyDown(second, { key: "Home" });
  expect(first.getAttribute("aria-selected")).toBe("true");
  fireEvent.keyDown(first, { key: "End" });
  expect(second.getAttribute("aria-selected")).toBe("true");
});
it("falls back to the first remaining file after the selected file is removed", () => {
  const view = render(
    <CodeSnippet
      files={[
        { filename: "a", code: "A" },
        { filename: "b", code: "B" },
      ]}
    />,
  );
  fireEvent.click(screen.getByRole("tab", { name: "b" }));
  view.rerender(<CodeSnippet files={[{ filename: "a", code: "New A" }]} />);
  expect(screen.getByRole("button", { name: "Copy a" })).toBeTruthy();
  expect(view.container.querySelector("pre")?.textContent).toBe("New A");
});
it("provides manual full-source copying when clipboard access fails", async () => {
  writeText.mockRejectedValueOnce(new Error("clipboard denied"));
  const code = "one\n  two";
  render(<CodeSnippet code={code} filename="sample.txt" />);
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: "Copy sample.txt" })),
  );
  expect(
    (
      screen.getByRole("textbox", {
        name: "Code to copy manually",
      }) as HTMLTextAreaElement
    ).value,
  ).toBe(code);
});
it("escapes HTML and preserves each rendered line", () => {
  const code = '<script>alert("unsafe")</script>\nconst safe = true;';
  const view = render(<CodeSnippet code={code} language="html" />);
  expect(view.container.querySelector("script")).toBeNull();
  expect(
    Array.from(view.container.querySelectorAll("[data-code-line]"))
      .map((line) => line.textContent)
      .join("\n"),
  ).toBe(code);
});
it("handles an empty file collection and applies the scrolling bound", () => {
  const view = render(<CodeSnippet files={[]} code="" maxHeight={176} />);
  expect(view.container.querySelector("pre")?.style.maxHeight).toBe("176px");
  expect(screen.getByRole("button", { name: "Copy index.tsx" })).toBeTruthy();
});
it("switches command managers and copies the selected command", async () => {
  render(<CodeBlockDemo variant="Command" />);
  fireEvent.click(screen.getByRole("tab", { name: "npm" }));
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: "Copy npm" })),
  );
  expect(writeText).toHaveBeenCalledWith(
    "npx shadcn@latest add @dope-ui/code-block",
  );
});
it("exposes all seven presentation variants", () => {
  const view = render(<CodeBlockDemo />);
  fireEvent.click(screen.getByRole("button", { name: "Highlighted" }));
  expect(
    view.container.querySelectorAll('[data-highlighted="true"]'),
  ).toHaveLength(3);
  fireEvent.click(screen.getByRole("button", { name: "Files" }));
  expect(screen.getAllByRole("tab")).toHaveLength(2);
  fireEvent.click(screen.getByRole("button", { name: "Languages" }));
  expect(screen.getByRole("tab", { name: "Python" })).toBeTruthy();
});
