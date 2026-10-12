// @vitest-environment jsdom
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { FrostColorPage } from "./FrostColorPage";
beforeEach(() =>
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  ),
);
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("switches mode and brand without modifying the host document theme", () => {
  const view = render(<FrostColorPage />);
  fireEvent.click(screen.getByRole("tab", { name: "Dark" }));
  fireEvent.click(screen.getByRole("button", { name: "Mint" }));
  const scope = view.container.querySelector("[data-frost]");
  expect(scope?.getAttribute("data-theme")).toBe("dark");
  expect(scope?.getAttribute("data-brand")).toBe("mint");
  expect(document.documentElement.getAttribute("data-theme")).toBeNull();
});
it("copies the original HEX with honest success feedback", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  render(<FrostColorPage />);
  fireEvent.click(
    screen.getByRole("button", { name: "Mint 500 #91E6C3 をコピー" }),
  );
  await waitFor(() =>
    expect(screen.getByTestId("frost-copy-status").textContent).toContain(
      "#91E6C3 をコピーしました",
    ),
  );
  expect(writeText).toHaveBeenCalledWith("#91E6C3");
});
it("offers manual HEX copying when clipboard access is denied", async () => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
  });
  render(<FrostColorPage />);
  fireEvent.click(
    screen.getByRole("button", { name: "Lemon 500 #F6E58D をコピー" }),
  );
  await waitFor(() =>
    expect(screen.getByTestId("frost-copy-status").textContent).toContain(
      "手動でコピー",
    ),
  );
});

it("uses canonical components whose state survives color changes", () => {
  render(<FrostColorPage />);
  fireEvent.click(screen.getByRole("button", { name: "Projects" }));
  expect(screen.getByRole("heading", { name: "Projects" })).toBeTruthy();
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Explore the first direction" }),
  );
  fireEvent.click(screen.getByRole("tab", { name: "Dark" }));
  fireEvent.click(screen.getByRole("button", { name: "Lavender" }));
  expect(
    screen
      .getByRole("checkbox", { name: "Explore the first direction" })
      .getAttribute("aria-checked"),
  ).toBe("true");
  fireEvent.click(screen.getByRole("button", { name: "Add update →" }));
  expect(
    screen.getByRole("button", { name: "Notifications, 4 unread" }),
  ).toBeTruthy();
});
