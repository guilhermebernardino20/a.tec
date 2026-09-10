"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const fmt = (n: number) => n.toLocaleString("pt-BR");

/**
 * Contagem progressiva de 0 até o valor final, disparada quando a seção
 * entra na viewport. Escreve direto no nó de texto — sem re-render por
 * quadro — e respeita movimento reduzido.
 */
export default function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;

    if (reduced) {
      el.textContent = prefix + fmt(value) + suffix;
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
      el.textContent = prefix + fmt(Math.round(value * eased)) + suffix;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, prefix, suffix, duration, reduced]);

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {prefix}0{suffix}
    </span>
  );
}
