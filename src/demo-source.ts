// This file guarantees that copyable source is read from the actual rendered component.
import type { MotionDemo } from "./catalog";
import { libraryEntries, loadFoundation } from "./library/registry";
export type CodeLanguage =
  "React" | "CSS" | "HTML" | "JavaScript" | "JSON" | "Shell";
export type SnippetLanguage = "React" | "CSS";
/** React declares npm dependencies; CSS supplies the required shared Tailwind foundation. */
export interface DemoSource {
  React: string;
  CSS: string;
}
export async function getDemoSource(demo: MotionDemo): Promise<DemoSource> {
  const entry = libraryEntries[demo.id];
  const [React, CSS] = await Promise.all([
    entry.loadSource(),
    loadFoundation(),
  ]);
  return { React, CSS };
}
