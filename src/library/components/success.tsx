"use client";
// This file guarantees a self-contained Success check interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react";

/** Success check supports native root props and explicit interaction state. */
export interface SuccessProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  complete?: boolean;
  defaultComplete?: boolean;
  onCompleteChange?: (value: boolean) => void;
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function Success({
  className = "",
  style,
  motion = "system",
  disabled = false,
  complete: controlledActive,
  defaultComplete = false,
  onCompleteChange,
  ...rootProps
}: SuccessProps) {
  const [internalActive, setInternalActive] = useState(defaultComplete);
  const active = controlledActive ?? internalActive;
  const setActive = (next: boolean | ((current: boolean) => boolean)) => {
    const value = typeof next === "function" ? next(active) : next;
    if (controlledActive === undefined) setInternalActive(value);
    onCompleteChange?.(value);
  };
  const toggle = () => {
    if (!disabled) setActive((v) => !v);
  };
  const content = (
    <>
      <div className={cn(`success-icon ${active ? "done" : ""}`)}>
        {active ? (
          <Check size={28} />
        ) : (
          <LoaderCircle className={cn("spin")} size={28} />
        )}
      </div>
      <PlayButton disabled={disabled} action={toggle} />
    </>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-success ${className}`)}
        style={style}
        data-motion={motion}
      >
        {content}
      </div>
    </>
  );
}
function PlayButton({
  label = "Animate",
  action,
  disabled,
}: {
  label?: string;
  action: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className={cn("play-button")}
      type="button"
      disabled={disabled}
      onClick={action}
    >
      {label}
    </button>
  );
}

function Check({
  size = 24,
  className,
  fill = "none",
}: {
  size?: number;
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(className)}
      data-dui-icon=""
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function LoaderCircle({
  size = 24,
  className,
  fill = "none",
}: {
  size?: number;
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(className)}
      data-dui-icon=""
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
