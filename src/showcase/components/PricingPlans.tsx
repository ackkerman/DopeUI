"use client";
// This file guarantees the preview and copyable application example use the same component.
// This file guarantees the examples compose canonical UI components with shared, local state.
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Check } from "lucide-react";
import { AnimatedCounter } from "../../library/components/animated-counter";
import SpringToggle from "../../library/components/switch";
import CardResize from "../../library/components/card-resize";
import "../showcase-previews.css";
function cn(...values: ClassValue[]) {
  return twMerge(clsx(values));
}
export default function PricingPlans() {
  const [annual, setAnnual] = useState(false);
  const [chosen, setChosen] = useState(false);
  return (
    <div className={cn("sc-pricing")} data-component-layout="interaction">
      <div className={cn("sc-billing")}>
        <span>Monthly</span>
        <SpringToggle
          checked={annual}
          onCheckedChange={setAnnual}
          aria-label="Annual billing"
        />
        <span>
          Yearly <small>Save 20%</small>
        </span>
      </div>
      <CardResize compact={annual} disabled>
        <span className={cn("sc-plan-label")}>FOR YOUR NEXT IDEA</span>
        <h3>Creator</h3>
        <div className={cn("sc-price")}>
          <span>$</span>
          <AnimatedCounter value={annual ? 15 : 19} />
          <small>/ month</small>
        </div>
        <p>Everything you need to start.</p>
        <ul>
          <li>
            <Check size={13} />
            Unlimited projects
          </li>
          <li>
            <Check size={13} />
            Your code, your way
          </li>
          <li>
            <Check size={13} />
            Thoughtful defaults
          </li>
        </ul>
        <button
          className={cn("sc-button sc-button-dark")}
          type="button"
          onClick={() => setChosen((v) => !v)}
        >
          {chosen ? "Plan selected" : "Choose Creator"}
        </button>
      </CardResize>
    </div>
  );
}
