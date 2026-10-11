"use client";
import * as React from "react";

import { useEffect, useRef } from "react";

import { cn } from "../../class-names";

export interface GlyphMatrixProps extends React.HTMLAttributes<HTMLCanvasElement> {
  /** Characters to randomly pick from */
  glyphs?: string;
  /** Cell size in px (also font size) */
  cellSize?: number;
  /** Probability (0-1) a cell mutates each tick */
  mutationRate?: number;
  /** Tick interval in ms */
  interval?: number;
  /** Fade out toward bottom (0 = no fade) */
  fadeBottom?: number;
  /** Glyph color (any CSS color). Pass a theme-aware value from the consumer. */
  color?: string;
}

/**
 * GlyphMatrix — an animated grid of subtly shifting glyphs.
 * Pass a `color` prop (e.g. driven by next-themes) to adapt it to
 * light and dark modes.
 */
export function GlyphMatrix({
  glyphs = "01·•+*/\\<>=",
  cellSize = 14,
  mutationRate = 0.04,
  interval = 90,
  className,
  fadeBottom = 0.6,
  color = "#59687D",
  style,
  ...props
}: GlyphMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Current glyph color as RGBA (a in 0-1). Kept in a ref so a color change
  // (e.g. theme toggle) recolors the next frame without restarting the
  // animation. Defaults to #59687D.
  const rgbaRef = useRef({ r: 107, g: 114, b: 128, a: 1 });

  // Resolve the CSS color string to RGBA (handles hex, rgb, hsl, oklch, ...).
  useEffect(() => {
    const probe = document.createElement("canvas");
    probe.width = 1;
    probe.height = 1;
    const probeCtx = probe.getContext("2d");
    if (!probeCtx) return;
    // Seed with the default so an invalid color falls back to it: the 2d
    // context keeps the previous fillStyle when assigned an invalid value
    // instead of silently turning black.
    probeCtx.fillStyle = "#59687D";
    probeCtx.fillStyle = color;
    probeCtx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = probeCtx.getImageData(0, 0, 1, 1).data;
    rgbaRef.current = { r, g, b, a: a / 255 };
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let cells: string[] = [];
    let alphas: number[] = [];
    let raf = 0;
    let last = 0;
    let stopped = false;
    let visible = true;
    const visibility =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
          })
        : null;
    visibility?.observe(canvas);
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const { clientWidth: w, clientHeight: h } = canvas;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / Math.max(4, cellSize));
      rows = Math.ceil(h / Math.max(4, cellSize));

      cells = new Array(cols * rows)
        .fill(0)
        .map(() => glyphs[Math.floor(Math.random() * glyphs.length)]);
      alphas = new Array(cols * rows)
        .fill(0)
        .map(() => 0.05 + Math.random() * 0.35);
    };

    const draw = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      ctx.clearRect(0, 0, w, h);

      ctx.font = `${cellSize - 2}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";

      const { r, g, b, a: colorAlpha } = rgbaRef.current;
      for (let y = 0; y < rows; y++) {
        const fade = fadeBottom > 0 ? 1 - (y / rows) * fadeBottom : 1;
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const a = alphas[i] * fade * colorAlpha;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          ctx.fillText(cells[i], x * cellSize, y * cellSize);
        }
      }
    };

    const tick = (t: number) => {
      if (stopped) return;
      if (!visible || document.hidden || mq?.matches) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (t - last >= interval) {
        last = t;

        const total = cols * rows;
        const mutations = Math.max(1, Math.floor(total * mutationRate));

        for (let n = 0; n < mutations; n++) {
          const i = Math.floor(Math.random() * total);
          cells[i] = glyphs[Math.floor(Math.random() * glyphs.length)];
          alphas[i] = 0.05 + Math.random() * 0.45;
        }

        draw();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    draw();
    raf = requestAnimationFrame(tick);

    const ro =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(() => {
            resize();
            draw();
          })
        : null;
    ro?.observe(canvas);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      visibility?.disconnect();
    };
  }, [glyphs, cellSize, mutationRate, interval, fadeBottom]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none", className)}
      style={{ width: "100%", height: "100%", display: "block", ...style }}
      aria-hidden="true"
      {...props}
    />
  );
}

export type GlyphMatrixDemoProps = Partial<GlyphMatrixProps>;
export default function GlyphMatrixDemo({
  className,
  ...props
}: GlyphMatrixDemoProps) {
  const [alternate, setAlternate] = React.useState(false);
  return (
    <div
      className={cn("dui-glyph-matrix", className)}
      data-component-layout="motion"
    >
      <div
        className={cn(
          "relative h-[220px] w-full max-w-sm overflow-hidden rounded-2xl border border-black/10 bg-white",
        )}
      >
        <GlyphMatrix
          {...props}
          glyphs={props.glyphs ?? (alternate ? "01" : "01·•+*/\\<>=")}
          interval={props.interval ?? 180}
          color={props.color ?? "#416C91"}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center text-xl font-medium tracking-tight",
          )}
        >
          Glyph Matrix
        </div>
      </div>
      <div className={cn("dui-demo-controls")}>
        <button
          type="button"
          aria-pressed={alternate}
          onClick={() => setAlternate((v) => !v)}
        >
          Binary / Symbols
        </button>
      </div>
    </div>
  );
}
