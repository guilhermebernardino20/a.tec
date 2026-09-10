"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroBackdrop from "@/components/HeroBackdrop";
import HeroCanvas from "@/components/HeroCanvas";
import TextReveal from "@/components/ui/TextReveal";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import StatusLed from "@/components/ui/StatusLed";
import GlowRule from "@/components/ui/GlowRule";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Pill from "@/components/ui/Pill";
import { STEPS } from "@/lib/content";
import { cn } from "@/lib/utils";

const TITLE_LINES = ["Quando", "o processo", "vai além", "do direito."];
const STEP_SCROLL = 900; // px de rolagem por etapa, como na referência

/**
 * Hero + esteira fixada.
 *
 * O fundo orgânico fica preso na viewport enquanto o título sai e as
 * cinco etapas passam por cima dele; ao longo do trajeto o fundo escurece
 * (opacidade 0.875 → 0.6) e avança (escala 1 → 1.2).
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // abertura: o fundo abre em clip-path e o conteúdo entra em cascata
      if (!reduced) {
        gsap.fromTo(
          ".hero-bg-clip",
          { clipPath: "inset(18% 0% 18% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 2, delay: 0.3, ease: "expo.inOut" },
        );

        gsap.fromTo(
          ".hero-fade",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.8, delay: 1.5, stagger: 0.05, ease: "expo.out" },
        );
      }

      // fundo: escurece e avança conforme a esteira é percorrida
      gsap.fromTo(
        bg.current,
        { opacity: 0.9, scale: 1 },
        {
          opacity: 0.6,
          scale: 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );

      // etapa ativa da esteira
      ScrollTrigger.create({
        trigger: scroller.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const i = Math.min(
            STEPS.length - 1,
            Math.max(0, Math.floor(self.progress * STEPS.length)),
          );
          setActive(i);
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const step = STEPS[active];

  return (
    <section
      id="topo"
      ref={root}
      data-surface="dark"
      className="relative bg-olive-deep"
    >
      {/* fundo preso à viewport durante todo o percurso */}
      <div className="pointer-events-none sticky top-0 h-[100svh] w-full overflow-hidden">
        <div ref={bg} className="hero-bg-clip h-full w-full will-change-transform">
          <HeroBackdrop className="h-full w-full" />
          <HeroCanvas className="absolute inset-0 h-full w-full" />
        </div>
      </div>

      {/* painel de abertura */}
      <div className="relative -mt-[100svh] flex h-[100svh] min-h-[620px] flex-col justify-end">
        <Container className="pb-12 md:pb-16">
          <StatusLed className="hero-fade mb-8 md:mb-10" />

          <TextReveal
            as="h1"
            lines={TITLE_LINES}
            trigger="mount"
            delay={0.55}
            stagger={0.075}
            className="text-display max-w-[15ch] font-light text-paper"
          />

          <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
            <p className="hero-fade text-lead max-w-[42ch] font-light text-paper/90">
              Assistência técnica e perícias em Medicina, Psicologia, Engenharias
              e Avaliações Imobiliárias. Transformamos técnica em estratégia.
            </p>

            <div className="hero-fade flex flex-wrap items-center gap-2">
              <Pill href="#servicos" variant="light">
                Nossas frentes de atuação
              </Pill>
              <Pill href="#sobre" variant="ghost" className="text-paper hover:bg-paper/15">
                Sobre a a.tec
              </Pill>
            </div>
          </div>
        </Container>
      </div>

      {/* esteira fixada sobre o mesmo fundo */}
      <div
        id="processo"
        ref={scroller}
        className="relative"
        style={{ height: `${STEPS.length * STEP_SCROLL}px` }}
      >
        <div className="sticky top-0 flex h-[100svh] flex-col justify-between py-24 text-paper md:py-28">
          {/* véu discreto: mantém o texto legível sobre as áreas claras do fundo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-olive-deep/75 via-olive-deep/45 to-olive-deep/65"
          />
          <Container className="relative flex items-start justify-between">
            <Mono className="text-paper/55">Como a a.tec ajuda</Mono>
            <div className="flex items-baseline gap-1 font-mono text-mono uppercase text-paper/55">
              <span className="text-paper">{step.index}</span>
              <span>/</span>
              <span>{String(STEPS.length).padStart(2, "0")}</span>
            </div>
          </Container>

          <Container className="relative">
            <SpotlightCard tone="dark" size={520} className="relative rounded-sm py-6">
              {STEPS.map((s, i) => (
                <div
                  key={s.index}
                  aria-hidden={i !== active}
                  className={cn(
                    "grid grid-cols-1 gap-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:grid-cols-12 lg:gap-5",
                    i === active
                      ? "relative opacity-100 blur-0"
                      : "pointer-events-none absolute inset-0 opacity-0 blur-[2px]",
                  )}
                >
                  <h2 className="text-title max-w-[16ch] font-light lg:col-span-7">
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
                  <p className="text-lead max-w-[46ch] font-light text-paper/75 lg:col-span-5 lg:pt-3">
                    {s.body}
                  </p>
                </div>
              ))}
            </SpotlightCard>
          </Container>

          <Container className="relative">
            <GlowRule tone="dark" />
            <ol className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
              {STEPS.map((s, i) => (
                <li
                  key={s.index}
                  className={cn(
                    "font-mono text-mono uppercase transition-colors duration-500",
                    i === active ? "text-paper" : "text-paper/35",
                  )}
                >
                  {s.index} {s.short}
                </li>
              ))}
            </ol>
          </Container>
        </div>
      </div>
    </section>
  );
}
