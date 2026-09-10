"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MATRIX, RIGOR_LABEL, type Impact, type MatrixCase, type RigorLevel } from "@/lib/matrix";
import { prefillContact } from "@/lib/prefill";
import { getMatrixWhatsAppUrl } from "@/utils/whatsapp";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import Scramble from "@/components/ui/Scramble";
import MatrixRadarBg from "@/components/MatrixRadarBg";
import ScanEdge from "@/components/ui/ScanEdge";
import StatusLed from "@/components/ui/StatusLed";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const SCAN_MS = 1500;

const SCAN_LOG = [
  "Indexando peças e laudos do tipo selecionado",
  "Cruzando protocolos e normas aplicáveis",
  "Mapeando falhas recorrentes na perícia oficial",
  "Calculando relevância probatória",
];

type Phase = "idle" | "scanning" | "result";

/** Radar do painel: anéis, varredura cônica e nós pulsando. */
function Radar({ active }: { active: boolean }) {
  return (
    <div className="relative aspect-square w-full max-w-[260px]">
      {[0.35, 0.62, 0.88, 1].map((r) => (
        <span
          key={r}
          aria-hidden
          className="absolute rounded-full border border-paper/12"
          style={{
            inset: `${(1 - r) * 50}%`,
          }}
        />
      ))}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(127,153,112,0) 0deg, rgba(127,153,112,0.35) 40deg, rgba(198,212,191,0.05) 90deg, rgba(127,153,112,0) 150deg)",
          animation: `radar-spin ${active ? 1.1 : 7}s linear infinite`,
        }}
      />
      <span aria-hidden className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-paper/8" />
      <span aria-hidden className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-paper/8" />

      {[
        [0.28, 0.34],
        [0.72, 0.3],
        [0.6, 0.68],
        [0.36, 0.74],
        [0.82, 0.55],
      ].map(([x, y], i) => (
        <span
          key={`${x}-${y}`}
          aria-hidden
          className="absolute h-1.5 w-1.5 rounded-full bg-lime"
          style={{
            left: `${x * 100}%`,
            top: `${y * 100}%`,
            animation: `led-pulse ${active ? 1.2 : 3.4}s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/** Moldura holográfica: cantoneiras em L e cabeçalho técnico. */
function HudCard({
  header,
  children,
}: {
  header: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-md border border-white/10 bg-white/[0.015] p-5 md:p-6">
      {[
        "left-0 top-0 border-l border-t",
        "right-0 top-0 border-r border-t",
        "bottom-0 left-0 border-b border-l",
        "bottom-0 right-0 border-b border-r",
      ].map((corner) => (
        <span
          key={corner}
          aria-hidden
          className={`pointer-events-none absolute h-3 w-3 border-[#7F9970]/40 ${corner}`}
        />
      ))}

      <p className="font-mono text-[9px] uppercase tracking-widest text-[#7F9970]/70">
        {header}
      </p>

      <div className="mt-4">{children}</div>
    </div>
  );
}

/** Selo qualitativo do peso da prova técnica na tese. */
const IMPACT_STYLE: Record<Impact, string> = {
  CRÍTICO: "border-lime/70 text-lime",
  ESSENCIAL: "border-mint/50 text-mint",
  ALTO: "border-paper/35 text-paper/80",
};

function ImpactBadge({ impact }: { impact: Impact }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-mono uppercase",
        IMPACT_STYLE[impact],
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {impact}
    </span>
  );
}

/** Rigor metodológico exigido: quatro degraus, preenchidos com mola. */
function RigorMeter({ level }: { level: RigorLevel }) {
  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Mono className="text-paper/50">Nível de rigor metodológico exigido</Mono>
        <span className="font-mono text-mono uppercase text-lime">
          {RIGOR_LABEL[level]}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1" aria-hidden>
        {([1, 2, 3, 4] as RigorLevel[]).map((step) => (
          <div key={step} className="h-1 overflow-hidden bg-paper/12">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: step <= level ? 1 : 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.25 + step * 0.12 }}
              className="h-full origin-left bg-gradient-to-r from-olive to-lime"
            />
          </div>
        ))}
      </div>
      <p className="sr-only">
        Rigor metodológico {RIGOR_LABEL[level]}: nível {level} de 4.
      </p>
    </div>
  );
}

export default function AtecMatrix() {
  const [areaId, setAreaId] = useState(MATRIX[0].id);
  const [caseId, setCaseId] = useState(MATRIX[0].cases[0].id);
  const [phase, setPhase] = useState<Phase>("idle");
  const [logIndex, setLogIndex] = useState(0);
  // pulso de sonar: nasce no ponto exato do clique
  const [pulse, setPulse] = useState<{ x: number; y: number; id: number } | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  // contador próprio: identifica cada pulso sem depender do relógio
  const pulseId = useRef(0);
  const timers = useRef<number[]>([]);

  const area = useMemo(
    () => MATRIX.find((a) => a.id === areaId) ?? MATRIX[0],
    [areaId],
  );
  const current: MatrixCase =
    area.cases.find((c) => c.id === caseId) ?? area.cases[0];

  /** posiciona o pulso onde o usuário clicou, em coordenadas do painel */
  const emitPulse = (event: React.MouseEvent<HTMLElement>) => {
    const box = panel.current?.getBoundingClientRect();
    if (!box) return;
    const target = event.currentTarget.getBoundingClientRect();
    setPulse({
      x: target.left + target.width / 2 - box.left,
      y: target.top + target.height / 2 - box.top,
      id: (pulseId.current += 1),
    });
  };

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const selectArea = (id: string, event: React.MouseEvent<HTMLElement>) => {
    const next = MATRIX.find((a) => a.id === id);
    if (!next) return;
    emitPulse(event);
    clearTimers();
    setAreaId(id);
    setCaseId(next.cases[0].id);
    setPhase("idle");
  };

  const selectCase = (id: string, event: React.MouseEvent<HTMLElement>) => {
    emitPulse(event);
    clearTimers();
    setCaseId(id);
    setPhase("idle");
  };

  const process = () => {
    clearTimers();
    setLogIndex(0);
    setPhase("scanning");

    SCAN_LOG.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => setLogIndex(i + 1), (SCAN_MS / SCAN_LOG.length) * (i + 1)),
      );
    });
    timers.current.push(window.setTimeout(() => setPhase("result"), SCAN_MS));
  };

  return (
    <section id="matrix" className="bg-paper py-20 md:py-28">
      <Container>
        <div
          ref={panel}
          data-surface="dark"
          className="relative overflow-hidden rounded-[32px] bg-olive-deep text-paper md:rounded-[40px]"
        >
          <MatrixRadarBg active={phase !== "idle"} />

          {/* pulso de sonar a partir do controle acionado */}
          <AnimatePresence>
            {pulse ? (
              <motion.span
                key={pulse.id}
                aria-hidden
                initial={{ opacity: 0.5, scale: 0 }}
                animate={{ opacity: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                onAnimationComplete={() => setPulse(null)}
                className="pointer-events-none absolute z-20 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime/40"
                style={{ left: pulse.x, top: pulse.y }}
              />
            ) : null}
          </AnimatePresence>

          <ScanEdge orientation="x" duration={7} />
          <ScanEdge orientation="y" duration={9} delay={1.4} />
          <ScanEdge orientation="x" duration={8} delay={3} className="bottom-0 top-auto" />

          {/* cabeçalho do painel */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-paper/12 px-6 py-5 md:px-10">
            <div className="flex items-baseline gap-4">
              <Mono className="title-sheen [--sheen-base:#f7f7f5] [--sheen-light:#b7d492]">
                a.tec matrix
              </Mono>
              <span className="text-sm text-paper/45">Central de inteligência pericial</span>
            </div>
            <StatusLed
              label={
                phase === "scanning"
                  ? "Processando análise"
                  : phase === "result"
                    ? "Análise concluída"
                    : "Sistema pronto"
              }
            />
          </div>

          {/* transmissão: da seleção para o diagnóstico */}
          {phase === "result" ? (
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full lg:block"
            >
              <defs>
                <linearGradient id="matrix-stream" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7F9970" stopOpacity="0" />
                  <stop offset="55%" stopColor="#A3B899" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#B7D492" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              {[22, 50, 78].map((y, i) => (
                <path
                  key={y}
                  d={`M40 50 C 43 50, 43 ${y}, 47 ${y}`}
                  fill="none"
                  stroke="url(#matrix-stream)"
                  strokeWidth="0.35"
                  strokeDasharray="6 4"
                  style={{
                    animation: `data-stream ${2.4 + i * 0.4}s linear infinite`,
                  }}
                />
              ))}
            </svg>
          ) : null}

          <div className="relative grid grid-cols-1 lg:grid-cols-12">
            {/* --------- coluna de comando --------- */}
            <div className="border-b border-paper/12 px-6 py-8 md:px-10 lg:col-span-5 lg:border-b-0 lg:border-r">
              <Mono className="text-paper/45">01 — Área de atuação</Mono>
              <div className="mt-4 grid grid-cols-2 gap-px bg-paper/12">
                {MATRIX.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={(event) => selectArea(a.id, event)}
                    aria-pressed={a.id === area.id}
                    aria-label={`Selecionar área de atuação: ${a.label}`}
                    className={cn(
                      "flex flex-col items-start gap-1 bg-olive-deep px-4 py-4 text-left transition-colors duration-300",
                      a.id === area.id
                        ? "bg-olive text-paper"
                        : "text-paper/65 hover:bg-paper/[0.06] hover:text-paper",
                    )}
                  >
                    <Mono className="opacity-60">{a.index}</Mono>
                    <span className="text-sm font-light leading-tight">{a.label}</span>
                  </button>
                ))}
              </div>

              <Mono className="mt-8 block text-paper/45">02 — Tipo de litígio</Mono>
              <ul className="mt-4">
                {area.cases.map((c) => {
                  const active = c.id === current.id;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={(event) => selectCase(c.id, event)}
                        aria-pressed={active}
                        aria-label={`Selecionar tipo de litígio: ${c.label}`}
                        className={cn(
                          "group flex w-full items-center justify-between gap-4 border-b border-paper/10 py-4 text-left transition-colors duration-300",
                          active ? "text-paper" : "text-paper/60 hover:text-paper",
                        )}
                      >
                        <span className="text-body">{c.label}</span>
                        <span
                          aria-hidden
                          className={cn(
                            "h-2 w-2 shrink-0 rounded-full border transition-colors duration-300",
                            active
                              ? "border-lime bg-lime"
                              : "border-paper/30 group-hover:border-paper/60",
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={(event) => {
                  emitPulse(event);
                  process();
                }}
                disabled={phase === "scanning"}
                aria-label={`Processar análise de viabilidade para ${current.label}, na área de ${area.label}`}
                className="mt-8 flex w-full items-center justify-between gap-4 rounded-lg bg-paper px-5 py-4 font-mono text-mono uppercase text-ink transition-colors duration-300 hover:bg-mint disabled:cursor-progress disabled:opacity-70"
              >
                {phase === "scanning" ? "Processando…" : "Processar análise de viabilidade"}
                <span aria-hidden className="text-lg leading-none">
                  {phase === "scanning" ? "◍" : "→"}
                </span>
              </button>
            </div>

            {/* --------- coluna de leitura --------- */}
            <div className="relative min-h-[560px] px-6 py-8 md:px-10 lg:col-span-7">
              <AnimatePresence mode="wait">
                {phase !== "result" ? (
                  <motion.div
                    key={phase}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="flex h-full flex-col items-center justify-center gap-10 py-10"
                  >
                    <Radar active={phase === "scanning"} />

                    <div className="w-full max-w-[420px]">
                      {phase === "idle" ? (
                        <p className="text-center text-body text-paper/60">
                          Selecione a área e o tipo de litígio para ver onde a
                          prova técnica costuma decidir esse caso.
                        </p>
                      ) : (
                        <ul className="space-y-2" aria-live="polite">
                          {SCAN_LOG.slice(0, logIndex).map((line) => (
                            <motion.li
                              key={line}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, ease: EASE }}
                              className="flex items-center gap-3 text-sm text-paper/70"
                            >
                              <span className="text-lime">▸</span>
                              {line}
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`result-${current.id}`}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0 }}
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: 0.14 } },
                    }}
                    className="space-y-8"
                    aria-live="polite"
                  >
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                      }}
                    >
                      <HudCard header="[analysis_node // ponto_cego]">
                        <div className="flex items-baseline gap-3">
                          <Mono className="text-lime">[01]</Mono>
                          <Mono className="text-paper/45">Ponto cego pericial</Mono>
                        </div>
                        <p className="mt-4 text-body text-paper/85">
                          <Scramble text={current.blindSpot} trigger={current.id} />
                        </p>
                      </HudCard>
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                      }}
                    >
                      <HudCard header="[strategy_nodes // quesitos_estratégicos]">
                        <div className="flex items-baseline gap-3">
                          <Mono className="text-lime">[02]</Mono>
                          <Mono className="text-paper/45">Direcionamento de quesitos</Mono>
                        </div>
                        <ol className="mt-4 space-y-3">
                          {current.questioning.map((q, i) => (
                            <li key={q} className="flex gap-4 text-body text-paper/80">
                              <Mono className="mt-1 shrink-0 text-paper/35">
                                {String(i + 1).padStart(2, "0")}
                              </Mono>
                              <span>
                                <Scramble text={q} trigger={current.id} />
                              </span>
                            </li>
                          ))}
                        </ol>
                      </HudCard>
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                      }}
                    >
                      <HudCard header="[viability_score // rigor_metodológico]">
                        <div className="flex items-baseline gap-3">
                          <Mono className="text-lime">[03]</Mono>
                          <Mono className="text-paper/45">Prova e viabilidade</Mono>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div className="border-l border-paper/20 pl-4">
                            <Mono className="text-paper/40">Risco</Mono>
                            <p className="mt-2 text-sm leading-relaxed text-paper/75">
                              <Scramble text={current.evidence.risk} trigger={current.id} />
                            </p>
                          </div>
                          <div className="border-l border-lime/50 pl-4">
                            <Mono className="text-paper/40">Oportunidade</Mono>
                            <p className="mt-2 text-sm leading-relaxed text-paper/75">
                              <Scramble
                                text={current.evidence.opportunity}
                                trigger={current.id}
                              />
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          <Mono className="text-paper/50">Impacto técnico na tese</Mono>
                          <ImpactBadge impact={current.evidence.impact} />
                        </div>

                        <RigorMeter level={current.evidence.rigor} />

                        <p className="mt-5 text-sm text-paper/55">
                          {current.evidence.horizon}
                        </p>
                      </HudCard>
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                      }}
                      className="border-t border-paper/12 pt-8"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <a
                          href="#contato"
                          onClick={() =>
                            prefillContact(
                              `Gostaria de agendar uma análise de viabilidade para o caso de ${current.label} na área de ${area.label}.`,
                              { area: area.label, caso: current.label },
                            )
                          }
                          aria-label={`Solicitar minuta de quesitos para ${current.label}, na área de ${area.label}, pelo formulário de contato`}
                          className="inline-flex items-center gap-3 rounded-lg border border-paper/25 px-5 py-4 font-mono text-mono uppercase text-paper transition-colors duration-300 hover:border-lime/70 hover:bg-paper/10"
                        >
                          Solicitar minuta de quesitos para este caso
                          <span aria-hidden>→</span>
                        </a>

                        <a
                          href={getMatrixWhatsAppUrl(area.label, current.label)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Falar no WhatsApp sobre um caso de ${area.label}: ${current.label}`}
                          className="inline-flex items-center gap-3 rounded-lg bg-paper px-5 py-4 font-mono text-mono uppercase text-ink transition-colors duration-300 hover:bg-mint"
                        >
                          Falar no WhatsApp
                          <span aria-hidden>↗</span>
                        </a>
                      </div>

                      <p className="mt-6 max-w-[62ch] text-[11px] leading-normal text-paper/45">
                        Análise preditiva baseada em padrões de impugnação e
                        metodologia pericial a.tec. Não substitui a análise
                        documental prévia do caso concreto.
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
