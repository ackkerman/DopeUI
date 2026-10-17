"use client";

// This file guarantees social cards retain their content and identity while scrolling in opposing rows.
import { useState } from "react";
import { cn } from "../../class-names";
import { MarqueeStrip } from "../primitives/marquee-strip";

/** A post's text is rendered without HTML; avatar failures retain the author's initials. */
export interface SocialMarqueePost {
  id: string;
  name: string;
  username: string;
  body: string;
  avatar?: string;
}

/** Posts are split once across one or two rows, with alternating directions and shared motion settings. */
export interface SocialMarqueeProps {
  posts?: readonly SocialMarqueePost[];
  rows?: 1 | 2;
  duration?: number;
  direction?: "left" | "right";
  gap?: number;
  paused?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

// Fictional authors and original sample posts keep the demo independent of social APIs.
const samplePosts: readonly SocialMarqueePost[] = [
  {
    id: "maya",
    name: "Maya Chen",
    username: "@mayamakes",
    body: "The little details make all the difference. This is the kind of UI I love building with.",
  },
  {
    id: "alex",
    name: "Alex Morgan",
    username: "@alexbuilds",
    body: "From a rough idea to a working prototype in an afternoon. Couldn't stop playing with the interactions.",
  },
  {
    id: "jules",
    name: "Jules Park",
    username: "@julesdesign",
    body: "Clean components, thoughtful motion, and code I can actually make my own. So good.",
  },
  {
    id: "sam",
    name: "Sam Rivera",
    username: "@samships",
    body: "Shipped a new landing page today. The tiny interactions are everyone's favorite part.",
  },
  {
    id: "nora",
    name: "Nora Ellis",
    username: "@noracreates",
    body: "Finally, a component library that leaves room for personality. Already planning my next project.",
  },
  {
    id: "leo",
    name: "Leo Kim",
    username: "@leocodes",
    body: "Dropped this into my project, tweaked a few colors, and it felt right at home. Love that.",
  },
];

function SocialPostCard({ post }: { post: SocialMarqueePost }) {
  const [failedAvatar, setFailedAvatar] = useState<string>();
  const initials =
    post.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("") || "?";
  return (
    <figure className="dui-social-marquee-card" role="listitem">
      <figcaption className="dui-social-marquee-author">
        <span className="dui-social-marquee-avatar" aria-hidden="true">
          {post.avatar && post.avatar !== failedAvatar ? (
            <img
              src={post.avatar}
              alt=""
              width="32"
              height="32"
              draggable={false}
              onError={() => setFailedAvatar(post.avatar)}
            />
          ) : (
            initials
          )}
        </span>
        <span className="dui-social-marquee-identity">
          <span className="dui-social-marquee-name">{post.name}</span>
          <span className="dui-social-marquee-username">
            {post.username.startsWith("@")
              ? post.username
              : `@${post.username}`}
          </span>
        </span>
      </figcaption>
      <blockquote>{post.body}</blockquote>
    </figure>
  );
}

export function SocialMarquee({
  posts = samplePosts,
  rows = 2,
  duration = 28,
  direction = "left",
  gap = 16,
  paused = false,
  pauseOnHover = false,
  className,
}: SocialMarqueeProps) {
  // A single post stays in one row; no author is duplicated across accessible rows.
  const split =
    rows === 2 && posts.length > 1 ? Math.ceil(posts.length / 2) : posts.length;
  const groups =
    posts.length > split
      ? [posts.slice(0, split), posts.slice(split)]
      : [posts];
  return (
    <div className={cn("dui-social-marquee", className)}>
      {groups.map((group, row) => (
        <MarqueeStrip
          key={row}
          items={group.map((post) => (
            <SocialPostCard post={post} key={`${post.id}-${post.avatar}`} />
          ))}
          itemWidth={256}
          label={`Social posts, row ${row + 1}`}
          duration={duration}
          direction={
            row === 0 ? direction : direction === "left" ? "right" : "left"
          }
          gap={gap}
          paused={paused}
          pauseOnHover={pauseOnHover}
        />
      ))}
    </div>
  );
}

export default function SocialMarqueeDemo({
  className,
}: {
  className?: string;
}) {
  const [paused, setPaused] = useState(false);
  const [reversed, setReversed] = useState(false);
  const [fast, setFast] = useState(false);
  return (
    <div className={cn("dui-social-marquee-demo", className)}>
      <SocialMarquee
        paused={paused}
        direction={reversed ? "right" : "left"}
        duration={fast ? 14 : 28}
      />
      <div className="dui-demo-controls">
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          aria-pressed={reversed}
          onClick={() => setReversed(!reversed)}
        >
          Reverse
        </button>
        <button
          type="button"
          aria-pressed={fast}
          onClick={() => setFast(!fast)}
        >
          {fast ? "Speed 2×" : "Speed 1×"}
        </button>
      </div>
    </div>
  );
}
