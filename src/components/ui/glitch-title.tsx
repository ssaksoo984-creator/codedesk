"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface GlitchTitleProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** Play immediately on mount instead of waiting for scroll-into-view */
  eager?: boolean;
}

export function GlitchTitle({
  children,
  as: Tag = "h2",
  className,
  eager = false,
}: GlitchTitleProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [play, setPlay] = useState(eager);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (eager) {
      const t = setTimeout(() => setSettled(true), 1150);
      return () => clearTimeout(t);
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlay(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    if (!play) return;
    const t = setTimeout(() => setSettled(true), 1150);
    return () => clearTimeout(t);
  }, [play]);

  return (
    <Tag
      ref={ref as never}
      className={clsx("glitch-title", className)}
      data-play={play || undefined}
      data-settled={settled || undefined}
    >
      {children}
    </Tag>
  );
}
