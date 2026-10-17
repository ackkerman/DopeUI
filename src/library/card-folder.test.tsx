// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { animate } from "motion/react";
import { CardFolder, type CardFolderProps } from "./components/card-folder";

vi.mock("motion/react", async (original) => {
  const actual = await original<typeof import("motion/react")>();
  return {
    ...actual,
    useReducedMotion: () => true,
    animate: vi.fn(actual.animate),
    AnimatePresence: ({ children }: { children: import("react").ReactNode }) =>
      children,
  };
});
const sample: CardFolderProps = {
  title: "Jamie Davis",
  cardNumber: "0000 0000 0000 4242",
  expiry: "08/29",
  cvv: "123",
  card: <span>Sample artwork</span>,
};
beforeEach(() => vi.mocked(animate).mockClear());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("opens independently of detail visibility and removes hidden pocket controls from navigation", () => {
  // Given a masked folder, revealing details does not open it and opening does not reset them.
  const open = vi.fn();
  const details = vi.fn();
  const { container } = render(
    <CardFolder
      {...sample}
      ariaLabel="Toggle folder"
      onOpenChange={open}
      onDetailsVisibleChange={details}
    />,
  );
  const root = container.querySelector("[data-open]")!;
  expect(root.getAttribute("data-open")).toBe("false");
  expect(screen.queryByText(sample.cardNumber)).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Show card details" }));
  expect(details).toHaveBeenCalledExactlyOnceWith(true);
  expect(open).not.toHaveBeenCalled();
  expect(root.getAttribute("data-details-visible")).toBe("true");
  expect(screen.getByText(sample.cardNumber)).toBeTruthy();
  expect(screen.getByText("123")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Toggle folder" }));
  expect(open).toHaveBeenCalledExactlyOnceWith(true);
  expect(root.getAttribute("data-open")).toBe("true");
  expect(container.querySelector("[inert]")?.getAttribute("aria-hidden")).toBe(
    "true",
  );
  expect(
    screen.queryByRole("button", { name: "Hide card details" }),
  ).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Toggle folder" }));
  expect(root.getAttribute("data-details-visible")).toBe("true");
  fireEvent.click(screen.getByRole("button", { name: "Hide card details" }));
  expect(root.getAttribute("data-details-visible")).toBe("false");
});

it("notifies controlled owners without changing either supplied value", () => {
  const open = vi.fn();
  const details = vi.fn();
  const { container, rerender } = render(
    <CardFolder
      {...sample}
      ariaLabel="Toggle folder"
      open={false}
      detailsVisible={false}
      onOpenChange={open}
      onDetailsVisibleChange={details}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Toggle folder" }));
  fireEvent.click(screen.getByRole("button", { name: "Show card details" }));
  expect(open).toHaveBeenCalledExactlyOnceWith(true);
  expect(details).toHaveBeenCalledExactlyOnceWith(true);
  expect(
    container.querySelector("[data-open]")?.getAttribute("data-open"),
  ).toBe("false");
  expect(
    container
      .querySelector("[data-details-visible]")
      ?.getAttribute("data-details-visible"),
  ).toBe("false");
  rerender(<CardFolder {...sample} open detailsVisible />);
  expect(
    container.querySelector("[data-open]")?.getAttribute("data-open"),
  ).toBe("true");
  expect(
    container
      .querySelector("[data-details-visible]")
      ?.getAttribute("data-details-visible"),
  ).toBe("true");
});

it("keeps overflow actions separate and never submits an enclosing form", () => {
  const submit = vi.fn((e) => e.preventDefault());
  const action = vi.fn();
  const open = vi.fn();
  const { container } = render(
    <form onSubmit={submit}>
      <CardFolder
        {...sample}
        ariaLabel="Toggle folder"
        onOpenChange={open}
        onAction={action}
        actionLabel="Card options"
      />
    </form>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Card options" }));
  expect(action).toHaveBeenCalledOnce();
  expect(open).not.toHaveBeenCalled();
  expect(
    container.querySelector("[data-open]")?.getAttribute("data-open"),
  ).toBe("false");
  fireEvent.click(screen.getByRole("button", { name: "Show card details" }));
  fireEvent.click(screen.getByRole("button", { name: "Toggle folder" }));
  expect(submit).not.toHaveBeenCalled();
});

it("disables opening, detail disclosure and overflow actions together", () => {
  const change = vi.fn();
  render(
    <CardFolder
      {...sample}
      disabled
      onOpenChange={change}
      onDetailsVisibleChange={change}
      onAction={change}
    />,
  );
  for (const button of screen.getAllByRole("button")) {
    expect((button as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(button);
  }
  expect(change).not.toHaveBeenCalled();
});

it("normalizes short or empty numbers without leaking them into the default label", () => {
  const { rerender } = render(<CardFolder {...sample} cardNumber="a12-3x" />);
  expect(
    screen.getByRole("button", {
      name: "Open Jamie Davis, card ending in •123, expires 08/29",
    }),
  ).toBeTruthy();
  rerender(
    <CardFolder {...sample} cardNumber="" cvv="" defaultDetailsVisible />,
  );
  expect(
    screen.getByRole("button", {
      name: "Open Jamie Davis, card ending in ••••, expires 08/29",
    }),
  ).toBeTruthy();
});

it("stops the active purse animation on unmount", () => {
  const { unmount } = render(<CardFolder {...sample} defaultOpen />);
  const controls = vi.mocked(animate).mock.results.at(-1)!.value;
  const stop = vi.spyOn(controls, "stop");
  unmount();
  expect(stop).toHaveBeenCalledOnce();
});
