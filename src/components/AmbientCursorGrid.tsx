"use client";

import { useEffect, useRef } from "react";

/**
 * Halo de luz que segue o cursor e acende a grelha do site.
 *
 * Camada fixa acima das seções e abaixo do cabeçalho, em `multiply`: no
 * papel claro o verde-oliva escurece de leve e as linhas da grelha só
 * aparecem no raio do cursor — a leitura é de circuito sendo ativado.
 *
 * Sem re-render: a posição vai direto para CSS vars dentro de um rAF.
 * Fica fora do ar em ponteiro grosso (toque) e sob movimento reduzido.
 */
export default function AmbientCursorGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let frame = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        el.style.setProperty("--ambient-opacity", "1");
      }
      if (frame) return;
      const { clientX, clientY } = e;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.setProperty("--ambient-x", `${clientX}px`);
        el.style.setProperty("--ambient-y", `${clientY}px`);
      });
    };

    const onLeave = () => {
      visible = false;
      el.style.setProperty("--ambient-opacity", "0");
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
      className="pointer-events-none fixed inset-0 z-[45] opacity-[var(--ambient-opacity,0)] mix-blend-multiply transition-opacity duration-700"
      style={
        {
          "--ambient-x": "50vw",
          "--ambient-y": "50vh",
        } as React.CSSProperties
      }
    >
      {/* halo difuso */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(340px circle at var(--ambient-x) var(--ambient-y), rgba(127, 153, 112, 0.16), transparent 70%)",
        }}
      />

      {/* grelha revelada apenas no raio do cursor */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(58, 71, 40, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(58, 71, 40, 0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(220px circle at var(--ambient-x) var(--ambient-y), #000 0%, rgba(0,0,0,0.35) 45%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(220px circle at var(--ambient-x) var(--ambient-y), #000 0%, rgba(0,0,0,0.35) 45%, transparent 75%)",
        }}
      />
    </div>
  );
}
