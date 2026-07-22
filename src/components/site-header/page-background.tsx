"use client";

import clsx from "clsx";
import { useGnbTheme } from "./gnb-theme";

/**
 * Fixed full-viewport background layer, colored by whichever section is
 * currently at the top of the screen. Every section renders with a
 * transparent background and lets this layer show through — the color
 * change happens exactly when a section's top reaches the viewport top,
 * the same trigger the GNB itself uses.
 */
export function PageBackground() {
  const { theme } = useGnbTheme();

  return (
    <div
      aria-hidden
      className={clsx(
        "fixed inset-0 -z-10 transition-colors duration-300 ease-out",
        theme === "light" ? "bg-paper" : "bg-ink"
      )}
    />
  );
}
