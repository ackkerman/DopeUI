"use client";
import { SELECTION_SPRING } from "../motion-presets";
import * as React from "react";

function Link(props: import("react").ComponentProps<"a">) {
  return <a {...props} />;
}
function usePathname() {
  const [pathname, setPathname] = React.useState("/");
  React.useEffect(() => {
    const read = () => setPathname(window.location.pathname);
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);
  return pathname;
}

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { motion, useReducedMotion } from "motion/react";

const CORNER = 6;
const DASH =
  "repeating-linear-gradient(to top, transparent 0 2px, currentColor 2px 4px)";

export type HookSidebarItem = string | { label: string; href?: string };

export type HookSidebarProps = Omit<ComponentProps<"nav">, "onChange"> & {
  items: HookSidebarItem[];
  label?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (index: number) => void;
  color?: string;
  dashed?: boolean;
};

const hrefOf = (item: HookSidebarItem) =>
  typeof item === "string" ? undefined : item.href;

const labelOf = (item: HookSidebarItem) =>
  typeof item === "string" ? item : item.label;

const Rail = ({
  from = 0,
  y,
  visible,
  color,
  dashed,
  className,
}: {
  from?: number;
  y: number | null;
  visible: boolean;
  color?: string;
  dashed: boolean;
  className?: string;
}) => {
  const reduced = useReducedMotion();
  const travel = reduced ? { duration: 0 } : SELECTION_SPRING;

  return (
    <motion.span
      aria-hidden
      initial={false}
      style={{ color }}
      animate={{ opacity: visible && y !== null ? 1 : 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.2 }}
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <motion.span
        initial={false}
        animate={{ top: from, height: Math.max(0, (y ?? 0) - CORNER - from) }}
        transition={travel}
        style={
          dashed
            ? { backgroundImage: DASH }
            : { backgroundColor: "currentColor" }
        }
        className={cn("absolute left-0.5 w-px")}
      />
      <motion.svg
        initial={false}
        animate={{ top: (y ?? 0) - CORNER }}
        transition={travel}
        width="12"
        height="7"
        viewBox="0 0 12 7"
        fill="none"
        className={cn("absolute left-0.5")}
      >
        <path
          d="M0.5 0a6 6 0 0 0 6 6H12"
          stroke="currentColor"
          strokeDasharray={dashed ? "2 2" : undefined}
        />
      </motion.svg>
    </motion.span>
  );
};

export function HookSidebar({
  items,
  label,
  value,
  defaultValue = 0,
  onChange,
  color = "var(--frost-primary, #416C91)",
  dashed = true,
  className,
  ...props
}: HookSidebarProps) {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [centers, setCenters] = useState<number[]>([]);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);

  const routed = items.some((item) => hrefOf(item));
  const routeIndex = items.findIndex((item) => hrefOf(item) === pathname);
  const activeIndex = value ?? (routed ? routeIndex : internalValue);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () =>
      setCenters(
        itemRefs.current.map((el) =>
          el ? el.offsetTop + el.offsetHeight / 2 : 0,
        ),
      );

    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [items.length]);

  const activeY = activeIndex < 0 ? null : (centers[activeIndex] ?? null);
  const hoverY = hoverIndex === null ? null : (centers[hoverIndex] ?? null);

  // above the active row the accent line already covers the span, so draw only the corner
  const hoverFrom =
    activeY !== null && hoverY !== null && hoverY <= activeY
      ? Math.max(0, hoverY - CORNER)
      : (activeY ?? 0);

  const select = (index: number) => {
    if (value === undefined) setInternalValue(index);
    onChange?.(index);
  };

  return (
    <nav
      data-slot="hook-sidebar"
      aria-label={label}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {label && (
        <span
          data-slot="hook-sidebar-label"
          className={cn(
            "pb-3 pl-0.5 pr-2 font-sans text-sm font-medium uppercase tracking-wide text-foreground",
          )}
        >
          {label}
        </span>
      )}

      <div
        ref={listRef}
        onMouseLeave={() => setPointerInside(false)}
        className={cn("relative flex flex-col gap-0.5")}
      >
        <Rail
          from={hoverFrom}
          y={hoverY}
          visible={(pointerInside || focusInside) && hoverIndex !== activeIndex}
          dashed={dashed}
          className={cn("text-foreground/30")}
        />
        <Rail
          y={activeY}
          visible={activeY !== null}
          color={color}
          dashed={dashed}
        />

        {items.map((item, index) => {
          const text = labelOf(item);
          const href = hrefOf(item);
          const isActive = index === activeIndex;
          const setRef = (el: HTMLElement | null) => {
            itemRefs.current[index] = el;
          };
          const rowProps = {
            "data-slot": "hook-sidebar-item",
            "data-active": isActive,
            onMouseEnter: () => {
              setHoverIndex(index);
              setPointerInside(true);
            },
            onFocus: () => {
              setHoverIndex(index);
              setFocusInside(true);
            },
            onBlur: () => setFocusInside(false),
            onClick: () => select(index),
            className: cn(
              "rounded-lg py-1.5 pl-5 pr-2 text-left text-sm transition-colors duration-200 motion-reduce:transition-none",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            ),
          };

          return href ? (
            <Link
              key={`${index}-${text}`}
              {...rowProps}
              ref={setRef}
              href={href}
              aria-current={isActive ? "page" : undefined}
            >
              {text}
            </Link>
          ) : (
            <button
              key={`${index}-${text}`}
              {...rowProps}
              ref={setRef}
              type="button"
              aria-current={isActive ? "true" : undefined}
            >
              {text}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export type HookSidebarDemoProps = Partial<
  React.ComponentProps<typeof HookSidebar>
> & { theme?: "light" | "dark" };
export default function HookSidebarDemo({
  theme = "light",
  className,
  ...props
}: HookSidebarDemoProps) {
  const items = props.items ?? ["Overview", "Sources", "Runs", "Settings"];
  const [selected, setSelected] = React.useState(props.defaultValue ?? 0);
  const active = props.value ?? selected;
  const label = items[active] ? labelOf(items[active]) : "Overview";
  const input = {
    ...props,
    items,
    value: active,
    onChange: (index: number) => {
      if (props.value === undefined) setSelected(index);
      props.onChange?.(index);
    },
  };
  return (
    <>
      <div
        className={cn(
          "dui-hook-sidebar",
          theme === "dark" && "dark",
          className,
        )}
        data-component-layout="interaction"
      >
        <div
          className={cn(
            "grid w-full grid-cols-[104px_minmax(0,1fr)] items-start gap-4",
          )}
        >
          <HookSidebar {...input} />
          <article
            data-slot="sidebar-demo-content"
            aria-label={`${label} content`}
            className={cn(
              "h-[280px] min-w-0 overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background px-5 py-5",
            )}
          >
            <span className={cn("text-xs text-muted-foreground")}>
              0{active + 1} / WORKSPACE
            </span>
            <h3
              className={cn(
                "mt-2 text-lg font-semibold tracking-tight text-foreground",
              )}
            >
              {label}
            </h3>
            <p
              className={cn(
                "mt-3 text-sm leading-relaxed text-muted-foreground",
              )}
            >
              {[
                "Plan the work, collect the right context, and review the result in one place.",
                "Keep reference material close to the work. Browse notes, documents, and saved context.",
                "Follow each step from planning to completion. Review progress and the results of recent runs.",
                "Choose how your workspace behaves. Update preferences and keep your tools organized.",
              ][active] ??
                "Explore this part of the workspace and its available context."}
            </p>
            <div
              className={cn(
                "mt-5 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground",
              )}
            >
              Select a section in the sidebar to explore its content. The rail
              follows your selection.
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
