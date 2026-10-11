"use client";
// This file guarantees independently authored, pausable word-by-word blur reveals.
import { useState, type ComponentProps, type CSSProperties } from "react";
import { cn } from "../../class-names";
/** Reveals an accessible text in place; paused animations retain their current progress. */
export interface StreamingWordsProps extends ComponentProps<"p"> {
  text: string;
  interval?: number;
  duration?: number;
  paused?: boolean;
  motion?: boolean;
  onComplete?: () => void;
}
export function StreamingWords({
  text,
  interval = 110,
  duration = 600,
  paused = false,
  motion = true,
  onComplete,
  className,
  ...props
}: StreamingWordsProps) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const step = Number.isFinite(interval) ? Math.max(0, interval) : 110;
  const resolve = Number.isFinite(duration) ? Math.max(1, duration) : 600;
  return (
    <p
      {...props}
      className={cn("dui-streaming-words", className)}
      data-motion={motion}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span
            key={`${index}-${word}`}
            className="dui-streaming-word"
            style={
              {
                animationDelay: `${index * step}ms`,
                animationDuration: `${resolve}ms`,
                animationPlayState: paused ? "paused" : "running",
              } as CSSProperties
            }
            onAnimationEnd={index === words.length - 1 ? onComplete : undefined}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </p>
  );
}
/** A replayable preview shares the same component and source as the copyable library. */
export interface StreamingTextProps extends ComponentProps<"div"> {
  text?: string;
  motion?: boolean;
  defaultPaused?: boolean;
}
export default function StreamingText({
  text = "Good interfaces make complex ideas feel simple. Every word arrives with a little clarity, giving you time to follow the thought as it unfolds.",
  motion = true,
  defaultPaused = false,
  className,
  ...props
}: StreamingTextProps) {
  const [paused, setPaused] = useState(defaultPaused);
  const [revision, setRevision] = useState(0);
  return (
    <div
      {...props}
      className={cn("dui-demo dui-streaming-text", className)}
      data-component-layout="content"
    >
      <StreamingWords
        key={`${text}-${revision}`}
        text={text}
        paused={paused}
        motion={motion}
      />
      <div className="dui-demo-controls">
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          onClick={() => {
            setRevision(revision + 1);
            setPaused(false);
          }}
        >
          Animate
        </button>
      </div>
    </div>
  );
}
