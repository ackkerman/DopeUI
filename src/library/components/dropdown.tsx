"use client";
// This file guarantees a self-contained Dropdown reveal interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  useId,
} from "react";

/** Dropdown reveal supports native root props and explicit interaction state. */
export interface DropdownProps extends Omit<
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

export default function Dropdown({
  className = "",
  style,
  motion = "system",
  disabled = false,
  open: controlledActive,
  defaultOpen = true,
  onOpenChange,
  ...rootProps
}: DropdownProps) {
  const [internalActive, setInternalActive] = useState(defaultOpen);
  const active = controlledActive ?? internalActive;
  const setActive = (next: boolean | ((current: boolean) => boolean)) => {
    const value = typeof next === "function" ? next(active) : next;
    if (controlledActive === undefined) setInternalActive(value);
    onOpenChange?.(value);
  };
  const [value, setValue] = useState("Make something great");
  const toggle = () => {
    if (!disabled) setActive((v) => !v);
  };
  const contentId = useId();
  const content = (
    <>
      <button
        type="button"
        disabled={disabled}
        className={cn("demo-button menu-trigger")}
        aria-expanded={active}
        aria-controls={contentId}
        onClick={toggle}
      >
        Workspace <ChevronDown size={14} />
      </button>
      <div
        id={contentId}
        className={cn(`demo-menu ${active ? "opened" : ""}`)}
        inert={!active}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setValue("New project");
            toggle();
          }}
        >
          <Plus size={15} />
          New project
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setValue("Your files");
            toggle();
          }}
        >
          <Folder size={15} />
          Your files
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setValue("Quick ideas");
            toggle();
          }}
        >
          <Sparkles size={15} />
          Quick ideas
        </button>
      </div>
      <span className={cn("menu-feedback")}>
        {value === "Make something great" ? "" : value}
      </span>
    </>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-dropdown ${className}`)}
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
function Folder({
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
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}
function Plus({
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
function Sparkles({
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
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      <path d="M20 2v4" />
      <path d="M22 4h-4" />
      <circle cx="4" cy="20" r="2" />
    </svg>
  );
}

// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
