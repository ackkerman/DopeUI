"use client";
// This file guarantees the preview and copyable application example use the same component.
// This file guarantees the examples compose canonical UI components with shared, local state.
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MoreHorizontal } from "lucide-react";
import { NotificationBell } from "../../library/components/notification-bell";
import { EmojiReaction } from "../../library/components/emoji-reaction";
import { ProgressiveBlur } from "../../library/components/progressive-blur";
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
export default function SocialMoment() {
  const [reaction, setReaction] = useState("");
  const [unread, setUnread] = useState(2);
  return (
    <div className={cn("sc-app sc-social")} data-component-layout="interaction">
      <AppTitle label="From the team">
        <NotificationBell
          count={unread}
          size={18}
          onClick={() => setUnread(0)}
        />
      </AppTitle>
      <Person
        name="Jamie Davis"
        detail="Shared a little milestone · just now"
      />
      <p>
        First draft, out in the world.
        <br />
        It's the little details that make it feel right.
      </p>
      <div className={cn("sc-social-art")}>
        <div>
          make
          <br />
          <span>something.</span>
        </div>
        <ProgressiveBlur height="28%" />
      </div>
      <div className={cn("sc-reaction-row")}>
        <EmojiReaction size="sm" onReact={setReaction} />
        <span>
          {reaction ? "You reacted to this update" : "8 people liked this"}
        </span>
      </div>
    </div>
  );
}
