"use client";

import React, {
  useMemo,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "../../class-names";

/** The video is clipped to text while a readable fallback preserves its content. */
export interface VideoTextProps {
  /**
   * The video source URL
   */
  src: string;
  /**
   * Additional className for the container
   */
  className?: string;
  /**
   * Whether to autoplay the video
   */
  autoPlay?: boolean;
  /**
   * Whether to mute the video
   */
  muted?: boolean;
  /**
   * Whether to loop the video
   */
  loop?: boolean;
  /**
   * Whether to preload the video
   */
  preload?: "auto" | "metadata" | "none";
  /**
   * The content to display (will have the video "inside" it)
   */
  children: ReactNode;
  /**
   * Font size for the text mask (in viewport width units)
   * @default 10
   */
  fontSize?: string | number;
  /**
   * Font weight for the text mask
   * @default "bold"
   */
  fontWeight?: string | number;
  /**
   * Text anchor for the text mask
   * @default "middle"
   */
  textAnchor?: string;
  /**
   * Dominant baseline for the text mask
   * @default "middle"
   */
  dominantBaseline?: string;
  /**
   * Font family for the text mask
   * @default "sans-serif"
   */
  fontFamily?: string;
  /**
   * The element type to render for the text
   * @default "div"
   */
  as?: ElementType;
}

export function VideoText({
  src,
  children,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  preload = "auto",
  fontSize = 20,
  fontWeight = "bold",
  textAnchor = "middle",
  dominantBaseline = "middle",
  fontFamily = "sans-serif",
  as: Component = "div",
}: VideoTextProps) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const content = React.Children.toArray(children).join("");
  const escapeXml = (value: string | number) =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&apos;",
        })[char]!,
    );
  const svgMask = useMemo(() => {
    const responsiveFontSize =
      typeof fontSize === "number" ? `${fontSize}vw` : fontSize;
    return `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><text x='50%' y='50%' font-size='${escapeXml(responsiveFontSize)}' font-weight='${escapeXml(fontWeight)}' text-anchor='${escapeXml(textAnchor)}' dominant-baseline='${escapeXml(dominantBaseline)}' font-family='${escapeXml(fontFamily)}'>${escapeXml(content)}</text></svg>`;
  }, [content, fontSize, fontWeight, textAnchor, dominantBaseline, fontFamily]);
  const dataUrlMask = `url("data:image/svg+xml,${encodeURIComponent(svgMask)}")`;

  return (
    <Component className={cn(`relative size-full`, className)}>
      {(!ready || failed) && (
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 flex items-center justify-center text-6xl font-black text-[#416C91]",
          )}
        >
          {content}
        </span>
      )}
      {/* Create a container that masks the video to only show within text */}
      <div
        className={cn("absolute inset-0 flex items-center justify-center")}
        style={{
          maskImage: dataUrlMask,
          WebkitMaskImage: dataUrlMask,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      >
        <video
          className={cn("h-full w-full object-cover")}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={preload}
          onLoadedData={() => setReady(true)}
          onError={() => setFailed(true)}
          aria-hidden
          playsInline
        >
          <source src={src} />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Add a backup text element for SEO/accessibility */}
      <span className={cn("sr-only")}>{content}</span>
    </Component>
  );
}

export type VideoTextDemoProps = Partial<VideoTextProps>;
export default function VideoTextDemo({
  className,
  children = "FOREST",
  src = "/media/video-text-forest-8s.mp4",
  ...props
}: VideoTextDemoProps) {
  const [playing, setPlaying] = useState(true);
  const host = useRef<HTMLDivElement>(null);
  const toggle = () => {
    const video = host.current?.querySelector("video");
    if (!video) return;
    if (video.paused)
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    else {
      video.pause();
      setPlaying(false);
    }
  };
  return (
    <div
      className={cn("dui-video-text", className)}
      data-component-layout="motion"
    >
      <div
        ref={host}
        className={cn("relative h-[160px] w-full max-w-sm overflow-hidden")}
      >
        <VideoText
          key={src}
          {...props}
          src={src}
          fontSize={props.fontSize ?? "72px"}
        >
          {children}
        </VideoText>
      </div>
      <div className={cn("dui-demo-controls")}>
        <button type="button" onClick={toggle}>
          {playing ? "Pause video" : "Play video"}
        </button>
      </div>
    </div>
  );
}
