"use client";
// This file guarantees the preview and copyable application example use the same component.
// This file guarantees the examples compose canonical UI components with shared, local state.
import { useId, useRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MoreHorizontal } from "lucide-react";
import RailTocDemo from "../../library/components/rail-toc";
import { ScrollProgress } from "../../library/components/scroll-progress";
import { ProgressiveBlur } from "../../library/components/progressive-blur";
import { Highlighter } from "../../library/components/highlighter";
import "../showcase-previews.css";
function cn(...values: ClassValue[]) {
  return twMerge(clsx(values));
}
function AppTitle({
  label,
  children,
}: {
  label: string;
  children?: import("react").ReactNode;
}) {
  return (
    <div className={cn("sc-title")}>
      <strong>{label}</strong>
      <div>{children ?? <MoreHorizontal size={16} aria-hidden />}</div>
    </div>
  );
}
export default function ReadingRoom() {
  const scroller = useRef<HTMLDivElement>(null);
  const prefix = useId();
  const items = ["Overview", "Principles", "Details", "Next steps"].map(
    (label, i) => ({ id: `${prefix}-${i}`, label }),
  );
  return (
    <div
      className={cn("sc-app sc-reading")}
      data-component-layout="interaction"
    >
      <AppTitle label="The little details" />
      <div className={cn("sc-reading-layout")}>
        <RailTocDemo
          className={cn("sc-reader-rail")}
          items={items}
          containerRef={scroller}
          offset={24}
        />
        <div className={cn("sc-reader-frame")}>
          <div
            ref={scroller}
            className={cn("sc-reader-text")}
            tabIndex={0}
            role="region"
            aria-label="Reading example"
          >
            {items.map((item, i) => (
              <section key={item.id} id={item.id}>
                <small>0{i + 1} / FIELD NOTES</small>
                <h4>{item.label}</h4>
                <p>
                  Good interfaces make{" "}
                  <Highlighter action="underline" color="#3355c5">
                    the useful things
                  </Highlighter>{" "}
                  easy to find. A little care in the details gives every
                  interaction a clearer purpose.
                </p>
              </section>
            ))}
          </div>
          <ProgressiveBlur height="20%" />
          <ScrollProgress
            sections={items}
            containerRef={scroller}
            offset={24}
          />
        </div>
      </div>
    </div>
  );
}
