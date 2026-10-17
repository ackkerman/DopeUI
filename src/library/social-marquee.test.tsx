// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import SocialMarqueeDemo, {
  SocialMarquee,
  type SocialMarqueePost,
} from "./components/social-marquee";

const posts: SocialMarqueePost[] = [
  {
    id: "a",
    name: "Alex Doe",
    username: "alex",
    body: "A thoughtful interaction.",
  },
  { id: "b", name: "Sam Lee", username: "@sam", body: "A lovely detail." },
  { id: "c", name: "Maya Chen", username: "@maya", body: "One more idea." },
];
beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("splits unique posts across two accessible rows with opposing directions", () => {
  // Given three posts, when split into two rows, then each author appears once to assistive technology.
  render(<SocialMarquee posts={posts} />);
  const rows = screen.getAllByRole("region");
  expect(rows.map((row) => row.getAttribute("data-direction"))).toEqual([
    "left",
    "right",
  ]);
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
  expect(screen.getAllByRole("listitem")[0].textContent).toContain("@alex");
  expect(screen.getAllByRole("listitem")[0].textContent).toContain(
    "A thoughtful interaction.",
  );
  for (const row of rows) {
    expect(
      row
        .querySelector('.dui-marquee-group[aria-hidden="true"]')
        ?.hasAttribute("inert"),
    ).toBe(true);
  }
});

it("supports a single row, one post, and empty data without duplicating accessible content", () => {
  // Given fewer posts or an explicit single row, then no empty second row is created.
  const view = render(<SocialMarquee posts={posts} rows={1} />);
  expect(screen.getAllByRole("region")).toHaveLength(1);
  view.rerender(<SocialMarquee posts={posts.slice(0, 1)} />);
  expect(screen.getAllByRole("region")).toHaveLength(1);
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
  view.rerender(<SocialMarquee posts={[]} />);
  expect(screen.queryAllByRole("listitem")).toHaveLength(0);
});

it("falls back to initials for broken avatars and retries a changed URL", () => {
  // Given an invalid avatar, when it fails, then the author remains identifiable.
  const view = render(
    <SocialMarquee posts={[{ ...posts[0], avatar: "bad.png" }]} />,
  );
  fireEvent.error(view.container.querySelector("img")!);
  expect(
    view.container.querySelector(".dui-social-marquee-avatar")?.textContent,
  ).toBe("AD");
  view.rerender(
    <SocialMarquee posts={[{ ...posts[0], avatar: "good.png" }]} />,
  );
  expect(view.container.querySelector("img")?.getAttribute("src")).toBe(
    "good.png",
  );
});

it("keeps multiline and untrusted post bodies as readable text", () => {
  // Given markup and line breaks, then text is preserved without creating executable markup.
  const body = "<script>alert(1)</script>\n" + "long".repeat(100);
  const view = render(<SocialMarquee posts={[{ ...posts[0], body }]} />);
  expect(view.container.querySelector("blockquote")?.textContent).toBe(body);
  expect(view.container.querySelector("script")).toBeNull();
});

it("applies controlled motion and safely normalizes invalid values", () => {
  // Given shared motion settings, then both rows receive safe values and alternate direction.
  render(
    <SocialMarquee
      posts={posts}
      duration={Infinity}
      gap={-1}
      paused
      direction="right"
      pauseOnHover={false}
    />,
  );
  const rows = screen.getAllByRole("region");
  expect(rows.map((row) => row.getAttribute("data-direction"))).toEqual([
    "right",
    "left",
  ]);
  for (const row of rows) {
    expect(row.getAttribute("data-paused")).toBe("true");
    expect(row.getAttribute("data-pause-on-hover")).toBe("false");
    expect(row.style.getPropertyValue("--dui-marquee-duration")).toBe("28s");
    expect(row.style.getPropertyValue("--dui-marquee-gap")).toBe("16px");
  }
});

it("pauses and resumes both rows, reverses them, and changes speed", () => {
  // Given the demo, when its controls are used, then both rows change together.
  render(<SocialMarqueeDemo />);
  fireEvent.click(screen.getByRole("button", { name: "Pause" }));
  expect(
    screen
      .getAllByRole("region")
      .every((row) => row.getAttribute("data-paused") === "true"),
  ).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Resume" }));
  expect(
    screen
      .getAllByRole("region")
      .every((row) => row.getAttribute("data-paused") === "false"),
  ).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Reverse" }));
  expect(
    screen
      .getAllByRole("region")
      .map((row) => row.getAttribute("data-direction")),
  ).toEqual(["right", "left"]);
  fireEvent.click(screen.getByRole("button", { name: "Speed 1×" }));
  expect(
    screen
      .getAllByRole("region")
      .every(
        (row) => row.style.getPropertyValue("--dui-marquee-duration") === "14s",
      ),
  ).toBe(true);
});
