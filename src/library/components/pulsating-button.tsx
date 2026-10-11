"use client";

import React, { useImperativeHandle, useLayoutEffect, useRef } from "react";

import { cn } from "../../class-names";

export interface PulsatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
  distance?: string;
  variant?: "pulse" | "ripple";
}

export const PulsatingButton = React.forwardRef<
  HTMLButtonElement,
  PulsatingButtonProps
>(
  (
    {
      className,
      children,
      pulseColor,
      duration = "1.5s",
      distance = "8px",
      variant = "pulse",
      style,
      ...props
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => innerRef.current!);

    useLayoutEffect(() => {
      const button = innerRef.current;
      if (!button) return;

      if (pulseColor) {
        button.style.removeProperty("--bg");
        return;
      }

      let animationFrameId = 0;
      let currentBg = "";

      const updateBg = () => {
        animationFrameId = 0;

        const nextBg = getComputedStyle(button).backgroundColor;
        if (nextBg === currentBg) return;

        currentBg = nextBg;
        button.style.setProperty("--bg", nextBg);
      };

      const scheduleBgUpdate = () => {
        if (animationFrameId) return;
        animationFrameId = window.requestAnimationFrame(updateBg);
      };

      updateBg();

      const themeObserver = new MutationObserver(scheduleBgUpdate);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      const buttonObserver = new MutationObserver(scheduleBgUpdate);
      buttonObserver.observe(button, {
        attributes: true,
      });

      const syncEvents = [
        "blur",
        "focus",
        "pointerenter",
        "pointerleave",
      ] as const;

      for (const eventName of syncEvents) {
        button.addEventListener(eventName, scheduleBgUpdate);
      }

      return () => {
        if (animationFrameId) {
          window.cancelAnimationFrame(animationFrameId);
        }

        themeObserver.disconnect();
        buttonObserver.disconnect();

        for (const eventName of syncEvents) {
          button.removeEventListener(eventName, scheduleBgUpdate);
        }
      };
    }, [pulseColor]);

    return (
      <button
        ref={innerRef}
        type="button"
        className={cn(
          "bg-primary text-primary-foreground relative flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-center",
          className,
        )}
        style={
          {
            ...(pulseColor && { "--pulse-color": pulseColor }),
            "--duration": duration,
            "--distance": distance,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        <span className={cn("relative z-10")}>{children}</span>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] bg-inherit",
            variant === "pulse"
              ? "animate-dui-pulse"
              : "animate-dui-pulse-ripple",
          )}
        />
      </button>
    );
  },
);

PulsatingButton.displayName = "PulsatingButton";

export type PulsatingButtonDemoProps = Partial<PulsatingButtonProps>;
export default function PulsatingButtonDemo({
  className,
  children = "Start something",
  ...props
}: PulsatingButtonDemoProps) {
  const [count, setCount] = React.useState(0);
  const [disabled, setDisabled] = React.useState(false);
  const [alternate, setAlternate] = React.useState(false);
  return (
    <div
      className={cn("dui-pulsating-button", className)}
      data-component-layout="motion"
    >
      <PulsatingButton
        {...props}
        pulseColor={props.pulseColor ?? "#416C91"}
        variant={props.variant ?? (alternate ? "ripple" : "pulse")}
        className={cn(
          "feature-button",
          "rounded-full min-h-11 px-6 py-3 text-sm font-medium",
        )}
        disabled={props.disabled || disabled}
        onClick={(event) => {
          setCount((n) => n + 1);
          props.onClick?.(event);
        }}
      >
        {children}
      </PulsatingButton>
      <p className={cn("text-xs text-[#59687D]")} role="status">
        {count
          ? `Pressed ${count} ${count === 1 ? "time" : "times"}`
          : "Try the interaction."}
      </p>
      <div className={cn("dui-demo-controls")}>
        <button type="button" onClick={() => setDisabled((v) => !v)}>
          {disabled ? "Enable" : "Disable"}
        </button>
        <button
          type="button"
          aria-pressed={alternate}
          onClick={() => setAlternate((v) => !v)}
        >
          Change variant
        </button>
      </div>
    </div>
  );
}
