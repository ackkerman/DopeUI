"use client";

// Requires Tailwind CSS v4 and the supplied foundation.css. Internal UI helpers are included.
import {
  useState,
  type ComponentProps,
  type CSSProperties,
  useEffect,
} from "react";

/* ─────────────────────────────────────────────────────────
 * TASK ROWS
 *
 *     0ms   rows enter staggered (80ms apart)
 *   600ms   row 1 ring sweeps 0 → 66%
 *  1500ms   row 1 expands — detail steps drop down
 *  3900ms   row 1 collapses; row 2 flips to Failed + retry
 *  5300ms   row 2 resolves to Completed
 * The status run completes once; task details stay clickable.
 * ───────────────────────────────────────────────────────── */

const TICKS = [600, 900, 2400, 1400, 2400, 600];

function useTick(intervals: number[]) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (tick >= intervals.length - 1) return;
    const t = setTimeout(() => setTick((x) => x + 1), intervals[tick]);
    return () => clearTimeout(t);
  }, [tick, intervals]);
  return tick;
}

function SpinnerRing({
  active,
  children,
}: {
  active?: boolean;
  children?: React.ReactNode;
}) {
  const size = 24,
    stroke = 2;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className={cn("absolute inset-0")}
        style={
          active
            ? { animation: "dui-ai-task-rows-spin 1.1s linear infinite" }
            : undefined
        }
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--line)"
          strokeWidth={stroke}
        />
        {active && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--ink-3)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c * 0.28} ${c * 0.72}`}
          />
        )}
      </svg>
      <span
        className={cn(
          "relative text-[10.5px] font-semibold tabular-nums text-ink",
        )}
      >
        {children}
      </span>
    </span>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "red" | "green";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(`flex size-5.5 shrink-0 items-center justify-center rounded-full text-white
        ${tone === "red" ? "bg-red" : "bg-green"}`)}
      style={{
        animation:
          "dui-ai-task-rows-pop-in 300ms cubic-bezier(0.23,1,0.32,1) both",
      }}
    >
      {children}
    </span>
  );
}

const XIcon = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    data-dui-icon=""
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const CheckIcon = (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    data-dui-icon=""
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const RetryIcon = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    data-dui-icon=""
  >
    <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
  </svg>
);

/* One detail line shown when a task row is expanded. */
export type TaskDetail = { label: string; meta: string };

/* A single task row.
 *  - "done"     → green check badge + completed pill (static)
 *  - "running"  → active spinner showing `step`, no pill (static)
 *  - "sequence" → animation-driven: pending spinner → failed → completed
 */
export type TaskRow = {
  key: string;
  label: string;
  amount: string;
  status: "done" | "running" | "sequence";
  step?: number;
  details: TaskDetail[];
};

export type TaskRowsLabels = {
  completed: string;
  failed: string;
};

const DEFAULT_LABELS: TaskRowsLabels = {
  completed: "Completed",
  failed: "Failed",
};

const TASK_ROWS: TaskRow[] = [
  {
    key: "verify",
    label: "Verified vendor records",
    amount: "12 suppliers",
    status: "done",
    details: [
      { label: "Matched tax and contact IDs", meta: "12/12" },
      { label: "Flagged stale records", meta: "0" },
    ],
  },
  {
    key: "index",
    label: "Build reorder task list",
    amount: "7 SKUs",
    status: "running",
    step: 2,
    details: [
      { label: "Reading POS export", meta: "3 files" },
      { label: "Scoring stockout risk", meta: "68%" },
    ],
  },
  {
    key: "draft",
    label: "Draft supplier emails",
    amount: "2 messages",
    status: "sequence",
    step: 3,
    details: [
      { label: "Cone supplier follow-up", meta: "draft" },
      { label: "Pistachio reorder note", meta: "draft" },
    ],
  },
];

function UpstreamTaskRows({
  variant = "Capsules",
  rows = TASK_ROWS,
  labels,
  className,
  onToggleRow,
}: {
  variant?: string;
  rows?: TaskRow[];
  labels?: Partial<TaskRowsLabels>;
  className?: string;
  onToggleRow?: (key: string, open: boolean) => void;
}) {
  const tick = useTick(TICKS);
  const [manualOpen, setManualOpen] = useState<Record<string, boolean>>({});
  const row2: "pending" | "failed" | "done" =
    tick < 3 ? "pending" : tick === 3 ? "failed" : "done";
  const copy = { ...DEFAULT_LABELS, ...labels };

  const badgeFor = (row: TaskRow) => {
    if (row.status === "done") return <Badge tone="green">{CheckIcon}</Badge>;
    if (row.status === "running")
      return <SpinnerRing active>{row.step}</SpinnerRing>;
    return row2 === "pending" ? (
      <SpinnerRing>{row.step}</SpinnerRing>
    ) : row2 === "failed" ? (
      <Badge tone="red">{XIcon}</Badge>
    ) : (
      <Badge tone="green">{CheckIcon}</Badge>
    );
  };

  const pillFor = (row: TaskRow) => {
    if (row.status === "done")
      return (
        <span
          className={cn(
            "inline-flex h-5.5 items-center rounded-full bg-green-tint px-2 text-[11.5px] font-medium text-green",
          )}
        >
          {copy.completed}
        </span>
      );
    if (row.status === "running") return null;
    return row2 === "failed" ? (
      <span
        className={cn(
          "inline-flex h-5.5 items-center gap-1.5 rounded-full bg-red-tint px-2 text-[11.5px] font-medium text-red",
        )}
        style={{ animation: "dui-ai-task-rows-fade-in 200ms ease-out both" }}
      >
        {copy.failed}{" "}
        <span
          style={{ animation: "dui-ai-task-rows-spin 1.2s linear infinite" }}
          className={cn("flex")}
        >
          {RetryIcon}
        </span>
      </span>
    ) : row2 === "done" ? (
      <span
        className={cn(
          "inline-flex h-5.5 items-center gap-1.5 rounded-full bg-green-tint px-2 text-[11.5px] font-medium text-green",
        )}
        style={{ animation: "dui-ai-task-rows-fade-in 200ms ease-out both" }}
      >
        {copy.completed}
      </span>
    ) : null;
  };

  const list = variant === "List";
  return (
    <div
      className={cn(
        `flex w-full min-w-0 max-w-110 flex-col ${
          list
            ? "gap-0 self-start overflow-hidden rounded-card bg-surface shadow-card"
            : "min-h-[196px] gap-2"
        }${className ? ` ${className}` : ""}`,
      )}
    >
      {rows.map((row, i) => {
        const open = manualOpen[row.key] ?? (row.key === "index" && tick === 2);
        return (
          <div
            key={row.key}
            className={cn(
              `self-stretch overflow-hidden transition-[border-radius,background-color] duration-300 hover:bg-inset ${
                list
                  ? "border-b border-line last:border-0"
                  : "bg-surface shadow-card"
              }`,
            )}
            style={{
              borderRadius: list ? 0 : open ? 14 : 22,
              animation: `dui-ai-task-rows-fade-up 450ms cubic-bezier(0.23,1,0.32,1) ${i * 80}ms both`,
            }}
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => {
                setManualOpen((current) => ({ ...current, [row.key]: !open }));
                onToggleRow?.(row.key, !open);
              }}
              className={cn(
                "grid min-h-11 w-full min-w-0 grid-cols-[24px_minmax(0,1fr)_28px] items-center gap-x-2.5 gap-y-1 px-2.5 py-2 text-left",
              )}
            >
              <span
                className={cn(
                  "row-span-2 flex size-6 shrink-0 items-center justify-center",
                )}
              >
                {badgeFor(row)}
              </span>
              <span
                className={cn(
                  "min-w-0 break-words text-[13px] font-medium text-ink",
                )}
              >
                {row.label}
              </span>
              <span
                className={cn(
                  "col-start-2 row-start-2 flex min-w-0 flex-wrap items-center gap-2 text-[12.5px] text-ink-2 tabular-nums",
                )}
              >
                <span>{row.amount}</span>
                {pillFor(row)}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "col-start-3 row-start-1 row-span-2 flex size-7 shrink-0 items-center justify-center rounded-full text-ink-3",
                )}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn("transition-transform duration-300")}
                  style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
                  data-dui-icon=""
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>

            {/* dropdown detail — same expandable grammar as Chain of Thought */}
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300",
              )}
              style={{
                gridTemplateRows: open ? "1fr" : "0fr",
                opacity: open ? 1 : 0,
                transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            >
              <div className={cn("overflow-hidden")}>
                <div
                  className={cn(
                    "mb-2.5 grid grid-cols-[24px_minmax(0,1fr)] gap-2.5 px-2.5",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn("mx-auto h-full w-px bg-line")}
                  />
                  <div className={cn("flex min-w-0 flex-col gap-1.5")}>
                    {row.details.map((d, j) => (
                      <div
                        key={d.label}
                        className={cn(
                          "flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-1",
                        )}
                        style={
                          open
                            ? {
                                animation: `dui-ai-task-rows-fade-up 300ms cubic-bezier(0.23,1,0.32,1) ${120 + j * 100}ms both`,
                              }
                            : undefined
                        }
                      >
                        <span
                          className={cn(
                            "min-w-0 flex-1 break-words text-[12px] text-ink-2",
                          )}
                        >
                          {d.label}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 font-mono text-[11.5px] text-ink-3 tabular-nums",
                          )}
                        >
                          {d.meta}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export type AiTaskRowsProps = ComponentProps<typeof UpstreamTaskRows> & {
  className?: string;
  style?: CSSProperties;
  theme?: "light" | "dark";
  onVariantChange?: (variant: string) => void;
};
export default function AiTaskRows({
  className,
  style,
  theme = "light",
  variant: controlledVariant,
  onVariantChange,
  ...props
}: AiTaskRowsProps) {
  const [localVariant, setVariant] = useState("Capsules");
  const variant = controlledVariant ?? localVariant;
  return (
    <>
      <div
        className={cn(
          "dui-ai-task-rows",
          theme === "dark" && "dark",
          className,
        )}
        style={style}
        data-component-layout="panel"
      >
        <div className={cn("dui-ai-content w-full min-w-0 max-w-110")}>
          <UpstreamTaskRows {...props} variant={variant} />
        </div>
        <div
          className={cn("dui-ai-variants")}
          role="group"
          aria-label="Task Rows variants"
        >
          {["Capsules", "List"].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={value === variant}
              onClick={() => {
                if (controlledVariant === undefined) setVariant(value);
                onVariantChange?.(value);
              }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

import { cn } from "../../class-names";
