"use client";
// This file guarantees the preview and copyable application example use the same component.
// This file guarantees the examples compose canonical UI components with shared, local state.
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MoreHorizontal } from "lucide-react";
import { TaskList, type Task } from "../../library/components/task-list";
import { NotificationBell } from "../../library/components/notification-bell";
import { AnimatedCounter } from "../../library/components/animated-counter";
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
export default function ProjectChecklist() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "brief", label: "Write the project brief", done: true },
    { id: "layout", label: "Review the layout", done: false },
    { id: "motion", label: "Fine-tune the motion", done: false },
    { id: "ship", label: "Ship something good", done: false },
  ]);
  const completed = tasks.filter((task) => task.done).length;
  return (
    <div
      className={cn("sc-app sc-project")}
      data-component-layout="interaction"
    >
      <AppTitle label="This week's focus">
        <NotificationBell count={4 - completed} size={18} />
      </AppTitle>
      <div className={cn("sc-project-summary")}>
        <span>Brand refresh</span>
        <span>
          <AnimatedCounter value={completed} /> / 4 complete
        </span>
      </div>
      <div className={cn("sc-progress-track")}>
        <i style={{ width: `${completed * 25}%` }} />
      </div>
      <TaskList tasks={tasks} onTasksChange={setTasks} size="sm" />
      <p className={cn("sc-muted sc-bottom-note")}>
        A little progress goes a long way.
      </p>
    </div>
  );
}
