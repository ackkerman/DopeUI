"use client";
// This file guarantees a self-contained Toast entrance interaction with isolated styles.
import {
  useState,
  useRef,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react";

/** Each notification has a stable id so individual dismissal preserves the rest of the queue. */
export interface ToastNotification {
  id: string;
  title: string;
  description?: string;
}
/** Stack layout keeps the newest notification in front and expands on pointer or keyboard focus. */
export interface ToastStackProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children"
> {
  items: readonly ToastNotification[];
  maxVisible?: number;
  onDismiss?: (id: string) => void;
  disabled?: boolean;
}
export function ToastStack({
  items,
  maxVisible = 3,
  onDismiss,
  disabled = false,
  className,
  ...props
}: ToastStackProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = items.slice(
    0,
    Number.isFinite(maxVisible) ? Math.max(1, Math.floor(maxVisible)) : 3,
  );
  return (
    <div
      {...props}
      className={cn("dui-toast-stack", className)}
      data-expanded={expanded}
      style={{
        height: Math.max(180, visible.length * 80 + 16),
        ...props.style,
      }}
      role="log"
      aria-label="Notifications"
      aria-live="polite"
      onMouseEnter={(event) => {
        props.onMouseEnter?.(event);
        setExpanded(true);
      }}
      onMouseLeave={(event) => {
        props.onMouseLeave?.(event);
        setExpanded(false);
      }}
      onFocus={(event) => {
        props.onFocus?.(event);
        setExpanded(true);
      }}
      onBlur={(event) => {
        props.onBlur?.(event);
        if (!event.currentTarget.contains(event.relatedTarget))
          setExpanded(false);
      }}
    >
      {visible.map((item, index) => (
        <div
          key={item.id}
          className={cn("dui-stack-toast")}
          aria-hidden={!expanded && index > 0}
          inert={!expanded && index > 0}
          style={
            {
              "--dui-stack-index": index,
              zIndex: visible.length - index,
              animationName: index === 0 ? "dui-toast-stack-enter" : "none",
            } as CSSProperties
          }
        >
          <span className={cn("toast-check")}>
            <Check size={16} />
          </span>
          <div className={cn("min-w-0 flex-1")}>
            <p className={cn("font-medium")}>{item.title}</p>
            {item.description && (
              <p className={cn("mt-0.5 text-xs text-muted-foreground")}>
                {item.description}
              </p>
            )}
          </div>
          {onDismiss && (
            <button
              type="button"
              disabled={disabled}
              aria-label={`Dismiss ${item.title}`}
              onClick={() => onDismiss(item.id)}
              className={cn("dui-toast-dismiss")}
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

/** Toast entrance supports native root props and explicit interaction state. */
export interface ToastProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (value: boolean) => void;
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
  stacked?: boolean;
  defaultStacked?: boolean;
  onStackedChange?: (stacked: boolean) => void;
  notifications?: readonly ToastNotification[];
  onNotificationsChange?: (notifications: readonly ToastNotification[]) => void;
  maxVisible?: number;
}

export default function Toast({
  className = "",
  style,
  motion = "system",
  disabled = false,
  open: controlledActive,
  defaultOpen = false,
  onOpenChange,
  stacked: controlledStacked,
  defaultStacked = false,
  onStackedChange,
  notifications,
  onNotificationsChange,
  maxVisible = 3,
  ...rootProps
}: ToastProps) {
  const [internalActive, setInternalActive] = useState(defaultOpen);
  const [internalStacked, setInternalStacked] = useState(defaultStacked);
  const [internalQueue, setInternalQueue] = useState<
    readonly ToastNotification[]
  >([]);
  const sequence = useRef(0);
  const active = controlledActive ?? internalActive;
  const stacked = controlledStacked ?? internalStacked;
  const queue = notifications ?? internalQueue;
  const setActive = (next: boolean) => {
    if (controlledActive === undefined) setInternalActive(next);
    onOpenChange?.(next);
  };
  const setQueue = (next: readonly ToastNotification[]) => {
    if (notifications === undefined) setInternalQueue(next);
    onNotificationsChange?.(next);
  };
  const selectMode = (next: boolean) => {
    if (controlledStacked === undefined) setInternalStacked(next);
    onStackedChange?.(next);
  };
  const trigger = () => {
    if (disabled) return;
    if (!stacked) {
      setActive(!active);
      return;
    }
    sequence.current += 1;
    const title = ["Changes saved", "Your build is ready", "New message"][
      (sequence.current - 1) % 3
    ];
    setQueue(
      [
        {
          id: `toast-${sequence.current}`,
          title,
          description: "The little details are taken care of.",
        },
        ...queue,
      ].slice(0, 20),
    );
    setActive(true);
  };
  const dismiss = (id: string) => {
    const next = queue.filter((item) => item.id !== id);
    setQueue(next);
    if (!next.length) setActive(false);
  };
  return (
    <div
      {...rootProps}
      className={cn("dui-toast dui-demo", className)}
      style={style}
      data-motion={motion}
      data-component-layout="content"
    >
      <div className={cn("dui-toast-stage")}>
        {stacked ? (
          <ToastStack
            items={controlledActive === false ? [] : queue}
            maxVisible={maxVisible}
            onDismiss={dismiss}
            disabled={disabled}
          />
        ) : (
          <div className={cn("mini-toast", active && "opened")} inert={!active}>
            <span className={cn("toast-check")}>
              <Check size={16} />
            </span>
            <span>Changes saved. You're all set.</span>
            <button
              type="button"
              disabled={disabled}
              aria-label="Dismiss demo toast"
              onClick={() => setActive(false)}
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
      <div
        className={cn("dui-demo-controls")}
        role="group"
        aria-label="Toast layout"
      >
        <button
          type="button"
          disabled={disabled}
          aria-pressed={!stacked}
          onClick={() => selectMode(false)}
        >
          Single
        </button>
        <button
          type="button"
          disabled={disabled}
          aria-pressed={stacked}
          onClick={() => selectMode(true)}
        >
          Stacked
        </button>
      </div>
      <div className={cn("dui-demo-controls")}>
        <button type="button" disabled={disabled} onClick={trigger}>
          {stacked ? "Add toast" : "Toggle toast"}
        </button>
        {stacked && (
          <button
            type="button"
            disabled={disabled || !queue.length}
            onClick={() => {
              setQueue([]);
              setActive(false);
            }}
          >
            Clear notifications
          </button>
        )}
      </div>
    </div>
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
function X({
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
