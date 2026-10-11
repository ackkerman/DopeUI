"use client";
// This file guarantees a self-contained Checkbox check interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react";

/** Checkbox check supports native root props and explicit interaction state. */
export interface CheckboxProps extends Omit<
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

export default function Checkbox({
  className = "",
  style,
  motion = "system",
  disabled = false,
  checked: controlledActive,
  defaultChecked = false,
  onCheckedChange,
  ...rootProps
}: CheckboxProps) {
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
    <label className={cn("demo-checkbox")}>
      <input
        disabled={disabled}
        type="checkbox"
        checked={active}
        onChange={toggle}
      />
      <span>
        <Check size={13} />
      </span>
      Keep me inspired
    </label>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-checkbox ${className}`)}
        style={style}
        data-motion={motion}
      >
        {content}
      </div>
    </>
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

// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
