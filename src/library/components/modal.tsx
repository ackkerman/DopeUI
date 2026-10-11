"use client";
// This file guarantees a self-contained Modal entrance interaction with isolated styles.
import {
  useState,
  useEffect,
  useRef,
  useId,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react";

/** Modal entrance supports native root props and explicit interaction state. */
export interface ModalProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  children?: import("react").ReactNode;
  title?: string;
  description?: string;
  preview?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (value: boolean) => void;
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function Modal({
  className = "",
  style,
  motion = "system",
  disabled = false,
  children,
  title = "A fresh start.",
  description = "Something good is coming.",
  preview = false,
  open: controlledActive,
  defaultOpen = preview,
  onOpenChange,
  ...rootProps
}: ModalProps) {
  const [internalActive, setInternalActive] = useState(defaultOpen);
  const active = controlledActive ?? internalActive;
  const setActive = (next: boolean | ((current: boolean) => boolean)) => {
    const value = typeof next === "function" ? next(active) : next;
    if (controlledActive === undefined) setInternalActive(value);
    onOpenChange?.(value);
  };
  const dialog = useRef<HTMLDialogElement>(null);
  const contentId = useId();
  useEffect(() => {
    if (preview || !dialog.current) return;
    if (active && !dialog.current.open) dialog.current.showModal();
    if (!active && dialog.current.open) dialog.current.close();
  }, [active, preview]);
  const toggle = () => {
    if (!disabled) setActive((v) => !v);
  };
  const modalBody = (
    <>
      <button
        type="button"
        disabled={disabled}
        className={cn("modal-close")}
        onClick={() => setActive(false)}
        aria-label="Close demo modal"
      >
        <X size={12} />
      </button>
      <span id={contentId} className={cn("mini-heading")}>
        {title}
      </span>
      <p>{description}</p>
      <button
        type="button"
        disabled={disabled}
        className={cn("demo-button")}
        onClick={() => setActive(false)}
      >
        Got it <Check size={12} />
      </button>
    </>
  );
  const content = (
    <>
      {preview ? (
        <div
          className={cn(`mini-modal ${active ? "opened" : ""}`)}
          inert={!active}
        >
          {children ?? modalBody}
        </div>
      ) : (
        <dialog
          ref={dialog}
          className={cn("mini-modal opened")}
          aria-label={children ? title : undefined}
          aria-labelledby={children ? undefined : contentId}
          onCancel={(event) => {
            event.preventDefault();
            setActive(false);
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActive(false);
          }}
        >
          {children ?? modalBody}
        </dialog>
      )}
      <PlayButton disabled={disabled} label="Toggle modal" action={toggle} />
    </>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-modal ${className}`)}
        style={style}
        data-motion={motion}
        data-preview={String(preview)}
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
