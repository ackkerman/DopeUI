"use client";
// This file guarantees a self-contained Confetti burst interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  useEffect,
  useRef,
} from "react";

/** Confetti burst supports native root props and explicit interaction state. */
export interface ConfettiProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function Confetti({
  className = "",
  style,
  motion = "system",
  disabled = false,
  ...rootProps
}: ConfettiProps) {
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
      <div className={cn("confetti-zone")} key={step}>
        {running &&
          Array.from({ length: 22 }, (_, i) => (
            <span
              key={i}
              style={
                {
                  "--x": `${Math.sin(i * 2.3) * 105}px`,
                  "--y": `${-45 - Math.abs(Math.cos(i)) * 90}px`,
                  "--r": `${i * 39}deg`,
                  background: ["#B8A5F8", "#F5A9C6", "#91E6C3", "#F6E58D"][
                    i % 4
                  ],
                } as CSSProperties
              }
            />
          ))}
      </div>
      <button
        type="button"
        disabled={disabled}
        className={cn("demo-button celebrate")}
        onClick={replay}
      >
        <Sparkles size={15} />
        Celebrate
      </button>
    </>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-confetti ${className}`)}
        style={style}
        data-motion={motion}
      >
        {content}
      </div>
    </>
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
