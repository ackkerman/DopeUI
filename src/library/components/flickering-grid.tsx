"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "../../class-names";

export interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const [rgbaColor, setRgbaColor] = useState("rgba(0,0,0,");
  useEffect(() => {
    const timer = setTimeout(() => {
      const probe = document.createElement("canvas");
      probe.width = probe.height = 1;
      const ctx = probe.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      setRgbaColor(`rgba(${r},${g},${b},`);
    }, 0);
    return () => clearTimeout(timer);
  }, [color]);
  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const cols = Math.ceil(width / (squareSize + gridGap));
      const rows = Math.ceil(height / (squareSize + gridGap));

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const opacity = squares[i * rows + j];
          ctx.fillStyle = `${rgbaColor}${opacity})`;
          ctx.fillRect(
            i * (squareSize + gridGap) * dpr,
            j * (squareSize + gridGap) * dpr,
            squareSize * dpr,
            squareSize * dpr,
          );
        }
      }
    },
    [rgbaColor, squareSize, gridGap],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d") ?? null;
    let animationFrameId: number | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let initialMeasure: ReturnType<typeof setTimeout> | undefined;
    let gridParams: ReturnType<typeof setupCanvas> | null = null;

    if (canvas && container && ctx) {
      const updateCanvasSize = () => {
        const newWidth = width || container.clientWidth;
        const newHeight = height || container.clientHeight;
        setCanvasSize({ width: newWidth, height: newHeight });
        gridParams = setupCanvas(canvas, newWidth, newHeight);
        drawGrid(
          ctx,
          canvas.width,
          canvas.height,
          gridParams.cols,
          gridParams.rows,
          gridParams.squares,
          gridParams.dpr,
        );
      };

      initialMeasure = setTimeout(updateCanvasSize, 0);

      let lastTime = 0;
      const animate = (time: number) => {
        if (!isInView || !gridParams) return;
        if (
          document.hidden ||
          window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
        ) {
          animationFrameId = requestAnimationFrame(animate);
          return;
        }

        const deltaTime = (time - lastTime) / 1000;
        lastTime = time;

        updateSquares(gridParams.squares, deltaTime);
        drawGrid(
          ctx,
          canvas.width,
          canvas.height,
          gridParams.cols,
          gridParams.rows,
          gridParams.squares,
          gridParams.dpr,
        );
        animationFrameId = requestAnimationFrame(animate);
      };

      if (typeof ResizeObserver === "function") {
        resizeObserver = new ResizeObserver(updateCanvasSize);
        resizeObserver.observe(container);
      }

      if (typeof IntersectionObserver === "function") {
        intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            setIsInView(entry.isIntersecting);
          },
          { threshold: 0 },
        );
        intersectionObserver.observe(canvas);
      }

      if (isInView) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    return () => {
      clearTimeout(initialMeasure);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div
      ref={containerRef}
      className={cn(`h-full w-full ${className}`)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className={cn("pointer-events-none")}
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  );
};

export type FlickeringGridDemoProps = Partial<FlickeringGridProps>;
export default function FlickeringGridDemo({
  className,
  ...props
}: FlickeringGridDemoProps) {
  const [alternate, setAlternate] = React.useState(false);
  return (
    <div
      className={cn("dui-flickering-grid", className)}
      data-component-layout="motion"
    >
      <div
        className={cn(
          "relative h-[220px] w-full max-w-sm overflow-hidden rounded-2xl border border-black/10 bg-white",
        )}
      >
        <FlickeringGrid
          {...props}
          squareSize={props.squareSize ?? (alternate ? 8 : 4)}
          gridGap={props.gridGap ?? 6}
          maxOpacity={props.maxOpacity ?? 0.3}
          color={props.color ?? "#416C91"}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center text-xl font-medium tracking-tight",
          )}
        >
          Flickering Grid
        </div>
      </div>
      <div className={cn("dui-demo-controls")}>
        <button
          type="button"
          aria-pressed={alternate}
          onClick={() => setAlternate((v) => !v)}
        >
          Change density
        </button>
      </div>
    </div>
  );
}
