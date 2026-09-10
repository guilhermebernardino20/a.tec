"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "0123456789ABCDEF";

/**
 * Revelação por decodificação: os caracteres passam por glifos
 * hexadecimais antes de assentar no texto real.
 *
 * O texto verdadeiro é renderizado no servidor e permanece no DOM para o
 * leitor de tela; o nó animado é `aria-hidden` e recebe as trocas direto
 * em `textContent` — nenhum re-render por quadro. Sob movimento reduzido,
 * o efeito não roda.
 */
export default function Scramble({
  text,
  /** troque para reexecutar a decodificação (ex.: id do caso) */
  trigger,
  className,
  duration = 380,
}: {
  text: string;
  trigger?: string | number;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }

    const chars = Array.from(text);
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);

      let out = "";
      for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        // espaços e quebras ficam de pé: o bloco não "pula" durante a troca
        if (char === " " || char === "\n") {
          out += char;
          continue;
        }
        // cada caractere assenta em um ponto diferente do percurso
        const settleAt = (i / chars.length) * 0.72 + 0.28;
        out +=
          t >= settleAt ? char : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;

      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      el.textContent = text;
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      // nunca deixar glifo para trás se a seleção mudar no meio
      el.textContent = text;
    };
  }, [text, trigger, duration]);

  return (
    <>
      <span ref={ref} aria-hidden className={className}>
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}
