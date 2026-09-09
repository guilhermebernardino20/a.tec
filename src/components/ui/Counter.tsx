"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const fmt = (n: number) => n.toLocaleString("pt-BR");

/**
 * Contador editorial: conta uma única vez, ao entrar na viewport.
 * Escreve direto no nó de texto — sem re-render a cada quadro.
 */
export default function Counter({
  value,
  prefix = "",
  duration = 1.8,
}: {
  value: number;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;

    if (reduced) {
      el.textContent = prefix + fmt(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = prefix + fmt(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, prefix, duration, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}0
    </span>
  );
}
