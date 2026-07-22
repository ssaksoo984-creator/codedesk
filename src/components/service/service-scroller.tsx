"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { SERVICES } from "@/lib/service-content";
import { ServiceCard } from "./service-card";

export function ServiceScroller() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ startX: 0, startScrollLeft: 0, moved: false });
  const [dragging, setDragging] = useState(false);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el || e.pointerType === "touch") return;
    setDragging(true);
    el.style.scrollSnapType = "none";
    dragState.current = { startX: e.clientX, startScrollLeft: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el || !dragging) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 3) dragState.current.moved = true;
    el.scrollLeft = dragState.current.startScrollLeft - dx;
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    setDragging(false);
    if (el) {
      el.style.scrollSnapType = "";
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    }
  }

  function handleClickCapture(e: React.MouseEvent<HTMLDivElement>) {
    // Swallow the click that follows a drag so it doesn't trigger a card link.
    if (dragState.current.moved) e.stopPropagation();
  }

  return (
    <div
      ref={scrollerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={handleClickCapture}
      className={clsx(
        "no-scrollbar flex w-full select-none snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:gap-6",
        dragging ? "cursor-grabbing" : "cursor-grab"
      )}
    >
      {SERVICES.map((service) => (
        <ServiceCard key={service.index} {...service} />
      ))}
      <div className="w-px shrink-0" aria-hidden />
    </div>
  );
}
