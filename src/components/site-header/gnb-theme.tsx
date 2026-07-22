"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type SectionTheme = "light" | "dark";

type Registry = Map<Element, SectionTheme>;

interface GnbThemeContextValue {
  theme: SectionTheme;
  register: (el: Element, theme: SectionTheme) => void;
  unregister: (el: Element) => void;
}

const GnbThemeContext = createContext<GnbThemeContextValue | null>(null);

// Roughly the GNB's own height — whichever registered marker's top edge has
// most recently scrolled above this line "wins". This is a classic
// scrollspy pattern (plain getBoundingClientRect, not intersection ratios)
// specifically because ratio-based comparison broke down when comparing a
// handful of small transition markers against whole-section wrappers that
// can be many screens tall.
const ACTIVATION_LINE = 90;

export function GnbThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<SectionTheme>("light");
  const registryRef = useRef<Registry>(new Map());
  const rafRef = useRef<number | null>(null);

  const recompute = useCallback(() => {
    let best: Element | null = null;
    let bestTop = -Infinity;

    for (const el of registryRef.current.keys()) {
      const top = el.getBoundingClientRect().top;
      if (top <= ACTIVATION_LINE && top > bestTop) {
        bestTop = top;
        best = el;
      }
    }

    if (!best) return;
    const next = registryRef.current.get(best);
    if (next) setTheme((prev) => (prev === next ? prev : next));
  }, []);

  useEffect(() => {
    function onScroll() {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        recompute();
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [recompute]);

  const register = useCallback(
    (el: Element, sectionTheme: SectionTheme) => {
      registryRef.current.set(el, sectionTheme);
      recompute();
    },
    [recompute]
  );

  const unregister = useCallback(
    (el: Element) => {
      registryRef.current.delete(el);
      recompute();
    },
    [recompute]
  );

  return (
    <GnbThemeContext.Provider value={{ theme, register, unregister }}>
      {children}
    </GnbThemeContext.Provider>
  );
}

export function useGnbTheme() {
  const ctx = useContext(GnbThemeContext);
  if (!ctx) throw new Error("useGnbTheme must be used within GnbThemeProvider");
  return ctx;
}

export function useRegisterThemeSection(theme: SectionTheme) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { register, unregister } = useGnbTheme();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    register(el, theme);
    return () => unregister(el);
  }, [register, unregister, theme]);

  return ref;
}
