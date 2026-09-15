"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import HeroBackdrop from "@/components/HeroBackdrop";
import { openTriage } from "@/lib/triagem";
import type { Segment } from "@/lib/segments";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Abertura das páginas de segmento (PF e Empresas). */
export default function SegmentHero({ segment }: { segment: Segment }) {
  const pf = segment.profile === "pf";

  return (
    <section
      id="topo"
      data-surface="dark"
      className="relative flex min-h-screen items-center supports-[height:100svh]:min-h-[100svh] overflow-hidden bg-dark pb-16 pt-28 text-paper"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <HeroBackdrop className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent" />
      </div>

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="max-w-4xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-olive">
            [ {segment.tag} ]
          </p>
          <div className="w-fit">
            <h1 className="mt-8 text-balance text-3xl font-bold leading-[1.08] tracking-tight text-paper sm:text-5xl lg:text-6xl">
              {segment.heroTitle.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-6 w-0 min-w-full text-base leading-relaxed text-neutral-300 md:text-lg">
              {segment.heroLead}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {pf ? (
              <button
                type="button"
                onClick={() => openTriage("pf")}
                className="min-h-11 rounded-full bg-olive px-8 py-4 font-semibold text-dark transition-colors duration-300 hover:bg-olive-light active:scale-[0.98]"
              >
                Começar a triagem gratuita
              </button>
            ) : (
              <Link
                href="#contato"
                className="min-h-11 rounded-full bg-olive px-8 py-4 text-center font-semibold text-dark transition-colors duration-300 hover:bg-olive-light active:scale-[0.98]"
              >
                Agendar análise técnica
              </Link>
            )}
            <Link
              href={pf ? "#areas" : "#matrix"}
              className="min-h-11 rounded-full border border-white/15 px-8 py-4 text-center text-neutral-200 transition-colors duration-300 hover:border-olive/40 hover:bg-white/5"
            >
              {pf ? "Entender como ajudamos" : "Conhecer a A.TEC Matrix"}
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
