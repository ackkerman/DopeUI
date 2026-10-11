// This file guarantees row-first masonry follows changing card dimensions without changing DOM order.
import { useLayoutEffect, useRef } from "react";

/** Returns the one-pixel row span including the gap beneath a natural-height card. */
export function masonryRowSpan(height: number, gap = 16): number {
  return Math.max(1, Math.ceil(height + gap));
}

/** Measures a new result set and releases its observer when that set is replaced. */
export function useMasonryLayout(resultKey: string) {
  const gridRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const grid = gridRef.current;
    // Unsupported browsers keep the ordinary responsive grid without overlapping cards.
    if (!grid || typeof ResizeObserver === "undefined") return;
    const cards = Array.from(grid.children) as HTMLElement[];
    const measure = (targets: HTMLElement[]) => {
      const spans = targets.map((card) =>
        masonryRowSpan(card.getBoundingClientRect().height),
      );
      targets.forEach((card, index) => {
        const value = `span ${spans[index]}`;
        if (card.style.gridRowEnd !== value) card.style.gridRowEnd = value;
      });
    };
    measure(cards);
    grid.dataset.masonry = "true";
    const observer = new ResizeObserver((entries) => {
      measure(entries.map((entry) => entry.target as HTMLElement));
    });
    cards.forEach((card) => observer.observe(card));
    return () => {
      observer.disconnect();
      delete grid.dataset.masonry;
      cards.forEach((card) => card.style.removeProperty("grid-row-end"));
    };
  }, [resultKey]);
  return gridRef;
}
