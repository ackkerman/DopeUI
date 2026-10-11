"use client";

import React, { useRef, type PropsWithChildren } from "react";
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import type { MotionProps } from "motion/react";

import { cn } from "../../class-names";
import { Home, Calendar, NotebookPen, Mail, Settings } from "lucide-react";

/** Dock composes icons with pointer-distance magnification and optional reduced motion. */
export interface DockProps {
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  disableMagnification?: boolean;
  iconDistance?: number;
  direction?: "top" | "middle" | "bottom";
  children: React.ReactNode;
}

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;
const DEFAULT_DISABLEMAGNIFICATION = false;

const dockVariants = ({ className }: { className?: string } = {}) =>
  cn(
    "mx-auto mt-8 flex w-max items-center justify-center gap-2 rounded-2xl border p-2 backdrop-blur-md",
    className,
  );

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      disableMagnification = DEFAULT_DISABLEMAGNIFICATION,
      iconDistance = DEFAULT_DISTANCE,
      direction = "middle",
      ...props
    },
    ref,
  ) => {
    const mouseX = useMotionValue(Infinity);
    const reduce = useReducedMotion();

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (
          React.isValidElement<DockIconProps>(child) &&
          child.type === DockIcon
        ) {
          return React.cloneElement(child, {
            ...child.props,
            mouseX: mouseX,
            size: iconSize,
            magnification: iconMagnification,
            disableMagnification: disableMagnification || !!reduce,
            distance: iconDistance,
          });
        }
        return child;
      });
    };

    return (
      <motion.div
        ref={ref}
        style={{
          height:
            Math.max(
              iconSize,
              disableMagnification || reduce ? iconSize : iconMagnification,
            ) + 18,
        }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        {...props}
        className={cn(
          dockVariants(),
          {
            "items-start": direction === "top",
            "items-center": direction === "middle",
            "items-end": direction === "bottom",
          },
          className,
        )}
      >
        {renderChildren()}
      </motion.div>
    );
  },
);

Dock.displayName = "Dock";

/** Each icon follows the shared pointer while retaining focusable child content. */
export interface DockIconProps extends Omit<
  MotionProps & React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  size?: number;
  magnification?: number;
  disableMagnification?: boolean;
  distance?: number;
  mouseX?: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
  props?: PropsWithChildren;
}

const DockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  disableMagnification,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const padding = Math.max(6, size * 0.2);
  const defaultMouseX = useMotionValue(Infinity);

  const distanceCalc = useTransform(mouseX ?? defaultMouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const targetSize = disableMagnification ? size : magnification;

  const sizeTransform = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, targetSize, size],
  );

  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      onFocusCapture={() => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) mouseX?.set(rect.x + rect.width / 2);
      }}
      onBlurCapture={() => mouseX?.set(Infinity)}
      style={{ width: scaleSize, height: scaleSize, padding }}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full",
        disableMagnification && "hover:bg-muted-foreground transition-colors",
        className,
      )}
      {...props}
    >
      <div>{children}</div>
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };

/** The default example offers five local actions; Dock and DockIcon can compose custom content. */
export type DockDemoProps = Partial<DockProps>;
export default function DockDemo({
  className,
  children,
  ...props
}: DockDemoProps) {
  const [selected, setSelected] = React.useState("Home");
  const actions = [
    { label: "Home", Icon: Home },
    { label: "Calendar", Icon: Calendar },
    { label: "Notes", Icon: NotebookPen },
    { label: "Inbox", Icon: Mail },
    { label: "Settings", Icon: Settings },
  ];
  return (
    <div className={cn("dui-dock", className)} data-component-layout="motion">
      <Dock
        direction="middle"
        className={cn("mt-0 border-black/10 bg-white/70 shadow-sm")}
        {...props}
      >
        {children ??
          actions.map(({ label, Icon }) => (
            <DockIcon key={label} className={cn("bg-black/[0.04]")}>
              <button
                type="button"
                aria-label={label}
                title={label}
                aria-pressed={selected === label}
                onClick={() => setSelected(label)}
                className={cn(
                  "flex h-full w-full items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#416C91]",
                )}
              >
                <Icon size={20} aria-hidden />
              </button>
            </DockIcon>
          ))}
      </Dock>
      {!children && (
        <p className={cn("mt-6 text-xs text-[#59687D]")} role="status">
          {selected}
        </p>
      )}
    </div>
  );
}
