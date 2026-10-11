// This file guarantees the color example uses canonical library components and live state.
import { useState } from "react";
import { cn } from "./class-names";
import { HookSidebar } from "./library/components/hook-sidebar";
import { TaskList, type Task } from "./library/components/task-list";
import { NotificationBell } from "./library/components/notification-bell";
import { AnimatedCounter } from "./library/components/animated-counter";
import type { FrostBrand, FrostTheme } from "./library/frost-colors";
/** Theme and brand affect this workspace without recoloring the documentation shell. */
export interface FrostExampleProps {
  theme: FrostTheme;
  brand: FrostBrand;
}
export function FrostExample({ theme, brand }: FrostExampleProps) {
  const [section, setSection] = useState(0);
  const [notifications, setNotifications] = useState(3);
  const [revenue, setRevenue] = useState(128430);
  const [tasks, setTasks] = useState<Task[]>([
    { id: "research", label: "Review the brief", done: true },
    { id: "draft", label: "Explore the first direction" },
    { id: "handoff", label: "Prepare the handoff" },
  ]);
  const completed = tasks.filter((task) => task.done).length;
  const sections = ["Overview", "Projects", "Activity", "Settings"];
  return (
    <div
      className={cn("frost-example", theme === "dark" && "dark")}
      data-frost
      data-theme={theme}
      data-brand={brand}
    >
      <aside className={cn("frost-example-sidebar")}>
        <strong>
          Nordic Workspace<span>✳</span>
        </strong>
        <HookSidebar
          items={sections}
          value={section}
          onChange={setSection}
          color="var(--frost-primary)"
          label="Workspace"
        />
        <div className={cn("frost-example-sidebar-note")}>
          Project Aurora<small>Design workspace</small>
        </div>
      </aside>
      <div className={cn("frost-example-content")}>
        <header className={cn("frost-example-header")}>
          <div>
            <span>Workspace / {sections[section]}</span>
            <h3>{section === 0 ? "Project Aurora" : sections[section]}</h3>
          </div>
          <NotificationBell
            count={notifications}
            onClick={() => setNotifications(0)}
            className={cn("frost-example-bell")}
            size={38}
          />
        </header>
        <div className={cn("frost-example-metrics")}>
          <div>
            <span>Monthly revenue</span>
            <AnimatedCounter
              value={revenue}
              prefix="$"
              className={cn("frost-example-number")}
            />
            <small>↗ 18.6% this month</small>
          </div>
          <div>
            <span>Active users</span>
            <AnimatedCounter
              value={8492}
              className={cn("frost-example-number")}
            />
            <small>+12.4% from last month</small>
          </div>
        </div>
        <section className={cn("frost-example-project")}>
          <div className={cn("frost-example-project-heading")}>
            <div>
              <h4>Ready for the next step.</h4>
              <p>Keep the little details moving.</p>
            </div>
            <span className={cn("frost-example-badge")}>
              {completed} / 3 complete
            </span>
          </div>
          <TaskList
            tasks={tasks}
            onTasksChange={setTasks}
            accent="var(--frost-primary)"
            size="sm"
          />
          <div className={cn("frost-example-actions")}>
            <button
              type="button"
              className={cn("frost-primary-button")}
              onClick={() => {
                setNotifications((n) => n + 1);
                setRevenue((n) => n + 125);
              }}
            >
              Add update →
            </button>
            <button
              type="button"
              className={cn("frost-secondary-button")}
              onClick={() =>
                setTasks((current) =>
                  current.map((task) => ({ ...task, done: true })),
                )
              }
            >
              AI complete
            </button>
          </div>
        </section>
        <p className={cn("frost-example-message")}>
          ● Your workspace is up to date.
        </p>
      </div>
    </div>
  );
}
