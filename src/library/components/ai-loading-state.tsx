"use client";

// Requires Tailwind CSS v4 and the supplied foundation.css. Internal UI helpers are included.
import {
  useState,
  type ComponentProps,
  type CSSProperties,
  useEffect,
} from "react";

/* ─────────────────────────────────────────────────────────
 * LOADING STATE — pixel-grid loader for long-running work
 *
 * Variants:
 *   Drive  — square cells, chevron wavefront driving right;
 *            the 650ms cycle is shorter than the sweep, so
 *            two fronts are always in flight
 *   Dots   — same wavefront, circular cells
 *   Orbit  — a comet lapping the grid perimeter
 *   Surfer — the Drive loader paired with a meme video below
 *
 * Paired with a shimmering label and a live elapsed timer
 * in mono tabular figures. Reduced motion freezes the grid
 * to its dim state; the timer still ticks.
 * ───────────────────────────────────────────────────────── */

const chevron = Array.from({ length: 9 }, (_, i) => {
  const r = Math.floor(i / 3),
    c = i % 3;
  return (c + Math.abs(r - 1)) * 90;
});

const ORBIT_ORDER = [0, 1, 2, 5, 8, 7, 6, 3];
const orbit = Array.from({ length: 9 }, (_, i) => {
  const k = ORBIT_ORDER.indexOf(i);
  return k === -1 ? null : k * 110;
});

const PATTERNS: Record<
  string,
  { delays: (number | null)[]; dur: number; round: boolean }
> = {
  Drive: { delays: chevron, dur: 650, round: false },
  Dots: { delays: chevron, dur: 650, round: true },
  Orbit: { delays: orbit, dur: 950, round: false },
};

function LoaderGrid({
  delays,
  dur,
  round,
}: {
  delays: (number | null)[];
  dur: number;
  round: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 grid-cols-[repeat(3,4px)] gap-[1.5px]")}
    >
      {delays.map((delay, index) => (
        <span
          key={index}
          className={cn(
            `size-[4px] bg-ink ${round ? "rounded-full" : "rounded-[1px]"}`,
          )}
          style={{
            opacity: delay === null ? 0.07 : 0.15,
            animation:
              delay === null
                ? "none"
                : `dui-ai-loading-state-pixel-on ${dur}ms ease-in-out ${delay}ms infinite`,
          }}
        />
      ))}
    </span>
  );
}

function useElapsed() {
  const [ds, setDs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDs((d) => d + 1), 100);
    return () => clearInterval(t);
  }, []);
  const total = ds / 10;
  if (total < 60) return `${total.toFixed(1)}s`;
  return `${Math.floor(total / 60)}m ${(total % 60).toFixed(1)}s`;
}

function UpstreamLoadingState({
  label,
  variant = "Drive",
  /** the meme feed for the Surfer variant; hosted on Vercel Blob so it plays in
   *  production (the local /public/subway-surfers.mp4 stays gitignored).
   *  Heavily compressed (288px, 20fps, no audio → ~265 KB, from 1.1 MB) to keep
   *  Blob data transfer down. */
  videoSrc = undefined,
}: {
  label?: string;
  variant?: string;
  videoSrc?: string;
}) {
  const elapsed = useElapsed();
  const surfer = variant === "Surfer";
  const resolvedLabel = label ?? (surfer ? "Subway surfing" : "Churning");
  const [videoOk, setVideoOk] = useState(true);
  const { delays, dur, round } = PATTERNS[variant] ?? PATTERNS.Drive;

  const labelEl = (
    <span
      className={cn("bg-clip-text text-[13px] font-medium text-transparent")}
      style={{
        backgroundImage:
          "linear-gradient(90deg, var(--ink-3) 35%, var(--ink) 50%, var(--ink-3) 65%)",
        backgroundSize: "200% 100%",
        animation: "dui-ai-loading-state-shimmer-text 1.4s linear infinite",
      }}
    >
      {resolvedLabel}
    </span>
  );
  const elapsedEl = (
    <span className={cn("font-mono text-[12px] text-ink-3 tabular-nums")}>
      {elapsed}
    </span>
  );

  if (surfer) {
    return (
      <div role="status" className={cn("flex w-fit flex-col items-start")}>
        <div className={cn("flex items-center gap-2.5")}>
          <LoaderGrid {...PATTERNS.Drive} />
          {labelEl}
          {elapsedEl}
        </div>

        {/* the context card follows the status text it is illustrating */}
        <div
          className={cn(
            "mt-2 w-56 overflow-hidden rounded-[10px] shadow-overlay",
          )}
          style={{
            animation:
              "dui-ai-loading-state-pop-in 200ms cubic-bezier(0.16,1,0.3,1) both",
            transformOrigin: "top left",
          }}
        >
          <div
            className={cn("relative aspect-video w-full")}
            style={{ background: "var(--tooltip-bg)" }}
          >
            {videoOk && videoSrc ? (
              <video
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                onError={() => setVideoOk(false)}
                className={cn("h-full w-full object-cover")}
              />
            ) : (
              <div
                className={cn(
                  "flex h-full w-full flex-col items-center justify-center gap-1.5",
                )}
              >
                <LoaderGrid {...PATTERNS.Drive} />
                <span
                  className={cn("px-3 text-center font-mono text-[10px]")}
                  style={{ color: "var(--tooltip-muted)" }}
                >
                  Video unavailable
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div role="status" className={cn("flex w-fit items-center gap-2.5")}>
      <LoaderGrid delays={delays} dur={dur} round={round} />
      {labelEl}
      {elapsedEl}
    </div>
  );
}

export type AiLoadingStateProps = ComponentProps<
  typeof UpstreamLoadingState
> & {
  className?: string;
  style?: CSSProperties;
  theme?: "light" | "dark";
  onVariantChange?: (variant: string) => void;
};
export default function AiLoadingState({
  className,
  style,
  theme = "light",
  variant: controlledVariant,
  onVariantChange,
  ...props
}: AiLoadingStateProps) {
  const [localVariant, setVariant] = useState("Drive");
  const variant = controlledVariant ?? localVariant;
  return (
    <>
      <div
        className={cn(
          "dui-ai-loading-state",
          theme === "dark" && "dark",
          className,
        )}
        style={style}
        data-component-layout="panel"
      >
        <div className={cn("dui-ai-content")}>
          <UpstreamLoadingState {...props} variant={variant} />
        </div>
        <div
          className={cn("dui-ai-variants")}
          role="group"
          aria-label="Loading State variants"
        >
          {["Drive", "Dots", "Orbit", "Surfer"].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={value === variant}
              onClick={() => {
                if (controlledVariant === undefined) setVariant(value);
                onVariantChange?.(value);
              }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

import { cn } from "../../class-names";
