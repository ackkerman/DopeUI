"use client";
// This file guarantees the preview and copyable application example use the same component.
// This file guarantees the examples compose canonical UI components with shared, local state.
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MoreHorizontal } from "lucide-react";
import SpringToggle from "../../library/components/switch";
import Success from "../../library/components/success";
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
export default function AccountPreferences() {
  const [email, setEmail] = useState(true);
  const [updates, setUpdates] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <div className={cn("sc-app sc-settings")}>
      <AppTitle label="A workspace that fits" />
      <Person name="Alex Morgan" detail="Personal account" />
      <div className={cn("sc-setting-row")}>
        <div>
          <strong>Email notifications</strong>
          <small>Only the important things.</small>
        </div>
        <SpringToggle
          checked={email}
          onCheckedChange={(value) => {
            setEmail(value);
            setSaved(false);
          }}
          aria-label="Email notifications"
        />
      </div>
      <div className={cn("sc-setting-row")}>
        <div>
          <strong>Product updates</strong>
          <small>A little inspiration, occasionally.</small>
        </div>
        <SpringToggle
          checked={updates}
          onCheckedChange={(value) => {
            setUpdates(value);
            setSaved(false);
          }}
          aria-label="Product updates"
        />
      </div>
      <div className={cn("sc-settings-save")}>
        <button
          className={cn("sc-button")}
          type="button"
          onClick={() => setSaved(true)}
        >
          {saved ? "Preferences saved" : "Save preferences"}
        </button>
        <Success className={cn("sc-save-check")} complete={saved} disabled />
      </div>
    </div>
  );
}
