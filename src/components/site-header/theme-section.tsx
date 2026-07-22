"use client";

import clsx from "clsx";
import { useRegisterThemeSection, type SectionTheme } from "./gnb-theme";

interface ThemeSectionProps {
  theme: SectionTheme;
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Registers this section as a full-page scroll-snap stop. */
  snap?: boolean;
}

export function ThemeSection({
  theme,
  children,
  className,
  id,
  snap,
}: ThemeSectionProps) {
  const ref = useRegisterThemeSection(theme);
  return (
    <div
      ref={ref}
      id={id}
      className={clsx(snap && "snap-section", className)}
      data-gnb-theme={theme}
    >
      {children}
    </div>
  );
}
