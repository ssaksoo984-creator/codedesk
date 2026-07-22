import type { ServiceCardData } from "@/lib/service-content";

export function ServiceCard({ index, title, tags }: ServiceCardData) {
  return (
    <div
      className="group relative flex h-[300px] w-[300px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl transition-colors duration-300 hover:bg-white/[0.1] md:h-[360px] md:w-[380px] md:p-8"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />

      <span className="font-display text-sm italic text-white/40">
        {index}
      </span>

      <div>
        <h3 className="mb-5 font-display text-2xl italic leading-snug text-paper md:text-[1.7rem]">
          {title}
        </h3>
        <ul className="flex flex-col gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-2 text-sm text-white/60"
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-white/40" />
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
