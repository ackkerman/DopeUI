"use client";
import { cn } from "../../../class-names";
// This file guarantees DOM-relative connectors release their observers and never intercept input.
import { useContext, useEffect, useId, useState } from "react";
import { ArrowHeadShape } from "./arrow-head";
import { ArrowLayerContext } from "./arrow-layer";
import { arrowPath, resolveArrowAnchor } from "./arrow-geometry";
import type {
  ArrowAnchor,
  ArrowEndpoint,
  ArrowPoint,
  ArrowProps,
} from "./arrow.types";

function targetElement(
  endpoint: ArrowEndpoint,
  root: HTMLElement,
): Element | null {
  try {
    const element =
      typeof endpoint === "string"
        ? root.querySelector(endpoint)
        : "current" in endpoint
          ? endpoint.current
          : null;
    return element && root.contains(element) ? element : null;
  } catch {
    // Invalid selectors are unresolved endpoints, not render failures.
    return null;
  }
}

function endpointPoint(
  endpoint: ArrowEndpoint,
  root: HTMLElement,
  anchor: ArrowAnchor,
  toward?: ArrowPoint,
): ArrowPoint | null {
  if (typeof endpoint !== "string" && "x" in endpoint) return endpoint;
  const element = targetElement(endpoint, root);
  if (!element) return null;
  const box = element.getBoundingClientRect(),
    layer = root.getBoundingClientRect();
  const center = {
    x:
      box.left - layer.left - root.clientLeft + root.scrollLeft + box.width / 2,
    y: box.top - layer.top - root.clientTop + root.scrollTop + box.height / 2,
  };
  const side = toward ? resolveArrowAnchor(anchor, center, toward) : anchor;
  return {
    x:
      center.x +
      (side === "left" ? -box.width / 2 : side === "right" ? box.width / 2 : 0),
    y:
      center.y +
      (side === "top"
        ? -box.height / 2
        : side === "bottom"
          ? box.height / 2
          : 0),
  };
}

export function Arrow({
  from,
  to,
  fromAnchor = "auto",
  toAnchor = "auto",
  variant = "curved",
  appearance = "simple",
  startHead = "none",
  endHead = "open",
  line = "solid",
  strokeWidth,
  color,
  bend = 0.65,
  animated = false,
  duration = 900,
  label,
  className = "",
  refreshKey,
}: ArrowProps) {
  const layer = useContext(ArrowLayerContext);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [domPath, setDomPath] = useState<string | null>(null);
  const coordinateOnly =
    typeof from !== "string" &&
    "x" in from &&
    typeof to !== "string" &&
    "x" in to;
  const directPath = coordinateOnly
    ? arrowPath(from, to, variant, appearance, bend, fromAnchor, toAnchor)
    : null;
  useEffect(() => {
    const root = layer?.current;
    // Coordinate-only arrows need no browser listeners, including during SSR.
    if (!root || coordinateOnly) return;
    let frame = 0;
    const update = () => {
      const a = endpointPoint(from, root, "center"),
        b = endpointPoint(to, root, "center");
      const sourceAnchor =
        a && b ? resolveArrowAnchor(fromAnchor, a, b) : fromAnchor;
      const targetAnchor =
        a && b ? resolveArrowAnchor(toAnchor, b, a) : toAnchor;
      const start = a && b ? endpointPoint(from, root, sourceAnchor, b) : null;
      const end = a && b ? endpointPoint(to, root, targetAnchor, a) : null;
      setDomPath(
        start && end
          ? arrowPath(
              start,
              end,
              variant,
              appearance,
              bend,
              sourceAnchor,
              targetAnchor,
            )
          : null,
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(schedule);
    observer?.observe(root);
    for (const endpoint of [from, to]) {
      const element = targetElement(endpoint, root);
      if (element) observer?.observe(element);
    }
    update();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
    };
  }, [
    layer,
    from,
    to,
    fromAnchor,
    toAnchor,
    variant,
    appearance,
    bend,
    refreshKey,
    coordinateOnly,
  ]);
  const d = coordinateOnly ? directPath : domPath;
  if (!layer || !d) return null;
  const baseWidth = appearance === "bold" ? 6 : appearance === "brush" ? 4 : 2;
  const width =
    strokeWidth !== undefined && Number.isFinite(strokeWidth) && strokeWidth > 0
      ? Math.min(strokeWidth, 64)
      : baseWidth;
  const safeDuration =
    Number.isFinite(duration) && duration > 0 ? duration : 900;
  return (
    <svg
      className={cn("dui-arrow", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      data-appearance={appearance}
      data-variant={variant}
      style={{ color, pointerEvents: "none" }}
    >
      {label ? <title>{label}</title> : null}
      <defs>
        {([startHead, endHead] as const).map((head, index) =>
          head === "none" ? null : (
            <marker
              key={index}
              id={`${id}-head-${index}`}
              viewBox="-10 -6 12 12"
              refX="0"
              refY="0"
              markerWidth={10 + width}
              markerHeight={10 + width}
              markerUnits="userSpaceOnUse"
              orient="auto-start-reverse"
              overflow="visible"
            >
              <ArrowHeadShape head={head} />
            </marker>
          ),
        )}
        {animated ? (
          <mask
            id={`${id}-draw`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100%"
            height="100%"
          >
            <path
              key={`${d}-${refreshKey}`}
              className="dui-arrow-reveal"
              d={d}
              pathLength="1"
              fill="none"
              stroke="white"
              strokeWidth={Math.max(40, width * 8)}
              strokeLinecap="round"
              style={{ animationDuration: `${safeDuration}ms` }}
            />
          </mask>
        ) : null}
      </defs>
      <g mask={animated ? `url(#${id}-draw)` : undefined}>
        <path
          className="dui-arrow-line"
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={
            line === "dashed"
              ? `${width * 3} ${width * 3}`
              : line === "dotted"
                ? `0 ${width * 3}`
                : undefined
          }
          markerStart={startHead === "none" ? undefined : `url(#${id}-head-0)`}
          markerEnd={endHead === "none" ? undefined : `url(#${id}-head-1)`}
        />
        {appearance === "brush" ? (
          <path
            d={d}
            transform="translate(0 2)"
            strokeDasharray={
              line === "dashed"
                ? `${width * 3} ${width * 3}`
                : line === "dotted"
                  ? `0 ${width * 3}`
                  : undefined
            }
            fill="none"
            stroke="currentColor"
            strokeWidth={Math.max(1, width * 0.5)}
            opacity="0.25"
            strokeLinecap="round"
            pointerEvents="none"
          />
        ) : null}
      </g>
    </svg>
  );
}
