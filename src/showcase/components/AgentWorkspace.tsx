"use client";
// This file guarantees the preview and copyable application example use the same component.
// This file guarantees the examples compose canonical UI components with shared, local state.
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Check, FileText, MoreHorizontal } from "lucide-react";
import AiPromptBar from "../../library/components/ai-prompt-bar";
import AiApprovalCard from "../../library/components/ai-approval-card";
import { TaskList, type Task } from "../../library/components/task-list";
import { NotificationBell } from "../../library/components/notification-bell";
import { HookSidebar } from "../../library/components/hook-sidebar";
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
export default function AgentWorkspace() {
  const [tab, setTab] = useState(0);
  const [brief, setBrief] = useState("");
  const [phase, setPhase] = useState<"idle" | "review" | "done">("idle");
  const [seen, setSeen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: "context", label: "Gather the context", done: true },
    { id: "draft", label: "Draft the campaign", done: false },
    { id: "review", label: "Review the details", done: false },
  ]);
  const approve = () => {
    setPhase("done");
    setTasks((current) => current.map((task) => ({ ...task, done: true })));
  };
  return (
    <div className={cn("sc-app sc-agent")} data-component-layout="interaction">
      <AppTitle label="Studio / Campaign">
        <span className={cn("sc-status-dot")}>Workspace</span>
        <NotificationBell
          count={phase === "done" && !seen ? 1 : 0}
          size={19}
          onClick={() => setSeen(true)}
        />
      </AppTitle>
      <div className={cn("sc-agent-layout")}>
        <aside>
          <span className={cn("sc-kicker")}>YOUR WORKSPACE</span>
          <HookSidebar
            items={["Overview", "Sources", "Runs"]}
            value={tab}
            onChange={setTab}
          />
          <Person name="Alex Morgan" detail="Workspace" />
        </aside>
        <div className={cn("sc-agent-main")}>
          {tab === 0 ? (
            <>
              <span className={cn("sc-kicker")}>MAKE SOMETHING GOOD</span>
              <h3>
                A little direction.
                <br />A lot of possibility.
              </h3>
              {phase === "done" ? (
                <div className={cn("sc-approved")} role="status">
                  <Check size={18} />
                  Campaign brief approved.
                </div>
              ) : (
                <p>
                  {brief ||
                    "Give your next project a thoughtful starting point."}
                </p>
              )}
              <TaskList tasks={tasks} onTasksChange={setTasks} size="sm" />
              {phase === "review" ? (
                <AiApprovalCard
                  questions={[
                    {
                      q: "Ready to move forward?",
                      type: "radio",
                      options: ["Approve the direction", "Keep exploring"],
                    },
                  ]}
                  labels={{
                    send: "Approve",
                    continue: "Review",
                    sentMessage: "Direction approved",
                  }}
                  onSubmitted={approve}
                  resettable={false}
                />
              ) : (
                <AiPromptBar
                  demo={false}
                  placeholder="Describe your next campaign…"
                  onSend={(text) => {
                    setBrief(text);
                    setPhase("review");
                    setSeen(false);
                    setTasks((current) =>
                      current.map((task) =>
                        task.id === "draft" ? { ...task, done: true } : task,
                      ),
                    );
                  }}
                />
              )}
            </>
          ) : (
            <>
              <span className={cn("sc-kicker")}>
                {tab === 1 ? "PROJECT CONTEXT" : "RECENT ACTIVITY"}
              </span>
              <h3>
                {tab === 1
                  ? "A place for the details."
                  : "Every step, in view."}
              </h3>
              {["Campaign brief", "Brand guidelines", "Audience notes"].map(
                (name, i) => (
                  <div className={cn("sc-file")} key={name}>
                    <FileText size={16} />
                    <span>{name}</span>
                    <small>
                      {tab === 1
                        ? "Document"
                        : i === 0 && phase === "done"
                          ? "Approved"
                          : "Available"}
                    </small>
                  </div>
                ),
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
