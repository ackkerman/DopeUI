// This file exposes independent, tree-shakeable React components.
export { default as Accordion } from "./components/accordion";
export type { AccordionProps } from "./components/accordion";
export { default as CardResize } from "./components/card-resize";
export type { CardResizeProps } from "./components/card-resize";
export { default as Checkbox } from "./components/checkbox";
export type { CheckboxProps } from "./components/checkbox";
export { default as ClearInput } from "./components/clear-input";
export type { ClearInputProps } from "./components/clear-input";
export { default as Confetti } from "./components/confetti";
export type { ConfettiProps } from "./components/confetti";
export { default as DotLoader } from "./components/dot-loader";
export type { DotLoaderProps } from "./components/dot-loader";
export { default as Dropdown } from "./components/dropdown";
export type { DropdownProps } from "./components/dropdown";
export { default as IconSwap } from "./components/icon-swap";
export type { IconSwapProps } from "./components/icon-swap";
export { default as InputShake } from "./components/input-shake";
export type { InputShakeProps } from "./components/input-shake";
export { default as Like } from "./components/like";
export type { LikeProps } from "./components/like";
export { default as Modal } from "./components/modal";
export type { ModalProps } from "./components/modal";
export { default as NotificationPop } from "./components/notification-pop";
export type { NotificationPopProps } from "./components/notification-pop";
export { default as NumberFlow } from "./components/number-flow";
export type { NumberFlowProps } from "./components/number-flow";
export { default as Panel } from "./components/panel";
export type { PanelProps } from "./components/panel";
export { default as QuickActions } from "./components/quick-actions";
export type { QuickActionsProps } from "./components/quick-actions";
export { default as Shimmer } from "./components/shimmer";
export type { ShimmerProps } from "./components/shimmer";
export { default as Skeleton } from "./components/skeleton";
export type { SkeletonProps } from "./components/skeleton";
export { default as SlidingTabs } from "./components/sliding-tabs";
export type { SlidingTabsProps } from "./components/sliding-tabs";
export { default as Success } from "./components/success";
export type { SuccessProps } from "./components/success";
export { default as Switch } from "./components/switch";
export type { SwitchProps } from "./components/switch";
export { default as TextReveal } from "./components/text-reveal";
export type { TextRevealProps } from "./components/text-reveal";
export { default as TextSwap } from "./components/text-swap";
export type { TextSwapProps } from "./components/text-swap";
export { default as Toast } from "./components/toast";
export type { ToastProps } from "./components/toast";
export { default as Tooltip } from "./components/tooltip";
export type { TooltipProps } from "./components/tooltip";

export { default as AiLoadingState } from "./components/ai-loading-state";
export { default as AiThinking } from "./components/ai-thinking";
export { default as AiStreamingText } from "./components/ai-streaming-text";
export { default as AiApprovalCard } from "./components/ai-approval-card";
export { default as AiToolChips } from "./components/ai-tool-chips";
export { default as AiTaskRows } from "./components/ai-task-rows";
export { default as AiChat } from "./components/ai-chat";
export { default as AiPromptBar } from "./components/ai-prompt-bar";
export { default as AiRecommendationCard } from "./components/ai-recommendation-card";
export { default as AiContextCards } from "./components/ai-context-cards";

export { default as TaskListDemo } from "./components/task-list";

export { default as VoiceNoteDemo } from "./components/voice-note";

export { default as StepPlayerDemo } from "./components/step-player";

export { default as NotificationBellDemo } from "./components/notification-bell";

export { default as ScrollProgressDemo } from "./components/scroll-progress";

export { default as DeleteButtonDemo } from "./components/delete-button";

export { default as HookSidebarDemo } from "./components/hook-sidebar";

export { default as GridRevealDemo } from "./components/grid-reveal";

export { default as GooeyNavDemo } from "./components/gooey-nav";

export { default as AnimatedCounterDemo } from "./components/animated-counter";

export { default as RailTocDemo } from "./components/rail-toc";

export { default as EmojiReactionDemo } from "./components/emoji-reaction";

export { default as DockDemo, Dock, DockIcon } from "./components/dock";
export type {
  DockProps,
  DockIconProps,
  DockDemoProps,
} from "./components/dock";

export {
  default as ProgressiveBlurDemo,
  ProgressiveBlur,
} from "./components/progressive-blur";
export type {
  ProgressiveBlurProps,
  ProgressiveBlurDemoProps,
} from "./components/progressive-blur";

export { default as AnimatedThemeTogglerDemo } from "./components/animated-theme-toggler";

export { default as VideoTextDemo } from "./components/video-text";

export { default as ScrollBasedVelocityDemo } from "./components/scroll-based-velocity";

export { default as HighlighterDemo } from "./components/highlighter";

export { AnimatedThemeToggler } from "./components/animated-theme-toggler";
export type {
  AnimatedThemeTogglerProps,
  TransitionVariant,
} from "./components/animated-theme-toggler";
export { VideoText } from "./components/video-text";
export type { VideoTextProps } from "./components/video-text";
export {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "./components/scroll-based-velocity";
export type { ScrollVelocityRowProps } from "./components/scroll-based-velocity";
export { Highlighter } from "./components/highlighter";
export type {
  HighlighterProps,
  AnnotationAction,
} from "./components/highlighter";

export {
  nordColors,
  frostExtensions,
  frostBrands,
  frostSwatches,
  getFrostTokens,
  createFrostStylesheet,
  frostContrast,
} from "./frost-colors";
export type { FrostBrand, FrostTheme, FrostTokens } from "./frost-colors";

export {
  default as DotPatternDemo,
  DotPattern,
} from "./components/dot-pattern";
export type { DotPatternProps } from "./components/dot-pattern";

export {
  default as Floating3DParticlesDemo,
  Floating3DParticles,
} from "./components/floating-3d-particles";
export type { Floating3DParticlesProps } from "./components/floating-3d-particles";

export {
  default as FileTreeDemo,
  Tree,
  Folder,
  File,
  CollapseButton,
} from "./components/file-tree";
export type {
  TreeViewProps,
  TreeViewElement,
  TreeSortMode,
} from "./components/file-tree";

export { frostShades, frostColorFamilies, getFrostRamp } from "./frost-colors";
export type { FrostShade } from "./frost-colors";

export {
  default as PulsatingButtonDemo,
  PulsatingButton,
} from "./components/pulsating-button";
export type { PulsatingButtonProps } from "./components/pulsating-button";

export {
  default as InteractiveHoverButtonDemo,
  InteractiveHoverButton,
} from "./components/interactive-hover-button";
export type { InteractiveHoverButtonProps } from "./components/interactive-hover-button";

export {
  default as GlyphMatrixDemo,
  GlyphMatrix,
} from "./components/glyph-matrix";
export type { GlyphMatrixProps } from "./components/glyph-matrix";

export {
  default as FlickeringGridDemo,
  FlickeringGrid,
} from "./components/flickering-grid";
export type { FlickeringGridProps } from "./components/flickering-grid";

export {
  default as RainbowButtonDemo,
  RainbowButton,
  rainbowButtonVariants,
} from "./components/rainbow-button";
export type { RainbowButtonProps } from "./components/rainbow-button";

export { default as SafariDemo, Safari } from "./components/safari";
export type { SafariProps } from "./components/safari";

export { default as IphoneDemo, Iphone } from "./components/iphone";
export type { IphoneProps } from "./components/iphone";

export { default as AndroidDemo, Android } from "./components/android";
export type { AndroidProps } from "./components/android";

export {
  default as ShineBorderDemo,
  ShineBorder,
} from "./components/shine-border";
export type { ShineBorderProps } from "./components/shine-border";

export { default as CardDemo, Card } from "./components/card";
export type { CardProps } from "./components/card";

export {
  default as BorderBeamDemo,
  BorderBeam,
} from "./components/border-beam";
export type { BorderBeamProps } from "./components/border-beam";

export { default as DottedMapDemo, DottedMap } from "./components/dotted-map";
export type { DottedMapProps, Marker } from "./components/dotted-map";

export { default as GlobeDemo, Globe } from "./components/globe";

export { default as AuroraTextDemo } from "./components/aurora-text";

export { default as AnimatedListDemo } from "./components/animated-list";

export { default as TerminalDemo } from "./components/terminal";

export { default as FluidOrbDemo } from "./components/fluid-orb";

export { default as OtpInputDemo } from "./components/otp-input";

export { default as Tilt3D } from "./components/tilt-3d";

export { default as CardStackHover } from "./components/card-stack-hover";

export { default as OrganicShimmer } from "./components/organic-shimmer";

export { AuroraText } from "./components/aurora-text";
export { AnimatedList, AnimatedListItem } from "./components/animated-list";
export { Terminal, AnimatedSpan, TypingAnimation } from "./components/terminal";
export { FluidOrb } from "./components/fluid-orb";
export { OtpInput } from "./components/otp-input";
export { TiltCard } from "./components/tilt-3d";
export { CardStack } from "./components/card-stack-hover";
export { OrganicShimmerSurface } from "./components/organic-shimmer";
export { ToastStack } from "./components/toast";

export type { AuroraTextProps } from "./components/aurora-text";
export type { AnimatedListProps } from "./components/animated-list";
export type {
  TerminalProps,
  AnimatedSpanProps,
  TypingAnimationProps,
} from "./components/terminal";
export type { FluidOrbProps } from "./components/fluid-orb";
export type { OtpInputProps, OtpStatus } from "./components/otp-input";
export type { TiltCardProps } from "./components/tilt-3d";
export type { CardStackProps, StackCard } from "./components/card-stack-hover";
export type { OrganicShimmerSurfaceProps } from "./components/organic-shimmer";
export type { ToastNotification, ToastStackProps } from "./components/toast";

export {
  LoadingIndicator,
  LOADING_VARIANTS,
  loadingVariantLabel,
} from "./components/dot-loader";
export type {
  LoadingIndicatorProps,
  LoadingVariant,
} from "./components/dot-loader";

export {
  LoadingPatternGallery,
  REPRESENTATIVE_LOADING_VARIANTS,
} from "./components/dot-loader";
export type { LoadingPatternGalleryProps } from "./components/dot-loader";

export {
  default as StreamingText,
  StreamingWords,
} from "./components/streaming-text";
export type {
  StreamingTextProps,
  StreamingWordsProps,
} from "./components/streaming-text";

export { Button } from "./primitives/button";
export type { ButtonVariant } from "./primitives/button";
export { GlideMenu } from "./primitives/glide-menu";
export type { GlideMenuProps } from "./primitives/glide-menu";
export { EntityChip, Monogram } from "./primitives/entity-chip";
export { ValuePill } from "./primitives/value-pill";
export type { ValueTone } from "./primitives/value-pill";

export { SELECTION_SPRING, FOLLOW_SPRING } from "./motion-presets";

export { default as ImageOpenTilt } from "./components/image-open-tilt";
export type { ImageOpenTiltProps } from "./components/image-open-tilt";

export { CodeBlock } from "./primitives/code-block";
export type { CodeBlockProps } from "./primitives/code-block";
