"use client";
// This file guarantees the preview and copyable application example use the same component.
// This file guarantees the examples compose canonical UI components with shared, local state.
import { useEffect, useRef, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Image, MoreHorizontal } from "lucide-react";
import AiPromptBar from "../../library/components/ai-prompt-bar";
import { GridReveal } from "../../library/components/grid-reveal";
import "../showcase-previews.css";
const photo =
  "https://images.unsplash.com/photo-1779896412176-45c509bbee35?auto=format&fit=max&w=1000&q=80";
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
export default function ImageStudio() {
  const [ready, setReady] = useState(true);
  const [caption, setCaption] = useState("Weekend, captured.");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const reveal = (text: string) => {
    if (timer.current) clearTimeout(timer.current);
    setCaption(text);
    setReady(false);
    timer.current = setTimeout(() => setReady(true), 1400);
  };
  return (
    <div className={cn("sc-app sc-image")} data-component-layout="interaction">
      <AppTitle label="Image studio">
        <Image size={16} />
      </AppTitle>
      <GridReveal
        src={ready ? photo : null}
        aspect={1.5}
        estimatedDuration={1400}
        alt="Two friends taking a selfie in a car"
        caption={ready ? "Preview ready" : "Preparing preview"}
      />
      <p className={cn("sc-muted")}>{caption}</p>
      <AiPromptBar
        demo={false}
        tall
        placeholder="Name this preview…"
        onSend={reveal}
      />
    </div>
  );
}
