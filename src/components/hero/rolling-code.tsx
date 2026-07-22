import { HERO_CODE_LINES } from "@/lib/code-snippet";
import { CodeLine } from "./code-line";

export function RollingCode() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-ink">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-ink to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-ink to-transparent"
        aria-hidden
      />

      <div className="roll-up-track px-2.5 py-4 font-mono text-[9px] leading-[1.6] md:px-7 md:py-6 md:text-sm">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1}>
            {HERO_CODE_LINES.map((line, i) => (
              <CodeLine key={`${copy}-${i}`} line={line} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
