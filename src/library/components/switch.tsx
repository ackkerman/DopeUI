"use client";
// This file guarantees a self-contained Spring toggle interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react";

/** Spring toggle supports native root props and explicit interaction state. */
export interface SwitchProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (value: boolean) => void;
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function Switch({
  className = "",
  style,
  motion = "system",
  disabled = false,
  checked: controlledActive,
  defaultChecked = false,
  onCheckedChange,
  ...rootProps
}: SwitchProps) {
  const [internalActive, setInternalActive] = useState(defaultChecked);
  const active = controlledActive ?? internalActive;
  const setActive = (next: boolean | ((current: boolean) => boolean)) => {
    const value = typeof next === "function" ? next(active) : next;
    if (controlledActive === undefined) setInternalActive(value);
    onCheckedChange?.(value);
  };
  const toggle = () => {
    if (!disabled) setActive((v) => !v);
  };
  const content = (
    <button
      type="button"
      disabled={disabled}
      className={cn(`spring-switch ${active ? "on" : ""}`)}
      role="switch"
      aria-checked={active}
      aria-label="Enable motion"
      onClick={toggle}
    >
      <span />
    </button>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-switch ${className}`)}
        style={style}
        data-motion={motion}
      >
        {content}
      </div>
    </>
  );
}

// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
