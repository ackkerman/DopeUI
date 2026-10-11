"use client";

import { useLayoutEffect, useRef } from "react";
import React from "react";
import { useInView, useReducedMotion } from "motion/react";
import { annotate } from "rough-notation";
import { cn } from "../../class-names";
import { type RoughAnnotation } from "rough-notation/lib/model";

export type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

/** An annotation decorates readable text and removes its generated SVG on cleanup. */
export interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  isView?: boolean;
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#F5A9C6",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
}: HighlighterProps) {
  const reduced = useReducedMotion();
  const elementRef = useRef<HTMLSpanElement>(null);

  const passiveRef = useRef<HTMLSpanElement>(null);
  const canObserve = typeof IntersectionObserver === "function";
  const isInView = useInView(isView && canObserve ? elementRef : passiveRef, {
    once: true,
    margin: "-10%",
  });

  // If isView is false, always show. If isView is true, wait for inView
  const shouldShow = !isView || !canObserve || isInView;

  useLayoutEffect(() => {
    const element = elementRef.current;
    let annotation: RoughAnnotation | null = null;
    let resizeObserver: ResizeObserver | null = null;

    if (shouldShow && element) {
      const annotationConfig = {
        type: action,
        color,
        strokeWidth,
        animate: !reduced,
        animationDuration: reduced ? 0 : animationDuration,
        iterations,
        padding,
        multiline,
      };

      const currentAnnotation = annotate(element, annotationConfig);
      annotation = currentAnnotation;
      currentAnnotation.show();

      if (typeof ResizeObserver === "function") {
        resizeObserver = new ResizeObserver(() => {
          currentAnnotation.hide();
          currentAnnotation.show();
        });

        resizeObserver.observe(element);
        resizeObserver.observe(document.body);
      }
    }

    return () => {
      annotation?.remove();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [
    reduced,
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
  ]);

  return (
    <span
      ref={elementRef}
      className={cn("relative inline-block bg-transparent")}
    >
      {children}
    </span>
  );
}

export type HighlighterDemoProps = Partial<HighlighterProps> & {
  className?: string;
};
export default function HighlighterDemo({
  className,
  children = "the little details",
  action: controlledAction,
  ...props
}: HighlighterDemoProps) {
  const [action, setAction] = React.useState<AnnotationAction>("highlight");
  const [run, setRun] = React.useState(0);
  return (
    <div
      className={cn("dui-highlighter", className)}
      data-component-layout="motion"
    >
      <p
        className={cn(
          "max-w-sm text-center text-2xl font-medium leading-relaxed",
        )}
      >
        Good interfaces make
        <br />
        <Highlighter
          key={run}
          {...props}
          action={controlledAction ?? action}
          color={
            props.color ?? (action === "highlight" ? "#B5E8F7" : "#416C91")
          }
        >
          {children}
        </Highlighter>
        <br />
        feel considered.
      </p>
      <div className={cn("dui-demo-controls")} aria-label="Annotation style">
        {(["highlight", "underline", "circle", "box"] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={(controlledAction ?? action) === value}
            onClick={() => setAction(value)}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </button>
        ))}
        <button type="button" onClick={() => setRun((v) => v + 1)}>
          Replay
        </button>
      </div>
    </div>
  );
}
