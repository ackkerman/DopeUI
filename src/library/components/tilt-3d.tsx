"use client";
import { FOLLOW_SPRING } from "../motion-presets";
// This file guarantees an original dope/ui interaction with copyable React code.
import { useEffect, useState, type ComponentProps } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import { cn } from "../../class-names";

/** Pointer and arrow keys tilt a card; disabled or reduced motion holds it still. */
export interface TiltCardProps extends ComponentProps<"div"> {
  maxTilt?: number;
  surfaceClassName?: string;
  disabled?: boolean;
  resetKey?: number;
}
export function TiltCard({
  className,
  children,
  maxTilt = 8,
  surfaceClassName,
  disabled = false,
  resetKey = 0,
  ...props
}: TiltCardProps) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(x, FOLLOW_SPRING);
  const ry = useSpring(y, FOLLOW_SPRING);
  const transform = useMotionTemplate`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  useEffect(() => {
    x.set(0);
    y.set(0);
  }, [resetKey, reduced, x, y]);
  return (
    <div
      {...props}
      className={cn(
        "w-full max-w-[280px] outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
      tabIndex={disabled ? -1 : (props.tabIndex ?? 0)}
      aria-disabled={disabled || undefined}
      onPointerMove={(event) => {
        props.onPointerMove?.(event);
        if (disabled || reduced || event.pointerType === "touch") return;
        const r = event.currentTarget.getBoundingClientRect();
        if (!r.width || !r.height) return;
        x.set(
          (-(event.clientY - r.top - r.height / 2) / r.height) * maxTilt * 2,
        );
        y.set(((event.clientX - r.left - r.width / 2) / r.width) * maxTilt * 2);
      }}
      onPointerLeave={(event) => {
        props.onPointerLeave?.(event);
        reset();
      }}
      onBlur={(event) => {
        props.onBlur?.(event);
        reset();
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (disabled || reduced) return;
        if (
          [
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Escape",
          ].includes(event.key)
        ) {
          event.preventDefault();
          if (event.key === "Escape") reset();
          else {
            x.set(
              event.key === "ArrowUp"
                ? -maxTilt
                : event.key === "ArrowDown"
                  ? maxTilt
                  : 0,
            );
            y.set(
              event.key === "ArrowLeft"
                ? -maxTilt
                : event.key === "ArrowRight"
                  ? maxTilt
                  : 0,
            );
          }
        }
      }}
    >
      <motion.div
        className={cn(
          "dui-tilt-surface rounded-2xl border border-border bg-surface p-6 text-foreground shadow-sm",
          surfaceClassName,
        )}
        style={{
          transform: reduced ? "none" : transform,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
/** The credit-card preview uses fictional display data and never handles payments. */
export type Tilt3DProps = TiltCardProps & {
  cardholder?: string;
  number?: string;
  expiry?: string;
};
export default function Tilt3D({
  className,
  children,
  cardholder = "JAMIE DAVIS",
  number = "4242 4242 4242 4242",
  expiry = "12/29",
  ...props
}: Tilt3DProps) {
  const [run, setRun] = useState(0);
  return (
    <div
      className={cn("dui-tilt-3d dui-demo", className)}
      data-component-layout="content"
    >
      <TiltCard
        {...props}
        resetKey={props.resetKey ?? run}
        surfaceClassName={cn(
          "dui-credit-card bg-[#2e3440] p-4 text-[#eceff4]",
          props.surfaceClassName,
        )}
        aria-label={
          props["aria-label"] ?? "Credit card tilt preview, use arrow keys"
        }
      >
        {children ?? (
          <>
            <div className={cn("flex items-center justify-between")}>
              <span className={cn("text-sm font-medium tracking-tight")}>
                dope/ui.
              </span>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-widest opacity-75",
                )}
              >
                Credit
              </span>
            </div>
            <div className={cn("mt-3 flex items-center justify-between")}>
              <svg
                aria-hidden="true"
                width="34"
                height="26"
                viewBox="0 0 34 26"
                fill="none"
              >
                <rect
                  x=".5"
                  y=".5"
                  width="33"
                  height="25"
                  rx="5"
                  fill="#EBCB8B"
                  fillOpacity=".85"
                />
                <path
                  d="M11 0v26M23 0v26M0 9h11M0 17h11M23 9h11M23 17h11M11 7h12v12H11"
                  stroke="#7A6843"
                  strokeWidth=".8"
                />
              </svg>
              <svg
                aria-hidden="true"
                data-dui-icon
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path d="M9 8a6 6 0 0 1 0 8M12 5a10 10 0 0 1 0 14M15 2a14 14 0 0 1 0 20" />
              </svg>
            </div>
            <p
              className={cn(
                "mt-3 whitespace-nowrap font-mono text-[clamp(11px,1.1vw,15px)] tracking-[.1em]",
              )}
            >
              {number}
            </p>
            <div
              className={cn(
                "mt-3 flex items-end justify-between text-[9px] uppercase tracking-widest",
              )}
            >
              <div>
                <p className={cn("opacity-60")}>Cardholder</p>
                <p className={cn("mt-0.5 font-medium")}>{cardholder}</p>
              </div>
              <div>
                <p className={cn("opacity-60")}>Valid thru</p>
                <p className={cn("mt-0.5 font-medium")}>{expiry}</p>
              </div>
            </div>
          </>
        )}
      </TiltCard>
      <p className={cn("text-center text-xs text-muted-foreground")}>
        Move your pointer or use the arrow keys.
      </p>
      <div className={cn("dui-demo-controls")}>
        <button type="button" onClick={() => setRun((v) => v + 1)}>
          Reset tilt
        </button>
      </div>
    </div>
  );
}
