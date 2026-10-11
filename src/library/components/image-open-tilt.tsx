"use client";
// This file guarantees original in-place image enlargement without losing the image's natural ratio.
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { motion as m, useReducedMotion } from "motion/react";
import { cn } from "../../class-names";

/** Owns an inline image viewer; controlled owners receive changes without hidden state mutations. */
export interface ImageOpenTiltProps extends ComponentProps<"div"> {
  src?: string;
  alt?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  thumbnailWidth?: number;
  expandedWidth?: number;
  disabled?: boolean;
  motion?: "system" | "off";
}
export default function ImageOpenTilt({
  src = "https://images.unsplash.com/photo-1633714998165-706d988d17ef?auto=format&fit=max&w=560&q=85",
  alt = "Pink tulips against a blue sky",
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  thumbnailWidth = 72,
  expandedWidth = 260,
  disabled = false,
  motion = "system",
  className,
  ...props
}: ImageOpenTiltProps) {
  const [local, setLocal] = useState(defaultOpen);
  const [failedSrc, setFailedSrc] = useState<string>();
  const [loaded, setLoaded] = useState({ src: "", ratio: 1.5 });
  const [bounds, setBounds] = useState({ width: 320, height: 240 });
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const failed = failedSrc === src;
  const open = !failed && (controlled ?? local);
  const quiet = reduced || motion === "off" || disabled;
  const ratio = loaded.src === src ? loaded.ratio : 1.5;
  const availableWidth = Math.max(44, bounds.width - 48);
  const availableHeight = Math.max(44, bounds.height - 48);
  const wantedThumbnail = Number.isFinite(thumbnailWidth)
    ? Math.max(24, thumbnailWidth)
    : 72;
  const wantedExpanded = Number.isFinite(expandedWidth)
    ? Math.max(44, expandedWidth)
    : 260;
  const width = Math.min(
    wantedThumbnail,
    availableWidth,
    availableHeight * ratio,
  );
  const footprintWidth = Math.max(44, width);
  const footprintHeight = Math.max(44, width / ratio);
  const scale = Math.max(
    1,
    Math.min(
      wantedExpanded / width,
      availableWidth / footprintWidth,
      availableHeight / footprintHeight,
    ),
  );
  const transition = quiet
    ? { duration: 0 }
    : { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const };
  const change = (next: boolean) => {
    if (disabled || failed) return;
    if (controlled === undefined) setLocal(next);
    onOpenChange?.(next);
  };
  useEffect(() => {
    const measure = () => {
      const rect = stage.current?.getBoundingClientRect();
      if (rect?.width && rect.height)
        setBounds({ width: rect.width, height: rect.height });
    };
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    if (stage.current) observer?.observe(stage.current);
    const timer = window.setTimeout(measure, 0);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, []);
  return (
    <div
      {...props}
      className={cn("dui-image-open-tilt dui-demo", className)}
      data-component-layout="motion"
    >
      <div
        ref={stage}
        className="dui-image-tilt-stage"
        onPointerDown={(event) => {
          if (event.target === event.currentTarget && open) change(false);
        }}
      >
        <m.button
          type="button"
          className="dui-image-tilt-target"
          disabled={disabled || failed}
          aria-label={open ? "Close image" : "Open image"}
          aria-expanded={open}
          onClick={() => change(!open)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && open) {
              event.preventDefault();
              change(false);
            }
          }}
          initial={false}
          animate={
            quiet
              ? { scale: open ? scale : 1 }
              : {
                  scale: open ? [null, scale * 1.04, scale] : 1,
                }
          }
          transition={transition}
        >
          {failed ? (
            <span
              className="dui-image-tilt-fallback"
              role="img"
              aria-label={alt}
            >
              Image unavailable
            </span>
          ) : (
            <m.span
              className="dui-image-tilt-plane"
              style={{ width }}
              animate={{ borderRadius: open ? 5 : 12 }}
              transition={transition}
            >
              <img
                src={src}
                alt={alt}
                draggable={false}
                onLoad={(event) => {
                  const image = event.currentTarget;
                  if (image.naturalWidth && image.naturalHeight)
                    setLoaded({
                      src,
                      ratio: image.naturalWidth / image.naturalHeight,
                    });
                }}
                onError={() => setFailedSrc(src)}
              />
            </m.span>
          )}
        </m.button>
      </div>
      <p className="dui-image-tilt-hint">
        {failed
          ? "Try another image."
          : open
            ? "Click again or press Esc to close."
            : "Click the image to open."}
      </p>
    </div>
  );
}
