"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { STEPS } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Rolagem por etapa enquanto o painel está fixo. Curta de propósito: um
 * pin longo dá a sensação de que a página parou. Somada à altura da tela,
 * a duração do pin fica igual em qualquer viewport.
 */
const STEP_SCROLL = 320;

/**
 * Metodologia da a.tec — as cinco etapas da prova.
 *
 * O painel gruda na viewport enquanto a seção é percorrida: a etapa
 * ativa troca e o trilho vertical acompanha o progresso. Rolar a página
 * é só um dos jeitos de navegar — os botões de avançar/voltar e os
 * marcadores do trilho levam direto a qualquer etapa, sem depender do
 * gesto de rolagem.
 */
export default function AtecAjuda() {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const railProgress = useMotionValue(0);
  const lenis = useLenis();

  /** leva a rolagem ao meio do trecho da etapa escolhida */
  const goTo = (i: number) => {
    const target = Math.min(STEPS.length - 1, Math.max(0, i));
    const el = scroller.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y =
      top +
      ((target + 0.5) / STEPS.length) * (el.offsetHeight - window.innerHeight);
    if (lenis) lenis.scrollTo(y, { duration: 0.9 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: scroller.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        railProgress.set(self.progress);
        const i = Math.min(
          STEPS.length - 1,
          Math.max(0, Math.floor(self.progress * STEPS.length)),
        );
        setActive(i);
      },
    });

    return () => trigger.kill();
  }, [railProgress]);

  const step = STEPS[active];
  const isFirst = active === 0;
  const isLast = active === STEPS.length - 1;

  return (
    <section id="processo" className="relative bg-paper">
      {/* halo de brilho por trás da moldura */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-olive/5 blur-[120px]"
      />

      <div
        ref={scroller}
        className="relative"
        style={{ height: `calc(100svh + ${STEPS.length * STEP_SCROLL}px)` }}
      >
        <div className="sticky top-0 flex h-[100svh]">
          {/* moldura em tela cheia; o conteúdo segue a grade do site */}
          <div
            data-surface="dark"
            className="relative h-full w-full overflow-hidden bg-dark-card text-paper"
          >
            <Container className="flex h-full flex-col pb-[max(2rem,env(safe-area-inset-bottom))] pt-24 md:pb-12 md:pt-28">
              {/* cabeçalho da moldura */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2.5 border border-dark-border bg-white/[0.03] px-3 py-2">
                  <span className="relative grid h-2 w-2 place-items-center">
                    <span className="absolute inset-0 rounded-full bg-lime animate-[led-halo_2.6s_ease-out_infinite]" />
                    <span className="relative h-2 w-2 rounded-full bg-lime animate-[led-pulse_2.6s_ease-in-out_infinite]" />
                  </span>
                  <Mono className="text-paper/80">
                    [&nbsp;Metodologia exclusiva • 5 etapas da prova
                    blindada&nbsp;]
                  </Mono>
                </span>

                <div className="flex items-baseline gap-1 font-mono text-mono uppercase text-paper/50">
                  <span className="text-paper">{step.index}</span>
                  <span>/</span>
                  <span>{String(STEPS.length).padStart(2, "0")}</span>
                </div>
              </div>

              {/* corpo: etapa ativa à esquerda, trilho vertical à direita */}
              <div className="flex flex-1 items-center gap-6 py-6 md:gap-12 md:py-0">
                <SpotlightCard
                  tone="dark"
                  size={560}
                  className="relative min-w-0 flex-1 rounded-sm py-2 md:py-4"
                >
                  {STEPS.map((s, i) => (
                    <div
                      key={s.index}
                      aria-hidden={i !== active}
                      className={cn(
                        "grid grid-cols-1 gap-4 md:gap-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:grid-cols-12 lg:gap-6",
                        i === active
                          ? "relative opacity-100 blur-0"
                          : "pointer-events-none absolute inset-0 opacity-0 blur-[2px]",
                      )}
                    >
                      <h2 className="text-title max-w-[16ch] font-light max-md:text-[1.75rem] max-md:[@media(max-height:600px)]:text-[1.5rem] max-md:[@media(min-height:780px)]:text-[2.25rem] lg:col-span-7">
                        {s.title.split(" ").map((w, wi) => (
                          <span
                            key={`${w}-${wi}`}
                            className="inline-block transition-opacity duration-500"
                            style={{
                              opacity: i === active ? 1 : 0.4,
                              transitionDelay: `${wi * 0.05}s`,
                            }}
                          >
                            {w}&nbsp;
                          </span>
                        ))}
                      </h2>
                      <p className="text-lead max-w-[46ch] font-light text-paper/75 max-md:text-[1.0625rem] max-md:leading-snug max-md:[@media(max-height:600px)]:text-[0.975rem] max-md:[@media(min-height:780px)]:text-[1.1875rem] lg:col-span-5 lg:pt-2">
                        {s.body}
                      </p>
                    </div>
                  ))}
                </SpotlightCard>

                <VerticalRail
                  progress={railProgress}
                  active={active}
                  onSelect={goTo}
                  onPrev={() => goTo(active - 1)}
                  onNext={() => goTo(active + 1)}
                  disablePrev={isFirst}
                  disableNext={isLast}
                />
              </div>
            </Container>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Trilho vertical da metodologia: uma linha de cima para baixo com um
 * marcador por etapa, o trecho já percorrido aceso e um ponto de luz na
 * posição exata do scroll. Setas no topo e na base avançam e voltam uma
 * etapa por vez, sem depender da rolagem.
 */
function VerticalRail({
  progress,
  active,
  onSelect,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}: {
  progress: MotionValue<number>;
  active: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  disablePrev: boolean;
  disableNext: boolean;
}) {
  const percent = useTransform(
    progress,
    (v) => Math.min(1, Math.max(0, v)) * 100,
  );
  const top = useMotionTemplate`${percent}%`;
  const litScale = useTransform(progress, (v) => Math.min(1, Math.max(0, v)));

  // mesmo acabamento das outras superfícies escuras do site (cartão com
  // borda, vidro e o realce oliva/lima no hover e na etapa ativa)
  const navButton =
    "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-dark-card/85 text-paper/70 backdrop-blur-md transition-all duration-300 hover:border-olive/40 hover:bg-white/[0.03] hover:text-paper active:scale-[0.94] disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className="flex h-full shrink-0 flex-col items-center">
      <button
        type="button"
        onClick={onPrev}
        disabled={disablePrev}
        aria-label="Etapa anterior"
        className={navButton}
      >
        <ChevronUp aria-hidden size={18} strokeWidth={1.75} />
      </button>

      {/* trilho: uma guia fina com o preenchimento e o ponto de luz do
         scroll, e ao lado a coluna de cartões — o mesmo cartão com borda
         usado em toda a a.tec Matrix — um por etapa */}
      <div className="my-3 flex flex-1 items-stretch gap-3 md:gap-4">
        <div className="relative w-1 shrink-0 self-stretch">
          <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-white/10" />
          <motion.span
            aria-hidden
            style={{ scaleY: litScale }}
            className="absolute left-1/2 top-0 h-full w-1 origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-olive via-sage to-lime"
          />
          <motion.span
            aria-hidden
            style={{ top }}
            className="absolute left-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime"
          >
            <span className="absolute inset-0 -m-2 rounded-full bg-lime/25 blur-[6px]" />
          </motion.span>
        </div>

        <div className="flex flex-1 flex-col gap-2 md:gap-3">
          {STEPS.map((s, i) => (
            <button
              key={s.index}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Ir para a etapa ${s.index}: ${s.title}`}
              aria-current={i === active ? "step" : undefined}
              className={cn(
                "flex min-h-11 min-w-11 flex-1 items-center gap-2.5 rounded-xl border bg-dark-card/85 px-3 backdrop-blur-md transition-all duration-300 md:min-w-0 md:gap-3 md:px-4",
                i === active
                  ? "border-olive/50 shadow-[0_0_24px_-8px_rgba(127,153,112,0.65)]"
                  : "border-white/10 hover:border-olive/40 hover:bg-white/[0.03] active:scale-[0.99]",
              )}
            >
              <span
                className={cn(
                  "font-mono text-mono uppercase transition-colors duration-300",
                  i <= active ? "text-lime" : "text-paper/35",
                )}
              >
                {s.index}
              </span>
              <span
                className={cn(
                  "hidden whitespace-nowrap text-sm font-light leading-tight transition-colors duration-300 md:inline",
                  i === active
                    ? "text-paper"
                    : i < active
                      ? "text-paper/60"
                      : "text-paper/35",
                )}
              >
                {s.short}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={disableNext}
        aria-label="Próxima etapa"
        className={navButton}
      >
        <ChevronDown aria-hidden size={18} strokeWidth={1.75} />
      </button>
    </div>
  );
}
