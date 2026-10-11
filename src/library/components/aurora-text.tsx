"use client";
// This file guarantees a standalone motion component with shared dope/ui styling.

import React, { memo } from "react";
import { cn } from "../../class-names";

/** Animated gradient text keeps a readable accessible copy and accepts caller colors. */
export interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
  paused?: boolean;
}

export const AuroraText = memo(
  ({
    children,
    className = "",
    colors = ["#416C91", "#8063BA", "#A74769", "#41755D"],
    speed = 1,
    paused = false,
  }: AuroraTextProps) => {
    const palette = colors.length ? colors : ["#416C91", "#8063BA"];
    const gradientStyle = {
      backgroundImage: `linear-gradient(135deg, ${palette.join(", ")}, ${
        palette[0]
      })`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animationDuration: `${10 / (Number.isFinite(speed) && speed > 0 ? speed : 1)}s`,
      animationPlayState: paused || speed <= 0 ? "paused" : "running",
    };

    return (
      <span className={cn(`relative inline-block ${className}`)}>
        <span className={cn("sr-only")}>{children}</span>
        <span
          className={cn(
            "animate-dui-aurora relative bg-size-[200%_auto] bg-clip-text text-transparent",
          )}
          style={gradientStyle}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    );
  },
);

AuroraText.displayName = "AuroraText";

export type AuroraTextDemoProps = Partial<AuroraTextProps>;
export default function AuroraTextDemo({
  className,
  children,
  ...props
}: AuroraTextDemoProps) {
  const [paused, setPaused] = React.useState(false);
  return (
    <div
      className={cn("dui-aurora-text dui-demo", className)}
      data-component-layout="motion"
    >
      <h3 className={cn("text-center text-3xl font-semibold tracking-tight")}>
        Make it{" "}
        <AuroraText {...props} paused={props.paused ?? paused}>
          {children ?? "feel alive."}
        </AuroraText>
      </h3>
      <div className={cn("dui-demo-controls")}>
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((v) => !v)}
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}
