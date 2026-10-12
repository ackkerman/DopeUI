// This file guarantees consistent native action buttons across AI components.
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentPropsWithRef,
} from "react";
import { cn } from "../../class-names";
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "accent"
  | "success"
  | "quiet"
  | "unstyled";
const filledShadow = "shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]";
const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary " + filledShadow,
  secondary:
    "bg-surface text-ink shadow-btn hover:bg-surface aria-expanded:bg-hover",
  ghost: "bg-hover-2 text-ink hover:bg-hover-2",
  accent: "bg-primary text-primary-foreground hover:bg-primary " + filledShadow,
  success:
    "bg-green text-primary-foreground hover:brightness-100 " + filledShadow,
  quiet: "text-ink hover:bg-transparent",
  unstyled: "",
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
}: (
  | ComponentPropsWithRef<"button">
  | (ComponentPropsWithRef<"a"> & { href: string })
) & {
  variant?: ButtonVariant;
  size?: keyof typeof BUTTON_SIZES;
}) {
  const classes = cn(
    "select-none disabled:pointer-events-none disabled:opacity-100",
    variant !== "unstyled" &&
      "inline-flex items-center justify-center font-medium transition-[transform,background-color,opacity] duration-150 ease-out active:scale-[0.97]",
    BUTTON_VARIANTS[variant],
    variant !== "unstyled" && BUTTON_SIZES[size],
    className,
  );
  // Link actions retain native navigation semantics rather than simulating clicks.
  if ("href" in props)
    return (
      <a
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        data-dui-action=""
        className={classes}
      />
    );
  return (
    <button
      type="button"
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      data-dui-action=""
      className={classes}
    />
  );
}
