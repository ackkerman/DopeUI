import type { CSSProperties, ReactNode, RefObject } from "react";

/** Coordinates use the untransformed ArrowLayer's local CSS pixels. */
export interface ArrowPoint {
  x: number;
  y: number;
}
/** DOM endpoints resolve within the layer; absent targets produce no arrow. */
export type ArrowEndpoint = ArrowPoint | string | RefObject<Element | null>;
export type ArrowAnchor =
  "auto" | "center" | "top" | "right" | "bottom" | "left";
export type ArrowVariant = "straight" | "curved" | "orthogonal";
export type ArrowAppearance = "simple" | "handdrawn" | "bold" | "brush";
export type ArrowHead = "none" | "open" | "triangle" | "circle" | "diamond";
/** Geometry and appearance are independent; labels opt into accessible image semantics. */
export interface ArrowProps {
  from: ArrowEndpoint;
  to: ArrowEndpoint;
  /** Auto selects the dominant direction; curves follow the normal of the chosen edge. */
  fromAnchor?: ArrowAnchor;
  toAnchor?: ArrowAnchor;
  variant?: ArrowVariant;
  appearance?: ArrowAppearance;
  startHead?: ArrowHead;
  endHead?: ArrowHead;
  line?: "solid" | "dashed" | "dotted";
  strokeWidth?: number;
  color?: string;
  /** Absolute magnitude controls curved handle length; endpoint directions follow the anchors. */
  bend?: number;
  animated?: boolean;
  duration?: number;
  label?: string;
  className?: string;
  /** Change after layout shifts that do not resize either endpoint. */
  refreshKey?: string | number;
}
/** Content remains interactive below the pointer-transparent SVG overlays. */
export interface ArrowLayerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}
