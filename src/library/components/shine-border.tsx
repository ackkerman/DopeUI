"use client";

import * as React from "react";

import { cn } from "../../class-names";

export interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the border in pixels
   * @default 1
   */
  borderWidth?: number;
  /**
   * Duration of the animation in seconds
   * @default 14
   */
  duration?: number;
  /**
   * Color of the border, can be a single color or an array of colors
   * @default "#000000"
   */
  shineColor?: string | string[];
}

/**
 * Shine Border
 *
 * An animated background border effect component with configurable properties.
 */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "#000000",
  className,
  style,
  ...props
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,
          backgroundImage: `radial-gradient(transparent,transparent, ${
            Array.isArray(shineColor) ? shineColor.join(",") : shineColor
          },transparent,transparent)`,
          backgroundSize: "300% 300%",
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "var(--border-width)",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "motion-safe:animate-dui-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]",
        className,
      )}
      {...props}
    />
  );
}

export type ShineBorderDemoProps = Partial<ShineBorderProps>;
export default function ShineBorderDemo({
  className,
  ...props
}: ShineBorderDemoProps) {
  const [enabled, setEnabled] = React.useState(true);
  const [alternate, setAlternate] = React.useState(false);
  return (
    <div
      className={cn("dui-shine-border", className)}
      data-component-layout="motion"
    >
      <div
        className={cn(
          "relative flex h-[190px] w-full max-w-sm flex-col items-center justify-center rounded-2xl border border-black/10 bg-white px-6 text-center",
        )}
      >
        <h3 className={cn("text-xl font-medium")}>Shine Border</h3>
        <p className={cn("mt-2 text-sm text-[#626268]")}>
          A little light at the edges.
        </p>
        {enabled && (
          <ShineBorder
            {...props}
            borderWidth={props.borderWidth ?? 2}
            duration={props.duration ?? 5}
            shineColor={
              props.shineColor ??
              (alternate
                ? ["#eed49f", "#ed8796"]
                : ["#3355c5", "#8bd5ca", "#ed8796"])
            }
          />
        )}
      </div>
      <div className={cn("dui-demo-controls")}>
        <button type="button" onClick={() => setEnabled((v) => !v)}>
          {enabled ? "Disable effect" : "Enable effect"}
        </button>
        <button
          type="button"
          aria-pressed={alternate}
          onClick={() => setAlternate((v) => !v)}
        >
          Change colors
        </button>
      </div>
    </div>
  );
}
