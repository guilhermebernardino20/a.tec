"use client";

import { useEffect, useRef } from "react";

type Blob = {
  hue: [number, number, number];
  x: number;
  y: number;
  r: number;
  /** parâmetros da órbita lenta */
  ax: number;
  ay: number;
  sx: number;
  sy: number;
  phase: number;
};

const BLOBS: Blob[] = [
  // massa profunda que ancora o canto inferior esquerdo
  { hue: [16, 24, 13], x: 0.2, y: 0.78, r: 0.78, ax: 0.08, ay: 0.05, sx: 0.021, sy: 0.03, phase: 4.4 },
  { hue: [40, 66, 32], x: 0.3, y: 0.44, r: 0.66, ax: 0.11, ay: 0.08, sx: 0.047, sy: 0.035, phase: 0 },
  { hue: [96, 133, 72], x: 0.66, y: 0.3, r: 0.52, ax: 0.13, ay: 0.1, sx: 0.029, sy: 0.043, phase: 1.7 },
  // brilho quente, no lugar do reflexo do render de referência
  { hue: [214, 224, 196], x: 0.78, y: 0.6, r: 0.3, ax: 0.1, ay: 0.08, sx: 0.038, sy: 0.026, phase: 3.1 },
  { hue: [150, 178, 118], x: 0.9, y: 0.86, r: 0.36, ax: 0.07, ay: 0.06, sx: 0.033, sy: 0.022, phase: 5.6 },
  { hue: [12, 18, 10], x: 0.05, y: 0.12, r: 0.5, ax: 0.06, ay: 0.05, sx: 0.019, sy: 0.027, phase: 2.2 },
];

/**
 * Superfície orgânica em movimento — massas de luz que se atravessam
 * lentamente, no lugar de um loop de vídeo. Pausa fora da viewport e
 * sob `prefers-reduced-motion`.
 */
export default function OrganicCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // resolução reduzida: a imagem é toda desfocada, ninguém vê os pixels
      const scale = Math.min(window.devicePixelRatio || 1, 1.4) * 0.42;
      width = Math.max(1, Math.round(rect.width * scale));
      height = Math.max(1, Math.round(rect.height * scale));
      canvas.width = width;
      canvas.height = height;
    };

    const paint = (now: number) => {
      const t = reduced ? 0 : (now - start) / 1000;

      ctx.fillStyle = "#0f1410";
      ctx.fillRect(0, 0, width, height);

      const unit = Math.max(width, height);
      ctx.globalCompositeOperation = "lighter";

      for (const b of BLOBS) {
        const cx = (b.x + Math.sin(t * b.sx * Math.PI * 2 + b.phase) * b.ax) * width;
        const cy = (b.y + Math.cos(t * b.sy * Math.PI * 2 + b.phase) * b.ay) * height;
        const r = b.r * unit * (0.92 + Math.sin(t * 0.13 + b.phase) * 0.08);

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const [rr, gg, bb] = b.hue;
        g.addColorStop(0, `rgba(${rr}, ${gg}, ${bb}, 0.95)`);
        g.addColorStop(0.45, `rgba(${rr}, ${gg}, ${bb}, 0.4)`);
        g.addColorStop(1, `rgba(${rr}, ${gg}, ${bb}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";

      // vinheta para assentar o branco do título
      const v = ctx.createLinearGradient(0, 0, 0, height);
      v.addColorStop(0, "rgba(10, 14, 9, 0.62)");
      v.addColorStop(0.4, "rgba(10, 14, 9, 0.05)");
      v.addColorStop(1, "rgba(10, 14, 9, 0.72)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, width, height);

      if (!reduced && running) raf = requestAnimationFrame(paint);
    };

    resize();
    raf = requestAnimationFrame(paint);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) requestAnimationFrame(paint);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === running) return;
        running = entry.isIntersecting;
        if (running && !reduced) raf = requestAnimationFrame(paint);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ filter: "blur(26px) saturate(112%)", transform: "scale(1.12)" }}
    />
  );
}
