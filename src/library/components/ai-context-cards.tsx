"use client";

// Requires Tailwind CSS v4 and the supplied foundation.css. Internal UI helpers are included.
import {
  useState,
  type ComponentProps,
  type CSSProperties,
  useEffect,
} from "react";

/* ─────────────────────────────────────────────────────────
 * CONTEXT CARDS
 * Retrieved chunks enter once, then remain available.
 * ───────────────────────────────────────────────────────── */

export type ContextChunk = {
  title: string;
  chars: string;
  body: string;
  source: string;
  badge: string;
  tone: string;
};

export type ContextCardsLabels = {
  header: string;
  count: string;
};

const DEFAULT_LABELS: ContextCardsLabels = {
  header: "All chunks",
  count: "32",
};

const CHUNKS: ContextChunk[] = [
  {
    title: "Vendor onboarding rule",
    chars: "290 characters",
    body: "Cold-chain certification must be verified before a new dairy can be added to the reorder workflow.",
    source: "Dairy Onboarding SOP.pdf",
    badge: "PDF",
    tone: "bg-red",
  },
  {
    title: "Seasonal demand row",
    chars: "1,250 characters",
    body: "Q4 velocity table: pistachio +18%, vanilla +6%, rocky road -11%; retire flavors below 40 scoops weekly.",
    source: "Sales Velocity Export.csv",
    badge: "CSV",
    tone: "bg-green",
  },
];

function UpstreamContextCards({
  chunks = CHUNKS,
  labels,
  className,
}: {
  /** Accepted for gallery/registry parity; ContextCards has no visual variants. */
  variant?: string;
  chunks?: ContextChunk[];
  labels?: Partial<ContextCardsLabels>;
  className?: string;
} = {}) {
  const [chipsShown, setChipsShown] = useState(false);
  const copy = { ...DEFAULT_LABELS, ...labels };

  useEffect(() => {
    const chips = setTimeout(() => setChipsShown(true), 700);
    return () => clearTimeout(chips);
  }, []);

  return (
    <div
      className={cn(
        `flex w-full max-w-95 flex-col gap-2${className ? ` ${className}` : ""}`,
      )}
    >
      <div
        className={cn("flex items-center gap-2 px-0.5")}
        style={{
          animation: "dui-ai-context-cards-fade-in 400ms ease-out both",
        }}
      >
        <span className={cn("text-[13px] font-semibold text-ink")}>
          {copy.header}
        </span>
        <span
          className={cn(
            "inline-flex h-5 items-center rounded-md bg-inset px-1.5 text-[11.5px] font-medium text-ink-2 shadow-hairline tabular-nums",
          )}
        >
          {copy.count}
        </span>
      </div>

      {chunks.map((chunk, i) => (
        <div
          key={chunk.title}
          className={cn("overflow-hidden rounded-card bg-surface shadow-card")}
          style={{
            animation: `dui-ai-context-cards-fade-up 400ms cubic-bezier(0.23,1,0.32,1) ${i * 100}ms both`,
          }}
        >
          <div
            className={cn(
              "primitive-card-bar flex items-center gap-2.5 border-b border-line",
            )}
          >
            <span
              className={cn(
                "flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-ink",
              )}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                data-dui-icon=""
              >
                <path d="M4 6h16M4 12h16M4 18h10" />
              </svg>
              <span className={cn("truncate")}>{chunk.title}</span>
            </span>
            <span
              className={cn(
                "ml-auto shrink-0 text-[12px] text-ink-3 tabular-nums",
              )}
            >
              {chunk.chars}
            </span>
          </div>
          <p
            className={cn(
              "px-3 pt-2 pb-1 text-[12.5px] leading-relaxed text-ink-2",
            )}
          >
            {chunk.body}
          </p>
          <div className={cn("px-3 pb-3")}>
            <span
              className={cn(
                "inline-flex h-6 items-center gap-1.5 rounded-full bg-inset px-2\n                text-[12px] font-medium text-ink-2 shadow-btn\n                transition-[opacity,transform,background-color] duration-300 hover:bg-hover",
              )}
              style={{
                opacity: chipsShown ? 1 : 0,
                transform: chipsShown ? "scale(1)" : "scale(0.95)",
                transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <span
                className={cn(
                  `flex size-3.5 items-center justify-center rounded-[4px] ${chunk.tone} text-[7px] font-bold text-white`,
                )}
              >
                {chunk.badge}
              </span>
              {chunk.source}
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-dui-icon=""
              >
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export type AiContextCardsProps = ComponentProps<
  typeof UpstreamContextCards
> & {
  className?: string;
  style?: CSSProperties;
  theme?: "light" | "dark";
  onVariantChange?: (variant: string) => void;
};
export default function AiContextCards({
  className,
  style,
  theme = "light",
  variant: controlledVariant,
  ...props
}: AiContextCardsProps) {
  const [localVariant] = useState("Default");
  const variant = controlledVariant ?? localVariant;
  return (
    <>
      <div
        className={cn(
          "dui-ai-context-cards",
          theme === "dark" && "dark",
          className,
        )}
        style={style}
        data-component-layout="panel"
      >
        <div className={cn("dui-ai-content")}>
          <UpstreamContextCards {...props} variant={variant} />
        </div>
      </div>
    </>
  );
}

import { cn } from "../../class-names";
