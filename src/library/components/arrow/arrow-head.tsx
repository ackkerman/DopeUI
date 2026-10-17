// This file guarantees both arrow families share endpoint shapes.
import type { ArrowHead } from "./arrow.types";
export function ArrowHeadShape({ head }: { head: ArrowHead }) {
  if (head === "circle")
    return <circle cx="-4" cy="0" r="3" fill="currentColor" stroke="none" />;
  if (head === "diamond")
    return (
      <path d="M 0 0 -4 -3 -8 0 -4 3 Z" fill="currentColor" stroke="none" />
    );
  return (
    <path
      d="M -7 -4 L 0 0 L -7 4"
      fill={head === "triangle" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
