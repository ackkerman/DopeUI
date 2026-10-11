"use client";
// This file guarantees a self-contained Accordion interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  useId,
} from "react";

/** Accordion supports native root props and explicit interaction state. */
export interface AccordionProps extends Omit<
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

export default function Accordion({
  className = "",
  style,
  motion = "system",
  disabled = false,
  open: controlledActive,
  defaultOpen = false,
  onOpenChange,
  ...rootProps
}: AccordionProps) {
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
  const contentId = useId();
  const content = (
    <div className={cn(`demo-accordion ${active ? "opened" : ""}`)}>
      <button
        type="button"
        disabled={disabled}
        aria-expanded={active}
        aria-controls={contentId}
        onClick={toggle}
      >
        The little details <ChevronDown size={16} />
      </button>
      <div id={contentId} inert={!active} className={cn("accordion-content")}>
        <p>
          Good motion makes an interface feel natural. Keep it subtle,
          purposeful, and quick.
        </p>
      </div>
    </div>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-accordion ${className}`)}
        style={style}
        data-motion={motion}
      >
        {content}
      </div>
    </>
  );
}

function ChevronDown({
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
