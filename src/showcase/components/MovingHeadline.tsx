"use client";
// This file guarantees the preview and copyable application example use the same component.
// This file guarantees the examples compose canonical UI components with shared, local state.
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ArrowUpRight } from "lucide-react";
import { Highlighter } from "../../library/components/highlighter";
import { VideoText } from "../../library/components/video-text";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "../../library/components/scroll-based-velocity";
import "../showcase-previews.css";
function cn(...values: ClassValue[]) {
  return twMerge(clsx(values));
}
export default function MovingHeadline() {
  const [version, setVersion] = useState(0);
  return (
    <div className={cn("sc-brand")} data-component-layout="interaction">
      <div>
        <span className={cn("sc-kicker")}>MAKE YOUR NEXT IDEA MOVE</span>
        <h3>
          More than a<br />
          <Highlighter key={version} color="#b8d8ff" action="highlight">
            first impression.
          </Highlighter>
        </h3>
        <p>A little motion. A lasting feeling.</p>
        <button
          className={cn("sc-button")}
          type="button"
          onClick={() => setVersion((v) => v + 1)}
        >
          Replay the highlight <ArrowUpRight size={14} />
        </button>
      </div>
      <div className={cn("sc-video-word")}>
        <VideoText src="/media/video-text-forest-8s.mp4" fontSize="76px">
          DOPE
        </VideoText>
      </div>
      <div className={cn("sc-brand-velocity")}>
        <ScrollVelocityContainer>
          <ScrollVelocityRow baseVelocity={8}>
            <span>THOUGHTFUL MOTION • EVERYDAY INTERFACES • </span>
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </div>
    </div>
  );
}
