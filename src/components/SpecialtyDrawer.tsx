"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SPECIALTY_DETAILS } from "@/lib/specialties";
import { prefillContact } from "@/lib/prefill";
import { setScrollLock } from "@/lib/scroll-lock";
import { getSpecialtyWhatsAppUrl } from "@/utils/whatsapp";
import Mono from "@/components/ui/Mono";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import StatusLed from "@/components/ui/StatusLed";

const EASE = [0.16, 1, 0.3, 1] as const;
const BOTTOM_SHEET = "(max-width: 767px)";

export type DrawerSpecialty = {
  practice: string;
  index: string;
  title: string;
  body: string;
};

/**
 * Painel lateral em vidro escuro com o detalhamento de uma especialidade:
 * método de trabalho, checklist de documentos e caminhos de contato.
 */
export default function SpecialtyDrawer({
  specialty,
  onClose,
}: {
  specialty: DrawerSpecialty | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = Boolean(specialty);
  // em telas estreitas a gaveta vira bottom sheet
  const sheet = useMediaQuery(BOTTOM_SHEET);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    setScrollLock(true);
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
      setScrollLock(false);
    };
  }, [open, onClose]);

  const detail = specialty ? SPECIALTY_DETAILS[specialty.title] : undefined;

  const message = specialty
    ? `Tenho um processo envolvendo ${specialty.title} e gostaria de suporte técnico da A.TEC.`
    : "";

  return (
    <AnimatePresence>
      {specialty ? (
        <motion.div
          key="drawer"
          className="fixed inset-0 z-[70]"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            aria-hidden
            onClick={onClose}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.45, ease: EASE }}
            className="absolute inset-0 bg-olive-deep/60 backdrop-blur-md"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            variants={
              sheet
                ? { hidden: { y: "100%" }, visible: { y: 0 } }
                : { hidden: { x: "100%" }, visible: { x: 0 } }
            }
            transition={{ duration: 0.6, ease: EASE }}
            className={cn(
              "absolute flex flex-col text-paper",
              sheet
                ? "inset-x-0 bottom-0 max-h-[88vh] w-full rounded-t-3xl border-t border-white/15 bg-dark/95 shadow-2xl backdrop-blur-2xl"
                : "inset-y-0 right-0 w-1/2 min-w-[420px] max-w-xl border-l border-white/10 bg-neutral-900/90 backdrop-blur-md",
            )}
          >
            {sheet ? (
              <span
                aria-hidden
                className="mx-auto my-3 h-1.5 w-12 shrink-0 rounded-full bg-white/20"
              />
            ) : null}
            <header className="flex items-start justify-between gap-6 border-b border-paper/12 px-6 py-6 md:px-10">
              <div>
                <Mono className="text-paper/50">
                  {specialty.index} · {specialty.practice}
                </Mono>
                <h2
                  id="drawer-title"
                  className="text-heading mt-4 max-w-[22ch] text-balance font-light leading-[1.12] tracking-[-0.015em]"
                >
                  {specialty.title}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Fechar painel"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 transition-colors duration-300 hover:border-paper/60 hover:bg-paper/10"
              >
                <span aria-hidden className="relative block h-3.5 w-3.5">
                  <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-paper" />
                  <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-paper" />
                </span>
              </button>
            </header>

            <div
              // sem isto o Lenis captura a roda e rola a página atrás do painel
              data-lenis-prevent
              className="flex-1 overflow-y-auto overscroll-contain px-6 py-8 md:px-10"
            >
              <p className="text-lead font-light text-paper/85">
                {specialty.body}
              </p>

              {detail ? (
                <>
                  <section className="mt-10">
                    <Mono className="text-paper/50">Como conduzimos</Mono>
                    <p className="mt-4 text-body text-paper/75">
                      {detail.method}
                    </p>
                  </section>

                  <section className="mt-10">
                    <Mono className="text-paper/50">
                      Documentos a reunir ({detail.documents.length})
                    </Mono>
                    <ul className="mt-5 space-y-0">
                      {detail.documents.map((doc, i) => (
                        <motion.li
                          key={doc}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.45,
                            ease: EASE,
                            delay: 0.25 + i * 0.05,
                          }}
                          className="flex items-start gap-4 border-b border-paper/10 py-4 text-body text-paper/85"
                        >
                          <span
                            aria-hidden
                            className="mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border border-paper/35"
                          >
                            <span className="h-1.5 w-1.5 rounded-[1px] bg-lime/80" />
                          </span>
                          {doc}
                        </motion.li>
                      ))}
                    </ul>
                    <p className="mt-4 text-[11px] leading-normal text-paper/45">
                      Lista de referência: a equipe técnica indica o que falta
                      depois da primeira leitura do caso.
                    </p>
                  </section>
                </>
              ) : null}
            </div>

            <footer className="border-t border-paper/12 px-6 py-6 md:px-10">
              <StatusLed className="mb-5" />
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contato"
                  onClick={() => {
                    prefillContact(message, {
                      area: specialty.practice,
                      caso: specialty.title,
                    });
                    onClose();
                  }}
                  aria-label={`Solicitar análise sobre ${specialty.title} pelo formulário de contato`}
                  className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-paper px-6 py-3 text-center text-sm font-medium text-ink transition-colors duration-300 hover:bg-mint"
                >
                  Solicitar análise
                </a>
                <a
                  href={getSpecialtyWhatsAppUrl(specialty.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Falar no WhatsApp sobre ${specialty.title}`}
                  className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-white/10 px-6 py-3 text-center text-sm font-medium text-paper transition-colors duration-300 hover:border-paper/70 hover:bg-paper/10"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </footer>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
