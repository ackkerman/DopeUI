"use client";

// This file guarantees seamless repeated strips expose only their original items to assistive technology.
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "../../class-names";

/** Measured item sets repeat to cover the viewport; duration is one loop in seconds. */
export interface MarqueeStripProps {
  items: readonly ReactNode[];
  itemWidth: number;
  label: string;
  className?: string;
  duration?: number;
  direction?: "left" | "right";
  gap?: number;
  paused?: boolean;
  pauseOnHover?: boolean;
}

export function MarqueeStrip({
  items,
  itemWidth,
  label,
  className,
  duration = 28,
  direction = "left",
  gap = 16,
  paused = false,
  pauseOnHover = false,
}: MarqueeStripProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const originalSet = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ viewport: 0, content: 0 });
  const safeDuration =
    Number.isFinite(duration) && duration > 0 ? duration : 28;
  const safeGap = Number.isFinite(gap) && gap >= 0 ? gap : 16;
  const safeWidth =
    Number.isFinite(itemWidth) && itemWidth > 0 ? itemWidth : 144;
  const contentWidth =
    size.content ||
    items.length * safeWidth + Math.max(0, items.length - 1) * safeGap;
  const repeat = items.length
    ? Math.max(1, Math.ceil(size.viewport / (contentWidth + safeGap)))
    : 1;

  useEffect(() => {
    const element = viewport.current;
    // SSR and older hosts still render the original row without observing width.
    if (!element || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const next = {
        viewport: element.clientWidth,
        content: originalSet.current?.getBoundingClientRect().width ?? 0,
      };
      setSize((current) =>
        current.viewport === next.viewport && current.content === next.content
          ? current
          : next,
      );
    };
    const observer = new ResizeObserver(measure);
    measure();
    observer.observe(element);
    if (originalSet.current) observer.observe(originalSet.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={viewport}
      className={cn("dui-marquee", className)}
      role="region"
      aria-label={label}
      tabIndex={0}
      data-paused={paused}
      data-pause-on-hover={pauseOnHover}
      data-direction={direction}
      style={
        {
          "--dui-marquee-duration": `${safeDuration}s`,
          "--dui-marquee-gap": `${safeGap}px`,
        } as CSSProperties
      }
    >
      <div className="dui-marquee-track">
        {[0, 1].map((copy) => (
          <div
            className="dui-marquee-group"
            key={copy}
            role="list"
            aria-label={copy === 0 ? label : undefined}
            aria-hidden={copy === 1 ? true : undefined}
            inert={copy === 1 ? true : undefined}
          >
            {Array.from({ length: repeat }, (_, repetition) => (
              <div
                className="dui-marquee-set"
                ref={copy === 0 && repetition === 0 ? originalSet : undefined}
                key={repetition}
                role="presentation"
                aria-hidden={repetition > 0 ? true : undefined}
                inert={repetition > 0 ? true : undefined}
              >
                {items}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
