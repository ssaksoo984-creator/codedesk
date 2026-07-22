"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms, applied only once the reveal has started. */
  delay?: number;
}

/**
 * Fades content in (and nudges it up slightly) while it's in view, and
 * fades it back out as it scrolls past — so moving to the next section
 * reads as a crossfade rather than a hard cut.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={clsx(
        "transition-[opacity,transform] duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
