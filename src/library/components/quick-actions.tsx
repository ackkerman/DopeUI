"use client";
// This file guarantees a self-contained Quick actions interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react";

/** Quick actions supports native root props and explicit interaction state. */
export interface QuickActionsProps extends Omit<
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

export default function QuickActions({
  className = "",
  style,
  motion = "system",
  disabled = false,
  open: controlledActive,
  defaultOpen = false,
  onOpenChange,
  ...rootProps
}: QuickActionsProps) {
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
  const content = (
    <>
      <div className={cn(`quick-actions ${active ? "opened" : ""}`)}>
        {[File, Image, Folder].map((Icon, i) => (
          <button
            type="button"
            key={i}
            aria-label={["Create file", "Add image", "Create folder"][i]}
            className={cn("round-button quick-action")}
            disabled={disabled || !active}
            aria-hidden={!active}
            tabIndex={active ? 0 : -1}
            onClick={() => {
              setValue(["File created", "Image added", "Folder created"][i]);
              toggle();
            }}
          >
            <Icon size={17} />
          </button>
        ))}
        <button
          type="button"
          disabled={disabled}
          className={cn("round-button plus-main")}
          data-dui-button="icon"
          aria-label="Toggle quick actions"
          aria-expanded={active}
          onClick={toggle}
        >
          <Plus size={22} />
        </button>
      </div>
      <span className={cn("quick-feedback")}>
        {value === "Make something great" ? "" : value}
      </span>
    </>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-quick-actions ${className}`)}
        style={style}
        data-motion={motion}
      >
        {content}
      </div>
    </>
  );
}

function File({
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
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
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
function Image({
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
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

// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
