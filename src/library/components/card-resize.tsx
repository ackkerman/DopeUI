"use client";
// This file guarantees a self-contained Card resize interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react";

/** Card resize supports native root props and explicit interaction state. */
export interface CardResizeProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  compact?: boolean;
  defaultCompact?: boolean;
  onCompactChange?: (value: boolean) => void;
  children?: import("react").ReactNode;
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function CardResize({
  className = "",
  style,
  motion = "system",
  disabled = false,
  compact: controlledActive,
  defaultCompact = false,
  onCompactChange,
  children,
  ...rootProps
}: CardResizeProps) {
  const [internalActive, setInternalActive] = useState(defaultCompact);
  const active = controlledActive ?? internalActive;
  const setActive = (next: boolean | ((current: boolean) => boolean)) => {
    const value = typeof next === "function" ? next(active) : next;
    if (controlledActive === undefined) setInternalActive(value);
    onCompactChange?.(value);
  };
  const toggle = () => {
    if (!disabled) setActive((v) => !v);
  };
  const lines = (
    <div className={cn("lines")} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <div />
      <i />
      <i />
    </div>
  );
  const content = (
    <>
      <div className={cn(`mini-card resize-card ${active ? "compact" : ""}`)}>
        {children ?? lines}
      </div>
      <PlayButton disabled={disabled} action={toggle} />
    </>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-card-resize ${className}`)}
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

// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
