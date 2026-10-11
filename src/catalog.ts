// This file guarantees a stable, searchable catalogue of independent motion demos.
export const categories = [
  "All",
  "Essential",
  "AI Agents",
  "Effects",
  "Texts",
] as const;
export type Category = (typeof categories)[number];
export type SortOrder = "featured" | "az" | "za";
/** A demo describes one observable interaction and its source example. */
export interface MotionDemo {
  id: string;
  title: string;
  description: string;
  category: Exclude<Category, "All">;
  kind: string;
}
export const demos: MotionDemo[] = [
  // Primary actions
  {
    id: "pulsating-button",
    title: "Pulsating Button",
    description: "A gentle pulse or expanding ripple around a call to action.",
    category: "Essential",
    kind: "component",
  },
  {
    id: "interactive-hover-button",
    title: "Interactive Hover Button",
    description: "A expanding color dot reveals an arrow and action label.",
    category: "Essential",
    kind: "component",
  },
  {
    id: "rainbow-button",
    title: "Rainbow Button",
    description: "An animated spectrum glows around the button border.",
    category: "Essential",
    kind: "component",
  },
  {
    id: "delete-button",
    title: "Delete Button",
    category: "Essential",
    description: "Animated deletion feedback with a folding lid.",
    kind: "ai",
  },

  // Reactions and confirmation
  {
    id: "like",
    title: "Like button",
    description: "A little love goes a long way.",
    category: "Effects",
    kind: "like",
  },
  {
    id: "emoji-reaction",
    title: "Emoji Reaction",
    category: "Effects",
    description: "A reaction picker with a particle celebration.",
    kind: "ai",
  },
  {
    id: "icon-swap",
    title: "Icon swap",
    description: "A new icon, without the hard cut.",
    category: "Effects",
    kind: "icons",
  },
  {
    id: "success",
    title: "Success check",
    description: "The satisfying finish to a task.",
    category: "Essential",
    kind: "success",
  },
  {
    id: "confetti",
    title: "Confetti burst",
    description: "Make the small wins feel bigger.",
    category: "Effects",
    kind: "confetti",
  },

  // Selection and appearance
  {
    id: "checkbox",
    title: "Checkbox check",
    description: "One small check. All the difference.",
    category: "Essential",
    kind: "checkbox",
  },
  {
    id: "switch",
    title: "Spring toggle",
    description: "A switch with a softer landing.",
    category: "Essential",
    kind: "toggle",
  },
  {
    id: "animated-theme-toggler",
    title: "Animated Theme Toggler",
    description: "Switch light and dark with a reveal from the toggle.",
    category: "Essential",
    kind: "component",
  },

  // Menus and navigation
  {
    id: "dropdown",
    title: "Dropdown reveal",
    description: "A menu that opens from its origin.",
    category: "Essential",
    kind: "menu",
  },
  {
    id: "quick-actions",
    title: "Quick actions",
    description: "One button. A few possibilities.",
    category: "Effects",
    kind: "plus",
  },
  {
    id: "gooey-nav",
    title: "Gooey Navigation",
    category: "Effects",
    description: "Liquid navigation with a connected active pill.",
    kind: "ai",
  },
  {
    id: "dock",
    title: "Dock",
    description: "A spring dock that follows your pointer and focus.",
    category: "Essential",
    kind: "dock",
  },
  {
    id: "sliding-tabs",
    title: "Sliding tabs",
    description: "An indicator that follows your lead.",
    category: "Essential",
    kind: "tabs",
  },
  {
    id: "hook-sidebar",
    title: "Hook Sidebar",
    category: "Essential",
    description: "A sidebar with a springing active-item rail.",
    kind: "ai",
  },
  {
    id: "rail-toc",
    title: "Rail TOC",
    category: "Essential",
    description: "A travelling rail that follows the active section.",
    kind: "ai",
  },
  {
    id: "scroll-progress",
    title: "Scroll Progress",
    category: "Essential",
    description: "Reading progress and section navigation.",
    kind: "ai",
  },
  {
    id: "file-tree",
    title: "File Tree",
    description:
      "Explore nested folders and select a file with native disclosure controls.",
    category: "Essential",
    kind: "component",
  },

  // Expanding surfaces and notifications
  {
    id: "card-resize",
    title: "Card resize",
    description: "A little space. A smooth change.",
    category: "Essential",
    kind: "resize",
  },
  {
    id: "image-open-tilt",
    title: "Image Zoom",
    description: "An image opens in place with a smooth, straight zoom.",
    category: "Effects",
    kind: "library",
  },
  {
    id: "tilt-3d",
    title: "3D Tilt",
    description: "A card follows your pointer with a little perspective.",
    category: "Effects",
    kind: "library",
  },
  {
    id: "accordion",
    title: "Accordion",
    description: "More detail, less interruption.",
    category: "Essential",
    kind: "accordion",
  },
  {
    id: "panel",
    title: "Panel reveal",
    description: "Details slide into place.",
    category: "Essential",
    kind: "panel",
  },
  {
    id: "modal",
    title: "Modal entrance",
    description: "A softer way to enter the spotlight.",
    category: "Essential",
    kind: "modal",
  },
  {
    id: "tooltip",
    title: "Tooltip travel",
    description: "Helpful hints that move with you.",
    category: "Essential",
    kind: "tooltip",
  },
  {
    id: "toast",
    title: "Toast entrance",
    description: "Good news, delivered softly.",
    category: "Essential",
    kind: "toast",
  },
  {
    id: "animated-list",
    title: "Animated List",
    description: "A sequence of activity cards arrives with a gentle spring.",
    category: "Essential",
    kind: "library",
  },
  {
    id: "notification-bell",
    title: "Notification Bell",
    category: "Essential",
    description: "A swinging bell with rolling notification digits.",
    kind: "ai",
  },

  // Inputs and agent conversations
  {
    id: "clear-input",
    title: "Clear input",
    description: "Let your words gently disappear.",
    category: "Texts",
    kind: "clear",
  },
  {
    id: "input-shake",
    title: "Input shake",
    description: "A little nudge when something is off.",
    category: "Essential",
    kind: "shake",
  },
  {
    id: "otp-input",
    title: "OTP Input",
    description:
      "Code entry with rolling characters, paste, and status feedback.",
    category: "Essential",
    kind: "library",
  },
  {
    id: "ai-prompt-bar",
    title: "Prompt Bar",
    description: "Sources, commands, models, and a rich composer.",
    category: "AI Agents",
    kind: "ai",
  },
  {
    id: "ai-chat",
    title: "Agent Chat",
    description: "Tabbed agent replies and a prompt composer.",
    category: "AI Agents",
    kind: "ai",
  },
  {
    id: "ai-tool-chips",
    title: "Tool Chips",
    description: "Compact tool calls, results, and code previews.",
    category: "AI Agents",
    kind: "ai",
  },
  {
    id: "terminal",
    title: "Terminal",
    description:
      "A readable terminal preview with sequenced output and typing.",
    category: "AI Agents",
    kind: "library",
  },
  {
    id: "ai-context-cards",
    title: "Context Cards",
    description: "Retrieved knowledge chunks with their source context.",
    category: "AI Agents",
    kind: "ai",
  },
  {
    id: "ai-recommendation-card",
    title: "Recommendation Card",
    description: "Agent suggestions with confidence and approval actions.",
    category: "AI Agents",
    kind: "ai",
  },
  {
    id: "ai-approval-card",
    title: "Approval Card",
    description: "Human-in-the-loop questions before an agent acts.",
    category: "AI Agents",
    kind: "ai",
  },

  // Tasks and playback
  {
    id: "ai-task-rows",
    title: "Task Rows",
    description: "Live task progress from running to completed.",
    category: "AI Agents",
    kind: "ai",
  },
  {
    id: "task-list",
    title: "Task List",
    category: "AI Agents",
    description: "Tasks with spring checks and animated completion.",
    kind: "ai",
  },
  {
    id: "step-player",
    title: "Step Player",
    category: "Essential",
    description: "A playback control for a sequence of steps.",
    kind: "ai",
  },
  {
    id: "voice-note",
    title: "Voice Note",
    category: "AI Agents",
    description: "A waveform player with speed and seeking.",
    kind: "ai",
  },

  // Loading and thinking
  {
    id: "dot-loader",
    title: "Loading Indicators",
    description: "The original matrix and the complete loading.dev collection.",
    category: "AI Agents",
    kind: "loader",
  },
  {
    id: "skeleton",
    title: "Skeleton reveal",
    description: "From loading to ready, seamlessly.",
    category: "AI Agents",
    kind: "skeleton",
  },
  {
    id: "ai-loading-state",
    title: "Loading State",
    description: "Pixel-grid loader with shimmer and elapsed time.",
    category: "AI Agents",
    kind: "ai",
  },
  {
    id: "ai-thinking",
    title: "Thinking",
    description: "Expandable agent traces, reasoning, search, and coding.",
    category: "AI Agents",
    kind: "ai",
  },
  {
    id: "fluid-orb",
    title: "Fluid Orb",
    description: "A drifting fluid orb for voice and agent activity.",
    category: "AI Agents",
    kind: "library",
  },

  // Animated values
  {
    id: "number-flow",
    title: "Number flow",
    description: "Numbers with a spring in their step.",
    category: "Texts",
    kind: "count",
  },
  {
    id: "animated-counter",
    title: "Animated Counter",
    category: "Texts",
    description: "Smooth digit reels for changing values.",
    kind: "ai",
  },

  // Text motion and emphasis
  {
    id: "text-swap",
    title: "Text swap",
    description: "One state flows into the next.",
    category: "Texts",
    kind: "swap",
  },
  {
    id: "text-reveal",
    title: "Staggered text",
    description: "Give each line its own entrance.",
    category: "Texts",
    kind: "reveal",
  },
  {
    id: "streaming-text",
    title: "Streaming Words",
    description: "Words resolve in place through a soft, overlapping blur.",
    category: "AI Agents",
    kind: "library",
  },
  {
    id: "ai-streaming-text",
    title: "Streaming Text",
    description: "Streamed answers with sources, actions, and follow-ups.",
    category: "AI Agents",
    kind: "ai",
  },
  {
    id: "shimmer",
    title: "Thinking shimmer",
    description: "A quiet sign that ideas are forming.",
    category: "AI Agents",
    kind: "shimmer",
  },
  {
    id: "organic-shimmer",
    title: "Organic Shimmer",
    description: "A wavy light band travels with a soft edge glow.",
    category: "AI Agents",
    kind: "library",
  },
  {
    id: "scroll-based-velocity",
    title: "Scroll Based Velocity",
    description: "Two text streams change pace and direction as you scroll.",
    category: "Texts",
    kind: "component",
  },
  {
    id: "video-text",
    title: "Video Text",
    description: "Moving footage clipped inside bold, readable text.",
    category: "Texts",
    kind: "component",
  },
  {
    id: "aurora-text",
    title: "Aurora Text",
    description: "A living gradient adds color and movement to a phrase.",
    category: "Texts",
    kind: "library",
  },
  {
    id: "highlighter",
    title: "Highlighter",
    description: "Hand-drawn highlights, underlines, circles, and boxes.",
    category: "Effects",
    kind: "component",
  },

  // Reveal and edge effects
  {
    id: "grid-reveal",
    title: "Grid Reveal",
    category: "AI Agents",
    description: "Grid-based reveal for generated images.",
    kind: "ai",
  },
  {
    id: "progressive-blur",
    title: "Progressive Blur",
    description: "A soft blur gradient at the edges of scrollable content.",
    category: "Effects",
    kind: "blur",
  },
  {
    id: "shine-border",
    title: "Shine Border",
    description: "A moving light traces the border of a card.",
    category: "Effects",
    kind: "component",
  },
  {
    id: "border-beam",
    title: "Border Beam",
    description: "A moving light traces the border of a card.",
    category: "Effects",
    kind: "component",
  },
  {
    id: "card",
    title: "Card",
    description:
      "A pointer-following gradient border and optional glowing orb.",
    category: "Effects",
    kind: "component",
  },

  // Animated backgrounds
  {
    id: "dot-pattern",
    title: "Dot Pattern",
    description: "A responsive dot field with optional glowing pulses.",
    category: "Effects",
    kind: "component",
  },
  {
    id: "flickering-grid",
    title: "Flickering Grid",
    description:
      "A living grid of cells with gentle, randomized opacity changes.",
    category: "Effects",
    kind: "component",
  },
  {
    id: "glyph-matrix",
    title: "Glyph Matrix",
    description: "Subtly shifting glyphs in a responsive canvas field.",
    category: "Effects",
    kind: "component",
  },
  {
    id: "floating-3d-particles",
    title: "Floating 3D Particles",
    description:
      "An orbiting particle field with perspective and buoyant drift.",
    category: "Effects",
    kind: "component",
  },

  // Geographic visualizations
  {
    id: "dotted-map",
    title: "Dotted Map",
    description: "A dotted world map with customizable location markers.",
    category: "Effects",
    kind: "component",
  },
  {
    id: "globe",
    title: "Globe",
    description: "An interactive globe with dotted land and location markers.",
    category: "Effects",
    kind: "component",
  },

  // Device frames
  {
    id: "safari",
    title: "Safari",
    description: "A responsive Safari device frame for your app preview.",
    category: "Essential",
    kind: "component",
  },
  {
    id: "iphone",
    title: "iPhone",
    description: "A responsive iPhone device frame for your app preview.",
    category: "Essential",
    kind: "component",
  },
  {
    id: "android",
    title: "Android",
    description: "A responsive Android device frame for your app preview.",
    category: "Essential",
    kind: "component",
  },

  {
    id: "card-stack-hover",
    title: "Card Stack Hover",
    description: "A small collection fans out on hover and focus.",
    category: "Essential",
    kind: "library",
  },
];
/** Empty matches are a valid result; sorting never mutates the catalogue. */
export function filterDemos(
  query: string,
  category: Category,
  sort: SortOrder,
): MotionDemo[] {
  const term = query.trim().toLowerCase();
  const result = demos.filter(
    (d) =>
      (category === "All" || d.category === category) &&
      `${d.title} ${d.description}`.toLowerCase().includes(term),
  );
  if (sort !== "featured") {
    // Explicit sorting preserves the curated order until a user requests otherwise.
    result.sort(
      (a, b) => a.title.localeCompare(b.title) * (sort === "az" ? 1 : -1),
    );
  }
  return result;
}
