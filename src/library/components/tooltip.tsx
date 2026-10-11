"use client";
// This file guarantees a self-contained Tooltip travel interaction with isolated styles.
import {
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react";

/** Tooltip travel supports native root props and explicit interaction state. */
export interface TooltipProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function Tooltip({
  className = "",
  style,
  motion = "system",
  disabled = false,
  ...rootProps
}: TooltipProps) {
  const [step, setStep] = useState(0);
  const content = (
    <div className={cn("tooltip-group")}>
      {[Copy, Image, MoreHorizontal].map((Icon, i) => (
        <button
          type="button"
          disabled={disabled}
          className={cn("demo-button tooltip-target")}
          key={i}
          aria-label={["Copy item", "View image", "More options"][i]}
          onClick={() => setStep(i)}
        >
          <Icon size={18} />
          <span role="tooltip">
            {["Copy", "Image", "More"][i]}
            {step === i ? " · selected" : ""}
          </span>
        </button>
      ))}
    </div>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-tooltip ${className}`)}
        style={style}
        data-motion={motion}
      >
        {content}
      </div>
    </>
  );
}

function Copy({
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}
function Image({
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
function MoreHorizontal({
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
