"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Mono from "@/components/ui/Mono";

const EASE = [0.16, 1, 0.3, 1] as const;
const SCAN_MS = 800;

/** Fases da leitura do dossiê, exibidas no chip de status. */
type Phase = "idle" | "scanning" | "done";

const BRACKETS = [
  { key: "tl", className: "left-2 top-2 border-l border-t" },
  { key: "tr", className: "right-2 top-2 border-r border-t" },
  { key: "bl", className: "bottom-2 left-2 border-b border-l" },
  { key: "br", className: "bottom-2 right-2 border-b border-r" },
] as const;

/** Malha de captura: pontos de 8px, quase imperceptíveis. */
const DOT_PATTERN =
  "radial-gradient(rgba(58, 71, 40, 0.6) 1px, transparent 1px)";

/**
 * Cartão de especialidade com pré-visualização de leitura documental.
 *
 * O hover (ou o foco de teclado) dispara uma varredura: a mira encaixa,
 * o feixe percorre o cartão e o chip de status passa de PRONTO a
 * ESCANEANDO e, ao fim, ao número real de documentos recomendados.
 *
 * Todo o HUD é decorativo (`aria-hidden`); o que chega ao leitor de tela
 * é o rótulo do botão e o conteúdo do cartão.
 */
export default function SpecialtyCard({
  index,
  title,
  body,
  documents,
  onOpen,
}: {
  index: string;
  title: string;
  body: string;
  /** quantidade de documentos recomendados para essa especialidade */
  documents: number;
  onOpen: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const timer = useRef(0);
  const reduced = useReducedMotion();

  const start = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    setPhase("scanning");
    timer.current = window.setTimeout(() => setPhase("done"), SCAN_MS);
  }, []);

  const reset = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = 0;
    setPhase("idle");
  }, []);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const active = phase !== "idle";

  return (
    <SpotlightCard
      as="button"
      type="button"
      onClick={onOpen}
      onPointerEnter={start}
      onPointerLeave={reset}
      onFocus={start}
      onBlur={reset}
      aria-haspopup="dialog"
      aria-label={`Abrir o método de trabalho da a.tec em ${title}`}
      className="group/card relative w-full overflow-hidden rounded-sm px-4 pb-12 pt-6 text-left"
    >
      {/* malha de captura */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: DOT_PATTERN, backgroundSize: "8px 8px" }}
        animate={
          reduced
            ? { opacity: 0.05 }
            : { opacity: active ? [0.06, 0.13, 0.06] : 0.05 }
        }
        transition={
          active && !reduced
            ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.4 }
        }
      />

      {/* mira de encaixe */}
      {BRACKETS.map((bracket, i) => (
        <motion.span
          key={bracket.key}
          aria-hidden
          className={`pointer-events-none absolute h-3 w-3 border-[#7F9970]/50 ${bracket.className}`}
          initial={false}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.3, ease: EASE, delay: active ? i * 0.03 : 0 }}
        />
      ))}

      {/* feixe com rastro: a lâmina de luz fica na borda inferior do rastro */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#7F9970]/15 to-[#7F9970]/40"
        initial={false}
        animate={{ top: active && !reduced ? "100%" : "-56px" }}
        transition={
          active && !reduced
            ? { duration: 1.2, ease: "linear" }
            : { duration: 0 }
        }
      >
        <span className="absolute inset-x-0 bottom-0 h-px bg-[#A3B899] shadow-[0_0_8px_#7F9970]" />
      </motion.span>

      <span className="relative block">
        <span className="flex items-center justify-between gap-4">
          <Mono className="text-ink-mute">{index}.</Mono>
          <Mono className="text-ink-mute/0 transition-colors duration-500 group-hover/card:text-ink-mute">
            Ver método →
          </Mono>
        </span>

        <span className="mt-3 block font-sans text-lg font-light text-ink">{title}</span>
        <span className="mt-2 block max-w-[46ch] text-body text-ink-soft">{body}</span>
      </span>

      {/* chip de status da leitura */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 border border-ink/12 bg-paper/70 px-2.5 py-1.5 text-[11px] leading-normal text-ink-mute backdrop-blur-sm"
      >
        {phase === "scanning" ? (
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lime animate-[led-pulse_0.9s_ease-in-out_infinite]" />
        ) : (
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              phase === "done" ? "bg-lime" : "bg-ink/25"
            }`}
          />
        )}
        {phase === "idle" ? "OCR pronto" : null}
        {phase === "scanning" ? "Escaneando laudo…" : null}
        {phase === "done"
          ? `Indexado · ${documents} documentos recomendados`
          : null}
      </span>
    </SpotlightCard>
  );
}
