"use client";

import clsx from "clsx";
import { useGnbTheme } from "./gnb-theme";

/**
 * Fixed bottom-right "TOP" button. Adapts color exactly like the GNB pill
 * (charcoal box on light sections, white box on dark ones) and works
 * automatically under moon mode since it's just another element under the
 * page-wide invert filter.
 */
export function BackToTop() {
  const { theme } = useGnbTheme();
  const isLight = theme === "light";

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="맨 위로 이동"
      className={clsx(
        "fixed bottom-5 right-5 z-40 flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-semibold tracking-wide shadow-lg transition-colors duration-500 md:bottom-8 md:right-8 md:h-14 md:w-14 md:text-[11px]",
        isLight ? "bg-charcoal text-paper" : "bg-paper text-charcoal"
      )}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
      TOP
    </button>
  );
}
