"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/ui/Container";
import HeroBackdrop from "@/components/HeroBackdrop";
import HeroCanvas from "@/components/HeroCanvas";
import { SEGMENTS } from "@/lib/segments";

/** curva de entrada do site de referência */
const EASE_INTEGRATED = [0.16, 1, 0.3, 1] as const;

const TITLE_LINES = ["Quando o processo", "vai além do direito."];

/** granulação de papel: tira o aspecto liso do gradiente */
const NOISE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
     <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
     <feColorMatrix type="saturate" values="0"/></filter>
     <rect width="220" height="220" filter="url(#n)"/>
   </svg>`,
)}`;

// ---------------------------------------------------------------------
// Orquestração da abertura
// ---------------------------------------------------------------------

/**
 * Abertura: a seção nasce do centro e cresce até a tela cheia. Só
 * `transform` e `opacity` — as duas propriedades que o compositor
 * anima sem repintar. (O clip-path e o blur da versão anterior
 * repintavam a tela inteira a cada quadro.)
 */
const frame: Variants = {
  hidden: { scale: 0.82, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { duration: 1.8, ease: EASE_INTEGRATED },
  },
};

/** contra-escala: a câmera recua enquanto a janela abre */
const backdrop: Variants = {
  hidden: { scale: 1.18 },
  show: { scale: 1, transition: { duration: 2.4, ease: EASE_INTEGRATED } },
};

const eyebrow: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 0.6, ease: EASE_INTEGRATED },
  },
};

/** título: entra quando a expansão já passou de ~40% do percurso */
const title: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, delay: 0.7, ease: EASE_INTEGRATED },
  },
};

const lead: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, delay: 0.9, ease: EASE_INTEGRATED },
  },
};

const tail: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 1.05, ease: EASE_INTEGRATED },
  },
};

/**
 * Abertura do site.
 *
 * Nada de HUD: um fundo silencioso, uma linha de identificação, o título
 * e dois caminhos de ação. A entrada é a moldura que se expande; o GSAP
 * fica só com o afastamento do fundo na saída do herói.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bg.current,
        { opacity: 1, scale: 1 },
        {
          opacity: 0.65,
          scale: 1.12,
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
    <motion.section
      id="topo"
      ref={root}
      data-surface="dark"
      variants={frame}
      initial="hidden"
      animate="show"
      className="relative flex min-h-screen w-full origin-center flex-col justify-between overflow-hidden rounded-none bg-dark pb-8 pt-24 will-change-transform supports-[height:100svh]:min-h-[100svh] md:pb-16 md:pt-28"
    >
      {/* fundo: camada externa é do scrub (GSAP), interna é da entrada */}
      <div
        aria-hidden
        ref={bg}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden will-change-transform"
      >
        <motion.div
          variants={backdrop}
          className="relative h-full w-full will-change-transform"
        >
          {/* superfície orgânica em movimento */}
          <HeroBackdrop className="absolute inset-0 h-full w-full" />

          {/* rede de partículas que reage ao cursor */}
          <HeroCanvas className="absolute inset-0 h-full w-full" />

          {/* véu só onde o texto pede contraste; à direita o render aparece */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-dark/85 to-transparent" />

          {/* granulação de papel */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("${NOISE}")`,
              backgroundSize: "220px 220px",
            }}
          />
        </motion.div>
      </div>

      <div className="relative z-10 my-auto">
        <Container>
          <div className="max-w-4xl">
            <div>
              <motion.p
                variants={eyebrow}
                className="text-xs font-medium uppercase tracking-[0.25em] text-olive"
              >
                Prova Pericial Blindada
              </motion.p>

              {/* o subtítulo acompanha a largura do título */}
              <div className="w-fit">
                <motion.h1
                  variants={title}
                  className="mt-5 max-w-3xl text-balance sm:mt-8 font-sans text-3xl font-bold leading-[1.08] tracking-tight text-paper will-change-transform sm:text-5xl lg:text-6xl xl:text-7xl"
                >
                  {TITLE_LINES.map((line) => (
                    <span key={line} className="-my-2 block px-1 pb-2 pt-2">
                      {line}
                    </span>
                  ))}
                </motion.h1>

                <motion.p
                  variants={lead}
                  className="mt-6 hidden w-0 min-w-full text-base leading-relaxed text-neutral-300 sm:block md:text-lg"
                >
                  Assistência técnica e perícias em Medicina, Psicologia,
                  Engenharias e Avaliações Imobiliárias. Transformamos técnica
                  em estratégia.
                </motion.p>
              </div>

              {/* portal de entrada: dois caminhos, um por público */}
              <motion.div
                variants={tail}
                className="mt-6 grid grid-cols-1 gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:w-[min(72rem,calc(100vw-6rem))]"
              >
                {[SEGMENTS.pf, SEGMENTS.pj].map((seg) => (
                  <Link
                    key={seg.href}
                    href={seg.href}
                    className="group flex flex-col rounded-2xl border border-white/10 bg-neutral-900/50 p-5 text-left backdrop-blur-md hover:border-olive/40 hover:bg-white/[0.03] transition-all duration-300 active:scale-[0.98] sm:p-6 md:p-10 lg:min-h-[280px]"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-olive">
                      [ {seg.tag} ]
                    </span>
                    <span className="mt-5 font-sans text-2xl font-semibold leading-tight text-paper sm:text-3xl lg:text-4xl">
                      {seg.cardTitle}
                    </span>
                    <span className="mt-3 text-sm leading-relaxed text-neutral-300 md:text-[15px]">
                      {seg.cardBody}
                    </span>
                    <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-medium text-olive-light">
                      {seg.cardCta}
                      <span
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>
        </Container>
      </div>
    </motion.section>
  );
}
