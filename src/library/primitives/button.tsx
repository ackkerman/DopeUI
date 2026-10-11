// This file guarantees consistent native action buttons across AI components.
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../class-names";
export type ButtonVariant =
  "primary" | "secondary" | "ghost" | "accent" | "success" | "quiet";
const filledShadow = "shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]";
const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 " + filledShadow,
  secondary:
    "bg-surface text-ink shadow-btn hover:bg-inset aria-expanded:bg-hover",
  ghost: "bg-hover-2 text-ink hover:bg-line-strong",
  accent:
    "bg-primary text-primary-foreground hover:bg-primary/90 " + filledShadow,
  success:
    "bg-green text-primary-foreground hover:brightness-95 " + filledShadow,
  quiet: "text-ink hover:bg-hover",
};
const BUTTON_SIZES = {
  xs: "h-7 rounded-full px-2.5 text-xs font-medium leading-none gap-1",
  sm: "h-8 px-3 text-xs leading-none rounded-full gap-2",
  md: "min-h-9 px-4 py-2.5 text-[13px] leading-none rounded-full gap-2",
};
export function Button({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: keyof typeof BUTTON_SIZES;
}) {
  return (
    <button
      type="button"
      data-dui-action=""
      {...props}
      className={cn(
        "inline-flex items-center justify-center font-medium select-none transition-[transform,background-color,opacity] duration-150 ease-out active:scale-[0.97] disabled:opacity-100 disabled:pointer-events-none",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className,
      )}
    />
  );
}
