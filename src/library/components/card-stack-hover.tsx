"use client";
import { SELECTION_SPRING } from "../motion-presets";
// This file guarantees an original dope/ui interaction with copyable React code.
import { useState, type ComponentProps } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../class-names";

/** At most three attachments fan around the centre card. */
export interface StackCard {
  id: string;
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
}
/** Pointer hover, focus, and keyboard expansion preserve the same attachment content. */
export interface CardStackProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  cards?: readonly StackCard[];
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}
export const STACK_CARDS: readonly StackCard[] = [
  {
    id: "tulips",
    title: "Tulips",
    imageSrc:
      "https://images.unsplash.com/photo-1633714998165-706d988d17ef?auto=format&fit=max&w=560&q=85",
    imageAlt: "Pink tulips against a blue sky",
  },
  {
    id: "portrait",
    title: "Portrait",
    imageSrc:
      "https://images.unsplash.com/photo-1653443667522-a5b0eafb7082?auto=format&fit=max&w=560&q=85",
    imageAlt: "Portrait lit by blue and pink light",
  },
  {
    id: "car",
    title: "Milan",
    imageSrc:
      "https://images.unsplash.com/photo-1722591602044-17962109fa91?auto=format&fit=max&w=560&q=85",
    imageAlt: "A red sports car in Milan",
  },
];
export function CardStack({
  cards = STACK_CARDS,
  expanded: controlled,
  defaultExpanded = false,
  onExpandedChange,
  className,
  ...props
}: CardStackProps) {
  const [local, setLocal] = useState(defaultExpanded);
  const expanded = controlled ?? local;
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const change = (next: boolean) => {
    if (controlled === undefined) setLocal(next);
    onExpandedChange?.(next);
  };
  return (
    <div
      {...props}
      className={cn(
        "relative h-[220px] w-full max-w-[360px] [container-type:inline-size]",
        className,
      )}
      tabIndex={props.tabIndex ?? 0}
      role={props.role ?? "group"}
      aria-label={props["aria-label"] ?? "Photo attachments"}
      onPointerEnter={(e) => {
        props.onPointerEnter?.(e);
        change(true);
      }}
      onPointerLeave={(e) => {
        props.onPointerLeave?.(e);
        change(false);
      }}
      onFocus={(e) => {
        props.onFocus?.(e);
        change(true);
      }}
      onBlur={(e) => {
        props.onBlur?.(e);
        if (!e.currentTarget.contains(e.relatedTarget)) change(false);
      }}
      onKeyDown={(e) => {
        props.onKeyDown?.(e);
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          change(!expanded);
        }
        if (e.key === "Escape") change(false);
      }}
    >
      {cards.slice(0, 3).map((card, index) => (
        <motion.div
          key={card.id}
          className={cn(
            "absolute left-1/2 top-1/2 aspect-square w-[36cqw] max-w-[140px] overflow-hidden rounded-2xl border border-border bg-surface shadow-md",
          )}
          style={{ zIndex: index === 1 ? 3 : 1 }}
          initial={false}
          animate={{
            x: `${-50 + (index - 1) * (expanded ? 72 : 8)}%`,
            y: index === 1 ? "-50%" : "-55%",
            rotate: (index - 1) * (expanded ? 14 : 4),
            scale: expanded || index === 1 ? 1 : 0.94,
          }}
          transition={reduced ? { duration: 0 } : SELECTION_SPRING}
        >
          {card.imageSrc && !failed.has(card.imageSrc) ? (
            <img
              src={card.imageSrc}
              alt={card.imageAlt ?? card.title}
              loading="lazy"
              decoding="async"
              className={cn("h-full w-full object-cover")}
              onError={() =>
                setFailed((current) => new Set(current).add(card.imageSrc!))
              }
            />
          ) : (
            <div
              className={cn(
                "flex h-full flex-col justify-center p-4 text-foreground",
              )}
            >
              <h3 className={cn("text-sm font-medium")}>{card.title}</h3>
              <p className={cn("mt-2 text-xs text-muted-foreground")}>
                {card.description ?? "Attachment preview"}
              </p>
            </div>
          )}
        </motion.div>
      ))}
      {!cards.length && (
        <p className={cn("text-center text-xs text-muted-foreground")}>
          No attachments
        </p>
      )}
    </div>
  );
}
export type CardStackHoverProps = CardStackProps;
export default function CardStackHover({
  className,
  ...props
}: CardStackHoverProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={cn("dui-card-stack-hover dui-demo", className)}
      data-component-layout="content"
    >
      <CardStack
        {...props}
        expanded={props.expanded ?? expanded}
        onExpandedChange={(next) => {
          setExpanded(next);
          props.onExpandedChange?.(next);
        }}
      />
      <div className={cn("dui-demo-controls")}>
        <button
          type="button"
          aria-pressed={props.expanded ?? expanded}
          onClick={() => {
            const next = !(props.expanded ?? expanded);
            setExpanded(next);
            props.onExpandedChange?.(next);
          }}
        >
          {(props.expanded ?? expanded) ? "Collapse stack" : "Expand stack"}
        </button>
      </div>
    </div>
  );
}
