"use client";
// This file guarantees a self-contained Panel reveal interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react";

/** Panel reveal supports native root props and explicit interaction state. */
export interface PanelProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (value: boolean) => void;
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function Panel({
  className = "",
  style,
  motion = "system",
  disabled = false,
  open: controlledActive,
  defaultOpen = true,
  onOpenChange,
  ...rootProps
}: PanelProps) {
  const [internalActive, setInternalActive] = useState(defaultOpen);
  const active = controlledActive ?? internalActive;
  const setActive = (next: boolean | ((current: boolean) => boolean)) => {
    const value = typeof next === "function" ? next(active) : next;
    if (controlledActive === undefined) setInternalActive(value);
    onOpenChange?.(value);
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
      <div className={cn("panel-base")}>
        {lines}
        <div className={cn(`sliding-panel ${active ? "opened" : ""}`)}>
          <span>Details</span>
          <p>A little more context.</p>
          <div className={cn("lines")}>
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <PlayButton disabled={disabled} label="Toggle panel" action={toggle} />
    </>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-panel ${className}`)}
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
