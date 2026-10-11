"use client";
import { SELECTION_SPRING } from "../motion-presets";
// This file guarantees a standalone motion component with shared dope/ui styling.

import React, {
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import {
  AnimatePresence,
  motion,
  type MotionProps,
  useReducedMotion,
} from "motion/react";

import { cn } from "../../class-names";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const animations: MotionProps = {
    initial: reduced ? false : { scale: 0.94, opacity: 0, y: 8 },
    animate: { scale: 1, opacity: 1, y: 0, originY: 0 },
    exit: { scale: reduced ? 1 : 0.94, opacity: 0 },
    transition: reduced ? { duration: 0 } : SELECTION_SPRING,
  };

  return (
    <motion.div
      {...animations}
      layout={!reduced}
      className={cn("mx-auto w-full")}
    >
      {children}
    </motion.div>
  );
}

/** Children appear once in reverse insertion order; paused leaves the current items visible. */
export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  delay?: number;
  paused?: boolean;
}

export const AnimatedList = React.memo(
  ({
    children,
    className,
    delay = 1000,
    paused = false,
    ...props
  }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const reduced = useReducedMotion();
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children],
    );

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout> | null = null;

      if (!paused && !reduced && index < childrenArray.length - 1) {
        timeout = setTimeout(
          () => {
            setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
          },
          Math.max(20, delay),
        );
      }

      return () => {
        if (timeout !== null) {
          clearTimeout(timeout);
        }
      };
    }, [index, delay, childrenArray.length, paused, reduced]);

    const itemsToShow = useMemo(() => {
      const result = childrenArray
        .slice(0, reduced ? childrenArray.length : index + 1)
        .reverse();
      return result;
    }, [index, childrenArray, reduced]);

    return (
      <div
        className={cn(`flex flex-col items-center gap-4`, className)}
        {...props}
      >
        <AnimatePresence>
          {itemsToShow.map((item, position) => (
            <AnimatedListItem
              key={React.isValidElement(item) ? item.key : position}
            >
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

AnimatedList.displayName = "AnimatedList";

export type AnimatedListDemoProps = Partial<AnimatedListProps>;
const LIST_ITEMS = [
  "Project synced",
  "A new comment",
  "Build completed",
  "Ready for review",
];
export default function AnimatedListDemo({
  className,
  children,
  ...props
}: AnimatedListDemoProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  return (
    <div
      className={cn("dui-animated-list dui-demo", className)}
      data-component-layout="motion"
    >
      <AnimatedList
        key={run}
        {...props}
        delay={props.delay ?? 900}
        paused={props.paused ?? paused}
        className={cn("w-full max-w-sm gap-3")}
      >
        {children ??
          LIST_ITEMS.map((title, index) => (
            <div
              key={title}
              className={cn(
                "flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-sm",
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary",
                )}
              >
                <svg
                  data-dui-icon
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </span>
              <div className={cn("min-w-0")}>
                <p className={cn("font-medium text-foreground")}>{title}</p>
                <p className={cn("text-xs text-muted-foreground")}>
                  {index + 1} minute ago
                </p>
              </div>
            </div>
          ))}
      </AnimatedList>
      <div className={cn("dui-demo-controls")}>
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((v) => !v)}
        >
          {paused ? "Play" : "Pause"}
        </button>
        <button
          type="button"
          onClick={() => {
            setRun((v) => v + 1);
            setPaused(false);
          }}
        >
          Replay
        </button>
      </div>
    </div>
  );
}
