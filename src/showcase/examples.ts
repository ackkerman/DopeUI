// This file guarantees each application example names the real components it composes.
export const exampleCategories = [
  "All examples",
  "AI Agents",
  "Workspace",
  "Media",
  "Marketing",
] as const;
export type ExampleCategory = (typeof exampleCategories)[number];
/** An example describes an interactive composition and the canonical pieces required to reproduce it. */
export interface ShowcaseExample {
  id: string;
  title: string;
  description: string;
  category: Exclude<ExampleCategory, "All examples">;
  exportName: string;
  components: readonly string[];
  featured?: boolean;
}
export const examples: ShowcaseExample[] = [
  {
    id: "agent-workspace",
    title: "Agent workspace",
    description: "From a brief to an approved plan.",
    category: "AI Agents",
    exportName: "AgentWorkspace",
    components: [
      "ai-prompt-bar",
      "ai-approval-card",
      "task-list",
      "hook-sidebar",
      "notification-bell",
    ],
    featured: true,
  },
  {
    id: "live-analytics",
    title: "Live analytics",
    description: "A clearer view of the numbers.",
    category: "Workspace",
    exportName: "AnalyticsPanel",
    components: ["animated-counter", "sliding-tabs"],
  },
  {
    id: "project-checklist",
    title: "Project checklist",
    description: "Small tasks. Visible progress.",
    category: "Workspace",
    exportName: "ProjectChecklist",
    components: ["task-list", "notification-bell", "animated-counter"],
  },
  {
    id: "flexible-pricing",
    title: "Flexible pricing",
    description: "Switch billing without losing context.",
    category: "Marketing",
    exportName: "PricingPlans",
    components: ["switch", "card-resize", "animated-counter"],
  },
  {
    id: "reading-room",
    title: "Reading room",
    description: "Keep your place. Find the useful bits.",
    category: "Workspace",
    exportName: "ReadingRoom",
    components: [
      "rail-toc",
      "scroll-progress",
      "progressive-blur",
      "highlighter",
    ],
  },
  {
    id: "voice-inbox",
    title: "Voice inbox",
    description: "Listen, react, and clear your queue.",
    category: "Media",
    exportName: "VoiceInbox",
    components: ["voice-note", "emoji-reaction", "notification-bell"],
  },
  {
    id: "image-studio",
    title: "Image studio",
    description: "A prompt, a preview, a smooth reveal.",
    category: "AI Agents",
    exportName: "ImageStudio",
    components: ["ai-prompt-bar", "grid-reveal"],
  },
  {
    id: "app-launchpad",
    title: "App launchpad",
    description: "Your workspace, one click away.",
    category: "Workspace",
    exportName: "AppLaunchpad",
    components: ["dock", "modal"],
  },
  {
    id: "account-preferences",
    title: "Account preferences",
    description: "Settings that feel responsive.",
    category: "Workspace",
    exportName: "AccountPreferences",
    components: ["switch", "success"],
  },
  {
    id: "first-run",
    title: "A better first run",
    description: "Guide the next step. Make it count.",
    category: "Workspace",
    exportName: "FirstRunGuide",
    components: ["step-player", "success"],
  },
  {
    id: "social-moment",
    title: "A social moment",
    description: "Updates with a little personality.",
    category: "Media",
    exportName: "SocialMoment",
    components: ["emoji-reaction", "notification-bell", "progressive-blur"],
  },
  {
    id: "moving-headline",
    title: "A moving headline",
    description: "Motion built into the message.",
    category: "Marketing",
    exportName: "MovingHeadline",
    components: ["video-text", "scroll-based-velocity", "highlighter"],
    featured: true,
  },
];
/** Search and category both apply; filtering never modifies the curated list. */
export function filterExamples(query: string, category: ExampleCategory) {
  const term = query.trim().toLowerCase();
  return examples.filter(
    (example) =>
      (category === "All examples" || example.category === category) &&
      `${example.title} ${example.description} ${example.category}`
        .toLowerCase()
        .includes(term),
  );
}
