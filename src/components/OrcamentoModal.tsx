"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { setScrollLock } from "@/lib/scroll-lock";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import ContactForm from "@/components/ContactForm";
import Mono from "@/components/ui/Mono";

const EASE = [0.16, 1, 0.3, 1] as const;
const BOTTOM_SHEET = "(max-width: 767px)";

/**
 * Orçamento online: o mesmo formulário de contato (com anexos), em um
 * modal acessível de qualquer página pelo cabeçalho — sem depender de
 * rolar até a seção de contato, que nem toda página tem.
 */
export default function OrcamentoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const sheet = useMediaQuery(BOTTOM_SHEET);
  const ids = useId();

  useEffect(() => {
    if (open) opener.current = document.activeElement as HTMLElement | null;
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // o foco não sai da janela enquanto ela está aberta
      if (e.key === "Tab" && dialog.current) {
        const focusable = dialog.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    setScrollLock(true);
    heading.current?.focus({ preventScroll: true });

    const trigger = opener.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
      setScrollLock(false);
      trigger?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="orcamento"
          className="pointer-events-auto fixed inset-0 z-[75] flex items-end justify-center md:items-center md:p-6"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            aria-hidden
            onClick={onClose}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute inset-0 bg-olive-deep/60 backdrop-blur-md"
          />

          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${ids}-titulo`}
            variants={
              sheet
                ? { hidden: { y: "100%" }, visible: { y: 0 } }
                : {
                    hidden: { opacity: 0, y: 24, scale: 0.98 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }
            }
            transition={{ duration: 0.5, ease: EASE }}
            className={cn(
              "relative flex max-h-[88svh] w-full flex-col bg-paper text-ink shadow-2xl",
              sheet
                ? "rounded-t-3xl"
                : "max-w-2xl rounded-2xl border border-ink/10",
            )}
          >
            {sheet ? (
              <span
                aria-hidden
                className="mx-auto my-3 h-1.5 w-12 shrink-0 rounded-full bg-ink/15"
              />
            ) : null}
            <header className="flex items-start justify-between gap-6 px-6 pb-5 pt-3 md:px-10 md:pt-8">
              <div className="min-w-0">
                <Mono className="text-ink-mute">Orçamento online</Mono>
                <h2
                  id={`${ids}-titulo`}
                  ref={heading}
                  tabIndex={-1}
                  className="text-heading mt-3 text-balance font-light leading-[1.12] text-ink"
                >
                  Peça um orçamento sem sair da página.
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar orçamento online"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink/[0.06] transition-colors duration-300 hover:bg-ink/[0.12]"
              >
                <span aria-hidden className="relative block h-3.5 w-3.5">
                  <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-ink" />
                  <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-ink" />
                </span>
              </button>
            </header>

            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto overscroll-contain border-t border-ink/10 px-6 py-7 md:px-10"
            >
              <p className="mb-8 max-w-[52ch] text-body text-ink-soft">
                Mesmo formulário da nossa seção de contato: conte o caso,
                anexe petições ou laudos e receba a leitura técnica da
                equipe em até 1 dia útil.
              </p>
              <ContactForm submitLabel="Solicitar orçamento" />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
