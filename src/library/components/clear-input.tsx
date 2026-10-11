"use client";
// This file guarantees a self-contained Clear input interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  useEffect,
  useRef,
} from "react";

/** Clear input supports native root props and explicit interaction state. */
export interface ClearInputProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function ClearInput({
  className = "",
  style,
  motion = "system",
  disabled = false,
  value: controlledValue,
  defaultValue = "Make something great",
  onValueChange,
  ...rootProps
}: ClearInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;
  const setValue = (value: string) => {
    if (controlledValue === undefined) setInternalValue(value);
    onValueChange?.(value);
  };
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const content = (
    <>
      <div className={cn(`clear-field ${running ? "clearing" : ""}`)}>
        <Search size={15} />
        <input
          disabled={disabled}
          aria-label="Demo search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {value && (
          <button
            type="button"
            disabled={disabled}
            aria-label="Clear demo input"
            onClick={() => {
              setRunning(true);
              if (timer.current) clearTimeout(timer.current);
              timer.current = setTimeout(() => {
                setValue("");
                setRunning(false);
              }, 180);
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>
      <PlayButton
        label="Reset text"
        action={() => setValue("Make something great")}
      />
    </>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-clear-input ${className}`)}
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

function Search({
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
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
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
