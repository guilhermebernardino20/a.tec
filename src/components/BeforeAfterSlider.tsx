"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import TextReveal from "@/components/ui/TextReveal";
import { cn } from "@/lib/utils";

const WEAK = {
  tag: "Prova vulnerável",
  title: "Laudo comum",
  items: [
    "Quesitos genéricos, baixados da internet e iguais para qualquer caso",
    "Laudo prolixo, sem método declarado nem rigor científico",
    "Nenhum parecer de impugnação ao que foi produzido pelo juízo",
    "Alto risco de procedência contrária por prova frágil",
  ],
};

const STRONG = {
  tag: "Estratégia a.tec",
  title: "Atuação a.tec",
  items: [
    "Estudo de viabilidade técnica antes de definir a tese",
    "Quesitos sob medida, mirando o ponto cego daquele processo",
    "Parecer técnico claro e inteligível para o magistrado",
    "Acompanhamento presencial ou online no ato pericial",
  ],
};

/**
 * Comparação arrastável entre a prova frágil e a atuação da a.tec.
 * O divisor responde a ponteiro e a teclado; a posição vive em um
 * motion value, então arrastar não dispara re-render.
 */
export default function BeforeAfterSlider() {
  const wrapper = useRef<HTMLDivElement>(null);
  const position = useMotionValue(52);
  const [dragging, setDragging] = useState(false);
  const [announced, setAnnounced] = useState(52);

  // o painel frágil é recortado da direita para a esquerda
  const inset = useTransform(position, (v) => 100 - v);
  const clip = useMotionTemplate`inset(0 ${inset}% 0 0)`;
  const handleLeft = useMotionTemplate`${position}%`;

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = wrapper.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const next = ((clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(96, Math.max(4, next));
      position.set(clamped);
      setAnnounced(Math.round(clamped));
    },
    [position],
  );

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => setFromClientX(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, setFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    const current = position.get();
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = Math.min(
        96,
        Math.max(4, current + (e.key === "ArrowRight" ? step : -step)),
      );
      position.set(next);
      setAnnounced(Math.round(next));
    }
    if (e.key === "Home") {
      e.preventDefault();
      position.set(4);
      setAnnounced(4);
    }
    if (e.key === "End") {
      e.preventDefault();
      position.set(96);
      setAnnounced(96);
    }
  };

  return (
    <section id="comparativo" className="bg-paper py-20 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 pb-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Mono className="text-ink-mute">Antes e depois pericial</Mono>
          </div>
          <div className="lg:col-span-9">
            <TextReveal
              as="h2"
              lines={[
                "A diferença entre",
                "um laudo comum e uma",
                "estratégia vitoriosa.",
              ]}
              className="text-title max-w-[24ch] font-light text-ink"
            />
            <p className="mt-6 max-w-[52ch] text-body text-ink-soft">
              Arraste o divisor — ou use as setas do teclado — para comparar as
              duas formas de chegar à perícia.
            </p>
          </div>
        </div>

        <div
          ref={wrapper}
          onPointerDown={(e) => {
            setDragging(true);
            setFromClientX(e.clientX);
          }}
          className={cn(
            // abaixo de md não há largura para duas colunas legíveis:
            // o comparativo vira uma pilha e o divisor sai de cena
            "relative isolate hidden select-none overflow-hidden rounded-[28px] md:block md:rounded-[36px]",
            dragging ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          {/* base — atuação a.tec */}
          <Panel
            tone="strong"
            tag={STRONG.tag}
            title={STRONG.title}
            items={STRONG.items}
          />

          {/* sobreposição recortada — laudo comum */}
          <motion.div
            style={{ clipPath: clip }}
            className="absolute inset-0 z-10 will-change-[clip-path]"
          >
            <Panel
              tone="weak"
              tag={WEAK.tag}
              title={WEAK.title}
              items={WEAK.items}
            />
          </motion.div>

          {/* divisor */}
          <motion.div
            style={{ left: handleLeft }}
            className="absolute inset-y-0 z-20 w-px -translate-x-1/2 bg-paper/70"
          >
            <span
              aria-hidden
              className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-lime to-transparent"
            />
            <button
              type="button"
              role="slider"
              tabIndex={0}
              aria-label="Comparar laudo comum e atuação da a.tec"
              aria-valuemin={4}
              aria-valuemax={96}
              aria-valuenow={announced}
              aria-valuetext={`${announced}% de laudo comum à mostra`}
              onKeyDown={onKeyDown}
              onPointerDown={(e) => {
                e.stopPropagation();
                setDragging(true);
              }}
              className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-paper/40 bg-olive-deep/80 text-paper backdrop-blur-md transition-colors duration-300 hover:border-lime"
            >
              <span aria-hidden className="font-mono text-[11px] leading-none">
                ⇄
              </span>
            </button>
          </motion.div>
        </div>

        {/* pilha equivalente, para telas estreitas */}
        <div className="grid grid-cols-1 overflow-hidden rounded-[28px] md:hidden">
          <Panel
            tone="weak"
            stacked
            tag={WEAK.tag}
            title={WEAK.title}
            items={WEAK.items}
          />
          <Panel
            tone="strong"
            stacked
            tag={STRONG.tag}
            title={STRONG.title}
            items={STRONG.items}
          />
        </div>
      </Container>
    </section>
  );
}

function Panel({
  tone,
  tag,
  title,
  items,
  stacked = false,
}: {
  tone: "weak" | "strong";
  tag: string;
  title: string;
  items: string[];
  /** versão empilhada: sem altura mínima e sempre alinhada à esquerda */
  stacked?: boolean;
}) {
  const weak = tone === "weak";
  const alignRight = !weak && !stacked;

  return (
    <div
      className={cn(
        "flex h-full flex-col justify-between gap-10 p-7 md:p-12",
        stacked ? "gap-8" : "min-h-[520px] md:min-h-[560px]",
        weak ? "bg-stone text-ink" : "bg-olive-deep text-paper",
        // no comparativo lado a lado, cada painel encosta na metade que ocupa
        alignRight ? "items-end text-right" : "items-start text-left",
      )}
    >
      <div
        className={cn(
          "flex w-full items-start justify-between gap-6",
          alignRight && "flex-row-reverse",
        )}
      >
        <Mono
          className={cn(
            "border px-3 py-1.5",
            weak ? "border-ink/25 text-ink-soft" : "border-lime/60 text-lime",
          )}
        >
          [&nbsp;{tag}&nbsp;]
        </Mono>
        <Mono className={weak ? "text-ink-mute" : "text-paper/45"}>
          {weak ? "Parte contrária" : "a.tec"}
        </Mono>
      </div>

      <div className={alignRight ? "flex w-full flex-col items-end" : ""}>
        <h3
          className={cn(
            "text-heading font-light",
            weak ? "text-ink/70" : "text-paper",
          )}
        >
          {title}
        </h3>

        <ul className={cn("mt-7 max-w-[44ch] space-y-4", alignRight && "ml-auto")}>
          {items.map((item) => (
            <li
              key={item}
              className={cn(
                "flex gap-4 border-t pt-4 text-body",
                weak ? "border-ink/12 text-ink-soft" : "border-paper/15 text-paper/85",
                alignRight && "flex-row-reverse",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-1 font-mono text-[11px] leading-none",
                  weak ? "text-ink-mute" : "text-lime",
                )}
              >
                {weak ? "×" : "→"}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
