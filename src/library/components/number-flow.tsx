"use client";
// This file guarantees a self-contained Number flow interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  useEffect,
  useRef,
} from "react";

/** Number flow supports native root props and explicit interaction state. */
export interface NumberFlowProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  from?: number;
  to?: number;
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function NumberFlow({
  className = "",
  style,
  motion = "system",
  disabled = false,
  from = 65.78,
  to = 128.42,
  ...rootProps
}: NumberFlowProps) {
  const [step, setStep] = useState(0);
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
  };
  const content = (
    <>
      <div className={cn("number", "dui-numeric-value")} key={step}>
        <span>{step % 2 ? to : from}</span>
      </div>
      <PlayButton disabled={disabled} label="Animate" action={replay} />
    </>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-number-flow ${className}`)}
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
