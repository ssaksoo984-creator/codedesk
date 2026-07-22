"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const MIN_SPEED = 1;
const MAX_SPEED = 30;
const DEFAULT_SPEED = 8;

/**
 * Decorative background: a skyline built out of "1" characters, scrolling
 * left forever. Near layer (dark, buildings/trees/ground) scrolls faster
 * than the far layer (faint, distant buildings) for a bit of parallax.
 * Play/pause + speed controls sit in a thin row right below the canvas.
 */
export function BinaryCityScroll({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [paused, setPaused] = useState(false);
  const speedRef = useRef(speed);
  const pausedRef = useRef(paused);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let scroll = 0;
    let last = performance.now();

    const GROUND_THICK = 8;
    const NEAR_SLOT = 6;
    const FAR_SLOT = 9;
    const FAR_RATIO = 0.45;

    const hash = (n: number) => {
      let x = n | 0;
      x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
      x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
      return (x ^ (x >>> 16)) >>> 0;
    };
    const rnd = (n: number) => hash(n) / 4294967296;

    let cols = 0;
    let rows = 0;
    let groundTop = 0;
    let dpr = 1;
    let CELL = 9;

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      // Smaller cells on tight/short containers (mobile) so buildings and
      // trees get enough rows to read as shapes instead of a dense blur.
      CELL = rect.height < 140 ? 5 : rect.height < 220 ? 6 : 9;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      cols = Math.ceil(rect.width / CELL) + 2;
      rows = Math.floor(rect.height / CELL);
      groundTop = rows - GROUND_THICK;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `600 ${CELL}px "Pretendard", -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    }

    function nearFilled(wx: number, y: number) {
      if (y >= groundTop) {
        if (y === groundTop) return 1;
        return rnd(wx * 7 + y * 131) > 0.3 ? 1 : 0;
      }
      const slot = Math.floor(wx / NEAR_SLOT);
      const local = wx - slot * NEAR_SLOT;
      const kind = rnd(slot * 3 + 1);

      if (kind < 0.62) {
        const bw = 3 + (hash(slot * 9 + 2) % 3);
        // Capped to the available sky headroom so buildings always render
        // whole (base to roof) — any shortfall shrinks the ground instead.
        const bh = Math.min(4 + (hash(slot * 9 + 3) % 10), Math.max(2, groundTop));
        const lo = 1 + (hash(slot * 9 + 4) % Math.max(1, NEAR_SLOT - bw - 1));
        if (local >= lo && local < lo + bw) {
          const topRow = groundTop - bh;
          if (y >= topRow && y < groundTop) {
            const bx = local - lo;
            const by = y - topRow;
            const frame = bx === 0 || bx === bw - 1 || by === 0 || by === bh - 1;
            if (!frame && bx % 2 === 1 && by % 2 === 1) return 0;
            return 1;
          }
        }
        return 0;
      }

      if (kind < 0.94) {
        const th = Math.min(2 + (hash(slot * 9 + 5) % 3), Math.max(1, groundTop - 3));
        const cx = 2 + (hash(slot * 9 + 6) % Math.max(1, NEAR_SLOT - 4));
        const trunkTop = groundTop - th;
        if (local === cx && y >= trunkTop && y < groundTop) return 1;
        const cyc = trunkTop - 1;
        const dx = local - cx;
        const dy = y - cyc;
        if (Math.abs(dx) + Math.abs(dy) <= 2) return 1;
        if (Math.abs(dx) <= 2 && Math.abs(dy) <= 1) return 1;
        return 0;
      }
      return 0;
    }

    function farFilled(wx: number, y: number) {
      if (y >= groundTop) return 0;
      const slot = Math.floor(wx / FAR_SLOT);
      const local = wx - slot * FAR_SLOT;
      if (rnd(slot * 5 + 77) < 0.85) {
        const bw = 4 + (hash(slot * 11 + 2) % 5);
        const bh = Math.min(3 + (hash(slot * 11 + 3) % 8), Math.max(2, groundTop));
        const lo = 1 + (hash(slot * 11 + 4) % Math.max(1, FAR_SLOT - bw - 1));
        if (local >= lo && local < lo + bw) {
          const topRow = groundTop - bh;
          if (y >= topRow && y < groundTop) {
            const bx = local - lo;
            const by = y - topRow;
            const frame = bx === 0 || bx === bw - 1 || by === 0 || by === bh - 1;
            if (!frame && bx % 2 === 1 && by % 2 === 1) return 0;
            return 1;
          }
        }
      }
      return 0;
    }

    const BG = "#ffffff";
    const C_INK = "#0d0d0d";
    const C_FAR = "rgba(13,13,13,0.20)";

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      const scrollFar = scroll * FAR_RATIO;
      const baseN = Math.floor(scroll);
      const baseF = Math.floor(scrollFar);
      const h = CELL / 2;

      ctx.fillStyle = C_FAR;
      for (let i = 0; i <= cols; i++) {
        const wx = baseF + i;
        const x = (wx - scrollFar) * CELL + h;
        for (let y = 0; y < groundTop; y++) {
          if (farFilled(wx, y)) ctx.fillText("1", x, y * CELL + h);
        }
      }

      ctx.fillStyle = C_INK;
      for (let i = 0; i <= cols; i++) {
        const wx = baseN + i;
        const x = (wx - scroll) * CELL + h;
        for (let y = 0; y < rows; y++) {
          if (nearFilled(wx, y)) ctx.fillText("1", x, y * CELL + h);
        }
      }
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!pausedRef.current) scroll += speedRef.current * dt;
      draw();
      raf = requestAnimationFrame(frame);
    }

    resize();
    document.fonts?.ready?.then(resize);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={clsx("flex h-full min-h-0 flex-col gap-2", className)}>
      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl">
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      <div className="flex shrink-0 items-center gap-3 text-xs text-muted">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "재생" : "일시정지"}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink/15 text-[10px] text-ink transition-colors hover:bg-ink/5"
        >
          {paused ? "▶" : "❚❚"}
        </button>
        <label className="flex flex-1 items-center gap-2">
          <span className="whitespace-nowrap opacity-60">speed</span>
          <input
            type="range"
            min={MIN_SPEED}
            max={MAX_SPEED}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="h-1 flex-1 accent-ink"
          />
          <span className="w-5 text-right tabular-nums opacity-60">{speed}</span>
        </label>
      </div>
    </div>
  );
}
