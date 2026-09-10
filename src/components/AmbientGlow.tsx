"use client";

import { useEffect, useRef } from "react";

/**
 * Halo de luz que acompanha o cursor — discreto de propósito.
 *
 * Um único gradiente esmeralda de raio curto, em `plus-lighter`: acende
 * de leve as superfícies escuras e desaparece por completo sobre o papel
 * claro, sem interferir na leitura. A posição é interpolada (lerp) para
 * o brilho chegar sempre atrás do ponteiro, nunca colado nele.
 *
 * Nada de re-render: o rAF escreve direto em CSS vars e dorme quando o
 * halo alcança o cursor.
 */
const LERP = 0.075;

export default function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let frame = 0;
    let awake = false;

    const tick = () => {
      const dx = target.x - current.x;
      const dy = target.y - current.y;

      current.x += dx * LERP;
      current.y += dy * LERP;

      el.style.setProperty("--glow-x", `${current.x.toFixed(1)}px`);
      el.style.setProperty("--glow-y", `${current.y.toFixed(1)}px`);

      // dorme quando alcança o cursor; o próximo movimento acorda
      if (Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4) {
        awake = false;
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (awake) return;
      awake = true;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      el.style.setProperty("--glow-opacity", "1");
      wake();
    };

    const onLeave = () => {
      el.style.setProperty("--glow-opacity", "0");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[45] opacity-[var(--glow-opacity,0)] transition-opacity duration-700 [mix-blend-mode:plus-lighter]"
      style={
        {
          "--glow-x": "50vw",
          "--glow-y": "50vh",
          background:
            "radial-gradient(220px circle at var(--glow-x) var(--glow-y), rgba(127, 153, 112, 0.12), transparent 68%)",
        } as React.CSSProperties
      }
    />
  );
}
