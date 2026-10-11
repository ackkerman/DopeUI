import ImageOpenTilt from "./components/image-open-tilt";
import StreamingText from "./components/streaming-text";
import OrganicShimmer from "./components/organic-shimmer";
import CardStackHover from "./components/card-stack-hover";
import Tilt3D from "./components/tilt-3d";
import OtpInputDemo from "./components/otp-input";
import FluidOrbDemo from "./components/fluid-orb";
import TerminalDemo from "./components/terminal";
import AnimatedListDemo from "./components/animated-list";
import AuroraTextDemo from "./components/aurora-text";
import GlobeDemo from "./components/globe";
import DottedMapDemo from "./components/dotted-map";
import BorderBeamDemo from "./components/border-beam";
import CardDemo from "./components/card";
import ShineBorderDemo from "./components/shine-border";
import AndroidDemo from "./components/android";
import IphoneDemo from "./components/iphone";
import SafariDemo from "./components/safari";
import RainbowButtonDemo from "./components/rainbow-button";
import FlickeringGridDemo from "./components/flickering-grid";
import GlyphMatrixDemo from "./components/glyph-matrix";
import InteractiveHoverButtonDemo from "./components/interactive-hover-button";
import PulsatingButtonDemo from "./components/pulsating-button";
import FileTreeDemo from "./components/file-tree";
import Floating3DParticlesDemo from "./components/floating-3d-particles";
import DotPatternDemo from "./components/dot-pattern";
import HighlighterDemo from "./components/highlighter";
import ScrollBasedVelocityDemo from "./components/scroll-based-velocity";
import VideoTextDemo from "./components/video-text";
import AnimatedThemeTogglerDemo from "./components/animated-theme-toggler";
import ProgressiveBlurDemo from "./components/progressive-blur";
import DockDemo from "./components/dock";
import type { ComponentType } from "react";
export const loadFoundation = () =>
  import("./foundation.txt?raw").then((module) => module.default);
import Accordion from "./components/accordion";
import AiApprovalCard from "./components/ai-approval-card";
import AiChat from "./components/ai-chat";
import AiContextCards from "./components/ai-context-cards";
import AiLoadingState from "./components/ai-loading-state";
import AiPromptBar from "./components/ai-prompt-bar";
import AiRecommendationCard from "./components/ai-recommendation-card";
import AiStreamingText from "./components/ai-streaming-text";
import AiTaskRows from "./components/ai-task-rows";
import AiThinking from "./components/ai-thinking";
import AiToolChips from "./components/ai-tool-chips";
import CardResize from "./components/card-resize";
import Checkbox from "./components/checkbox";
import ClearInput from "./components/clear-input";
import Confetti from "./components/confetti";
import DotLoader from "./components/dot-loader";
import Dropdown from "./components/dropdown";
import IconSwap from "./components/icon-swap";
import InputShake from "./components/input-shake";
import Like from "./components/like";
import Modal from "./components/modal";
import NotificationPop from "./components/notification-pop";
import NumberFlow from "./components/number-flow";
import Panel from "./components/panel";
import QuickActions from "./components/quick-actions";
import AnimatedCounterDemo from "./components/animated-counter";
import DeleteButtonDemo from "./components/delete-button";
import EmojiReactionDemo from "./components/emoji-reaction";
import GooeyNavDemo from "./components/gooey-nav";
import GridRevealDemo from "./components/grid-reveal";
import HookSidebarDemo from "./components/hook-sidebar";
import NotificationBellDemo from "./components/notification-bell";
import RailTocDemo from "./components/rail-toc";
import ScrollProgressDemo from "./components/scroll-progress";
import StepPlayerDemo from "./components/step-player";
import TaskListDemo from "./components/task-list";
import VoiceNoteDemo from "./components/voice-note";
import Shimmer from "./components/shimmer";
import Skeleton from "./components/skeleton";
import SlidingTabs from "./components/sliding-tabs";
import Success from "./components/success";
import Switch from "./components/switch";
import TextReveal from "./components/text-reveal";
import TextSwap from "./components/text-swap";
import Toast from "./components/toast";
import Tooltip from "./components/tooltip";
/** Each entry declares all npm dependencies and the shared Tailwind foundation. */
export interface LibraryEntry {
  Component: ComponentType<{ className?: string }>;
  loadSource: () => Promise<string>;
  filename: string;
  dependencies: readonly string[];
}
export const libraryEntries: Record<string, LibraryEntry> = {
  "organic-shimmer": {
    Component: OrganicShimmer,
    loadSource: () =>
      import("./distribution/organic-shimmer.tsx?raw").then(
        (module) => module.default,
      ),
    filename: "OrganicShimmer.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "card-stack-hover": {
    Component: CardStackHover,
    loadSource: () =>
      import("./distribution/card-stack-hover.tsx?raw").then(
        (module) => module.default,
      ),
    filename: "CardStackHover.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "image-open-tilt": {
    Component: ImageOpenTilt,
    loadSource: () =>
      import("./distribution/image-open-tilt.tsx?raw").then(
        (module) => module.default,
      ),
    filename: "ImageOpenTilt.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "tilt-3d": {
    Component: Tilt3D,
    loadSource: () =>
      import("./distribution/tilt-3d.tsx?raw").then((module) => module.default),
    filename: "Tilt3D.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "otp-input": {
    Component: OtpInputDemo,
    loadSource: () =>
      import("./distribution/otp-input.tsx?raw").then(
        (module) => module.default,
      ),
    filename: "OtpInputDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "fluid-orb": {
    Component: FluidOrbDemo,
    loadSource: () =>
      import("./distribution/fluid-orb.tsx?raw").then(
        (module) => module.default,
      ),
    filename: "FluidOrbDemo.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  terminal: {
    Component: TerminalDemo,
    loadSource: () =>
      import("./distribution/terminal.tsx?raw").then(
        (module) => module.default,
      ),
    filename: "TerminalDemo.tsx",
    dependencies: ["react", "lucide-react", "clsx", "tailwind-merge", "motion"],
  },
  "animated-list": {
    Component: AnimatedListDemo,
    loadSource: () =>
      import("./distribution/animated-list.tsx?raw").then(
        (module) => module.default,
      ),
    filename: "AnimatedListDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "aurora-text": {
    Component: AuroraTextDemo,
    loadSource: () =>
      import("./distribution/aurora-text.tsx?raw").then(
        (module) => module.default,
      ),
    filename: "AuroraTextDemo.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  globe: {
    Component: GlobeDemo,
    loadSource: () =>
      import("./distribution/globe.tsx?raw").then((m) => m.default),
    filename: "GlobeDemo.tsx",
    dependencies: ["react", "cobe", "motion", "clsx", "tailwind-merge"],
  },
  "dotted-map": {
    Component: DottedMapDemo,
    loadSource: () =>
      import("./distribution/dotted-map.tsx?raw").then((m) => m.default),
    filename: "DottedMapDemo.tsx",
    dependencies: [
      "react",
      "motion",
      "svg-dotted-map",
      "clsx",
      "tailwind-merge",
    ],
  },
  "border-beam": {
    Component: BorderBeamDemo,
    loadSource: () =>
      import("./distribution/border-beam.tsx?raw").then((m) => m.default),
    filename: "BorderBeamDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  card: {
    Component: CardDemo,
    loadSource: () =>
      import("./distribution/card.tsx?raw").then((m) => m.default),
    filename: "CardDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "shine-border": {
    Component: ShineBorderDemo,
    loadSource: () =>
      import("./distribution/shine-border.tsx?raw").then((m) => m.default),
    filename: "ShineBorderDemo.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  android: {
    Component: AndroidDemo,
    loadSource: () =>
      import("./distribution/android.tsx?raw").then((m) => m.default),
    filename: "AndroidDemo.tsx",
    dependencies: ["clsx", "tailwind-merge", "react"],
  },
  iphone: {
    Component: IphoneDemo,
    loadSource: () =>
      import("./distribution/iphone.tsx?raw").then((m) => m.default),
    filename: "IphoneDemo.tsx",
    dependencies: ["clsx", "tailwind-merge", "react"],
  },
  safari: {
    Component: SafariDemo,
    loadSource: () =>
      import("./distribution/safari.tsx?raw").then((m) => m.default),
    filename: "SafariDemo.tsx",
    dependencies: ["clsx", "tailwind-merge", "react"],
  },
  "rainbow-button": {
    Component: RainbowButtonDemo,
    loadSource: () =>
      import("./distribution/rainbow-button.tsx?raw").then((m) => m.default),
    filename: "RainbowButtonDemo.tsx",
    dependencies: [
      "react",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
  },
  "flickering-grid": {
    Component: FlickeringGridDemo,
    loadSource: () =>
      import("./distribution/flickering-grid.tsx?raw").then((m) => m.default),
    filename: "FlickeringGridDemo.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "glyph-matrix": {
    Component: GlyphMatrixDemo,
    loadSource: () =>
      import("./distribution/glyph-matrix.tsx?raw").then((m) => m.default),
    filename: "GlyphMatrixDemo.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "interactive-hover-button": {
    Component: InteractiveHoverButtonDemo,
    loadSource: () =>
      import("./distribution/interactive-hover-button.tsx?raw").then(
        (m) => m.default,
      ),
    filename: "InteractiveHoverButtonDemo.tsx",
    dependencies: ["react", "lucide-react", "clsx", "tailwind-merge"],
  },
  "pulsating-button": {
    Component: PulsatingButtonDemo,
    loadSource: () =>
      import("./distribution/pulsating-button.tsx?raw").then((m) => m.default),
    filename: "PulsatingButtonDemo.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "file-tree": {
    Component: FileTreeDemo,
    loadSource: () =>
      import("./distribution/file-tree.tsx?raw").then((m) => m.default),
    filename: "FileTreeDemo.tsx",
    dependencies: [
      "react",
      "@radix-ui/react-accordion",
      "lucide-react",
      "clsx",
      "tailwind-merge",
    ],
  },
  "floating-3d-particles": {
    Component: Floating3DParticlesDemo,
    loadSource: () =>
      import("./distribution/floating-3d-particles.tsx?raw").then(
        (m) => m.default,
      ),
    filename: "Floating3DParticlesDemo.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "dot-pattern": {
    Component: DotPatternDemo,
    loadSource: () =>
      import("./distribution/dot-pattern.tsx?raw").then((m) => m.default),
    filename: "DotPatternDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  highlighter: {
    Component: HighlighterDemo,
    loadSource: () =>
      import("./distribution/highlighter.tsx?raw").then((m) => m.default),
    filename: "HighlighterDemo.tsx",
    dependencies: [
      "react",
      "motion",
      "rough-notation",
      "clsx",
      "tailwind-merge",
    ],
  },
  "scroll-based-velocity": {
    Component: ScrollBasedVelocityDemo,
    loadSource: () =>
      import("./distribution/scroll-based-velocity.tsx?raw").then(
        (m) => m.default,
      ),
    filename: "ScrollBasedVelocityDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "video-text": {
    Component: VideoTextDemo,
    loadSource: () =>
      import("./distribution/video-text.tsx?raw").then((m) => m.default),
    filename: "VideoTextDemo.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "animated-theme-toggler": {
    Component: AnimatedThemeTogglerDemo,
    loadSource: () =>
      import("./distribution/animated-theme-toggler.tsx?raw").then(
        (m) => m.default,
      ),
    filename: "AnimatedThemeTogglerDemo.tsx",
    dependencies: [
      "react",
      "lucide-react",
      "react-dom",
      "clsx",
      "tailwind-merge",
    ],
  },
  "progressive-blur": {
    Component: ProgressiveBlurDemo,
    loadSource: () =>
      import("./distribution/progressive-blur.tsx?raw").then((m) => m.default),
    filename: "ProgressiveBlurDemo.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  dock: {
    Component: DockDemo,
    loadSource: () =>
      import("./distribution/dock.tsx?raw").then((m) => m.default),
    filename: "DockDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge", "lucide-react"],
  },
  accordion: {
    Component: Accordion,
    loadSource: () =>
      import("./distribution/accordion.tsx?raw").then((m) => m.default),
    filename: "Accordion.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "ai-approval-card": {
    Component: AiApprovalCard,
    loadSource: () =>
      import("./distribution/ai-approval-card.tsx?raw").then((m) => m.default),
    filename: "AiApprovalCard.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "ai-chat": {
    Component: AiChat,
    loadSource: () =>
      import("./distribution/ai-chat.tsx?raw").then((m) => m.default),
    filename: "AiChat.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "ai-context-cards": {
    Component: AiContextCards,
    loadSource: () =>
      import("./distribution/ai-context-cards.tsx?raw").then((m) => m.default),
    filename: "AiContextCards.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "ai-loading-state": {
    Component: AiLoadingState,
    loadSource: () =>
      import("./distribution/ai-loading-state.tsx?raw").then((m) => m.default),
    filename: "AiLoadingState.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "ai-prompt-bar": {
    Component: AiPromptBar,
    loadSource: () =>
      import("./distribution/ai-prompt-bar.tsx?raw").then((m) => m.default),
    filename: "AiPromptBar.tsx",
    dependencies: ["react", "glimm", "clsx", "tailwind-merge"],
  },
  "ai-recommendation-card": {
    Component: AiRecommendationCard,
    loadSource: () =>
      import("./distribution/ai-recommendation-card.tsx?raw").then(
        (m) => m.default,
      ),
    filename: "AiRecommendationCard.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "streaming-text": {
    Component: StreamingText,
    loadSource: () =>
      import("./distribution/streaming-text.tsx?raw").then((m) => m.default),
    filename: "StreamingText.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "ai-streaming-text": {
    Component: AiStreamingText,
    loadSource: () =>
      import("./distribution/ai-streaming-text.tsx?raw").then((m) => m.default),
    filename: "AiStreamingText.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "ai-task-rows": {
    Component: AiTaskRows,
    loadSource: () =>
      import("./distribution/ai-task-rows.tsx?raw").then((m) => m.default),
    filename: "AiTaskRows.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "ai-thinking": {
    Component: AiThinking,
    loadSource: () =>
      import("./distribution/ai-thinking.tsx?raw").then((m) => m.default),
    filename: "AiThinking.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "ai-tool-chips": {
    Component: AiToolChips,
    loadSource: () =>
      import("./distribution/ai-tool-chips.tsx?raw").then((m) => m.default),
    filename: "AiToolChips.tsx",
    dependencies: ["react", "lucide-react", "clsx", "tailwind-merge"],
  },
  "card-resize": {
    Component: CardResize,
    loadSource: () =>
      import("./distribution/card-resize.tsx?raw").then((m) => m.default),
    filename: "CardResize.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  checkbox: {
    Component: Checkbox,
    loadSource: () =>
      import("./distribution/checkbox.tsx?raw").then((m) => m.default),
    filename: "Checkbox.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "clear-input": {
    Component: ClearInput,
    loadSource: () =>
      import("./distribution/clear-input.tsx?raw").then((m) => m.default),
    filename: "ClearInput.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  confetti: {
    Component: Confetti,
    loadSource: () =>
      import("./distribution/confetti.tsx?raw").then((m) => m.default),
    filename: "Confetti.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "dot-loader": {
    Component: DotLoader,
    loadSource: () =>
      import("./distribution/dot-loader.tsx?raw").then((m) => m.default),
    filename: "DotLoader.tsx",
    dependencies: ["react", "loading-dev", "clsx", "tailwind-merge"],
  },
  dropdown: {
    Component: Dropdown,
    loadSource: () =>
      import("./distribution/dropdown.tsx?raw").then((m) => m.default),
    filename: "Dropdown.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "icon-swap": {
    Component: IconSwap,
    loadSource: () =>
      import("./distribution/icon-swap.tsx?raw").then((m) => m.default),
    filename: "IconSwap.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "input-shake": {
    Component: InputShake,
    loadSource: () =>
      import("./distribution/input-shake.tsx?raw").then((m) => m.default),
    filename: "InputShake.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  like: {
    Component: Like,
    loadSource: () =>
      import("./distribution/like.tsx?raw").then((m) => m.default),
    filename: "Like.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  modal: {
    Component: Modal,
    loadSource: () =>
      import("./distribution/modal.tsx?raw").then((m) => m.default),
    filename: "Modal.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "notification-pop": {
    Component: NotificationPop,
    loadSource: () =>
      import("./distribution/notification-pop.tsx?raw").then((m) => m.default),
    filename: "NotificationPop.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "number-flow": {
    Component: NumberFlow,
    loadSource: () =>
      import("./distribution/number-flow.tsx?raw").then((m) => m.default),
    filename: "NumberFlow.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  panel: {
    Component: Panel,
    loadSource: () =>
      import("./distribution/panel.tsx?raw").then((m) => m.default),
    filename: "Panel.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "quick-actions": {
    Component: QuickActions,
    loadSource: () =>
      import("./distribution/quick-actions.tsx?raw").then((m) => m.default),
    filename: "QuickActions.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "animated-counter": {
    Component: AnimatedCounterDemo,
    loadSource: () =>
      import("./distribution/animated-counter.tsx?raw").then((m) => m.default),
    filename: "AnimatedCounterDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "delete-button": {
    Component: DeleteButtonDemo,
    loadSource: () =>
      import("./distribution/delete-button.tsx?raw").then((m) => m.default),
    filename: "DeleteButtonDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "emoji-reaction": {
    Component: EmojiReactionDemo,
    loadSource: () =>
      import("./distribution/emoji-reaction.tsx?raw").then((m) => m.default),
    filename: "EmojiReactionDemo.tsx",
    dependencies: [
      "react",
      "@radix-ui/react-slot",
      "motion",
      "lucide-react",
      "clsx",
      "tailwind-merge",
    ],
  },
  "gooey-nav": {
    Component: GooeyNavDemo,
    loadSource: () =>
      import("./distribution/gooey-nav.tsx?raw").then((m) => m.default),
    filename: "GooeyNavDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "grid-reveal": {
    Component: GridRevealDemo,
    loadSource: () =>
      import("./distribution/grid-reveal.tsx?raw").then((m) => m.default),
    filename: "GridRevealDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "hook-sidebar": {
    Component: HookSidebarDemo,
    loadSource: () =>
      import("./distribution/hook-sidebar.tsx?raw").then((m) => m.default),
    filename: "HookSidebarDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "notification-bell": {
    Component: NotificationBellDemo,
    loadSource: () =>
      import("./distribution/notification-bell.tsx?raw").then((m) => m.default),
    filename: "NotificationBellDemo.tsx",
    dependencies: [
      "react",
      "@radix-ui/react-slot",
      "motion",
      "clsx",
      "tailwind-merge",
    ],
  },
  "rail-toc": {
    Component: RailTocDemo,
    loadSource: () =>
      import("./distribution/rail-toc.tsx?raw").then((m) => m.default),
    filename: "RailTocDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "scroll-progress": {
    Component: ScrollProgressDemo,
    loadSource: () =>
      import("./distribution/scroll-progress.tsx?raw").then((m) => m.default),
    filename: "ScrollProgressDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "step-player": {
    Component: StepPlayerDemo,
    loadSource: () =>
      import("./distribution/step-player.tsx?raw").then((m) => m.default),
    filename: "StepPlayerDemo.tsx",
    dependencies: ["react", "flubber", "motion", "clsx", "tailwind-merge"],
  },
  "task-list": {
    Component: TaskListDemo,
    loadSource: () =>
      import("./distribution/task-list.tsx?raw").then((m) => m.default),
    filename: "TaskListDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  "voice-note": {
    Component: VoiceNoteDemo,
    loadSource: () =>
      import("./distribution/voice-note.tsx?raw").then((m) => m.default),
    filename: "VoiceNoteDemo.tsx",
    dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  },
  shimmer: {
    Component: Shimmer,
    loadSource: () =>
      import("./distribution/shimmer.tsx?raw").then((m) => m.default),
    filename: "Shimmer.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  skeleton: {
    Component: Skeleton,
    loadSource: () =>
      import("./distribution/skeleton.tsx?raw").then((m) => m.default),
    filename: "Skeleton.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "sliding-tabs": {
    Component: SlidingTabs,
    loadSource: () =>
      import("./distribution/sliding-tabs.tsx?raw").then((m) => m.default),
    filename: "SlidingTabs.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  success: {
    Component: Success,
    loadSource: () =>
      import("./distribution/success.tsx?raw").then((m) => m.default),
    filename: "Success.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  switch: {
    Component: Switch,
    loadSource: () =>
      import("./distribution/switch.tsx?raw").then((m) => m.default),
    filename: "Switch.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "text-reveal": {
    Component: TextReveal,
    loadSource: () =>
      import("./distribution/text-reveal.tsx?raw").then((m) => m.default),
    filename: "TextReveal.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  "text-swap": {
    Component: TextSwap,
    loadSource: () =>
      import("./distribution/text-swap.tsx?raw").then((m) => m.default),
    filename: "TextSwap.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  toast: {
    Component: Toast,
    loadSource: () =>
      import("./distribution/toast.tsx?raw").then((m) => m.default),
    filename: "Toast.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
  tooltip: {
    Component: Tooltip,
    loadSource: () =>
      import("./distribution/tooltip.tsx?raw").then((m) => m.default),
    filename: "Tooltip.tsx",
    dependencies: ["react", "clsx", "tailwind-merge"],
  },
};
