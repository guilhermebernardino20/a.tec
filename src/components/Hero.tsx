"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroTopographyCanvas from "@/components/HeroTopographyCanvas";
import TextReveal from "@/components/ui/TextReveal";
import Container from "@/components/ui/Container";
import StatusLed from "@/components/ui/StatusLed";
import Pill from "@/components/ui/Pill";
import { cn } from "@/lib/utils";

const TITLE_LINES = ["Quando", "o processo", "vai além", "do direito."];

/** ruído estático: textura de papel, sem custo de runtime */
const NOISE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
     <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
     <feColorMatrix type="saturate" values="0"/></filter>
     <rect width="220" height="220" filter="url(#n)"/>
   </svg>`,
)}`;

const TELEMETRY = [
  { id: "sys", text: "[ sys_status: operational ]", className: "left-6 top-24 md:left-12" },
  {
    id: "org",
    text: "[ a.tec // judicial technical assistance ]",
    className: "right-6 top-24 hidden text-right sm:block md:right-12",
  },
  {
    id: "geo",
    text: "[ curitiba / pr • brazil ]",
    className: "bottom-6 left-6 md:left-12",
  },
  {
    id: "scan",
    text: "[ hover to scan matrix ]",
    className: "bottom-6 right-6 hidden text-right md:right-12 lg:block",
  },
] as const;

/**
 * Abertura do site.
 *
 * O fundo orgânico fica preso na viewport enquanto o título entra; ao
 * longo da saída do herói ele escurece (opacidade 0.9 → 0.6) e avança
 * (escala 1 → 1.2).
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);

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
            end: "bottom top",
            scrub: 1,
          },
        },
      );

    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="topo"
      ref={root}
      data-surface="dark"
      className="relative bg-olive-deep"
    >
      {/* fundo preso à viewport durante todo o percurso */}
      <div className="pointer-events-none sticky top-0 h-[100svh] w-full overflow-hidden">
        <div ref={bg} className="hero-bg-clip relative h-full w-full will-change-transform">
          {/* luz volumétrica, no alto do quadro */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#7F9970]/15 via-[#080B09]/80 to-[#080B09]" />

          {/* malha topográfica reativa ao cursor */}
          <HeroTopographyCanvas className="absolute inset-0 h-full w-full" />

          {/* granulação editorial */}
          <div
            className="absolute inset-0 opacity-[0.03] [mix-blend-mode:overlay]"
            style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "220px 220px" }}
          />

          {/* assentamento do texto no rodapé do quadro */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#080B09] via-[#080B09]/70 to-transparent" />
        </div>
      </div>

      {/* painel de abertura */}
      <div className="relative -mt-[100svh] flex h-[100svh] min-h-[620px] flex-col justify-end">
        {/* telemetria nos cantos */}
        {TELEMETRY.map((item) => (
          <span
            key={item.id}
            aria-hidden
            className={cn(
              "hero-fade pointer-events-none absolute font-mono text-[9px] uppercase tracking-[0.2em] text-[#7F9970]/60",
              item.className,
            )}
          >
            {item.text}
          </span>
        ))}

        <Container className="pb-20 md:pb-24">
          <StatusLed className="hero-fade mb-8 md:mb-10" />

          <TextReveal
            as="h1"
            lines={TITLE_LINES}
            trigger="mount"
            delay={0.55}
            stagger={0.075}
            className="text-display max-w-[15ch] font-light text-paper"
            pieceClassName="title-sheen [--sheen-base:#f7f7f5] [--sheen-light:#ffffff]"
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

        {/* indicador de rolagem */}
        <span
          aria-hidden
          className="hero-fade pointer-events-none absolute inset-x-0 bottom-6 hidden flex-col items-center gap-3 md:flex"
        >
          <span className="relative block h-8 w-px overflow-hidden bg-paper/15">
            <span
              className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-transparent via-lime to-transparent"
              style={{ animation: "scan-y 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite" }}
            />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/45">
            Deslize para explorar
          </span>
        </span>
      </div>
    </section>
  );
}
