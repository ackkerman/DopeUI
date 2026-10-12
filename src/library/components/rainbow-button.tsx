"use client";
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../class-names";

const rainbowButtonVariants = cva(
  cn(
    "relative cursor-pointer group transition-all animate-dui-rainbow",
    "inline-flex items-center justify-center gap-2 shrink-0",
    "rounded-sm outline-none focus-visible:ring-[3px] aria-invalid:border-destructive",
    "text-sm font-medium whitespace-nowrap",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        default:
          "border-0 bg-[linear-gradient(#ffffff,#ffffff),linear-gradient(#ffffff_50%,rgba(255,255,255,0.6)_80%,rgba(255,255,255,0)),linear-gradient(90deg,var(--dui-rainbow-color-1),var(--dui-rainbow-color-5),var(--dui-rainbow-color-3),var(--dui-rainbow-color-4),var(--dui-rainbow-color-2))] bg-[length:200%] text-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.125rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-dui-rainbow before:bg-[linear-gradient(90deg,var(--dui-rainbow-color-1),var(--dui-rainbow-color-5),var(--dui-rainbow-color-3),var(--dui-rainbow-color-4),var(--dui-rainbow-color-2))] before:bg-[length:200%] before:[filter:blur(0.75rem)] dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,var(--dui-rainbow-color-1),var(--dui-rainbow-color-5),var(--dui-rainbow-color-3),var(--dui-rainbow-color-4),var(--dui-rainbow-color-2))]",
        outline:
          "border border-input border-b-transparent bg-[linear-gradient(#ffffff,#ffffff),linear-gradient(#ffffff_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,var(--dui-rainbow-color-1),var(--dui-rainbow-color-5),var(--dui-rainbow-color-3),var(--dui-rainbow-color-4),var(--dui-rainbow-color-2))] bg-[length:200%] text-accent-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-dui-rainbow before:bg-[linear-gradient(90deg,var(--dui-rainbow-color-1),var(--dui-rainbow-color-5),var(--dui-rainbow-color-3),var(--dui-rainbow-color-4),var(--dui-rainbow-color-2))] before:bg-[length:200%] before:[filter:blur(0.75rem)] dark:bg-[linear-gradient(#2E3440,#2E3440),linear-gradient(#2E3440_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,var(--dui-rainbow-color-1),var(--dui-rainbow-color-5),var(--dui-rainbow-color-3),var(--dui-rainbow-color-4),var(--dui-rainbow-color-2))]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-xl px-3 text-xs",
        lg: "h-11 rounded-xl px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface RainbowButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rainbowButtonVariants> {
  asChild?: boolean;
}

const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        data-slot="rainbow-button"
        data-dui-button="action"
        type={asChild ? undefined : "button"}
        className={cn(rainbowButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

RainbowButton.displayName = "RainbowButton";

export { RainbowButton, rainbowButtonVariants, type RainbowButtonProps };

export type RainbowButtonDemoProps = Partial<RainbowButtonProps>;
export default function RainbowButtonDemo({
  className,
  children = "Explore more",
  ...props
}: RainbowButtonDemoProps) {
  const [disabled, setDisabled] = React.useState(false);
  const [alternate, setAlternate] = React.useState(false);
  return (
    <div
      className={cn("dui-rainbow-button", className)}
      data-component-layout="motion"
    >
      <RainbowButton
        {...props}
        variant={props.variant ?? (alternate ? "outline" : "default")}
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
      </RainbowButton>
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
