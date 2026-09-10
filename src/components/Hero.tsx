"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/ui/Container";
import { useMediaQuery } from "@/lib/use-media-query";

/** curva de entrada do site de referência */
const EASE_INTEGRATED = [0.16, 1, 0.3, 1] as const;

const TITLE_LINES = ["Quando", "o processo", "vai além", "do direito."];

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
 * Moldura que se expande: o herói começa como um cartão recuado e
 * desfocado e abre até ocupar a tela inteira.
 */
const FRAME_OPEN = {
  clipPath: "inset(0% 0% 0% 0% round 0px)",
  scale: 1,
  opacity: 1,
  filter: "blur(0px)",
} as const;

const FRAME_CLOSED_DESKTOP = {
  clipPath: "inset(6% 5% 6% 5% round 28px)",
  scale: 0.92,
  opacity: 0.6,
  filter: "blur(10px)",
} as const;

/** no celular o recuo é menor: comprimir o texto não ajuda ninguém */
const FRAME_CLOSED_MOBILE = {
  ...FRAME_CLOSED_DESKTOP,
  clipPath: "inset(3% 2% 3% 2% round 16px)",
} as const;

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
  const compact = useMediaQuery("(max-width: 767px)");

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
    <motion.div
      initial={compact ? FRAME_CLOSED_MOBILE : FRAME_CLOSED_DESKTOP}
      animate={FRAME_OPEN}
      transition={{ duration: 2.2, ease: EASE_INTEGRATED }}
      className="relative will-change-transform"
    >
      <motion.section
        id="topo"
        ref={root}
        data-surface="dark"
        initial="hidden"
        animate="show"
        className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#070807] pb-14 pt-24 supports-[height:100svh]:min-h-[100svh] md:pb-16 md:pt-28"
      >
        {/* fundo: camada externa é do scrub (GSAP), interna é da entrada */}
        <div
          aria-hidden
          ref={bg}
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden will-change-transform"
        >
          <motion.div variants={backdrop} className="relative h-full w-full will-change-transform">
            {/* única fonte de luz: difusa, no centro-topo */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(127,153,112,0.12),rgba(255,255,255,0))]" />

            {/* granulação de papel */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "220px 220px" }}
            />
          </motion.div>
        </div>

        <div className="relative z-10 my-auto md:mb-0 md:mt-auto">
          <Container>
            <motion.p
              variants={eyebrow}
              className="text-xs font-medium uppercase tracking-[0.25em] text-[#7F9970]"
            >
              Assistência Técnica Judicial • Prova Pericial Blindada
            </motion.p>

            <motion.h1
              variants={title}
              className="mt-8 max-w-[15ch] font-sans text-3xl font-bold leading-[1.08] tracking-tight text-[#F3F4F3] will-change-transform sm:text-5xl md:text-7xl"
            >
              {TITLE_LINES.map((line) => (
                <span key={line} className="-my-2 block px-1 pb-2 pt-2">
                  {line}
                </span>
              ))}
            </motion.h1>

            <motion.p
              variants={lead}
              className="mt-8 max-w-2xl text-base leading-relaxed text-neutral-300 md:text-xl"
            >
              Assistência técnica e perícias em Medicina, Psicologia, Engenharias
              e Avaliações Imobiliárias. Transformamos técnica em estratégia.
            </motion.p>

            <motion.div variants={tail} className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="#servicos"
                className="rounded-full bg-[#7F9970] px-8 py-4 font-semibold text-[#070807] shadow-lg transition-all duration-300 hover:bg-[#8EA87E]"
              >
                Nossas frentes de atuação
              </Link>
              <Link
                href="#contato"
                className="rounded-full border border-white/15 px-8 py-4 text-neutral-200 transition-all duration-300 hover:bg-white/5"
              >
                Agendar análise técnica
              </Link>
            </motion.div>
          </Container>
        </div>
      </motion.section>
    </motion.div>
  );
}
