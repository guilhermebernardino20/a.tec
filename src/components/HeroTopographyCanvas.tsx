"use client";

import { useEffect, useRef } from "react";

/**
 * Malha topográfica do herói.
 *
 * Um relevo fixo em perspectiva — linhas de nível de um terreno técnico —
 * que o cursor deforma como uma onda ao passar. O relevo em si é estático:
 * quando a onda assenta e o ponteiro para, o `requestAnimationFrame`
 * encerra de verdade, e o canvas não custa mais nada até o próximo
 * movimento.
 */

const COLS = 46;
const ROWS = 26;
const LINE = "127, 153, 112";
const RIPPLE_RADIUS = 260;
const LERP = 0.08;

export default function HeroTopographyCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let awake = false;
    let visible = true;

    // alvo do ponteiro e posição interpolada da onda
    const pointer = { x: -9999, y: -9999, active: false };
    const wave = { x: -9999, y: -9999, strength: 0, target: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    /** relevo fixo do terreno, em unidades normalizadas */
    const relief = (u: number, t: number) =>
      Math.sin(u * 3.1 + t * 5.2) * 0.55 +
      Math.cos(u * 6.4 - t * 3.1) * 0.28 +
      Math.sin(u * 1.7 + t * 9.0) * 0.16;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      const horizon = height * 0.34;
      const points: { x: number; y: number; a: number }[][] = [];

      for (let j = 0; j <= ROWS; j++) {
        const t = j / ROWS;
        // perspectiva: linhas se abrem e se afastam em direção à base
        const persp = Math.pow(t, 1.85);
        const y0 = horizon + persp * (height * 1.02 - horizon);
        const spread = 0.22 + persp * 1.75;
        const amp = 26 + persp * 90;

        const row: { x: number; y: number; a: number }[] = [];
        for (let i = 0; i <= COLS; i++) {
          const u = (i / COLS) * 2 - 1;
          const x = width / 2 + u * spread * (width / 2);
          let y = y0 + relief(u, t) * amp * 0.35;

          if (wave.strength > 0.002) {
            const dx = x - wave.x;
            const dy = y - wave.y;
            const d2 = dx * dx + dy * dy;
            const r2 = RIPPLE_RADIUS * RIPPLE_RADIUS;
            if (d2 < r2 * 2.2) {
              // sino gaussiano: o terreno sobe em direção ao cursor
              const bump = Math.exp(-d2 / r2) * wave.strength;
              y -= bump * (34 + persp * 46);
            }
          }

          row.push({ x, y, a: 0.05 + persp * 0.95 });
        }
        points.push(row);
      }

      ctx.lineWidth = 0.8;

      // linhas de nível (horizontais)
      for (let j = 0; j <= ROWS; j++) {
        const row = points[j];
        ctx.beginPath();
        ctx.moveTo(row[0].x, row[0].y);
        for (let i = 1; i <= COLS; i++) ctx.lineTo(row[i].x, row[i].y);
        ctx.strokeStyle = `rgba(${LINE}, ${(0.15 * row[0].a).toFixed(3)})`;
        ctx.stroke();
      }

      // meridianos (verticais), mais espaçados para não fechar a malha
      for (let i = 0; i <= COLS; i += 2) {
        ctx.beginPath();
        ctx.moveTo(points[0][i].x, points[0][i].y);
        for (let j = 1; j <= ROWS; j++) ctx.lineTo(points[j][i].x, points[j][i].y);
        ctx.strokeStyle = `rgba(${LINE}, 0.07)`;
        ctx.stroke();
      }
    };

    const frame = () => {
      // a onda persegue o cursor e decai quando ele para
      wave.x += (pointer.x - wave.x) * LERP;
      wave.y += (pointer.y - wave.y) * LERP;
      wave.strength += (wave.target - wave.strength) * LERP;

      draw();

      const settled =
        Math.abs(wave.target - wave.strength) < 0.004 &&
        (wave.target === 0 ||
          (Math.abs(pointer.x - wave.x) < 0.6 && Math.abs(pointer.y - wave.y) < 0.6));

      if (settled) {
        // repouso: nada mais a animar até o próximo movimento
        awake = false;
        raf = 0;
        if (wave.target === 0) {
          wave.strength = 0;
          draw();
        }
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (awake || !visible || reduced) return;
      awake = true;
      raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = inside;
      wave.target = inside ? 1 : 0;

      if (wave.strength === 0) {
        // primeira entrada: nasce sob o cursor, sem varrer a tela
        wave.x = pointer.x;
        wave.y = pointer.y;
      }
      wake();
    };

    const onLeave = () => {
      pointer.active = false;
      wave.target = 0;
      wake();
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
          awake = false;
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
