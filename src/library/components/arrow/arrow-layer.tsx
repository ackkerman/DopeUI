"use client";
import { cn } from "../../../class-names";
// This file guarantees a shared local coordinate surface without capturing content pointer events.
import { createContext, useRef } from "react";
import type { RefObject } from "react";
import type { ArrowLayerProps } from "./arrow.types";

export const ArrowLayerContext =
  createContext<RefObject<HTMLDivElement | null> | null>(null);

export function ArrowLayer({
  children,
  className = "",
  style,
}: ArrowLayerProps) {
  const root = useRef<HTMLDivElement>(null);
  return (
    <ArrowLayerContext.Provider value={root}>
      <div
        ref={root}
        className={cn("dui-arrow-layer", className)}
        style={style}
      >
        {children}
      </div>
    </ArrowLayerContext.Provider>
  );
}
