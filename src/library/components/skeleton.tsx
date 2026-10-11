"use client";
// This file guarantees a self-contained Skeleton reveal interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  useEffect,
  useRef,
} from "react";

/** Skeleton reveal supports native root props and explicit interaction state. */
export interface SkeletonProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function Skeleton({
  className = "",
  style,
  motion = "system",
  disabled = false,
  ...rootProps
}: SkeletonProps) {
  const [step, setStep] = useState(0);
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
      <div
        key={step}
        className={cn(`profile-card mini-card ${running ? "loading" : ""}`)}
      >
        <div className={cn("profile-avatar")}>JD</div>
        <div className={cn("profile-text")}>
          <strong>Jamie Davis</strong>
          <span>Designing the little details.</span>
        </div>
      </div>
      <PlayButton disabled={disabled} label="Replay" action={replay} />
    </>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-skeleton ${className}`)}
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
