"use client";
// This file guarantees the preview and copyable application example use the same component.
// This file guarantees the examples compose canonical UI components with shared, local state.
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Command, Home, Mail, User } from "lucide-react";
import { Dock, DockIcon } from "../../library/components/dock";
import Modal from "../../library/components/modal";
import "../showcase-previews.css";
function cn(...values: ClassValue[]) {
  return twMerge(clsx(values));
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
export default function AppLaunchpad() {
  const [selected, setSelected] = useState<string | null>(null);
  const apps = [
    { name: "Home", Icon: Home },
    { name: "Inbox", Icon: Mail },
    { name: "Projects", Icon: Command },
    { name: "Profile", Icon: User },
  ];
  return (
    <div className={cn("sc-launchpad")} data-component-layout="interaction">
      <span className={cn("sc-kicker")}>LESS SEARCHING. MORE MAKING.</span>
      <h3>Your next move.</h3>
      <Dock direction="middle" className={cn("sc-dock")}>
        {apps.map(({ name, Icon }) => (
          <DockIcon key={name} className={cn("sc-dock-icon")}>
            <button
              type="button"
              aria-label={`Open ${name}`}
              onClick={() => setSelected(name)}
            >
              <Icon size={20} />
            </button>
          </DockIcon>
        ))}
      </Dock>
      <p>Everything you need, close by.</p>
      <Modal
        className={cn("sc-launch-modal")}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={selected ?? "Workspace"}
        description="A place for the next good idea."
      >
        <div className={cn("sc-modal-content")}>
          <Person
            name="Alex Morgan"
            detail={`${selected ?? "Your"} workspace is ready.`}
          />
          <p>Close this window to explore another destination.</p>
        </div>
      </Modal>
    </div>
  );
}
