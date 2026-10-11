"use client";
// This file guarantees a self-contained Staggered text interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  useEffect,
  useRef,
} from "react";

/** Staggered text supports native root props and explicit interaction state. */
export interface TextRevealProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function TextReveal({
  className = "",
  style,
  motion = "system",
  disabled = false,
  ...rootProps
}: TextRevealProps) {
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
      <div className={cn("revealed-text")} key={step}>
        <strong>Your next idea starts here.</strong>
        <span>Make it something worth feeling.</span>
      </div>
      <PlayButton disabled={disabled} label="Replay" action={replay} />
    </>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-text-reveal ${className}`)}
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
