// This file maps application examples to their independently copyable canonical components.
import type { ComponentType } from "react";
import AgentWorkspace from "./components/AgentWorkspace";
export { AgentWorkspace };
import AnalyticsPanel from "./components/AnalyticsPanel";
export { AnalyticsPanel };
import ProjectChecklist from "./components/ProjectChecklist";
export { ProjectChecklist };
import PricingPlans from "./components/PricingPlans";
export { PricingPlans };
import ReadingRoom from "./components/ReadingRoom";
export { ReadingRoom };
import VoiceInbox from "./components/VoiceInbox";
export { VoiceInbox };
import ImageStudio from "./components/ImageStudio";
export { ImageStudio };
import AppLaunchpad from "./components/AppLaunchpad";
export { AppLaunchpad };
import AccountPreferences from "./components/AccountPreferences";
export { AccountPreferences };
import FirstRunGuide from "./components/FirstRunGuide";
export { FirstRunGuide };
import SocialMoment from "./components/SocialMoment";
export { SocialMoment };
import MovingHeadline from "./components/MovingHeadline";
export { MovingHeadline };
export const examplePreviews: Record<string, ComponentType> = {
  "agent-workspace": AgentWorkspace,
  "live-analytics": AnalyticsPanel,
  "project-checklist": ProjectChecklist,
  "flexible-pricing": PricingPlans,
  "reading-room": ReadingRoom,
  "voice-inbox": VoiceInbox,
  "image-studio": ImageStudio,
  "app-launchpad": AppLaunchpad,
  "account-preferences": AccountPreferences,
  "first-run": FirstRunGuide,
  "social-moment": SocialMoment,
  "moving-headline": MovingHeadline,
};
