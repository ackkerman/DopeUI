"use client";
import * as React from "react";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";

import { cn } from "../../class-names";

export type TransitionVariant =
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "hexagon"
  | "rectangle"
  | "star";

/** Theme transitions can target a supplied preview scope or the document root. */
export interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  scopeRef?: React.RefObject<HTMLElement | null>;
  duration?: number;
  variant?: TransitionVariant;
  /** When true, the transition expands from the viewport center instead of the button center. */
  fromCenter?: boolean;
  /**
   * Controlled theme value. When provided, the parent owns persistence
   * (e.g. `next-themes`) and this component will not write to localStorage.
   */
  theme?: "light" | "dark";
  /** Called on toggle. Pair with `theme` for controlled usage. */
  onThemeChange?: (theme: "light" | "dark") => void;
}

function polygonCollapsed(point: string, vertexCount: number): string {
  const pairs = Array.from({ length: vertexCount }, () => point).join(", ");
  return `polygon(${pairs})`;
}

// All coordinates are percentages of the snapshot reference box: Chrome 150
// renders absolute px clip-path coordinates on ::view-transition-new(root)
// unscaled on fractional display scales (e.g. Windows 150%) for the first
// transition after load, so px values land at the wrong position (#989).
function getThemeTransitionClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number,
): [string, string] {
  const toX = (x: number) => `${(x / viewportWidth) * 100}%`;
  const toY = (y: number) => `${(y / viewportHeight) * 100}%`;
  const point = (x: number, y: number) => `${toX(x)} ${toY(y)}`;
  // circle() percentage radii resolve against hypot(w, h) / sqrt(2) of the reference box.
  const toRadius = (r: number) =>
    `${(r / (Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2)) * 100}%`;

  switch (variant) {
    case "circle":
      return [
        `circle(0% at ${point(cx, cy)})`,
        `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`,
      ];
    case "square": {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const halfSide = Math.max(halfW, halfH) * 1.05;
      const end = [
        point(cx - halfSide, cy - halfSide),
        point(cx + halfSide, cy - halfSide),
        point(cx + halfSide, cy + halfSide),
        point(cx - halfSide, cy + halfSide),
      ].join(", ");
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }
    case "triangle": {
      const scale = maxRadius * 2.2;
      const dx = (Math.sqrt(3) / 2) * scale;
      const verts = [
        point(cx, cy - scale),
        point(cx + dx, cy + 0.5 * scale),
        point(cx - dx, cy + 0.5 * scale),
      ].join(", ");
      return [polygonCollapsed(point(cx, cy), 3), `polygon(${verts})`];
    }
    case "diamond": {
      // Slightly larger than the view-transition circle radius so axis-aligned coverage matches the circle reveal.
      const R = maxRadius * Math.SQRT2;
      const end = [
        point(cx, cy - R),
        point(cx + R, cy),
        point(cx, cy + R),
        point(cx - R, cy),
      ].join(", ");
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }
    case "hexagon": {
      const R = maxRadius * Math.SQRT2;
      const verts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        verts.push(point(cx + R * Math.cos(a), cy + R * Math.sin(a)));
      }
      return [
        polygonCollapsed(point(cx, cy), 6),
        `polygon(${verts.join(", ")})`,
      ];
    }
    case "rectangle": {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const end = [
        point(cx - halfW, cy - halfH),
        point(cx + halfW, cy - halfH),
        point(cx + halfW, cy + halfH),
        point(cx - halfW, cy + halfH),
      ].join(", ");
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }
    case "star": {
      // Small overscan so the last frames never leave a 1px seam before the transition group ends.
      const R = maxRadius * Math.SQRT2 * 1.03;
      const innerRatio = 0.42;
      const starPolygon = (radius: number) => {
        const verts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          verts.push(
            point(
              cx + radius * Math.cos(outerA),
              cy + radius * Math.sin(outerA),
            ),
          );
          const innerA = outerA + Math.PI / 5;
          verts.push(
            point(
              cx + radius * innerRatio * Math.cos(innerA),
              cy + radius * innerRatio * Math.sin(innerA),
            ),
          );
        }
        return `polygon(${verts.join(", ")})`;
      };
      const startR = Math.max(2, R * 0.025);
      return [starPolygon(startR), starPolygon(R)];
    }
    default:
      return [
        `circle(0% at ${point(cx, cy)})`,
        `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`,
      ];
  }
}

export const AnimatedThemeToggler = ({
  className,
  scopeRef,
  duration = 400,
  variant,
  fromCenter = false,
  theme,
  onThemeChange,
  ...props
}: AnimatedThemeTogglerProps) => {
  const shape = variant ?? "circle";
  const isControlled = theme !== undefined;
  const [internalIsDark, setInternalIsDark] = useState(false);
  const isDark = isControlled ? theme === "dark" : internalIsDark;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTransitioningRef = useRef(false);
  const activeAnimRef = useRef<Animation | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const cancelAnim = useCallback(() => {
    activeAnimRef.current?.cancel();
    activeAnimRef.current = null;
  }, []);

  useEffect(
    () => () => {
      cleanupRef.current?.();
      cancelAnim();
    },
    [cancelAnim],
  );

  useEffect(() => {
    if (isControlled) return;

    const updateTheme = () => {
      setInternalIsDark(
        (scopeRef?.current ?? document.documentElement).classList.contains(
          "dark",
        ),
      );
    };

    const initialSync = setTimeout(updateTheme, 0);

    const observer = new MutationObserver(updateTheme);
    observer.observe(scopeRef?.current ?? document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      clearTimeout(initialSync);
      observer.disconnect();
    };
  }, [isControlled, scopeRef]);

  const toggleTheme = useCallback(
    (event?: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (
        !button ||
        isTransitioningRef.current ||
        document.documentElement.dataset.duiThemeVt === "active"
      )
        return;

      // innerWidth/innerHeight (not visualViewport): percentages must resolve
      // against the snapshot reference box, which includes classic scrollbars.
      const scopeElement = scopeRef?.current;
      const scopeBounds = scopeElement?.getBoundingClientRect();
      const viewportWidth = scopeBounds?.width ?? window.innerWidth;
      const viewportHeight = scopeBounds?.height ?? window.innerHeight;
      const originLeft = scopeBounds?.left ?? 0;
      const originTop = scopeBounds?.top ?? 0;

      let x: number;
      let y: number;
      if (fromCenter) {
        x = viewportWidth / 2;
        y = viewportHeight / 2;
      } else {
        const { top, left, width, height } = button.getBoundingClientRect();
        x =
          (event && event.detail > 0 ? event.clientX : left + width / 2) -
          originLeft;
        y =
          (event && event.detail > 0 ? event.clientY : top + height / 2) -
          originTop;
      }

      const maxRadius = Math.hypot(
        Math.max(x, viewportWidth - x),
        Math.max(y, viewportHeight - y),
      );

      const applyTheme = () => {
        const newTheme = !isDark;
        // The preview owns a local theme; document usage remains available without a scope.
        const themeRoot = scopeRef?.current ?? document.documentElement;
        themeRoot.classList.toggle("dark", newTheme);
        if (isControlled) {
          onThemeChange?.(newTheme ? "dark" : "light");
        } else {
          setInternalIsDark(newTheme);
          if (!scopeRef?.current) {
            try {
              localStorage.setItem("theme", newTheme ? "dark" : "light");
            } catch {
              /* A denied storage write must not prevent the visual theme change. */
            }
          }
        }
      };

      if (
        typeof document.startViewTransition !== "function" ||
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
      ) {
        applyTheme();
        return;
      }

      const clipPath = getThemeTransitionClipPaths(
        shape,
        x,
        y,
        maxRadius,
        viewportWidth,
        viewportHeight,
      );

      const root = document.documentElement;
      root.dataset.duiThemeVt = "active";
      const previousTransitionName =
        scopeElement?.style.viewTransitionName ?? "";
      if (scopeElement) {
        scopeElement.style.setProperty(
          "view-transition-name",
          "dui-theme-preview",
        );
        root.dataset.duiThemeVtScope = "preview";
      }
      root.style.setProperty("--dui-theme-toggle-vt-duration", `${duration}ms`);
      // Pin the collapsed clip-path via CSS so Firefox does not paint the new
      // theme unclipped between snapshot and the ready.then() JS animation.
      root.style.setProperty("--dui-theme-vt-clip-from", clipPath[0]);
      const cleanup = () => {
        if (!isTransitioningRef.current) return;
        isTransitioningRef.current = false;
        delete root.dataset.duiThemeVt;
        delete root.dataset.duiThemeVtScope;
        if (scopeElement)
          scopeElement.style.setProperty(
            "view-transition-name",
            previousTransitionName,
          );
        root.style.removeProperty("--dui-theme-toggle-vt-duration");
        root.style.removeProperty("--dui-theme-vt-clip-from");
        cancelAnim();
      };

      cleanupRef.current = cleanup;
      isTransitioningRef.current = true;
      const transition = document.startViewTransition(() => {
        flushSync(applyTheme);
      });
      if (typeof transition?.finished?.finally === "function") {
        transition.finished.finally(cleanup).catch(() => {});
      } else {
        cleanup();
      }

      const ready = transition?.ready;
      if (ready && typeof ready.then === "function") {
        ready
          .then(() => {
            const anim = document.documentElement.animate(
              {
                clipPath,
              },
              {
                duration,
                // Star: linear avoids easing overshoot that fights polygon interpolation at t→1; VT group duration is synced above.
                easing: shape === "star" ? "linear" : "ease-in-out",
                fill: "forwards",
                pseudoElement: scopeElement
                  ? "::view-transition-new(dui-theme-preview)"
                  : "::view-transition-new(root)",
              },
            );
            activeAnimRef.current = anim;
          })
          .catch(() => {});
      }
    },
    [
      scopeRef,
      shape,
      fromCenter,
      duration,
      isDark,
      isControlled,
      onThemeChange,
      cancelAnim,
    ],
  );

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      aria-pressed={isDark}
      className={cn("dui-theme-toggle", className)}
      {...props}
    >
      {isDark ? <Sun /> : <Moon />}
      <span className={cn("sr-only")}>Toggle theme</span>
    </button>
  );
};

export type AnimatedThemeTogglerDemoProps = Partial<AnimatedThemeTogglerProps>;
export default function AnimatedThemeTogglerDemo({
  className,
  variant: controlledVariant,
  ...props
}: AnimatedThemeTogglerDemoProps) {
  const scope = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [variant, setVariant] = useState<TransitionVariant>("circle");
  return (
    <div
      className={cn("dui-animated-theme-toggler", className)}
      data-component-layout="motion"
    >
      <div
        ref={scope}
        className={cn(
          "relative w-full max-w-sm rounded-2xl border border-black/10 bg-white px-6 py-8 text-center text-[#2E3440] dark:bg-[#2E3440] dark:text-white",
          theme === "dark" && "dark",
        )}
      >
        <AnimatedThemeToggler
          {...props}
          scopeRef={scope}
          theme={theme}
          variant={controlledVariant ?? variant}
          onThemeChange={(next) => {
            setTheme(next);
            props.onThemeChange?.(next);
          }}
          className={cn(
            "inline-flex h-12 w-12 items-center justify-center rounded-full border border-current/10",
          )}
        />
        <h3 className={cn("mt-4 text-xl font-semibold")}>
          {theme === "dark" ? "Night mode" : "Day mode"}
        </h3>
        <p className={cn("mt-2 text-sm opacity-60")}>
          Same workspace, a different light.
        </p>
      </div>
      <div className={cn("dui-demo-controls")} aria-label="Transition shape">
        {(
          [
            "circle",
            "square",
            "diamond",
            "hexagon",
            "triangle",
            "rectangle",
            "star",
          ] as const
        ).map((shape) => (
          <button
            type="button"
            key={shape}
            aria-pressed={(controlledVariant ?? variant) === shape}
            onClick={() => setVariant(shape)}
          >
            {shape[0].toUpperCase() + shape.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
