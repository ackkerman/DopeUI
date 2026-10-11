"use client";
// This file guarantees a self-contained Text swap interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react";

/** Text swap supports native root props and explicit interaction state. */
export interface TextSwapProps extends Omit<
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

export default function TextSwap({
  className = "",
  style,
  motion = "system",
  disabled = false,
  complete: controlledActive,
  defaultComplete = false,
  onCompleteChange,
  ...rootProps
}: TextSwapProps) {
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
      <p className={cn("swap-text")} key={String(active)}>
        {active ? "All done. Looking good." : "Making things happen..."}
      </p>
      <PlayButton disabled={disabled} action={toggle} />
    </>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-text-swap ${className}`)}
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
