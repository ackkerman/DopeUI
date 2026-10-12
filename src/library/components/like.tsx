"use client";
// This file guarantees a self-contained Like button interaction with isolated styles.
import {
  useState,
  useRef,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react";

/** A burst ray carries a per-click destination without a render-time random seed. */
type LikeRayStyle = CSSProperties & {
  "--dui-ray-x": string;
  "--dui-ray-y": string;
};

/** Like button supports native root props and explicit interaction state. */
export interface LikeProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "style"
> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (value: boolean) => void;
  style?: CSSProperties & { [key: `--dui-${string}`]: string | number };
  motion?: "system" | "off";
  disabled?: boolean;
}

export default function Like({
  className = "",
  style,
  motion = "system",
  disabled = false,
  pressed: controlledActive,
  defaultPressed = false,
  onPressedChange,
  ...rootProps
}: LikeProps) {
  const [internalActive, setInternalActive] = useState(defaultPressed);
  const active = controlledActive ?? internalActive;
  const burstSequence = useRef(0);
  const [burst, setBurst] = useState<{
    id: number;
    rays: LikeRayStyle[];
  } | null>(null);
  const setActive = (next: boolean | ((current: boolean) => boolean)) => {
    const value = typeof next === "function" ? next(active) : next;
    if (controlledActive === undefined) setInternalActive(value);
    onPressedChange?.(value);
  };
  const toggle = () => {
    // Disabled controls must not change state or start decorative feedback.
    if (disabled) return;
    if (!active && motion !== "off") {
      burstSequence.current += 1;
      setBurst({
        id: burstSequence.current,
        rays: Array.from({ length: 8 }, (_, index) => {
          const direction = (index * Math.PI) / 4 + (Math.random() - 0.5) * 0.4;
          const distance = 16 + Math.random() * 8;
          const size = `${2 + Math.random() * 1.3}px`;
          return {
            "--dui-ray-x": `${Math.cos(direction) * distance}px`,
            "--dui-ray-y": `${Math.sin(direction) * distance}px`,
            width: size,
            height: size,
            animationDelay: `${Math.random() * 45}ms`,
          };
        }),
      });
    } else {
      // Unlike returns to the outline without replaying the celebration.
      setBurst(null);
    }
    setActive(!active);
  };
  const content = (
    <button
      type="button"
      disabled={disabled}
      className={cn(`demo-button like-button ${active ? "liked" : ""}`)}
      data-dui-button="action"
      aria-pressed={active}
      data-burst={active && burst ? "true" : undefined}
      onClick={toggle}
    >
      <span className={cn("dui-like-heart")} aria-hidden="true">
        <span className={cn("dui-like-heart-icon")}>
          <Heart size={16} fill={active ? "currentColor" : "none"} />
        </span>
        {active && burst && (
          <span key={burst.id} className={cn("dui-like-rays")}>
            {burst.rays.map((ray, index) => (
              <i key={index} style={ray} />
            ))}
          </span>
        )}
      </span>
      Like
    </button>
  );
  return (
    <>
      <div
        {...rootProps}
        className={cn(`dui-like ${className}`)}
        style={style}
        data-motion={motion}
      >
        {content}
      </div>
    </>
  );
}

function Heart({
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
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  );
}

// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
