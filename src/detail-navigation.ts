// This file guarantees that detail links resolve only to known catalogue entries.
import { demos, type MotionDemo } from "./catalog";
/** Recognizes Pages canonical URLs and the local HTML entry as one detail route. */
export function isDetailPath(pathname: string): boolean {
  return ["/detail", "/detail/", "/detail.html"].includes(pathname);
}
export function detailHref(id: string): string {
  return `/detail.html?t=${encodeURIComponent(id)}`;
}
/** A missing id selects the first demo; an unknown id deliberately stays unresolved. */
export function resolveDetail(id: string | null): MotionDemo | undefined {
  // The former Pop page now resolves to the single counted notification demo.
  const canonicalId = id === "notification-pop" ? "notification-bell" : id;
  return id === null ? demos[0] : demos.find((demo) => demo.id === canonicalId);
}
export function adjacentDemos(id: string): {
  previous?: MotionDemo;
  next?: MotionDemo;
} {
  const index = demos.findIndex((demo) => demo.id === id);
  // Unknown URLs must never fall through to the first next entry.
  if (index < 0) return {};
  return { previous: demos[index - 1], next: demos[index + 1] };
}
