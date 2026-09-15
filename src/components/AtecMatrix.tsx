"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MATRIX,
  RIGOR_LABEL,
  type Impact,
  type RigorLevel,
} from "@/lib/matrix";
import { prefillContact } from "@/lib/prefill";
import { getMatrixWhatsAppUrl } from "@/utils/whatsapp";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** abaixo de lg o resultado fica sob a lista: o clique leva até ele */
const STACKED = "(max-width: 1023px)";

/** Selo qualitativo do peso da prova técnica na tese. */
const IMPACT_STYLE: Record<Impact, string> = {
  CRÍTICO: "bg-lime/15 text-lime",
  ESSENCIAL: "bg-mint/10 text-mint",
  ALTO: "bg-paper/10 text-paper/80",
};

/** Rótulo numerado de cada bloco do diagnóstico. */
function BlockLabel({ index, children }: { index: string; children: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-mono text-olive-light">{index}</span>
      <Mono className="text-paper/55">{children}</Mono>
    </div>
  );
}

/** Rigor metodológico exigido: quatro degraus finos. */
function RigorMeter({ level }: { level: RigorLevel }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm text-paper/60">
          Rigor metodológico exigido
        </span>
        <span className="text-sm text-paper">{RIGOR_LABEL[level]}</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5" aria-hidden>
        {([1, 2, 3, 4] as RigorLevel[]).map((step) => (
          <span
            key={step}
            className={cn(
              "h-[3px] rounded-full transition-colors duration-500",
              step <= level ? "bg-olive-light" : "bg-paper/10",
            )}
          />
        ))}
      </div>
      <p className="sr-only">
        Rigor metodológico {RIGOR_LABEL[level]}: nível {level} de 4.
      </p>
    </div>
  );
}

/**
 * A.TEC Matrix: escolher a área e o tipo de litígio já mostra o
 * diagnóstico (ponto cego, quesitos e viabilidade), sem etapa
 * intermediária.
 */
export default function AtecMatrix() {
  const [areaId, setAreaId] = useState(MATRIX[0].id);
  const [caseId, setCaseId] = useState(MATRIX[0].cases[0].id);
  const result = useRef<HTMLDivElement>(null);

  const area = useMemo(
    () => MATRIX.find((a) => a.id === areaId) ?? MATRIX[0],
    [areaId],
  );
  const current = area.cases.find((c) => c.id === caseId) ?? area.cases[0];

  const selectArea = (id: string) => {
    const next = MATRIX.find((a) => a.id === id);
    if (!next) return;
    setAreaId(id);
    setCaseId(next.cases[0].id);
  };

  const selectCase = (id: string) => {
    setCaseId(id);
    if (window.matchMedia(STACKED).matches) {
      result.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="matrix" className="bg-paper py-20 md:py-32">
      <Container>
        <div
          data-surface="dark"
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-dark-card text-paper"
        >
          {/* cabeçalho */}
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-6 pb-2 pt-8 md:px-12 md:pt-12">
            <h2 className="text-heading font-light">A.TEC Matrix</h2>
            <span className="text-sm text-paper/50">
              Central de inteligência pericial
            </span>
          </div>

          <div className="grid grid-cols-1 gap-y-4 px-6 pb-8 pt-6 md:px-12 md:pb-12 lg:grid-cols-12 lg:gap-x-12">
            {/* --------- seleção --------- */}
            <div className="lg:col-span-5">
              <Mono className="text-paper/45">Área de atuação</Mono>
              <div
                className="mt-4 flex flex-wrap gap-2"
                role="group"
                aria-label="Área de atuação"
              >
                {MATRIX.map((a) => {
                  const active = a.id === area.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => selectArea(a.id)}
                      aria-pressed={active}
                      className={cn(
                        "min-h-11 rounded-full border px-4 py-2.5 text-sm transition-all duration-300 active:scale-[0.99]",
                        active
                          ? "border-paper bg-paper text-ink"
                          : "border-white/10 text-paper/70 hover:border-olive/40 hover:bg-white/[0.03] hover:text-paper",
                      )}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>

              <Mono className="mt-10 block text-paper/45">Tipo de litígio</Mono>
              <ul className="mt-3">
                {area.cases.map((c) => {
                  const active = c.id === current.id;
                  return (
                    <li
                      key={c.id}
                      className="border-b border-paper/[0.08] last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => selectCase(c.id)}
                        aria-pressed={active}
                        aria-controls="matrix-resultado"
                        className={cn(
                          "group flex min-h-14 w-full items-center justify-between gap-4 min-h-[48px] rounded-xl px-4 py-4 text-left transition-all duration-300 hover:bg-white/[0.03] active:scale-[0.99]",
                          active
                            ? "text-paper"
                            : "text-paper/55 hover:text-paper",
                        )}
                      >
                        <span className="text-body">{c.label}</span>
                        <span
                          aria-hidden
                          className={cn(
                            "text-base transition-all duration-300",
                            active
                              ? "translate-x-0 text-olive-light opacity-100"
                              : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60",
                          )}
                        >
                          →
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* --------- diagnóstico --------- */}
            <div
              ref={result}
              id="matrix-resultado"
              aria-live="polite"
              className="scroll-mt-24 border-t border-paper/[0.08] pt-8 lg:col-span-7 lg:min-h-[640px] lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.28, ease: EASE }}
                >
                  <p className="text-sm text-paper/45">
                    {area.label} · {current.label}
                  </p>

                  <section className="mt-6">
                    <BlockLabel index="01">Ponto cego pericial</BlockLabel>
                    <p className="mt-4 text-lead font-light text-paper/90">
                      {current.blindSpot}
                    </p>
                  </section>

                  <section className="mt-10 border-t border-paper/[0.08] pt-8">
                    <BlockLabel index="02">
                      Direcionamento de quesitos
                    </BlockLabel>
                    <ol className="mt-5 space-y-4">
                      {current.questioning.map((q, i) => (
                        <li
                          key={q}
                          className="flex gap-4 text-body text-paper/80"
                        >
                          <span className="mt-[3px] w-5 shrink-0 font-mono text-mono text-paper/35">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section className="mt-10 border-t border-paper/[0.08] pt-8">
                    <BlockLabel index="03">Prova e viabilidade</BlockLabel>

                    <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-paper/50">Risco</p>
                        <p className="mt-2 text-sm leading-relaxed text-paper/80">
                          {current.evidence.risk}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-paper/50">Oportunidade</p>
                        <p className="mt-2 text-sm leading-relaxed text-paper/80">
                          {current.evidence.opportunity}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-end">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm text-paper/60">
                          Impacto na tese
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium tracking-wide",
                            IMPACT_STYLE[current.evidence.impact],
                          )}
                        >
                          {current.evidence.impact}
                        </span>
                      </div>
                      <RigorMeter level={current.evidence.rigor} />
                    </div>

                    <p className="mt-6 text-sm text-paper/55">
                      {current.evidence.horizon}
                    </p>
                  </section>

                  <div className="mt-10 flex flex-col gap-3 border-t border-paper/[0.08] pt-8 sm:flex-row sm:flex-wrap">
                    <a
                      href="#contato"
                      onClick={() =>
                        prefillContact(
                          `Gostaria de agendar uma análise de viabilidade para o caso de ${current.label} na área de ${area.label}.`,
                          { area: area.label, caso: current.label },
                        )
                      }
                      className="inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-colors duration-300 hover:bg-mint"
                    >
                      Solicitar minuta de quesitos
                      <span aria-hidden>→</span>
                    </a>
                    <a
                      href={getMatrixWhatsAppUrl(area.label, current.label)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Falar no WhatsApp sobre um caso de ${area.label}: ${current.label}`}
                      className="inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-paper/[0.08] px-6 py-3 text-sm text-paper transition-colors duration-300 hover:bg-paper/[0.16]"
                    >
                      Falar no WhatsApp
                      <span aria-hidden>↗</span>
                    </a>
                  </div>

                  <p className="mt-6 max-w-[62ch] text-[11px] leading-normal text-paper/40">
                    Análise preditiva baseada em padrões de impugnação e
                    metodologia pericial a.tec. Não substitui a análise
                    documental prévia do caso concreto.
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
