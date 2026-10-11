import { describe, expect, it } from "vitest";
import { demos } from "../catalog";
import { examples, filterExamples } from "./examples";
import { examplePreviews } from "./ShowcasePreviews";

describe("application showcase", () => {
  it("provides twelve distinct working compositions with real component links", () => {
    expect(examples).toHaveLength(12);
    expect(new Set(examples.map((example) => example.id)).size).toBe(12);
    for (const example of examples) {
      expect(examplePreviews[example.id]).toBeTypeOf("function");
      expect(example.components.length).toBeGreaterThanOrEqual(2);
      for (const id of example.components)
        expect(
          demos.some((demo) => demo.id === id),
          `${example.id}: ${id}`,
        ).toBe(true);
    }
  });
  it("combines application category and case-insensitive search", () => {
    expect(
      filterExamples("  IMAGE  ", "AI Agents").map((example) => example.id),
    ).toEqual(["image-studio"]);
    expect(filterExamples("image", "Workspace")).toEqual([]);
    expect(filterExamples("", "All examples")).toHaveLength(12);
  });
  it("preserves the curated examples when finding an empty result", () => {
    const order = examples.map((example) => example.id);
    expect(filterExamples("unfindable", "All examples")).toEqual([]);
    expect(examples.map((example) => example.id)).toEqual(order);
  });
});
