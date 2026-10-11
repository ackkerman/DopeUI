"use client";
// This file guarantees the preview and copyable application example use the same component.
// This file guarantees the examples compose canonical UI components with shared, local state.
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MoreHorizontal } from "lucide-react";
import { NotificationBell } from "../../library/components/notification-bell";
import { VoiceNote } from "../../library/components/voice-note";
import { EmojiReaction } from "../../library/components/emoji-reaction";
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
function Person({
  name = "Jamie Davis",
  detail = "Designing the little details.",
}: {
  name?: string;
  detail?: string;
}) {
  return (
    <div className={cn("sc-person")}>
      <span className={cn("sc-avatar")}>
        {name
          .split(" ")
          .map((word) => word[0])
          .join("")}
      </span>
      <div>
        <strong>{name}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}
export default function VoiceInbox() {
  const [heard, setHeard] = useState(false);
  const [reaction, setReaction] = useState("");
  return (
    <div className={cn("sc-app sc-voice")} data-component-layout="interaction">
      <AppTitle label="Your inbox">
        <NotificationBell count={heard ? 0 : 1} size={18} />
      </AppTitle>
      <Person name="Mia Chen" detail="Left you a voice note · 2 min ago" />
      <div className={cn("sc-voice-bubble")}>
        <VoiceNote
          duration={18}
          bars={28}
          size="sm"
          onPlayingChange={(playing) => {
            if (playing) setHeard(true);
          }}
        />
        <p>Some thoughts on the new direction.</p>
      </div>
      <div className={cn("sc-reaction-row")}>
        <EmojiReaction size="sm" onReact={setReaction} />
        <span>
          {reaction
            ? "Reaction added"
            : heard
              ? "Listened"
              : "A little feedback?"}
        </span>
      </div>
    </div>
  );
}
