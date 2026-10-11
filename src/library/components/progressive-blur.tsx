"use client";

import React from "react";

import { cn } from "../../class-names";

/** A non-interactive overlay gradually blurs one or both edges of a positioned surface. */
export interface ProgressiveBlurProps {
  className?: string;
  height?: string;
  position?: "top" | "bottom" | "both";
  blurLevels?: number[];
  children?: React.ReactNode;
}

export function ProgressiveBlur({
  className,
  height = "30%",
  position = "bottom",
  blurLevels = [0.5, 1, 2, 4, 8, 16, 32, 64],
  children,
}: ProgressiveBlurProps) {
  const valid = blurLevels.filter(
    (value) => Number.isFinite(value) && value >= 0,
  );
  if (!valid.length) return null;
  const levels = valid.length === 1 ? [valid[0], valid[0]] : valid;
  if (position === "both")
    return (
      <>
        <ProgressiveBlur
          className={className}
          height={height}
          position="top"
          blurLevels={levels}
        />
        <ProgressiveBlur
          className={className}
          height={height}
          position="bottom"
          blurLevels={levels}
        >
          {children}
        </ProgressiveBlur>
      </>
    );
  const divElements = Array(levels.length - 2).fill(null);

  return (
    <div
      data-slot="progressive-blur"
      aria-hidden={children ? undefined : true}
      className={cn(
        "gradient-blur pointer-events-none absolute inset-x-0 z-10",
        className,
        position === "top"
          ? "top-0"
          : position === "bottom"
            ? "bottom-0"
            : "inset-y-0",
      )}
      style={{
        height,
      }}
    >
      {/* First blur layer (pseudo element) */}
      <div
        className={cn("absolute inset-0")}
        style={{
          zIndex: 1,
          backdropFilter: `blur(${levels[0]}px)`,
          WebkitBackdropFilter: `blur(${levels[0]}px)`,
          maskImage:
            position === "bottom"
              ? `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)`
              : position === "top"
                ? `linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)`
                : `linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)`,
          WebkitMaskImage:
            position === "bottom"
              ? `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)`
              : position === "top"
                ? `linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)`
                : `linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)`,
        }}
      />

      {/* Middle blur layers */}
      {divElements.map((_, index) => {
        const blurIndex = index + 1;
        const startPercent = blurIndex * 12.5;
        const midPercent = (blurIndex + 1) * 12.5;
        const endPercent = (blurIndex + 2) * 12.5;

        const maskGradient =
          position === "bottom"
            ? `linear-gradient(to bottom, rgba(0,0,0,0) ${startPercent}%, rgba(0,0,0,1) ${midPercent}%, rgba(0,0,0,1) ${endPercent}%, rgba(0,0,0,0) ${endPercent + 12.5}%)`
            : position === "top"
              ? `linear-gradient(to top, rgba(0,0,0,0) ${startPercent}%, rgba(0,0,0,1) ${midPercent}%, rgba(0,0,0,1) ${endPercent}%, rgba(0,0,0,0) ${endPercent + 12.5}%)`
              : `linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)`;

        return (
          <div
            key={`blur-${index}`}
            className={cn("absolute inset-0")}
            style={{
              zIndex: index + 2,
              backdropFilter: `blur(${levels[blurIndex]}px)`,
              WebkitBackdropFilter: `blur(${levels[blurIndex]}px)`,
              maskImage: maskGradient,
              WebkitMaskImage: maskGradient,
            }}
          />
        );
      })}

      {/* Last blur layer (pseudo element) */}
      <div
        className={cn("absolute inset-0")}
        style={{
          zIndex: levels.length,
          backdropFilter: `blur(${levels[levels.length - 1]}px)`,
          WebkitBackdropFilter: `blur(${levels[levels.length - 1]}px)`,
          maskImage:
            position === "bottom"
              ? `linear-gradient(to bottom, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)`
              : position === "top"
                ? `linear-gradient(to top, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)`
                : `linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)`,
          WebkitMaskImage:
            position === "bottom"
              ? `linear-gradient(to bottom, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)`
              : position === "top"
                ? `linear-gradient(to top, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)`
                : `linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)`,
        }}
      />
      {children && <div className={cn("relative z-20")}>{children}</div>}
    </div>
  );
}

/** The default example keeps its blur overlay fixed while the content scrolls independently. */
export type ProgressiveBlurDemoProps = Partial<ProgressiveBlurProps>;
export default function ProgressiveBlurDemo({
  className,
  position: controlledPosition,
  ...props
}: ProgressiveBlurDemoProps) {
  const [edge, setEdge] = React.useState<"top" | "bottom" | "both">("bottom");
  const [enabled, setEnabled] = React.useState(true);
  const position = controlledPosition ?? edge;
  const labels = [
    "Discover",
    "Define",
    "Explore",
    "Prototype",
    "Review",
    "Polish",
    "Ship",
    "Iterate",
  ];
  return (
    <div
      className={cn("dui-progressive-blur", className)}
      data-component-layout="motion"
    >
      <div
        className={cn(
          "relative isolate w-full max-w-sm overflow-clip rounded-2xl border border-black/10 bg-white",
        )}
      >
        <div
          role="region"
          aria-label="Blurred workflow list"
          tabIndex={0}
          className={cn(
            "h-[240px] overflow-y-auto overscroll-contain p-3 focus-visible:outline-2 focus-visible:outline-[#416C91]",
          )}
        >
          <div className={cn("flex flex-col gap-2")}>
            {labels.map((label, i) => (
              <div
                key={label}
                className={cn(
                  "flex h-16 shrink-0 items-center gap-4 rounded-xl border border-black/[0.06] bg-[#ECEFF4] px-4",
                )}
              >
                <span className={cn("text-xs text-[#59687D]")}>0{i + 1}</span>
                <span className={cn("text-sm font-medium")}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        {enabled && (
          <ProgressiveBlur
            {...props}
            position={position}
            height={props.height ?? "45%"}
          />
        )}
      </div>
      <div className={cn("blur-controls")} aria-label="Blur position">
        {(["top", "bottom", "both"] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={position === value}
            onClick={() => setEdge(value)}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={enabled}
          onClick={() => setEnabled((v) => !v)}
        >
          {enabled ? "Disable blur" : "Enable blur"}
        </button>
      </div>
    </div>
  );
}
