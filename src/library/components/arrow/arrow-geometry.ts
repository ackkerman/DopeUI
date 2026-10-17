// This file guarantees finite paths whose curved endpoint tangents follow their attachment edges.
import type {
  ArrowAnchor,
  ArrowAppearance,
  ArrowPoint,
  ArrowVariant,
} from "./arrow.types";

/** Auto picks the dominant center-to-center direction; explicit attachment edges remain authoritative. */
export function resolveArrowAnchor(
  anchor: ArrowAnchor,
  origin: ArrowPoint,
  target: ArrowPoint,
): ArrowAnchor {
  if (anchor !== "auto") return anchor;
  const dx = target.x - origin.x,
    dy = target.y - origin.y;
  return Math.abs(dx) >= Math.abs(dy)
    ? dx >= 0
      ? "right"
      : "left"
    : dy >= 0
      ? "bottom"
      : "top";
}

function arrowNormal(
  anchor: ArrowAnchor,
  origin: ArrowPoint,
  target: ArrowPoint,
): ArrowPoint {
  // Center attachments keep their position, while deriving a tangent from the other endpoint.
  const side = resolveArrowAnchor(
    anchor === "center" ? "auto" : anchor,
    origin,
    target,
  );
  return {
    x: side === "left" ? -1 : side === "right" ? 1 : 0,
    y: side === "top" ? -1 : side === "bottom" ? 1 : 0,
  };
}

/** A curved path leaves and enters along edge normals; null means invalid or coincident endpoints. */
export function arrowPath(
  from: ArrowPoint,
  to: ArrowPoint,
  variant: ArrowVariant,
  appearance: ArrowAppearance,
  bend: number,
  fromAnchor: ArrowAnchor = "auto",
  toAnchor: ArrowAnchor = "auto",
): string | null {
  // Invalid or coincident endpoints cannot define a visible direction.
  if (![from.x, from.y, to.x, to.y, bend].every(Number.isFinite)) return null;
  const dx = to.x - from.x,
    dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length < 0.01) return null;
  const start = `M ${from.x} ${from.y}`;
  if (variant === "orthogonal") {
    return `${start} H ${from.x + dx / 2} V ${to.y} H ${to.x}`;
  }
  if (variant === "curved") {
    const sourceNormal = arrowNormal(fromAnchor, from, to);
    const targetNormal = arrowNormal(toAnchor, to, from);
    const span = Math.max(Math.abs(dx), Math.abs(dy));
    const reach = Math.max(
      16,
      Math.min(180, span * Math.max(0.1, Math.min(1, Math.abs(bend)))),
    );
    const sourceReach = reach * (appearance === "handdrawn" ? 1.08 : 1);
    const targetReach = reach * (appearance === "handdrawn" ? 0.88 : 1);
    return `${start} C ${from.x + sourceNormal.x * sourceReach} ${from.y + sourceNormal.y * sourceReach}, ${to.x + targetNormal.x * targetReach} ${to.y + targetNormal.y * targetReach}, ${to.x} ${to.y}`;
  }
  const nx = -dy / length,
    ny = dx / length;
  const wobble = appearance === "handdrawn" ? Math.min(12, length * 0.06) : 0;
  return `${start} C ${from.x + dx * 0.3 + nx * wobble} ${from.y + dy * 0.3 + ny * wobble}, ${from.x + dx * 0.7 - nx * wobble} ${from.y + dy * 0.7 - ny * wobble}, ${to.x} ${to.y}`;
}
