"use client";
import * as React from "react";

import {
  motion,
  useReducedMotion,
  type MotionStyle,
  type Transition,
} from "motion/react";

import { cn } from "../../class-names";

export interface BorderBeamProps {
  /**
   * The size of the border beam.
   */
  size?: number;
  /**
   * The duration of the border beam.
   */
  duration?: number;
  /**
   * The delay of the border beam.
   */
  delay?: number;
  /**
   * The color of the border beam from.
   */
  colorFrom?: string;
  /**
   * The color of the border beam to.
   */
  colorTo?: string;
  /**
   * The motion transition of the border beam.
   */
  transition?: Transition;
  /**
   * The class name of the border beam.
   */
  className?: string;
  /**
   * The style of the border beam.
   */
  style?: React.CSSProperties;
  /**
   * Whether to reverse the animation direction.
   */
  reverse?: boolean;
  /**
   * The initial offset position (0-100).
   */
  initialOffset?: number;
  /**
   * The border width of the beam.
   */
  borderWidth?: number;
}

export const BorderBeam = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}: BorderBeamProps) => {
  const reduced = useReducedMotion();
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(#000,#000),linear-gradient(#000,#000)] mask-exclude [-webkit-mask-composite:xor] [mask-clip:padding-box,border-box]",
      )}
      style={
        {
          "--border-beam-width": `${borderWidth}px`,
        } as React.CSSProperties
      }
    >
      <motion.div
        className={cn(
          "absolute aspect-square",
          "bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent",
          className,
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
            ...style,
          } as MotionStyle
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reduced
            ? `${initialOffset}%`
            : reverse
              ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
              : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  );
};

export type BorderBeamDemoProps = Partial<BorderBeamProps>;
export default function BorderBeamDemo({
  className,
  ...props
}: BorderBeamDemoProps) {
  const [enabled, setEnabled] = React.useState(true);
  const [alternate, setAlternate] = React.useState(false);
  return (
    <div
      className={cn("dui-border-beam", className)}
      data-component-layout="motion"
    >
      <div
        className={cn(
          "relative flex h-[190px] w-full max-w-sm flex-col items-center justify-center rounded-2xl border border-black/10 bg-white px-6 text-center",
        )}
      >
        <h3 className={cn("text-xl font-medium")}>Border Beam</h3>
        <p className={cn("mt-2 text-sm text-[#626268]")}>
          A little light at the edges.
        </p>
        {enabled && (
          <BorderBeam
            {...props}
            borderWidth={props.borderWidth ?? 2}
            size={props.size ?? 70}
            duration={props.duration ?? 5}
            reverse={props.reverse ?? alternate}
            colorFrom={props.colorFrom ?? "#3355c5"}
            colorTo={props.colorTo ?? "#8bd5ca"}
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
          Reverse direction
        </button>
      </div>
    </div>
  );
}
