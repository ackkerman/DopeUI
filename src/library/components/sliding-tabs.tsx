"use client";
// This file guarantees a self-contained Sliding tabs interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  useId,
  type KeyboardEvent,
} from "react";

/** Sliding tabs supports native root props and explicit interaction state. */
export interface SlidingTabsProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  value?: 0 | 1 | 2;
  defaultValue?: 0 | 1 | 2;
  onValueChange?: (value: 0 | 1 | 2) => void;
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function SlidingTabs({
  className = "",
  style,
  motion = "system",
  disabled = false,
  value: controlledStep,
  defaultValue = 0,
  onValueChange,
  ...rootProps
}: SlidingTabsProps) {
  const [internalStep, setInternalStep] = useState(defaultValue);
  const step = controlledStep ?? internalStep;
  const setStep = (value: number) => {
    const next = Math.max(0, Math.min(2, value)) as 0 | 1 | 2;
    if (controlledStep === undefined) setInternalStep(next);
    onValueChange?.(next);
  };
  const contentId = useId();
  const content = (
    <div
      className={cn("demo-tabs")}
      role="tablist"
      aria-label="Preview mode"
      onKeyDown={navigateTabs}
    >
      <div
        className={cn("tab-indicator")}
        style={{ transform: `translateX(${step * 100}%)` }}
      />
      {["Design", "Build", "Ship"].map((s, i) => (
        <button
          type="button"
          disabled={disabled}
          key={s}
          role="tab"
          aria-selected={step === i}
          tabIndex={step === i ? 0 : -1}
          id={`${contentId}-${i}`}
          aria-controls={contentId}
          onClick={() => setStep(i)}
        >
          {s}
        </button>
      ))}
    </div>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-sliding-tabs ${className}`)}
        style={style}
        data-motion={motion}
      >
        {content}
        <div
          id={contentId}
          role="tabpanel"
          aria-labelledby={`${contentId}-${step}`}
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clipPath: "inset(50%)",
          }}
        >
          {["Design", "Build", "Ship"][step]} mode selected
        </div>
      </div>
    </>
  );
}
function navigateTabs(event: KeyboardEvent<HTMLElement>) {
  const tabs = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  );
  const current = tabs.indexOf(event.target as HTMLButtonElement);
  if (current < 0) return;
  let next: number;
  switch (event.key) {
    case "ArrowRight":
      next = (current + 1) % tabs.length;
      break;
    case "ArrowLeft":
      next = (current + tabs.length - 1) % tabs.length;
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = tabs.length - 1;
      break;
    default:
      return;
  }
  event.preventDefault();
  tabs[next].focus();
  tabs[next].click();
}

// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
