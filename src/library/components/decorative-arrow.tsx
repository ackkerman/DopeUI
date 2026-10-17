"use client";
// This file guarantees decorative SVG arrows can be placed without a connector layer or DOM targets.
import { useId, useState, type CSSProperties } from "react";
import { cn } from "../../class-names";
import { ArrowHeadShape } from "./arrow/arrow-head";
import type { ArrowHead } from "./arrow/arrow.types";

export type DecorativeArrowShape = "straight" | "arc" | "loop" | "swoosh";
/** Size and positioning belong to the caller; rotation and reflection only affect the drawing. */
export interface DecorativeArrowProps {
  shape?: DecorativeArrowShape;
  width?: number | string;
  height?: number | string;
  rotate?: number;
  flipX?: boolean;
  flipY?: boolean;
  color?: string;
  strokeWidth?: number;
  head?: ArrowHead;
  line?: "solid" | "dashed" | "dotted";
  animated?: boolean;
  duration?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

const decorativePaths: Record<DecorativeArrowShape, string> = {
  straight: "M 20 90 L 180 30",
  arc: "M 20 100 C 40 18 115 12 180 50",
  loop: "M 20 24 C 72 0 126 57 96 73 C 64 91 57 27 111 43 C 149 54 166 78 180 103",
  swoosh: "M 20 91 C 92 115 155 77 178 22",
};

export function DecorativeArrow({
  shape = "loop",
  width = 160,
  height = 96,
  rotate = 0,
  flipX = false,
  flipY = false,
  color,
  strokeWidth = 3,
  head = "open",
  line = "solid",
  animated = false,
  duration = 900,
  label,
  className,
  style,
}: DecorativeArrowProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const weight =
    Number.isFinite(strokeWidth) && strokeWidth > 0
      ? Math.min(strokeWidth, 20)
      : 3;
  const angle = Number.isFinite(rotate) ? rotate : 0;
  const time = Number.isFinite(duration) && duration > 0 ? duration : 900;
  const d = decorativePaths[shape];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 120"
      width={width}
      height={height}
      className={cn("dui-decorative-arrow", className)}
      style={{ color, ...style }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      data-shape={shape}
    >
      {label ? <title>{label}</title> : null}
      <defs>
        {head === "none" ? null : (
          <marker
            id={`${id}-head`}
            viewBox="-10 -6 12 12"
            refX="0"
            refY="0"
            markerWidth={10 + weight}
            markerHeight={10 + weight}
            markerUnits="userSpaceOnUse"
            orient="auto"
            overflow="visible"
          >
            <ArrowHeadShape head={head} />
          </marker>
        )}
        {animated ? (
          <mask
            id={`${id}-draw`}
            maskUnits="userSpaceOnUse"
            x="-200"
            y="-200"
            width="600"
            height="520"
          >
            <path
              className="dui-arrow-reveal"
              d={d}
              pathLength="1"
              fill="none"
              stroke="white"
              strokeWidth={Math.max(40, weight * 8)}
              strokeLinecap="round"
              style={{ animationDuration: `${time}ms` }}
            />
          </mask>
        ) : null}
      </defs>
      <g
        transform={`translate(100 60) rotate(${angle}) scale(${flipX ? -1 : 1} ${flipY ? -1 : 1}) translate(-100 -60)`}
      >
        <path
          className="dui-decorative-arrow-line"
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={weight}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={
            line === "dashed"
              ? `${weight * 3} ${weight * 3}`
              : line === "dotted"
                ? `0 ${weight * 3}`
                : undefined
          }
          markerEnd={head === "none" ? undefined : `url(#${id}-head)`}
          mask={animated ? `url(#${id}-draw)` : undefined}
        />
      </g>
    </svg>
  );
}

export default function DecorativeArrowDemo({
  className,
}: {
  className?: string;
}) {
  const [shape, setShape] = useState<DecorativeArrowShape>("loop");
  const [rotation, setRotation] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [arrowhead, setArrowhead] = useState(true);
  const [replay, setReplay] = useState(0);
  return (
    <div className={cn("dui-decorative-arrow-demo", className)}>
      <div
        className="dui-decorative-arrow-samples"
        role="group"
        aria-label="Decorative arrow shape"
      >
        {(["straight", "arc", "loop", "swoosh"] as const).map((value) => (
          <button
            type="button"
            key={value}
            aria-pressed={shape === value}
            onClick={() => setShape(value)}
          >
            <DecorativeArrow shape={value} width="100%" height={62} />
            <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
          </button>
        ))}
      </div>
      <div className="dui-decorative-arrow-stage">
        <span className="dui-decorative-arrow-caption">A little nudge.</span>
        <DecorativeArrow
          key={`${shape}-${rotation}-${flipped}-${replay}`}
          shape={shape}
          rotate={rotation}
          flipX={flipped}
          head={arrowhead ? "open" : "none"}
          width={180}
          height={108}
          animated
          className="dui-decorative-arrow-placement"
          label="A freely placed decorative arrow"
        />
        <button
          type="button"
          className="dui-decorative-arrow-cta"
          onClick={() => setReplay(replay + 1)}
        >
          Right here <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="dui-demo-controls dui-decorative-arrow-controls">
        <button
          type="button"
          aria-pressed={flipped}
          onClick={() => setFlipped(!flipped)}
        >
          Flip
        </button>
        <button
          type="button"
          onClick={() => setRotation((rotation + 90) % 360)}
        >
          Rotate {rotation}°
        </button>
        <button
          type="button"
          aria-pressed={arrowhead}
          onClick={() => setArrowhead(!arrowhead)}
        >
          Arrowhead
        </button>
        <button type="button" onClick={() => setReplay(replay + 1)}>
          Replay
        </button>
      </div>
    </div>
  );
}
