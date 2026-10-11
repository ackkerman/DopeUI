"use client";
// This file guarantees one controller combines the original matrix and every loading.dev indicator.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react";
import { SPINNERS, type SpinnerProps } from "loading-dev";
import { cn } from "../../class-names";
/** Matrix is retained alongside the complete official SDK set. */
export type LoadingVariant = "matrix" | keyof typeof SPINNERS;
export const LOADING_VARIANTS: readonly LoadingVariant[] = [
  "matrix",
  ...(Object.keys(SPINNERS) as (keyof typeof SPINNERS)[]),
];
export function loadingVariantLabel(variant: LoadingVariant) {
  return variant
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
/** A loader requires no additional CSS file; loading.dev supplies React 19 style resources. */
export interface LoadingIndicatorProps extends SpinnerProps {
  variant?: LoadingVariant;
}
export function LoadingIndicator({
  variant = "matrix",
  size = 48,
  color = "var(--frost-primary, #416C91)",
  duration = 1200,
  playState = "running",
  className,
}: LoadingIndicatorProps) {
  const diameter = Number.isFinite(size) ? Math.max(1, size) : 48;
  const milliseconds = Number.isFinite(duration)
    ? Math.max(100, duration)
    : 1200;
  const seconds = milliseconds / 1000;
  const Spinner = variant === "matrix" ? null : SPINNERS[variant];
  return (
    <span
      className={cn(
        "dui-loading-indicator inline-flex max-w-full items-center justify-center",
        className,
      )}
      data-variant={variant}
      data-paused={playState === "paused"}
      aria-hidden="true"
    >
      {Spinner ? (
        <Spinner
          size={diameter}
          color={color}
          duration={milliseconds}
          playState={playState}
          className="max-w-full"
        />
      ) : (
        <span
          className={cn("dot-matrix", playState === "paused" && "paused")}
          style={{
            width: diameter,
            height: diameter,
            gridTemplateColumns: "repeat(4,1fr)",
            gridTemplateRows: "repeat(4,1fr)",
            color,
          }}
        >
          {Array.from({ length: 16 }, (_, index) => (
            <i
              key={index}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "currentColor",
                animationDuration: `${seconds}s`,
                animationDelay: `${(((index % 4) + Math.floor(index / 4)) * seconds) / 10}s`,
                animationPlayState: playState,
              }}
            />
          ))}
        </span>
      )}
    </span>
  );
}
export const REPRESENTATIVE_LOADING_VARIANTS: readonly LoadingVariant[] = [
  "matrix",
  "arc",
  "bouncing-dots",
  "wave",
];
/** A named grid compares indicators without a selection step; duration is milliseconds. */
export interface LoadingPatternGalleryProps extends SpinnerProps {
  variants?: readonly LoadingVariant[];
  onCopySnippet?: (variant: LoadingVariant) => void;
  copiedVariant?: LoadingVariant;
}
export function LoadingPatternGallery({
  variants = LOADING_VARIANTS,
  size = 32,
  color,
  duration = 1200,
  playState = "running",
  className,
  onCopySnippet,
  copiedVariant,
}: LoadingPatternGalleryProps) {
  return (
    <div className={cn("dui-loading-pattern-grid", className)}>
      {variants.map((variant) => (
        <div key={variant} className={cn("dui-loading-pattern")}>
          <div className={cn("dui-loading-pattern-art")}>
            <LoadingIndicator
              variant={variant}
              size={size}
              color={color}
              duration={duration}
              playState={playState}
            />
          </div>
          <div className={cn("dui-loading-pattern-meta")}>
            <span>{loadingVariantLabel(variant)}</span>
            {onCopySnippet && (
              <button
                type="button"
                aria-label={`Copy ${loadingVariantLabel(variant)} usage`}
                onClick={() => onCopySnippet(variant)}
              >
                {copiedVariant === variant ? "Copied" : "Copy"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
/** The legacy pause API is preserved; explicit variant selects a single indicator. */
export interface DotLoaderProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  paused?: boolean;
  defaultPaused?: boolean;
  onPausedChange?: (value: boolean) => void;
  variant?: LoadingVariant;
  defaultVariant?: LoadingVariant;
  onVariantChange?: (value: LoadingVariant) => void;
  display?: "showcase" | "single" | "all";
  size?: number;
  color?: string;
  duration?: number;
  showControls?: boolean;
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}
export default function DotLoader({
  className,
  style,
  motion = "system",
  disabled = false,
  paused: controlled,
  defaultPaused = false,
  onPausedChange,
  variant: controlledVariant,
  defaultVariant,
  onVariantChange,
  display,
  size = 40,
  color,
  duration = 1200,
  showControls = true,
  ...rootProps
}: DotLoaderProps) {
  const [localPaused, setPaused] = useState(defaultPaused);
  const [localVariant, setVariant] = useState(defaultVariant ?? "matrix");
  const paused = controlled ?? localPaused;
  const requested = controlledVariant ?? localVariant;
  const variant = LOADING_VARIANTS.includes(requested) ? requested : "matrix";
  const mode =
    display ??
    (controlledVariant !== undefined || defaultVariant !== undefined
      ? "single"
      : "showcase");
  const playState = paused || motion === "off" ? "paused" : "running";
  const toggle = () => {
    if (disabled) return;
    const next = !paused;
    if (controlled === undefined) setPaused(next);
    onPausedChange?.(next);
  };
  return (
    <div
      {...rootProps}
      className={cn("dui-dot-loader dui-demo", className)}
      style={style}
      data-motion={motion}
      data-component-layout="loading"
    >
      <div className={cn("dui-loader-stage")} role="status">
        <span className={cn("sr-only")}>
          {playState === "paused" ? "Loading animation paused" : "Loading"}
        </span>
        {mode === "single" ? (
          <LoadingIndicator
            variant={variant}
            size={size}
            color={color}
            duration={duration}
            playState={playState}
          />
        ) : (
          <LoadingPatternGallery
            variants={
              mode === "all"
                ? LOADING_VARIANTS
                : REPRESENTATIVE_LOADING_VARIANTS
            }
            size={size}
            color={color}
            duration={duration}
            playState={playState}
            className={cn(mode === "showcase" && "dui-loading-showcase")}
          />
        )}
      </div>
      {showControls && (
        <>
          {mode === "single" && (
            <label
              className={cn(
                "dui-loading-picker w-full max-w-[240px] text-xs text-muted-foreground",
              )}
            >
              Animation
              <select
                aria-label="Loading animation"
                disabled={disabled}
                value={variant}
                className={cn(
                  "mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-foreground",
                )}
                onChange={(event) => {
                  const next = event.target.value as LoadingVariant;
                  if (controlledVariant === undefined) setVariant(next);
                  onVariantChange?.(next);
                }}
              >
                {LOADING_VARIANTS.map((name) => (
                  <option key={name} value={name}>
                    {loadingVariantLabel(name)}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className={cn("dui-demo-controls")}>
            <button
              type="button"
              disabled={disabled}
              aria-pressed={paused}
              onClick={toggle}
            >
              {paused ? "Play" : "Pause"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
