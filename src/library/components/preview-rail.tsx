"use client";
// This file guarantees pointer, keyboard, and touch navigation share one preview rail.

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";
import { SELECTION_SPRING, CONTENT_EASE_OUT } from "../motion-presets";
import { useDismiss } from "../primitives/use-dismiss";
import { useHoverGesture } from "../primitives/use-hover-gesture";
import { useTapGesture } from "../primitives/use-tap-gesture";
import { cn } from "../../class-names";

/** A destination is a native link when href exists, otherwise a selection button. */
export interface PreviewRailItem {
  id: string;
  label: string;
  ariaLabel?: string;
  description?: ReactNode;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

/** The caller owns destination content and may control the active selection independently of hover. */
export interface PreviewRailProps {
  items: PreviewRailItem[];
  label?: string;
  orientation?: "vertical" | "horizontal";
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  onItemSelect?: (item: PreviewRailItem) => void;
  renderPreview?: (item: PreviewRailItem) => ReactNode;
  showPreview?: boolean;
  previewSide?: "before" | "after";
  highlightActive?: boolean;
  itemSize?: number;
  children?: ReactNode;
  className?: string;
  railClassName?: string;
  previewContainerClassName?: string;
  previewClassName?: string;
}

function DefaultPreview({ item }: { item: PreviewRailItem }) {
  return (
    <div
      data-slot="preview-rail-card"
      className="dui-preview-rail-card rounded-[16px] border p-4 shadow-sm"
    >
      <p data-slot="preview-rail-title" className="font-medium">
        {item.label}
      </p>
      {item.description ? (
        <div
          data-slot="preview-rail-description"
          className="mt-1 text-sm leading-6 text-muted-foreground"
        >
          {item.description}
        </div>
      ) : null}
    </div>
  );
}

/** Empty items render an empty navigation; unknown active IDs fall back to the first item. */
export function PreviewRail({
  items,
  label = "Section navigation",
  orientation = "vertical",
  activeId,
  defaultActiveId,
  onActiveChange,
  onItemSelect,
  renderPreview,
  showPreview = true,
  previewSide = "after",
  highlightActive = false,
  itemSize = 24,
  children,
  className,
  railClassName,
  previewContainerClassName,
  previewClassName,
}: PreviewRailProps) {
  const uid = useId();
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [internalActiveId, setInternalActiveId] = useState(
    defaultActiveId ?? items[0]?.id ?? "",
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // A finger cannot hover, so a tap lights the tick instead. Kept apart from
  // the hovered one: they end in different ways, and a stray mouse move must
  // not clear a tick the keyboard or a tap chose.
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  // A click carries no pointerType, so the pointerdown before it is what says
  // whether the activation was a tap. Keyboard activation has none at all.
  const tap = useTapGesture<boolean>();
  const hover = useHoverGesture();

  const clearPreview = useCallback(() => {
    setPinnedId(null);
    setHoveredId(null);
    setFocusedId(null);
  }, []);

  // The next tap outside the rail stands in for the pointer leaving it. The
  // card is a preview, so that tap passes through to whatever it landed on.
  useDismiss(
    pinnedId !== null || focusedId !== null || hoveredId !== null,
    clearPreview,
    rootRef,
  );

  const requestedActiveId = activeId ?? internalActiveId;
  const selectedId = items.some((item) => item.id === requestedActiveId)
    ? requestedActiveId
    : (items[0]?.id ?? "");
  const displayedId = hoveredId ?? pinnedId ?? focusedId ?? "";
  const highlightedId = displayedId || (highlightActive ? selectedId : "");
  const displayedIndex = items.findIndex((item) => item.id === highlightedId);
  const rowTemplate = items.length
    ? `repeat(${items.length}, ${itemSize}px)`
    : undefined;
  const isHorizontal = orientation === "horizontal";

  const selectItem = (id: string) => {
    if (activeId === undefined) setInternalActiveId(id);
    onActiveChange?.(id);
  };

  return (
    <motion.div
      layoutRoot
      ref={rootRef}
      onBlur={(event) => {
        // Both tick sources leave with the focus: a tap does not always land
        // focus, but when it does, tabbing away must not strand the card.
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusedId(null);
          setPinnedId(null);
        }
      }}
      className={cn(
        "dui-preview-rail isolate relative flex w-full overflow-visible",
        isHorizontal
          ? "min-h-64 flex-col items-center justify-center"
          : "min-h-80",
        !isHorizontal && previewSide === "before" && "flex-row-reverse",
        className,
      )}
    >
      <nav
        aria-label={label}
        onPointerLeave={(event) => {
          // A touch pointer leaves on lift, which would clear the tick the tap
          // just chose — that one is cleared by the outside tap instead.
          if (hover.leave(event)) setHoveredId(null);
        }}
        style={
          isHorizontal
            ? { gridTemplateColumns: rowTemplate }
            : { gridTemplateRows: rowTemplate }
        }
        className={cn(
          "relative z-10 grid shrink-0",
          isHorizontal
            ? "h-12 w-fit max-w-full self-center justify-center"
            : "w-12 content-center",
          railClassName,
        )}
      >
        {items.map((item, index) => {
          const selected = item.id === selectedId;
          const highlighted = item.id === highlightedId;
          const distance =
            displayedIndex < 0
              ? Number.POSITIVE_INFINITY
              : Math.abs(index - displayedIndex);
          const scale = highlighted
            ? 1
            : distance === 1
              ? 0.68
              : distance === 2
                ? 0.44
                : 0.25;

          const itemContent = (
            <>
              <motion.span
                data-slot="preview-rail-tick"
                aria-hidden="true"
                animate={isHorizontal ? { scaleY: scale } : { scaleX: scale }}
                transition={reduce ? { duration: 0 } : SELECTION_SPRING}
                className={cn(
                  "block bg-current",
                  isHorizontal
                    ? "h-12 w-0.5 origin-bottom"
                    : "h-0.5 w-12 origin-left",
                  highlighted ? "text-foreground" : undefined,
                )}
              />
            </>
          );

          const sharedClassName = cn(
            "relative flex text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isHorizontal
              ? "h-12 w-6 items-end justify-center"
              : "h-6 w-12 items-center",
          );
          const sharedStyle = isHorizontal
            ? { width: itemSize }
            : { height: itemSize };
          const handlePointerEnter = (
            event: ReactPointerEvent<HTMLElement>,
          ) => {
            if (hover.enter(event)) setHoveredId(item.id);
          };
          const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
            tap.start(event, pinnedId === item.id);
            setFocusedId(null);
          };
          // A gesture the platform takes away sends no click, and a key press
          // starts an activation that never had a pointer behind it: either
          // one leaves a record the next click would read as a tap of its own.
          const dropGesture = () => tap.drop();
          const handleFocus = (currentTarget: HTMLElement) => {
            if (currentTarget.matches(":focus-visible")) {
              // Keyboard movement replaces an earlier hover or touch preview.
              setHoveredId(null);
              setPinnedId(null);
              setFocusedId(item.id);
            }
          };
          const handleSelect = (event: ReactMouseEvent<HTMLElement>) => {
            const gesture = tap.take();
            const tapped = gesture !== null && gesture.pointerType !== "mouse";

            if (tapped) {
              // A link would otherwise show its preview and leave the page in
              // the same tap, so the card is never read: the first tap lights
              // the tick, the second follows the link.
              if (item.href && !gesture.state) {
                event.preventDefault();
                setPinnedId(item.id);
                return;
              }
              setPinnedId(item.id);
            }

            selectItem(item.id);
            onItemSelect?.(item);
          };

          return item.href ? (
            <a
              key={item.id}
              data-slot="preview-rail-item"
              href={item.href}
              target={item.target}
              rel={
                item.rel ??
                (item.target === "_blank" ? "noreferrer noopener" : undefined)
              }
              aria-label={item.ariaLabel ?? item.label}
              aria-current={selected ? "page" : undefined}
              onPointerEnter={handlePointerEnter}
              onPointerDown={handlePointerDown}
              onPointerCancel={dropGesture}
              onKeyDown={dropGesture}
              onFocus={(event) => handleFocus(event.currentTarget)}
              onClick={handleSelect}
              style={sharedStyle}
              className={sharedClassName}
            >
              {itemContent}
            </a>
          ) : (
            <button
              key={item.id}
              data-slot="preview-rail-item"
              type="button"
              aria-label={item.ariaLabel ?? item.label}
              aria-current={selected ? "location" : undefined}
              onPointerEnter={handlePointerEnter}
              onPointerDown={handlePointerDown}
              onPointerCancel={dropGesture}
              onKeyDown={dropGesture}
              onFocus={(event) => handleFocus(event.currentTarget)}
              onClick={handleSelect}
              style={sharedStyle}
              className={sharedClassName}
            >
              {itemContent}
            </button>
          );
        })}
      </nav>

      {showPreview ? (
        <div
          aria-hidden="true"
          style={
            isHorizontal
              ? { gridTemplateColumns: rowTemplate }
              : { gridTemplateRows: rowTemplate }
          }
          className={cn(
            "pointer-events-none absolute z-50 grid",
            isHorizontal
              ? "top-1/2 left-1/2 h-5 w-fit max-w-full -translate-x-1/2 -translate-y-1/2 justify-center"
              : previewSide === "before"
                ? "inset-y-0 right-16 left-4 content-center"
                : "inset-y-0 right-4 left-16 content-center",
            previewContainerClassName,
          )}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              style={isHorizontal ? { width: itemSize } : { height: itemSize }}
              className={cn(
                "relative flex items-center",
                isHorizontal ? "justify-center" : undefined,
              )}
            >
              {item.id === displayedId ? (
                <div
                  data-slot="preview-rail-preview"
                  style={
                    isHorizontal
                      ? {
                          width: Math.min(288, items.length * itemSize),
                          left: `clamp(${Math.min(288, items.length * itemSize) / 2 - index * itemSize}px, 50%, ${items.length * itemSize - Math.min(288, items.length * itemSize) / 2 - index * itemSize}px)`,
                        }
                      : undefined
                  }
                  className={cn(
                    isHorizontal
                      ? "absolute bottom-12 left-1/2 w-72 -translate-x-1/2"
                      : cn(
                          "w-full max-w-sm",
                          previewSide === "before" && "ml-auto",
                        ),
                    previewClassName,
                  )}
                >
                  <motion.div
                    layoutId={`preview-rail-card-${uid}`}
                    transition={reduce ? { duration: 0 } : SELECTION_SPRING}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={item.id}
                        initial={
                          reduce
                            ? { opacity: 0 }
                            : { opacity: 0, y: 4, filter: "blur(6px)" }
                        }
                        animate={
                          reduce
                            ? { opacity: 1 }
                            : { opacity: 1, y: 0, filter: "blur(0px)" }
                        }
                        exit={
                          reduce
                            ? { opacity: 0 }
                            : {
                                opacity: 0,
                                y: -2,
                                filter: "blur(4px)",
                                transition: {
                                  duration: 0.12,
                                  ease: CONTENT_EASE_OUT,
                                },
                              }
                        }
                        transition={{
                          duration: reduce ? 0 : 0.18,
                          ease: CONTENT_EASE_OUT,
                        }}
                      >
                        {renderPreview ? (
                          renderPreview(item)
                        ) : (
                          <DefaultPreview item={item} />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {children ? (
        <div className="min-h-0 min-w-0 flex-1">{children}</div>
      ) : null}
    </motion.div>
  );
}

const sampleRailItems: PreviewRailItem[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Your workspace and recent activity.",
  },
  {
    id: "components",
    label: "Components",
    description: "Small interactions, ready to make your own.",
  },
  {
    id: "blocks",
    label: "Blocks",
    description: "Thoughtful combinations for everyday interfaces.",
  },
  {
    id: "playground",
    label: "Playground",
    description: "Explore the details and tune the movement.",
  },
  {
    id: "docs",
    label: "Documentation",
    description: "Everything you need to get started.",
  },
  {
    id: "updates",
    label: "Updates",
    description: "The latest additions and improvements.",
  },
  {
    id: "examples",
    label: "Examples",
    description: "See the pieces come together in context.",
  },
  {
    id: "guides",
    label: "Guides",
    description: "Practical ideas for building with feeling.",
  },
  {
    id: "community",
    label: "Community",
    description: "Share what you are making and discover new ideas.",
  },
];

/** Both orientations use the public rail API with locally selected sample destinations. */
export default function PreviewRailDemo({ className }: { className?: string }) {
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">(
    "vertical",
  );
  const [side, setSide] = useState<"before" | "after">("after");
  const [highlight, setHighlight] = useState(false);
  return (
    <div
      className={cn("dui-preview-rail-demo", className)}
      data-component-layout="content"
    >
      <PreviewRail
        items={sampleRailItems}
        orientation={orientation}
        previewSide={side}
        highlightActive={highlight}
        defaultActiveId="docs"
        className="dui-preview-rail-stage"
      >
        {orientation === "vertical" ? (
          <div className="dui-preview-rail-hint">
            <span>Explore the collection.</span>
            <p>Hover or focus a tick to preview.</p>
          </div>
        ) : null}
      </PreviewRail>
      <div className="dui-preview-rail-controls">
        <button
          type="button"
          aria-pressed={orientation === "vertical"}
          onClick={() => setOrientation("vertical")}
        >
          Vertical
        </button>
        <button
          type="button"
          aria-pressed={orientation === "horizontal"}
          onClick={() => setOrientation("horizontal")}
        >
          Horizontal
        </button>
        <button
          type="button"
          disabled={orientation === "horizontal"}
          aria-pressed={side === "before"}
          onClick={() =>
            setSide((value) => (value === "after" ? "before" : "after"))
          }
        >
          Preview before
        </button>
        <button
          type="button"
          aria-pressed={highlight}
          onClick={() => setHighlight((value) => !value)}
        >
          Highlight active
        </button>
      </div>
    </div>
  );
}
