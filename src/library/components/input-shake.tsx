"use client";
// This file guarantees a self-contained Input shake interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  useEffect,
  useRef,
} from "react";

/** Input shake supports native root props and explicit interaction state. */
export interface InputShakeProps extends Omit<
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

export default function InputShake({
  className = "",
  style,
  motion = "system",
  disabled = false,
  value: controlledValue,
  defaultValue = "Make something great",
  onValueChange,
  ...rootProps
}: InputShakeProps) {
  const [step, setStep] = useState(0);
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
  const replay = () => {
    if (disabled) return;
    setStep((s) => s + 1);
    setRunning(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setRunning(false), 1000);
  };
  const content = (
    <>
      <div className={cn(`shake-field ${running ? "shaking" : ""}`)} key={step}>
        <input
          disabled={disabled}
          aria-label="Demo email"
          value={value === "Make something great" ? "hello@" : value}
          onChange={(e) => setValue(e.target.value)}
        />
        <span>That email needs a little more.</span>
      </div>
      <PlayButton disabled={disabled} label="Validate" action={replay} />
    </>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-input-shake ${className}`)}
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
