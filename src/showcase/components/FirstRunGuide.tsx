"use client";
// This file guarantees the preview and copyable application example use the same component.
// This file guarantees the examples compose canonical UI components with shared, local state.
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Sparkles } from "lucide-react";
import { StepPlayer } from "../../library/components/step-player";
import Success from "../../library/components/success";
import "../showcase-previews.css";
function cn(...values: ClassValue[]) {
  return twMerge(clsx(values));
}
export default function FirstRunGuide() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const content = [
    {
      title: "Make it yours.",
      body: "Give your workspace a name and a little personality.",
    },
    {
      title: "Bring the context.",
      body: "Keep the useful files and ideas close to your work.",
    },
    {
      title: "Start something good.",
      body: "Your first project is just one thoughtful step away.",
    },
  ];
  return (
    <div className={cn("sc-onboarding")} data-component-layout="interaction">
      <span className={cn("sc-onboarding-symbol")}>
        <Sparkles size={23} />
      </span>
      <small>STEP {step + 1} OF 3</small>
      <h3>{content[step].title}</h3>
      <p>{content[step].body}</p>
      <StepPlayer
        steps={3}
        value={step}
        onValueChange={setStep}
        duration={1800}
        seekable
        onComplete={() => setComplete(true)}
      />
      <Success
        complete={complete}
        disabled
        className={cn("sc-onboarding-check")}
      />
    </div>
  );
}
