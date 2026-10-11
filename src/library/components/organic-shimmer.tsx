"use client";
// This file guarantees an original square shimmer with a wavy band and synchronized edge light.
import { useEffect, useRef, useState, useId, type ComponentProps } from "react";
import { cn } from "../../class-names";
function bandPath(progress: number) {
  const x = -36 + 212 * progress;
  const edge = (y: number) =>
    x +
    5 * Math.sin(y / 19 + progress * 6) +
    3 * Math.cos(y / 31 - progress * 4);
  const left = Array.from({ length: 17 }, (_, i) => {
    const y = i * 10 - 10;
    return `${edge(y).toFixed(2)},${y}`;
  });
  const right = Array.from({ length: 17 }, (_, i) => {
    const y = 150 - i * 10;
    return `${(edge(y) + 32).toFixed(2)},${y}`;
  });
  return `M${left.join(" L")} L${right.join(" L")} Z`;
}
/** A shared animation phase moves the organic light band and its edge highlight. */
export interface OrganicShimmerSurfaceProps extends ComponentProps<"div"> {
  active?: boolean;
}
export function OrganicShimmerSurface({
  active = true,
  className,
  children,
  ...props
}: OrganicShimmerSurfaceProps) {
  const id = useId().replace(/:/g, "");
  const path = useRef<SVGPathElement>(null);
  const edge = useRef<SVGLinearGradientElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  useEffect(() => {
    const media =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    let reduced = media?.matches ?? false;
    let visible = true;
    let frame = 0;
    let last = performance.now();
    let disposed = false;
    const draw = (now: number) => {
      if (disposed) return;
      if (active && !reduced && visible && !document.hidden)
        elapsed.current += Math.max(0, now - last);
      last = now;
      const progress = (elapsed.current % 3000) / 3000;
      const x = -20 + 212 * progress;
      path.current?.setAttribute("d", bandPath(progress));
      edge.current?.setAttribute("x1", String(x - 28));
      edge.current?.setAttribute("x2", String(x + 28));
      if (active && !reduced && visible && !document.hidden)
        frame = requestAnimationFrame(draw);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      draw(last);
    };
    const onMotion = () => {
      reduced = media?.matches ?? false;
      restart();
    };
    media?.addEventListener?.("change", onMotion);
    document.addEventListener("visibilitychange", restart);
    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((entries) => {
            visible = entries[0]?.isIntersecting ?? true;
            restart();
          })
        : null;
    if (stage.current) observer?.observe(stage.current);
    restart();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      media?.removeEventListener?.("change", onMotion);
      document.removeEventListener("visibilitychange", restart);
    };
  }, [active]);
  return (
    <div
      {...props}
      ref={stage}
      className={cn("dui-organic-surface", className)}
      data-active={active}
      role={props.role ?? (children ? undefined : "img")}
      aria-label={props["aria-label"] ?? "Organic shimmer surface"}
    >
      {children}
      <svg
        aria-hidden="true"
        className={cn("dui-organic-wave")}
        viewBox="0 0 140 140"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`band-${id}`}>
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset=".55" stopColor="white" stopOpacity=".65" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            ref={edge}
            id={`edge-${id}`}
            gradientUnits="userSpaceOnUse"
            x1="-48"
            x2="8"
          >
            <stop stopColor="#88C0D0" stopOpacity="0" />
            <stop offset=".5" stopColor="#B48EAD" stopOpacity=".65" />
            <stop offset="1" stopColor="#88C0D0" stopOpacity="0" />
          </linearGradient>
          <filter
            id={`soft-${id}`}
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>
        <path
          ref={path}
          d={bandPath(0)}
          fill={`url(#band-${id})`}
          filter={`url(#soft-${id})`}
        />
        <rect
          x="1.5"
          y="1.5"
          width="137"
          height="137"
          rx="15"
          fill="none"
          stroke={`url(#edge-${id})`}
          strokeWidth="3"
          filter={`url(#soft-${id})`}
        />
      </svg>
    </div>
  );
}
export interface OrganicShimmerProps extends OrganicShimmerSurfaceProps {
  onActiveChange?: (active: boolean) => void;
}
export default function OrganicShimmer({
  active: controlled,
  onActiveChange,
  className,
  children,
  ...props
}: OrganicShimmerProps) {
  const [playing, setPlaying] = useState(true);
  const active = controlled ?? playing;
  return (
    <div
      className={cn("dui-organic-shimmer dui-demo", className)}
      data-component-layout="content"
    >
      <OrganicShimmerSurface {...props} active={active}>
        {children}
      </OrganicShimmerSurface>
      <div className={cn("dui-demo-controls")}>
        <button
          type="button"
          aria-pressed={active}
          onClick={() => {
            const next = !active;
            setPlaying(next);
            onActiveChange?.(next);
          }}
        >
          {active ? "Pause shimmer" : "Play shimmer"}
        </button>
      </div>
    </div>
  );
}
