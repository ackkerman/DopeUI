"use client";
// This file guarantees the Arrow demo uses the same public connectors provided for copying.
import { useId, useRef, useState } from "react";
import { cn } from "../../class-names";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../primitives/select";
import { Arrow } from "./arrow/arrow";
import { ArrowLayer } from "./arrow/arrow-layer";
import { resolveArrowAnchor } from "./arrow/arrow-geometry";
import type {
  ArrowPoint,
  ArrowEndpoint,
  ArrowAnchor,
  ArrowVariant,
  ArrowAppearance,
  ArrowHead,
  ArrowProps,
  ArrowLayerProps,
} from "./arrow/arrow.types";
export { Arrow, ArrowLayer };
export type {
  ArrowPoint,
  ArrowEndpoint,
  ArrowAnchor,
  ArrowVariant,
  ArrowAppearance,
  ArrowHead,
  ArrowProps,
  ArrowLayerProps,
};

const appearances: readonly {
  value: ArrowAppearance;
  label: string;
  note: string;
}[] = [
  { value: "simple", label: "Simple", note: "Just the essentials" },
  { value: "handdrawn", label: "Handdrawn", note: "A little human touch" },
  { value: "bold", label: "Bold", note: "Make a point" },
  { value: "brush", label: "Brush", note: "Leave a mark" },
];

/** Advances from the currently attached edge, including the initial automatic edge. */
function nextConnectionSide(
  anchor: ArrowAnchor,
  origin: HTMLElement | null,
  target: HTMLElement | null,
): ArrowAnchor {
  const sides: readonly ArrowAnchor[] = ["right", "bottom", "left", "top"];
  let active = anchor;
  if (active === "auto" && origin && target) {
    const a = origin.getBoundingClientRect(),
      b = target.getBoundingClientRect();
    active = resolveArrowAnchor(
      "auto",
      { x: a.left + a.width / 2, y: a.top + a.height / 2 },
      { x: b.left + b.width / 2, y: b.top + b.height / 2 },
    );
  }
  return sides[(sides.indexOf(active) + 1) % sides.length];
}

export default function ArrowDemo({ className = "" }: { className?: string }) {
  const [appearance, setAppearance] = useState<ArrowAppearance>("handdrawn");
  const [variant, setVariant] = useState<ArrowVariant>("curved");
  const [line, setLine] = useState<"solid" | "dashed" | "dotted">("solid");
  const [bothEnds, setBothEnds] = useState(false);
  const [arrowhead, setArrowhead] = useState(true);
  const [replay, setReplay] = useState(0);
  const [fromAnchor, setFromAnchor] = useState<ArrowAnchor>("auto");
  const [toAnchor, setToAnchor] = useState<ArrowAnchor>("auto");
  const sourceRef = useRef<HTMLButtonElement>(null);
  const targetRef = useRef<HTMLButtonElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <div className={cn("dui-arrow-demo", className)}>
      <div
        className="dui-arrow-samples"
        role="group"
        aria-label="Arrow appearance"
      >
        {appearances.map(({ value, label, note }) => (
          <button
            type="button"
            className="dui-arrow-sample"
            key={value}
            aria-pressed={appearance === value}
            onClick={() => setAppearance(value)}
          >
            <ArrowLayer className="dui-arrow-swatch">
              <span data-swatch-start="" />
              <span data-swatch-end="" />
              <Arrow
                from="[data-swatch-start]"
                to="[data-swatch-end]"
                appearance={value}
                variant={value === "simple" ? "straight" : "curved"}
                endHead={value === "bold" ? "triangle" : "open"}
              />
            </ArrowLayer>
            <span>{label}</span>
            <small>{note}</small>
          </button>
        ))}
      </div>
      <ArrowLayer className="dui-arrow-stage">
        <span className="dui-arrow-stage-caption">CONNECT THE DOTS</span>
        <button
          id={`${id}-source`}
          ref={sourceRef}
          data-anchor={fromAnchor}
          aria-describedby={`${id}-connection-hint`}
          type="button"
          className="dui-arrow-node dui-arrow-source"
          onClick={() =>
            setFromAnchor(
              nextConnectionSide(
                fromAnchor,
                sourceRef.current,
                targetRef.current,
              ),
            )
          }
        >
          An idea <span>01</span>
        </button>
        <button
          id={`${id}-target`}
          ref={targetRef}
          data-anchor={toAnchor}
          aria-describedby={`${id}-connection-hint`}
          type="button"
          className="dui-arrow-node dui-arrow-target"
          onClick={() =>
            setToAnchor(
              nextConnectionSide(
                toAnchor,
                targetRef.current,
                sourceRef.current,
              ),
            )
          }
        >
          Something great <span>02</span>
        </button>
        <Arrow
          from={`#${id}-source`}
          to={`#${id}-target`}
          appearance={appearance}
          fromAnchor={fromAnchor}
          toAnchor={toAnchor}
          bend={0.2}
          variant={variant}
          line={line}
          startHead={bothEnds && arrowhead ? "circle" : "none"}
          endHead={
            arrowhead ? (appearance === "bold" ? "triangle" : "open") : "none"
          }
          animated
          refreshKey={replay}
          label="From an idea to something great"
        />
        <span id={`${id}-connection-hint`} className="dui-arrow-stage-hint">
          Click a node to switch its connection side.
        </span>
      </ArrowLayer>
      <div className="dui-demo-controls dui-arrow-controls">
        <div className="dui-arrow-select-field">
          <span id={`${id}-path-label`}>Path</span>
          <Select
            value={variant}
            onValueChange={(value) => setVariant(value as ArrowVariant)}
          >
            <SelectTrigger
              aria-label="Arrow path"
              className="dui-arrow-select-trigger h-8 border-0 rounded-md bg-transparent p-1 text-[11px] shadow-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className="dui-arrow-select-content"
            >
              <SelectItem value="straight">Straight</SelectItem>
              <SelectItem value="curved">Curved</SelectItem>
              <SelectItem value="orthogonal">Elbow</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="dui-arrow-select-field">
          <span>Line</span>
          <Select
            value={line}
            onValueChange={(value) => setLine(value as typeof line)}
          >
            <SelectTrigger
              aria-label="Arrow line"
              className="dui-arrow-select-trigger h-8 border-0 rounded-md bg-transparent p-1 text-[11px] shadow-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className="dui-arrow-select-content"
            >
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button
          type="button"
          aria-pressed={bothEnds}
          disabled={!arrowhead}
          onClick={() => setBothEnds(!bothEnds)}
        >
          Both ends
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
