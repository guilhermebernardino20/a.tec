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
 * ativa troca, o ponto de luz corre pela fibra e os cartões acendem em
 * sequência. O progresso vive em um motion value, então só a troca de
 * etapa toca no estado do React.
 */
export default function AtecAjuda() {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const railProgress = useMotionValue(0);
  const lenis = useLenis();

  /** leva a rolagem ao meio do trecho da etapa escolhida */
  const goTo = (i: number) => {
    const el = scroller.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y =
      top + ((i + 0.5) / STEPS.length) * (el.offsetHeight - window.innerHeight);
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

  return (
    <section id="processo" className="relative bg-paper md:py-32">
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
        <div className="sticky top-0 flex h-[100svh] items-center md:py-24">
          <Container className="w-full max-md:h-full max-md:px-0">
            {/* no celular a moldura vira tela cheia; do tablet para cima, cartão */}
            <div
              data-surface="dark"
              className="relative flex flex-col overflow-hidden bg-dark-card px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24 text-paper max-md:h-full md:rounded-2xl md:border md:border-dark-border md:bg-dark-card/95 md:p-12 md:shadow-[0_40px_120px_-40px_rgba(12,17,11,0.9)] md:backdrop-blur-md"
            >
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

              {/* etapa ativa */}
              <div className="flex flex-1 items-center py-6 md:py-0">
                <SpotlightCard
                  tone="dark"
                  size={560}
                  className="relative w-full rounded-sm py-2 md:mt-16 md:py-4"
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
              </div>

              <FiberRail
                progress={railProgress}
                active={active}
                onSelect={goTo}
              />
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}

/**
 * Linha do tempo em fibra óptica ligando os cartões das etapas: um ponto
 * de luz corre pelo filete e acende cada nó na passagem.
 */
function FiberRail({
  progress,
  active,
  onSelect,
}: {
  progress: MotionValue<number>;
  active: number;
  onSelect: (index: number) => void;
}) {
  const percent = useTransform(
    progress,
    (v) => Math.min(1, Math.max(0, v)) * 100,
  );
  const left = useMotionTemplate`${percent}%`;
  const litScale = useTransform(progress, (v) => Math.min(1, Math.max(0, v)));

  return (
    <div className="md:mt-16">
      <div className="relative h-px w-full bg-white/10">
        <motion.span
          aria-hidden
          style={{ scaleX: litScale }}
          className="absolute inset-0 h-px origin-left bg-gradient-to-r from-olive via-sage to-lime"
        />

        <motion.span
          aria-hidden
          style={{ left }}
          className="absolute top-1/2 z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime"
        >
          <span className="absolute inset-0 -m-2 rounded-full bg-lime/25 blur-[6px]" />
        </motion.span>

        {STEPS.map((s, i) => (
          <span
            key={s.index}
            aria-hidden
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${((i + 0.5) / STEPS.length) * 100}%` }}
          >
            <span
              className={cn(
                "block h-1.5 w-1.5 rounded-full transition-all duration-500",
                i <= active
                  ? "bg-lime shadow-[0_0_10px_rgba(183,212,146,0.8)]"
                  : "bg-white/25",
              )}
            />
          </span>
        ))}
      </div>

      <ol className="mt-4 grid grid-cols-5 gap-2 md:gap-3">
        {STEPS.map((s, i) => (
          <li key={s.index}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Ir para a etapa ${s.index}: ${s.title}`}
              aria-current={i === active ? "step" : undefined}
              className={cn(
                "group/step block h-full min-h-11 w-full cursor-pointer rounded-xl border bg-dark-card/85 p-2.5 text-left backdrop-blur-md transition-all duration-300 md:p-4",
                i === active
                  ? "border-olive/50 shadow-[0_0_24px_-8px_rgba(127,153,112,0.65)]"
                  : "border-white/10 hover:border-olive/40 hover:bg-white/[0.03] active:scale-[0.99]",
              )}
            >
              <span
                className={cn(
                  "block font-mono text-mono uppercase transition-colors duration-500",
                  i <= active ? "text-lime" : "text-paper/35",
                )}
              >
                {s.index}
              </span>
              <span
                className={cn(
                  "mt-2 hidden text-sm font-light leading-tight transition-colors duration-500 sm:block",
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
          </li>
        ))}
      </ol>
    </div>
  );
}
