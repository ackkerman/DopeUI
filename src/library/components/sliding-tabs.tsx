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
export interface SlidingTabsProps<
  Value extends number = 0 | 1 | 2,
> extends Omit<ComponentPropsWithRef<"div">, "children" | "style"> {
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (value: Value) => void;
  items?: readonly string[];
  tablistLabel?: string;
  panelId?: string;
  tabIdPrefix?: string;
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function SlidingTabs<Value extends number = 0 | 1 | 2>({
  className = "",
  style,
  motion = "system",
  disabled = false,
  value: controlledStep,
  defaultValue = 0 as Value,
  onValueChange,
  items = ["Design", "Build", "Ship"],
  tablistLabel = "Preview mode",
  panelId,
  tabIdPrefix,
  ...rootProps
}: SlidingTabsProps<Value>) {
  const [internalStep, setInternalStep] = useState(defaultValue);
  const labels = items.length ? items : ["Design", "Build", "Ship"];
  const step = Math.max(
    0,
    Math.min(labels.length - 1, controlledStep ?? internalStep),
  );
  const setStep = (value: number) => {
    const next = Math.max(0, Math.min(labels.length - 1, value));
    if (controlledStep === undefined) setInternalStep(next as Value);
    onValueChange?.(next as Value);
  };
  const contentId = useId();
  const targetId = panelId ?? contentId;
  const tabId = (index: number) =>
    tabIdPrefix ? `${tabIdPrefix}-${labels[index]}` : `${contentId}-${index}`;
  const content = (
    <div
      className={cn("demo-tabs")}
      role="tablist"
      aria-label={tablistLabel}
      onKeyDown={navigateTabs}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))`,
      }}
    >
      <div
        className={cn("tab-indicator")}
        style={{
          width: `calc((100% - 8px) / ${labels.length})`,
          transform: `translateX(${step * 100}%)`,
        }}
      />
      {labels.map((s, i) => (
        <button
          type="button"
          className="border-0! bg-transparent! shadow-none! hover:bg-transparent! hover:text-inherit!"
          disabled={disabled}
          key={s}
          role="tab"
          aria-selected={step === i}
          tabIndex={step === i ? 0 : -1}
          id={tabId(i)}
          aria-controls={targetId}
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
        {!panelId && (
          <div
            id={contentId}
            role="tabpanel"
            aria-labelledby={tabId(step)}
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clipPath: "inset(50%)",
            }}
          >
            {labels[step]} mode selected
          </div>
        )}
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
