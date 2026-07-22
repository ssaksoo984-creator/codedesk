"use client";

import { useState } from "react";
import clsx from "clsx";

interface VideoSlotProps {
  /** File basename under public/media, e.g. "typing-hands" -> typing-hands.mp4 */
  basename: string;
  /** Shown in the placeholder while no file exists at that path yet. */
  label: string;
  className?: string;
  grayscale?: boolean;
}

/**
 * Generic looping background-video slot. Drop matching files under
 * public/media/ to activate it — falls back to a solid gray placeholder
 * until then, so layout and sizing stay correct either way.
 */
export function VideoSlot({ basename, label, className, grayscale = true }: VideoSlotProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={clsx(
          "flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl bg-[#9a9a9a] text-center",
          className
        )}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-charcoal text-paper">
          <PlaceholderDots />
        </span>
        <p className="max-w-[240px] text-xs text-white/80">
          {label}
          <br />
          <code className="text-[11px]">public/media/{basename}.mp4</code>
        </p>
      </div>
    );
  }

  return (
    <video
      className={clsx(
        "h-full w-full rounded-2xl object-cover",
        grayscale && "grayscale contrast-[1.05]",
        className
      )}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster={`/media/${basename}-poster.jpg`}
      onError={() => setFailed(true)}
    >
      <source src={`/media/${basename}.webm`} type="video/webm" />
      <source src={`/media/${basename}.mp4`} type="video/mp4" />
    </video>
  );
}

function PlaceholderDots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-paper"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}
