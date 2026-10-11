"use client";
import { CodeBlock } from "../primitives/code-block";
// This file guarantees a standalone motion component with shared dope/ui styling.

import {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type RefAttributes,
} from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type DOMMotionComponents,
  type HTMLMotionProps,
  type MotionProps,
} from "motion/react";

import { cn } from "../../class-names";

interface SequenceContextValue {
  completeItem: (index: number) => void;
  activeIndex: number;
  sequenceStarted: boolean;
}

const SequenceContext = createContext<SequenceContextValue | null>(null);

const useSequence = () => useContext(SequenceContext);

const ItemIndexContext = createContext<number | null>(null);
const useItemIndex = () => useContext(ItemIndexContext);

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const;

type MotionElementType = Extract<
  keyof DOMMotionComponents,
  keyof typeof motionElements
>;
type TerminalTypingMotionComponent = ComponentType<
  Omit<HTMLMotionProps<"span">, "ref"> & RefAttributes<HTMLElement>
>;

/** A line joins a terminal sequence or animates independently. */
export interface AnimatedSpanProps extends MotionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  startOnView?: boolean;
}

export const AnimatedSpan = ({
  children,
  delay = 0,
  className,
  startOnView = false,
  ...props
}: AnimatedSpanProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const idleRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(
    (startOnView && typeof IntersectionObserver !== "undefined"
      ? elementRef
      : idleRef) as React.RefObject<Element>,
    {
      amount: 0.3,
      once: true,
    },
  );

  const sequence = useSequence();
  const itemIndex = useItemIndex();
  const reduced = useReducedMotion();
  const hasStarted =
    !!sequence &&
    itemIndex !== null &&
    sequence.sequenceStarted &&
    sequence.activeIndex >= itemIndex;
  const shouldAnimate = sequence
    ? hasStarted
    : startOnView && typeof IntersectionObserver !== "undefined"
      ? isInView
      : true;

  return (
    <motion.div
      ref={elementRef}
      initial={reduced ? false : { opacity: 0, y: -5 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
      transition={{
        duration: reduced ? 0 : 0.3,
        delay: reduced || sequence ? 0 : delay / 1000,
      }}
      className={cn("grid text-sm font-normal tracking-tight", className)}
      onAnimationComplete={() => {
        if (!sequence) return;
        if (itemIndex === null) return;
        sequence.completeItem(itemIndex);
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/** Types a plain string and reveals the full text immediately when motion is reduced. */
export interface TypingAnimationProps extends Omit<MotionProps, "children"> {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  as?: MotionElementType;
  startOnView?: boolean;
}

export const TypingAnimation = ({
  children,
  className,
  duration = 60,
  delay = 0,
  as: Component = "span",
  startOnView = true,
  ...props
}: TypingAnimationProps) => {
  if (typeof children !== "string") {
    throw new Error("TypingAnimation: children must be a string. Received:");
  }

  const MotionComponent = motionElements[
    Component
  ] as TerminalTypingMotionComponent;

  const reduced = useReducedMotion();
  const [displayedText, setDisplayedText] = useState<string>("");
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const idleRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(
    (startOnView && typeof IntersectionObserver !== "undefined"
      ? elementRef
      : idleRef) as React.RefObject<Element>,
    {
      amount: 0.3,
      once: true,
    },
  );

  const sequence = useSequence();
  const itemIndex = useItemIndex();
  const hasSequence = sequence !== null;
  const sequenceStarted = sequence?.sequenceStarted ?? false;
  const sequenceActiveIndex = sequence?.activeIndex ?? null;
  const sequenceCompleteItemRef = useRef<
    SequenceContextValue["completeItem"] | null
  >(null);
  const sequenceItemIndexRef = useRef<number | null>(null);

  useEffect(() => {
    sequenceCompleteItemRef.current = sequence?.completeItem ?? null;
    sequenceItemIndexRef.current = itemIndex;
  }, [sequence?.completeItem, itemIndex]);

  useEffect(() => {
    let startTimeout: ReturnType<typeof setTimeout> | null = null;

    if (hasSequence && itemIndex !== null) {
      if (sequenceStarted && !started && sequenceActiveIndex === itemIndex) {
        startTimeout = setTimeout(() => setStarted(true), 0);
      }
    } else if (
      !startOnView ||
      isInView ||
      typeof IntersectionObserver === "undefined"
    ) {
      startTimeout = setTimeout(() => setStarted(true), delay);
    }

    return () => {
      if (startTimeout !== null) {
        clearTimeout(startTimeout);
      }
    };
  }, [
    delay,
    startOnView,
    isInView,
    started,
    hasSequence,
    sequenceActiveIndex,
    sequenceStarted,
    itemIndex,
  ]);

  useEffect(() => {
    let typingEffect: ReturnType<typeof setInterval> | null = null;

    if (started && !reduced) {
      let i = 0;
      typingEffect = setInterval(
        () => {
          if (i < children.length) {
            setDisplayedText(children.substring(0, i + 1));
            i++;
          } else {
            if (typingEffect !== null) {
              clearInterval(typingEffect);
            }
            const completeItem = sequenceCompleteItemRef.current;
            const currentItemIndex = sequenceItemIndexRef.current;
            if (completeItem && currentItemIndex !== null) {
              completeItem(currentItemIndex);
            }
          }
        },
        Math.max(1, duration),
      );
    }

    return () => {
      if (typingEffect !== null) {
        clearInterval(typingEffect);
      }
    };
  }, [children, duration, started, reduced]);

  return (
    <>
      <span className={cn("sr-only")}>{children}</span>
      <MotionComponent
        aria-hidden="true"
        ref={elementRef}
        className={cn("text-sm font-normal tracking-tight", className)}
        {...props}
      >
        {reduced ? children : displayedText}
      </MotionComponent>
    </>
  );
};

/** Terminal sequences its children without executing the displayed commands. */
export interface TerminalProps {
  children: React.ReactNode;
  className?: string;
  sequence?: boolean;
  startOnView?: boolean;
}

export const Terminal = ({
  children,
  className,
  sequence = true,
  startOnView = true,
}: TerminalProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const idleRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(
    (startOnView && typeof IntersectionObserver !== "undefined"
      ? containerRef
      : idleRef) as React.RefObject<Element>,
    {
      amount: 0.3,
      once: true,
    },
  );

  const reduced = useReducedMotion();
  const effectiveSequence = sequence && !reduced;
  const [activeIndex, setActiveIndex] = useState(0);
  const sequenceHasStarted = effectiveSequence
    ? !startOnView || isInView || typeof IntersectionObserver === "undefined"
    : false;

  const contextValue = useMemo<SequenceContextValue | null>(() => {
    if (!effectiveSequence) return null;
    return {
      completeItem: (index: number) => {
        setActiveIndex((current) =>
          index === current ? current + 1 : current,
        );
      },
      activeIndex,
      sequenceStarted: sequenceHasStarted,
    };
  }, [effectiveSequence, activeIndex, sequenceHasStarted]);

  const wrappedChildren = useMemo(() => {
    if (!effectiveSequence) return children;
    const array = Children.toArray(children);
    return array.map((child, index) => (
      <ItemIndexContext.Provider key={index} value={index}>
        {child as React.ReactNode}
      </ItemIndexContext.Provider>
    ));
  }, [children, effectiveSequence]);

  const content = (
    <div
      ref={containerRef}
      className={cn(
        "border-border bg-surface z-0 w-full min-w-0 max-w-lg rounded-2xl border",
        className,
      )}
    >
      <div className={cn("border-border flex flex-col gap-y-2 border-b p-4")}>
        <div className={cn("flex flex-row gap-x-2")}>
          <div className={cn("h-2 w-2 rounded-full bg-red")}></div>
          <div className={cn("h-2 w-2 rounded-full bg-orange")}></div>
          <div className={cn("h-2 w-2 rounded-full bg-green")}></div>
        </div>
      </div>
      <CodeBlock
        preProps={{
          className: cn("min-w-0 whitespace-pre-wrap break-words p-4"),
        }}
        tone="surface"
        copyLabel="Copy terminal output"
      >
        <code className={cn("grid min-w-0 gap-y-1")}>{wrappedChildren}</code>
      </CodeBlock>
    </div>
  );

  if (!effectiveSequence) return content;

  return (
    <SequenceContext.Provider value={contextValue}>
      {content}
    </SequenceContext.Provider>
  );
};

export type TerminalDemoProps = Partial<TerminalProps>;
export default function TerminalDemo({
  className,
  children,
  ...props
}: TerminalDemoProps) {
  const [run, setRun] = useState(0);
  return (
    <div
      className={cn("dui-terminal dui-demo", className)}
      data-component-layout="motion"
    >
      <Terminal key={run} {...props} startOnView={props.startOnView ?? false}>
        {children ?? (
          <>
            <TypingAnimation duration={35}>
              $ npm install react clsx tailwind-merge
            </TypingAnimation>
            <AnimatedSpan className={cn("text-primary")}>
              ✔ Components ready
            </AnimatedSpan>
            <TypingAnimation duration={30}>
              Make the little details feel better.
            </TypingAnimation>
          </>
        )}
      </Terminal>
      <div className={cn("dui-demo-controls")}>
        <button type="button" onClick={() => setRun((v) => v + 1)}>
          Replay terminal
        </button>
      </div>
    </div>
  );
}
