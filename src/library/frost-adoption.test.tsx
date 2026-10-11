// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { TaskList } from "./components/task-list";
import AiChat from "./components/ai-chat";
import { frostContrast, getFrostTokens } from "./frost-colors";
afterEach(cleanup);
it("keeps the disabled send arrow legible and enables sending only for nonempty input", () => {
  const onSend = vi.fn();
  render(<AiChat onSend={onSend} />);
  const send = screen.getByRole("button", {
    name: "Send",
  }) as HTMLButtonElement;
  expect(send.disabled).toBe(true);
  expect(send.style.opacity).toBe("1");
  expect(send.style.background).toContain("--frost-disabled-background");
  fireEvent.click(send);
  expect(onSend).not.toHaveBeenCalled();
  fireEvent.change(screen.getByRole("textbox", { name: "Chat prompt" }), {
    target: { value: "  Hello Frost  " },
  });
  expect(send.disabled).toBe(false);
  expect(send.style.background).toContain("--frost-primary");
  fireEvent.click(send);
  expect(onSend).toHaveBeenCalledWith("Hello Frost");
});
it("defines readable disabled colors and supplies their CSS in the copyable foundation", () => {
  for (const theme of ["light", "dark"] as const) {
    const t = getFrostTokens(theme);
    expect(
      frostContrast(t["disabled-background"], t["disabled-foreground"]),
    ).toBeGreaterThanOrEqual(4.5);
  }
  const foundation = readFileSync("src/library/foundation.txt", "utf8");
  expect(foundation).toContain("--nord-0:");
  expect(foundation).toContain("--frost-disabled-background:");
  expect(foundation).toContain("[data-frost-components]");
  expect(foundation).not.toMatch(/@import\s+["'].*frost/);
  for (const name of ["ai-chat", "ai-prompt-bar"]) {
    const source = readFileSync(`src/library/components/${name}.tsx`, "utf8");
    expect(source).toContain("var(--frost-disabled-foreground, var(--ink-2))");
    expect(source).toContain("opacity: 1");
  }
});

it("uses Frost primary and on-primary for Task List without the upstream orange fallback", () => {
  const view = render(
    <TaskList
      defaultTasks={[{ id: "one", label: "A Frost task", done: true }]}
    />,
  );
  const task = screen.getByRole("checkbox", { name: "A Frost task" });
  expect((task as HTMLElement).style.getPropertyValue("--task-accent")).toBe(
    "var(--frost-primary, #416C91)",
  );
  expect(
    view.container.querySelector(
      'path[stroke="var(--frost-primary-foreground, #ffffff)"]',
    ),
  ).not.toBeNull();
  expect(
    readFileSync("src/library/components/task-list.tsx", "utf8"),
  ).not.toContain("#FF5F2E");
});
