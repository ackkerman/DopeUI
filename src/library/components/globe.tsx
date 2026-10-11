"use client";
import * as React from "react";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring, useReducedMotion } from "motion/react";

import { cn } from "../../class-names";

const MOVEMENT_DAMPING = 1400;

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const reduced = useReducedMotion();
  const [unavailable, setUnavailable] = React.useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.setProperty(
        "cursor",
        value !== null ? "grabbing" : "grab",
      );
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
      pointerInteracting.current = clientX;
    }
  };

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    let globe: ReturnType<typeof createGlobe>;
    try {
      globe = createGlobe(canvasRef.current!, {
        ...config,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        onRender: (state) => {
          if (pointerInteracting.current === null && !reduced)
            phiRef.current += 0.005;
          state.phi = phiRef.current + (reduced ? r.get() : rs.get());
          state.width = widthRef.current * 2;
          state.height = widthRef.current * 2;
        },
      });
    } catch {
      window.removeEventListener("resize", onResize);
      const timer = setTimeout(() => setUnavailable(true), 0);
      return () => clearTimeout(timer);
    }
    let visible = true;
    const sync = () => globe.toggle(!document.hidden && visible);
    const observer =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            sync();
          })
        : null;
    if (canvasRef.current) observer?.observe(canvasRef.current);
    document.addEventListener("visibilitychange", sync);
    const revealTimer = setTimeout(
      () => canvasRef.current?.style.setProperty("opacity", "1"),
      0,
    );
    return () => {
      clearTimeout(revealTimer);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, r, config, reduced]);

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-150",
        className,
      )}
    >
      {unavailable && (
        <p
          role="status"
          className={cn(
            "absolute inset-0 flex items-center justify-center text-center text-xs text-[#626268]",
          )}
        >
          3D preview is unavailable in this browser.
        </p>
      )}
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size] touch-none",
        )}
        ref={canvasRef}
        tabIndex={0}
        aria-label="Rotate globe with arrow keys"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            r.set(r.get() + (e.key === "ArrowRight" ? 0.2 : -0.2));
          }
        }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}

export type GlobeDemoProps = React.ComponentProps<typeof Globe>;
export default function GlobeDemo({ className, ...props }: GlobeDemoProps) {
  const [run, setRun] = React.useState(0);
  return (
    <div className={cn("dui-globe", className)} data-component-layout="motion">
      <div
        className={cn(
          "dui-globe-stage relative aspect-square w-[240px] max-w-full shrink-0",
        )}
      >
        <Globe key={run} {...props} />
      </div>
      <p className={cn("dui-globe-instructions text-xs text-[#626268]")}>
        Drag to rotate, or use the arrow keys.
      </p>
      <div className={cn("dui-demo-controls")}>
        <button type="button" onClick={() => setRun((v) => v + 1)}>
          Reset rotation
        </button>
      </div>
    </div>
  );
}
