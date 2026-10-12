"use client";
import * as React from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "../../class-names";

export type InteractiveHoverButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;
export function InteractiveHoverButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      data-dui-button="action"
      className={cn(
        "group bg-[var(--frost-surface,var(--surface,#fff))] disabled:bg-[var(--frost-disabled-background,#e5e9f0)] disabled:text-[var(--frost-disabled-foreground,#59687d)] relative w-auto cursor-pointer overflow-hidden disabled:pointer-events-none min-h-12 rounded-full border-0 p-2 px-6 text-center text-[13px] font-medium",
        className,
      )}
      {...props}
    >
      <div className={cn("flex items-center justify-center gap-2")}>
        <div
          className={cn(
            "bg-primary h-2 w-2 rounded-full transition-all duration-300 group-[:not(:disabled):hover]:scale-[100.8]",
          )}
        ></div>
        <span
          className={cn(
            "inline-block transition-all duration-300 group-[:not(:disabled):hover]:translate-x-12 group-[:not(:disabled):hover]:opacity-0",
          )}
        >
          {children}
        </span>
      </div>
      <div
        aria-hidden
        className={cn(
          "text-primary-foreground absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-[:not(:disabled):hover]:-translate-x-5 group-[:not(:disabled):hover]:opacity-100",
        )}
      >
        <span>{children}</span>
        <ArrowRight />
      </div>
    </button>
  );
}

export type InteractiveHoverButtonDemoProps =
  Partial<InteractiveHoverButtonProps>;
export default function InteractiveHoverButtonDemo({
  className,
  children = "Hover me",
  ...props
}: InteractiveHoverButtonDemoProps) {
  const [disabled, setDisabled] = React.useState(false);
  return (
    <div
      className={cn("dui-interactive-hover-button", className)}
      data-component-layout="motion"
    >
      <InteractiveHoverButton
        {...props}
        className={cn(
          "feature-button",
          "rounded-full min-h-12 px-6 py-3 text-[13px] font-medium",
        )}
        disabled={props.disabled || disabled}
        onClick={(event) => {
          props.onClick?.(event);
        }}
      >
        {children}
      </InteractiveHoverButton>
      <div className={cn("dui-demo-controls")}>
        <button type="button" onClick={() => setDisabled((v) => !v)}>
          {disabled ? "Enable" : "Disable"}
        </button>
      </div>
    </div>
  );
}
