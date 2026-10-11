"use client";

import React, { useCallback, useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";

import { cn } from "../../class-names";

interface CardBaseProps {
  children?: React.ReactNode;
  className?: string;
  theme?: "light" | "dark";
  gradientSize?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

interface CardGradientProps extends CardBaseProps {
  mode?: "gradient";

  gradientColor?: string;
  gradientOpacity?: number;

  glowFrom?: never;
  glowTo?: never;
  glowAngle?: never;
  glowSize?: never;
  glowBlur?: never;
  glowOpacity?: never;
}

interface CardOrbProps extends CardBaseProps {
  mode: "orb";

  glowFrom?: string;
  glowTo?: string;
  glowAngle?: number;
  glowSize?: number;
  glowBlur?: number;
  glowOpacity?: number;

  gradientColor?: never;
  gradientOpacity?: never;
}

export type CardProps = CardGradientProps | CardOrbProps;
type ResetReason = "enter" | "leave" | "global" | "init";

function isOrbMode(props: CardProps): props is CardOrbProps {
  return props.mode === "orb";
}

export function Card(props: CardProps) {
  const {
    children,
    className,
    gradientSize = 200,
    gradientColor = "#262626",
    gradientOpacity = 0.8,
    gradientFrom = "#9E7AFF",
    gradientTo = "#FE8BBB",
    mode = "gradient",
  } = props;

  const glowFrom = isOrbMode(props) ? (props.glowFrom ?? "#ee4f27") : "#ee4f27";
  const glowTo = isOrbMode(props) ? (props.glowTo ?? "#6b21ef") : "#6b21ef";
  const glowAngle = isOrbMode(props) ? (props.glowAngle ?? 90) : 90;
  const glowSize = isOrbMode(props) ? (props.glowSize ?? 420) : 420;
  const glowBlur = isOrbMode(props) ? (props.glowBlur ?? 60) : 60;
  const glowOpacity = isOrbMode(props) ? (props.glowOpacity ?? 0.9) : 0.9;
  const isDarkTheme = props.theme === "dark";

  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const orbX = useSpring(mouseX, { stiffness: 250, damping: 30, mass: 0.6 });
  const orbY = useSpring(mouseY, { stiffness: 250, damping: 30, mass: 0.6 });
  const orbVisible = useSpring(0, { stiffness: 300, damping: 35 });

  const modeRef = useRef(mode);
  const glowOpacityRef = useRef(glowOpacity);
  const gradientSizeRef = useRef(gradientSize);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    glowOpacityRef.current = glowOpacity;
  }, [glowOpacity]);

  useEffect(() => {
    gradientSizeRef.current = gradientSize;
  }, [gradientSize]);

  const reset = useCallback(
    (reason: ResetReason = "leave") => {
      const currentMode = modeRef.current;

      if (currentMode === "orb") {
        if (reason === "enter") orbVisible.set(glowOpacityRef.current);
        else orbVisible.set(0);
        return;
      }

      const off = -gradientSizeRef.current;
      mouseX.set(off);
      mouseY.set(off);
    },
    [mouseX, mouseY, orbVisible],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY],
  );

  useEffect(() => {
    reset("init");
  }, [reset]);

  useEffect(() => {
    const handleGlobalPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) reset("global");
    };
    const handleBlur = () => reset("global");
    const handleVisibility = () => {
      if (document.visibilityState !== "visible") reset("global");
    };

    window.addEventListener("pointerout", handleGlobalPointerOut);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("pointerout", handleGlobalPointerOut);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reset]);

  const cardTemplate0 = useMotionTemplate`
          linear-gradient(var(--color-background,var(--background,#fff)) 0 0) padding-box,
          radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
            ${gradientFrom},
            ${gradientTo},
            var(--color-border,var(--border,#e1e1e4)) 100%
          ) border-box
        `;
  const cardTemplate1 = useMotionTemplate`
              radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
                ${gradientColor},
                transparent 100%
              )
            `;

  return (
    <motion.div
      className={cn(
        "group relative isolate overflow-hidden rounded-[inherit] border border-transparent",
        className,
      )}
      tabIndex={0}
      onFocus={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(rect.width / 2);
        mouseY.set(rect.height / 2);
        reset("enter");
      }}
      onBlur={() => reset("leave")}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => reset("leave")}
      onPointerEnter={() => reset("enter")}
      style={{
        background: cardTemplate0,
      }}
    >
      <div
        className={cn("bg-background absolute inset-px z-20 rounded-[inherit]")}
      />

      {mode === "gradient" && (
        <motion.div
          suppressHydrationWarning
          className={cn(
            "pointer-events-none absolute inset-px z-30 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          )}
          style={{
            background: cardTemplate1,
            opacity: gradientOpacity,
          }}
        />
      )}

      {mode === "orb" && (
        <motion.div
          suppressHydrationWarning
          aria-hidden="true"
          className={cn("pointer-events-none absolute z-30")}
          style={{
            width: glowSize,
            height: glowSize,
            x: orbX,
            y: orbY,
            translateX: "-50%",
            translateY: "-50%",
            borderRadius: 9999,
            filter: `blur(${glowBlur}px)`,
            opacity: orbVisible,
            background: `linear-gradient(${glowAngle}deg, ${glowFrom}, ${glowTo})`,

            mixBlendMode: isDarkTheme ? "screen" : "multiply",
            willChange: "transform, opacity",
          }}
        />
      )}
      <div className={cn("relative z-40")}>{children}</div>
    </motion.div>
  );
}

export type CardDemoProps = Partial<CardProps>;
export default function CardDemo({
  className,
  children,
  ...props
}: CardDemoProps) {
  const [orb, setOrb] = React.useState(false);
  const [dark, setDark] = React.useState(false);
  const config = {
    ...props,
    mode: props.mode ?? (orb ? "orb" : "gradient"),
    theme: props.theme ?? (dark ? "dark" : "light"),
  } as CardProps;
  return (
    <div className={cn("dui-card", className)} data-component-layout="motion">
      <div
        className={cn(
          "w-full max-w-sm rounded-2xl",
          config.theme === "dark" && "dark",
        )}
        style={
          {
            "--background": config.theme === "dark" ? "#1c1c1e" : "#fff",
            "--foreground": config.theme === "dark" ? "#fff" : "#1c1c1e",
            color: config.theme === "dark" ? "#fff" : "#1c1c1e",
          } as React.CSSProperties
        }
      >
        <Card
          {...config}
          className={cn(
            "flex h-[200px] items-center justify-center rounded-2xl",
          )}
        >
          {children ?? (
            <div className={cn("px-6 text-center")}>
              <h3 className={cn("text-xl font-medium")}>
                Follow your curiosity.
              </h3>
              <p className={cn("mt-2 text-sm opacity-60")}>
                Move your pointer around the card.
              </p>
            </div>
          )}
        </Card>
      </div>
      <div className={cn("dui-demo-controls")}>
        <button
          type="button"
          aria-pressed={orb}
          onClick={() => setOrb((v) => !v)}
        >
          Orb glow
        </button>
        <button
          type="button"
          aria-pressed={dark}
          onClick={() => setDark((v) => !v)}
        >
          Change theme
        </button>
      </div>
    </div>
  );
}
