"use client";
import * as React from "react";

import { useEffect, useRef } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";

const SURFACE = "bg-white dark:bg-[#262626]";
const GLYPH = "text-[#2E3440] dark:text-[#9B9AA7]";

const COLORS = {
  neutral: "bg-[#222]",
  red: "bg-[#FF3B30] dark:bg-[#FF453A]",
  orange: "bg-[#FF9500] dark:bg-[#FF9F0A]",
  green: "bg-[#34C759] dark:bg-[#30D158]",
  blue: "bg-[#007AFF] dark:bg-[#0A84FF]",
  violet: "bg-[#AF52DE] dark:bg-[#BF5AF2]",
} as const;

// all sizes are a fraction of the size prop
const ICON = 19 / 42;
const BADGE = 18 / 42;
const DOT = 0.22;
const FONT = 9 / 42;
const PAD = 0.09;

// low damping so it keeps swinging for a bit
const SWING_SPRING = {
  type: "spring",
  stiffness: 220,
  damping: 10,
  mass: 1,
  restDelta: 0.01,
} as const;
const CLAPPER_SPRING = { stiffness: 300, damping: 14, mass: 1 };
const COLUMN_SPRING = { stiffness: 400, damping: 30, mass: 0.9 };
const ENTER_SPRING = { type: "spring", stiffness: 600, damping: 20 } as const;
const FADE = { duration: 0.15 } as const;

// degrees per second
const IMPULSE = 500;
const MAX_VELOCITY = 900;
const BURST = 5;
const CLAPPER_SWEEP = 13;
const CLAPPER_VELOCITY = 450;

// how many digits to keep above and below, and how far behind the spring can get
const WINDOW = 3;
const LAG = 2;

// a taller window would show the next digit at rest, so the fade rides velocity instead
const ROLL_FADE = 34;
const ROLL_VELOCITY = 9;

const clamp = (value: number, limit: number) =>
  Math.max(-limit, Math.min(limit, value));

const digitOf = (value: number) => ((value % 10) + 10) % 10;

function badgeMetrics(size: number, dot: boolean) {
  const side = size * (dot ? DOT : BADGE);
  return {
    side,
    // Match the Pop badge offset, scaling it with custom trigger sizes.
    inset: -size * (4 / 42),
  };
}

function useBellRing(total: number, reduced: boolean) {
  const swing = useMotionValue(0);
  const swingVelocity = useVelocity(swing);
  // clapper follows the bell's speed, so it lags behind on its own
  const clapperLag = useTransform(
    swingVelocity,
    [-CLAPPER_VELOCITY, 0, CLAPPER_VELOCITY],
    [CLAPPER_SWEEP, 0, -CLAPPER_SWEEP],
    { clamp: true },
  );
  const clapper = useSpring(clapperLag, CLAPPER_SPRING);
  const previous = useRef(total);
  const ringing = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    const delta = total - previous.current;
    previous.current = total;
    if (delta <= 0 || reduced) return;

    const weight = 0.7 + (0.6 * Math.min(delta, BURST)) / BURST;
    const moving = swing.getVelocity();
    // push it the way it is already moving so it swings harder
    const along = moving > 1 ? 1 : -1;

    ringing.current = animate(swing, 0, {
      ...SWING_SPRING,
      velocity: clamp(moving + along * IMPULSE * weight, MAX_VELOCITY),
    });
  }, [total, reduced, swing]);

  useEffect(() => () => ringing.current?.stop(), []);

  return { swing, clapper };
}

function BellIcon({
  side,
  swing,
  clapper,
}: {
  side: number;
  swing: MotionValue<number>;
  clapper: MotionValue<number>;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      width={side}
      height={side}
      style={{ rotate: swing, transformOrigin: "50% 12%" }}
      data-dui-icon=""
    >
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
      <motion.path
        d="M10.268 21a2 2 0 0 0 3.464 0"
        style={{
          rotate: clapper,
          transformBox: "fill-box",
          transformOrigin: "50% 0%",
        }}
      />
    </motion.svg>
  );
}

// this only moves the way the count moved, so the digits roll the right way
function DigitColumn({ value, reduced }: { value: number; reduced: boolean }) {
  const position = useSpring(value, COLUMN_SPRING);
  const y = useTransform(position, (p) => `${-p * 100}%`);
  const velocity = useVelocity(position);
  const mask = useTransform(velocity, (v) => {
    const fade = Math.min(ROLL_FADE, (Math.abs(v) / ROLL_VELOCITY) * ROLL_FADE);
    return `linear-gradient(to bottom, transparent 0%, #000 ${fade}%, #000 ${100 - fade}%, transparent 100%)`;
  });

  useEffect(() => {
    const gap = value - position.get();
    // on a big jump, move it closer first so there are still digits to show
    if (Math.abs(gap) > LAG) position.jump(value - Math.sign(gap) * LAG);
    if (reduced) position.jump(value);
    else position.set(value);
  }, [value, reduced, position]);

  return (
    <motion.span
      className={cn("relative inline-block h-[1em] overflow-hidden")}
      style={{
        width: "1ch",
        maskImage: reduced ? undefined : mask,
        WebkitMaskImage: reduced ? undefined : mask,
      }}
    >
      <motion.span className={cn("absolute inset-0")} style={{ y }}>
        {Array.from({ length: WINDOW * 2 + 1 }, (_, i) => {
          const tile = value - WINDOW + i;
          return (
            <span
              key={tile}
              className={cn("absolute inset-x-0 flex justify-center")}
              style={{ top: `${tile * 100}%` }}
            >
              {digitOf(tile)}
            </span>
          );
        })}
      </motion.span>
    </motion.span>
  );
}

function CountBadge({
  total,
  max,
  size,
  color,
  dot,
  reduced,
}: {
  total: number;
  max: number;
  size: number;
  color: keyof typeof COLORS;
  dot: boolean;
  reduced: boolean;
}) {
  const { side, inset } = badgeMetrics(size, dot);
  const clamped = total > max;
  const places = clamped ? 0 : String(total).length;

  return (
    <AnimatePresence initial={false}>
      {total > 0 && (
        <motion.span
          key="badge"
          // motion does not turn layout animation off for reduced motion, so we do it here
          layout={!reduced}
          aria-hidden
          className={cn(
            "pointer-events-none absolute z-10 grid place-items-center rounded-full dui-notification-badge",
            COLORS[color],
          )}
          style={{
            top: inset,
            right: inset,
            height: side,
            minWidth: side,
            paddingInline: dot ? 0 : size * PAD,
            fontSize: size * FONT,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={reduced ? FADE : ENTER_SPRING}
        >
          {!dot && (
            <span
              className={cn(
                "flex font-normal leading-none tracking-tight text-white",
              )}
              // digits need the same width or the columns shift
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {clamped
                ? `${max}+`
                : Array.from({ length: places }, (_, i) => {
                    const place = places - 1 - i;
                    return (
                      <DigitColumn
                        key={place}
                        value={Math.floor(total / 10 ** place)}
                        reduced={reduced}
                      />
                    );
                  })}
            </span>
          )}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export type NotificationBellProps = Omit<
  ComponentProps<"button">,
  | "children"
  | "color"
  | "onAnimationStart"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
> & {
  count?: number;
  max?: number;
  variant?: "count" | "dot";
  size?: number;
  color?: keyof typeof COLORS;
  asChild?: boolean;
  children?: ReactNode;
};

export function NotificationBell({
  count = 0,
  max = 99,
  variant = "count",
  size = 42,
  color = "neutral",
  asChild = false,
  className,
  style,
  children,
  ...props
}: NotificationBellProps) {
  const reduced = useReducedMotion() ?? false;
  const total = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  // use the total so a weird count cannot ring the bell
  const { swing, clapper } = useBellRing(total, reduced);

  const badge = (
    <CountBadge
      total={total}
      max={max}
      size={size}
      color={color}
      dot={variant === "dot"}
      reduced={reduced}
    />
  );

  // this is also the button label, so the count gets read out when it changes
  const label = (
    <span role="status" className={cn("sr-only")}>
      {total > 0 ? `Notifications, ${total} unread` : "Notifications"}
    </span>
  );

  if (asChild) {
    return (
      <Slot
        data-slot="notification-bell"
        className={cn("relative", className)}
        style={style}
        {...props}
      >
        <Slottable>{children}</Slottable>
        {label}
        {badge}
      </Slot>
    );
  }

  return (
    <button
      type="button"
      data-slot="notification-bell"
      className={cn(
        "round-button bell dui-notification-trigger relative grid place-items-center rounded-full outline-none transition-transform active:scale-90 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:active:scale-100",
        SURFACE,
        GLYPH,
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {label}
      <BellIcon side={size * ICON} swing={swing} clapper={clapper} />
      {badge}
    </button>
  );
}

export type NotificationBellDemoProps = Partial<
  React.ComponentProps<typeof NotificationBell>
> & { theme?: "light" | "dark" };
export default function NotificationBellDemo({
  theme = "light",
  className,
  ...props
}: NotificationBellDemoProps) {
  const [count, setCount] = React.useState(0);
  const defaults = {
    count,
    onClick: () => {
      if (props.count === undefined) setCount((n) => n + 1);
    },
  };
  const input = { ...defaults, ...props } as React.ComponentProps<
    typeof NotificationBell
  >;
  return (
    <>
      <div
        className={cn(
          "dui-notification-bell",
          "dui-notification-stage",
          theme === "dark" && "dark",
          className,
        )}
        data-component-layout="interaction"
      >
        <NotificationBell {...input} />
        <div className={cn("dui-demo-controls", "dui-notification-controls")}>
          <button
            className={cn("dui-notification-action")}
            type="button"
            onClick={() => setCount((n) => n + 1)}
          >
            Animate
          </button>
          <button
            className={cn("dui-notification-action")}
            type="button"
            onClick={() => setCount(0)}
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
}
// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
