"use client";
// This file guarantees a self-contained Notification pop interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react";

/** Notification pop supports native root props and explicit interaction state. */
export interface NotificationPopProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function NotificationPop({
  className = "",
  style,
  motion = "system",
  disabled = false,
  visible: controlledActive,
  defaultVisible = false,
  onVisibleChange,
  ...rootProps
}: NotificationPopProps) {
  const [internalActive, setInternalActive] = useState(defaultVisible);
  const active = controlledActive ?? internalActive;
  const setActive = (next: boolean | ((current: boolean) => boolean)) => {
    const value = typeof next === "function" ? next(active) : next;
    if (controlledActive === undefined) setInternalActive(value);
    onVisibleChange?.(value);
  };
  const toggle = () => {
    if (!disabled) setActive((v) => !v);
  };
  const content = (
    <>
      <button
        type="button"
        disabled={disabled}
        className={cn(
          `round-button bell dui-notification-trigger ${active ? "ring" : ""}`,
        )}
        aria-label="Toggle notification"
        onClick={toggle}
      >
        <Bell size={19} />
        {active && (
          <span className={cn("notification-count", "dui-notification-badge")}>
            1
          </span>
        )}
      </button>
      <PlayButton disabled={disabled} action={toggle} />
    </>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(
          `dui-notification-pop dui-notification-stage ${className}`,
        )}
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
      className={cn("play-button", "dui-notification-action")}
      type="button"
      disabled={disabled}
      onClick={action}
    >
      {label}
    </button>
  );
}

function Bell({
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
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    </svg>
  );
}

// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
