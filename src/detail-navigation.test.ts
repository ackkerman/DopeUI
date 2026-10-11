import { describe, expect, it } from "vitest";
import { demos } from "./catalog";
import { adjacentDemos, detailHref, resolveDetail } from "./detail-navigation";
describe("individual demo navigation", () => {
  it("resolves every catalogue entry and produces directly addressable URLs", () => {
    for (const demo of demos) {
      expect(resolveDetail(demo.id)).toBe(demo);
      expect(detailHref(demo.id)).toBe(`/detail.html?t=${demo.id}`);
    }
  });
  it("uses the first entry only when the id is omitted", () => {
    expect(resolveDetail(null)).toBe(demos[0]);
    expect(resolveDetail("unknown")).toBeUndefined();
    expect(resolveDetail("rare-task-list")).toBeUndefined();
    expect(resolveDetail("magic-dock")).toBeUndefined();
    expect(resolveDetail("")).toBeUndefined();
  });
  it("keeps adjacent navigation inside catalogue boundaries", () => {
    expect(adjacentDemos(demos[0].id)).toEqual({
      previous: undefined,
      next: demos[1],
    });
    expect(adjacentDemos(demos.at(-1)!.id)).toEqual({
      previous: demos.at(-2),
      next: undefined,
    });
    expect(adjacentDemos("unknown")).toEqual({});
  });
  it("encodes query values instead of introducing additional URL parameters", () => {
    expect(detailHref("x&y")).toBe("/detail.html?t=x%26y");
  });
});

it("resolves the retired Pop URL to the single notification page", () => {
  expect(resolveDetail("notification-pop")?.id).toBe("notification-bell");
  expect(demos.filter((demo) => demo.id.includes("notification"))).toHaveLength(
    1,
  );
});
