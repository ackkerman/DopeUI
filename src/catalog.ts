// This file guarantees a stable, searchable catalogue of independent motion demos.
export const categories = [
  "All",
  "Essential",
  "Buttons",
  "AI Agents",
  "Effects",
  "Images",
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
  /** Additional discovery groups share the same entry, source, and detail URL. */
  additionalCategories?: readonly Exclude<Category, "All">[];
  kind: string;
}
export const demos: MotionDemo[] = [
  // Primary actions
  {
    id: "pulsating-button",
    title: "Pulse Button",
    description: "A gentle pulse or expanding ripple around a call to action.",
    category: "Buttons",
    kind: "component",
  },
  {
    id: "interactive-hover-button",
    title: "Hover Button",
    description: "A expanding color dot reveals an arrow and action label.",
    category: "Buttons",
    kind: "component",
  },
  {
    id: "rainbow-button",
    title: "Rainbow Button",
    description: "An animated spectrum glows around the button border.",
    category: "Buttons",
    kind: "component",
  },
  {
    id: "delete-button",
    title: "Delete Button",
    category: "Buttons",
    description: "Animated deletion feedback with a folding lid.",
    kind: "ai",
  },

  // Reactions and confirmation
  {
    id: "like",
    title: "Like Button",
    description: "A little love goes a long way.",
    category: "Buttons",
    kind: "like",
  },
  {
    id: "emoji-reaction",
    title: "Emoji Reaction",
    category: "Buttons",
    description: "A reaction picker with a particle celebration.",
    kind: "ai",
  },
  {
    id: "icon-swap",
    title: "Icon Swap",
    description: "A new icon, without the hard cut.",
    category: "Buttons",
    kind: "icons",
  },
  {
    id: "success",
    title: "Success Check",
    description: "The satisfying finish to a task.",
    category: "Essential",
    kind: "success",
  },
  {
    id: "confetti",
    title: "Confetti Burst",
    description: "Make the small wins feel bigger.",
    category: "Effects",
    kind: "confetti",
  },

  // Selection and appearance
  {
    id: "checkbox",
    title: "Checkbox",
    description: "One small check. All the difference.",
    category: "Essential",
    kind: "checkbox",
  },
  {
    id: "switch",
    title: "Spring Switch",
    description: "A switch with a softer landing.",
    category: "Essential",
    kind: "toggle",
  },
  {
    id: "animated-theme-toggler",
    title: "Theme Toggle",
    description: "Switch light and dark with a reveal from the toggle.",
    category: "Essential",
    kind: "component",
  },

  // Menus and navigation
  {
    id: "dropdown",
    title: "Dropdown",
    description: "A menu that opens from its origin.",
    category: "Essential",
    kind: "menu",
  },
  {
    id: "quick-actions",
    title: "Quick Actions",
    description: "One button. A few possibilities.",
    category: "Buttons",
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
    title: "Sliding Tabs",
    description: "An indicator that follows your lead.",
    category: "Essential",
    kind: "tabs",
  },
  {
    id: "hook-sidebar",
    title: "Collapsible Sidebar",
    category: "Essential",
    description: "A sidebar with a springing active-item rail.",
    kind: "ai",
  },
  {
    id: "rail-toc",
    title: "Table of Contents",
    category: "Essential",
    description: "A travelling rail that follows the active section.",
    kind: "ai",
  },
  {
    id: "preview-rail",
    title: "Preview Rail",
    description:
      "Compact navigation ticks reveal a floating destination preview.",
    category: "Essential",
    kind: "component",
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
  {
    id: "code-block",
    title: "Code Block",
    description:
      "Readable code with file tabs, line highlights, and one-click copying.",
    category: "Essential",
    kind: "content",
  },

  // Expanding surfaces and notifications
  {
    id: "card-resize",
    title: "Resizable Card",
    description: "A little space. A smooth change.",
    category: "Essential",
    kind: "resize",
  },
  {
    id: "arrow",
    title: "Arrow",
    description: "Simple, handdrawn, bold, or brushed. Connect ideas your way.",
    category: "Essential",
    kind: "component",
  },
  {
    id: "decorative-arrow",
    title: "Decorative Arrow",
    description: "A handdrawn loop, a sweeping curve. Drop an arrow anywhere.",
    category: "Essential",
    kind: "component",
  },
  {
    id: "social-marquee",
    title: "Social Marquee",
    description:
      "Social posts in two seamless rows, moving in opposite directions.",
    category: "Essential",
    kind: "component",
  },
  {
    id: "logo-marquee",
    title: "Logo Marquee",
    description:
      "Company logos in a seamless loop. Pause, reverse, or set the pace.",
    category: "Images",
    kind: "component",
  },
  {
    id: "image-open-tilt",
    title: "Image Zoom",
    description: "An image opens in place with a smooth, straight zoom.",
    category: "Images",
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
    id: "card-folder",
    title: "Card Folder",
    description: "A stitched pocket folds away as a card lifts into view.",
    category: "Effects",
    kind: "component",
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
    title: "Expandable Panel",
    description: "Details slide into place.",
    category: "Essential",
    kind: "panel",
  },
  {
    id: "modal",
    title: "Modal",
    description: "A softer way to enter the spotlight.",
    category: "Essential",
    kind: "modal",
  },
  {
    id: "tooltip",
    title: "Tooltip",
    description: "Helpful hints that move with you.",
    category: "Essential",
    kind: "tooltip",
  },
  {
    id: "toast",
    title: "Toast",
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
    title: "Clearable Input",
    description: "Let your words gently disappear.",
    category: "Texts",
    kind: "clear",
  },
  {
    id: "input-shake",
    title: "Shake Input",
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
    title: "Loading Indicator",
    description: "The original matrix and the complete loading.dev collection.",
    category: "AI Agents",
    kind: "loader",
  },
  {
    id: "skeleton",
    title: "Skeleton",
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
    title: "Thinking Indicator",
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
    title: "Number Flow",
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
    title: "Text Swap",
    description: "One state flows into the next.",
    category: "Texts",
    kind: "swap",
  },
  {
    id: "text-reveal",
    title: "Staggered Text",
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
    title: "Shimmer Text",
    description: "A quiet sign that ideas are forming.",
    category: "AI Agents",
    kind: "shimmer",
  },
  {
    id: "organic-shimmer",
    title: "Organic Shimmer",
    description: "A wavy light band travels with a soft edge glow.",
    category: "Images",
    kind: "library",
  },
  {
    id: "scroll-based-velocity",
    title: "Scroll Velocity Text",
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
    title: "Text Highlighter",
    description: "Hand-drawn highlights, underlines, circles, and boxes.",
    category: "Effects",
    kind: "component",
  },

  // Reveal and edge effects
  {
    id: "grid-reveal",
    title: "Grid Reveal",
    category: "Images",
    description: "Grid-based reveal for generated images.",
    kind: "ai",
  },
  {
    id: "image-generation",
    title: "Image Generation",
    description:
      "A moving dot field reveals an image through generation and refinement.",
    category: "Images",
    additionalCategories: ["AI Agents"],
    kind: "component",
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
    title: "Shimmer Border",
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
    title: "Motion Card",
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
    title: "3D Particles",
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
    title: "Browser Frame",
    description: "A responsive Safari device frame for your app preview.",
    category: "Essential",
    kind: "component",
  },
  {
    id: "iphone",
    title: "iPhone Frame",
    description: "A responsive iPhone device frame for your app preview.",
    category: "Essential",
    kind: "component",
  },
  {
    id: "android",
    title: "Android Frame",
    description: "A responsive Android device frame for your app preview.",
    category: "Essential",
    kind: "component",
  },

  {
    id: "card-stack-hover",
    title: "Hover Card Stack",
    description: "A small collection fans out on hover and focus.",
    category: "Images",
    kind: "library",
  },
];
/** All includes each entry once; primary and additional groups resolve to the same demo. */
export function demoMatchesCategory(
  demo: MotionDemo,
  category: Category,
): boolean {
  return (
    category === "All" ||
    demo.category === category ||
    Boolean(demo.additionalCategories?.includes(category))
  );
}

/** Empty matches are a valid result; sorting never mutates the catalogue. */
export function filterDemos(
  query: string,
  category: Category,
  sort: SortOrder,
): MotionDemo[] {
  const term = query.trim().toLowerCase();
  const result = demos.filter(
    (d) =>
      demoMatchesCategory(d, category) &&
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
