// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { CodeBlock } from "./primitives/code-block";

const writeText = vi.fn();
beforeEach(() => {
  writeText.mockReset().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it("copies the complete source with whitespace while its highlighted preview is shortened", async () => {
  vi.useFakeTimers();
  const full = "  const value = 1;\n".repeat(3000);
  const submit = vi.fn();
  render(
    <form onSubmit={submit}>
      <CodeBlock code={full}>
        <code>shortened preview</code>
      </CodeBlock>
    </form>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
  await act(async () => {});
  expect(writeText).toHaveBeenCalledWith(full);
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();
  await act(async () => vi.advanceTimersByTime(2000));
  expect(screen.getByRole("button", { name: "Copy code" })).toBeTruthy();
});
it("provides the complete selected source for manual copying when clipboard access fails", async () => {
  writeText.mockRejectedValueOnce(new Error("Denied"));
  const code = "  first\nsecond\n";
  render(<CodeBlock code={code} />);
  fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
  const manual = (await screen.findByRole("textbox", {
    name: "Code to copy manually",
  })) as HTMLTextAreaElement;
  expect(manual.value).toBe(code);
  expect(document.activeElement).toBe(manual);
  expect(manual.selectionStart).toBe(0);
  expect(manual.selectionEnd).toBe(code.length);
  expect(screen.queryByRole("button", { name: "Copied" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
  await screen.findByRole("button", { name: "Copied" });
  expect(screen.queryByRole("textbox")).toBeNull();
});
it("keeps feedback local and copies a new code prop after a language change", async () => {
  // Keep transient feedback visible while assertions run on a loaded host.
  vi.useFakeTimers();
  const view = render(
    <>
      <CodeBlock code="React" />
      <CodeBlock code="CSS" />
    </>,
  );
  fireEvent.click(screen.getAllByRole("button", { name: "Copy code" })[0]);
  await act(async () => {});
  expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();
  expect(screen.getAllByRole("button", { name: "Copy code" })).toHaveLength(1);
  view.rerender(<CodeBlock code="new CSS" />);
  fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
  await act(async () => {});
  expect(writeText).toHaveBeenLastCalledWith("new CSS");
});
it("does not start feedback timers after an unresolved copy is unmounted", async () => {
  vi.useFakeTimers();
  let resolve!: () => void;
  writeText.mockReturnValueOnce(
    new Promise<void>((done) => {
      resolve = done;
    }),
  );
  const view = render(<CodeBlock code="source" />);
  fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
  expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
  view.unmount();
  await act(async () => resolve());
  expect(vi.getTimerCount()).toBe(0);
});
it("copies terminal lines without duplicating the animated visual text", async () => {
  render(
    <CodeBlock copyLabel="Copy output">
      <code className="grid">
        <span>
          <span className="sr-only">full command</span>
          <span aria-hidden="true">partial</span>
        </span>
        <span>done</span>
      </code>
    </CodeBlock>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Copy output" }));
  await act(async () => {});
  expect(writeText).toHaveBeenCalledWith("full command\ndone");
});
