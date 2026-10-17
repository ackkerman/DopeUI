"use client";

// This file guarantees a seamless logo strip with one accessible copy of each company.
import { useState } from "react";
import { MarqueeStrip } from "../primitives/marquee-strip";
import { cn } from "../../class-names";

/** A company is always identified by name, including when its optional image fails. */
export interface LogoMarqueeItem {
  name: string;
  src?: string;
}

/** Duration is one loop in seconds; gap is the space between naturally sized logo images in pixels. */
export interface LogoMarqueeProps {
  items?: readonly LogoMarqueeItem[];
  duration?: number;
  direction?: "left" | "right";
  gap?: number;
  paused?: boolean;
  pauseOnHover?: boolean;
  label?: string;
  className?: string;
}

// These typographic samples are generated locally and need no external image service.
const sampleLogos: readonly LogoMarqueeItem[] = [
  ["Microsoft", "#737373", "Arial", "500", "146"],
  ["stripe", "#635bff", "Arial", "800", "82"],
  ["SONY", "#111111", "Georgia", "700", "100"],
  ["Google", "#4285f4", "Arial", "500", "104"],
  ["Canon", "#cc0000", "Georgia", "700", "100"],
  ["SAMSUNG", "#1428a0", "Arial", "800", "160"],
].map(([name, color, font, weight, width]) => ({
  name,
  src: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="48" viewBox="0 0 ${width} 48"><text x="0" y="35" textLength="${width}" lengthAdjust="spacingAndGlyphs" font-family="${font}" font-size="32" font-weight="${weight}" fill="${color}">${name}</text></svg>`)}`,
}));

function MarqueeLogo({ item }: { item: LogoMarqueeItem }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  return (
    <span className="dui-logo-marquee-item" role="listitem">
      {item.src && failedSrc !== item.src ? (
        <img
          src={item.src}
          alt={item.name}
          height="38"
          draggable={false}
          onError={() => setFailedSrc(item.src)}
        />
      ) : (
        <span className="dui-logo-marquee-fallback">{item.name}</span>
      )}
    </span>
  );
}

export function LogoMarquee({
  items = sampleLogos,
  duration = 28,
  direction = "left",
  gap = 16,
  paused = false,
  pauseOnHover = false,
  label = "Company logos",
  className,
}: LogoMarqueeProps) {
  const safeGap = Number.isFinite(gap) && gap >= 0 ? gap : 16;
  return (
    <MarqueeStrip
      items={items.map((item, index) => (
        <MarqueeLogo item={item} key={`${index}-${item.name}-${item.src}`} />
      ))}
      itemWidth={144}
      label={label}
      className={cn("dui-logo-marquee", className)}
      duration={duration}
      direction={direction}
      gap={safeGap}
      paused={paused}
      pauseOnHover={pauseOnHover}
    />
  );
}

export default function LogoMarqueeDemo({ className }: { className?: string }) {
  const [paused, setPaused] = useState(false);
  const [reversed, setReversed] = useState(false);
  const [fast, setFast] = useState(false);
  const [gap, setGap] = useState(16);
  return (
    <div className={cn("dui-logo-marquee-demo", className)}>
      <LogoMarquee
        gap={gap}
        paused={paused}
        direction={reversed ? "right" : "left"}
        duration={fast ? 14 : 28}
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
          aria-pressed={reversed}
          onClick={() => setReversed(!reversed)}
        >
          Reverse
        </button>
        <button
          type="button"
          aria-pressed={fast}
          onClick={() => setFast(!fast)}
        >
          {fast ? "Speed 2×" : "Speed 1×"}
        </button>
        <label className="dui-logo-marquee-spacing">
          <span>Spacing</span>
          <input
            type="range"
            aria-label="Logo spacing"
            min={0}
            max={96}
            step={4}
            value={gap}
            onChange={(event) => setGap(Number(event.target.value))}
          />
          <output aria-hidden="true">{gap}px</output>
        </label>
      </div>
    </div>
  );
}
