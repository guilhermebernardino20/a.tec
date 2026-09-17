"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/data/faq-data";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Lista de perguntas em vidro escuro, uma aberta por vez. Publica também
 * o schema `FAQPage` em JSON-LD, para a busca do Google.
 */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-neutral-900/50 p-6 text-sm text-paper/60 backdrop-blur-md">
        Nenhuma pergunta encontrada para esse filtro.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <script
        type="application/ld+json"
        // conteúdo estático e confiável, gerado a partir dos próprios dados
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-md transition-colors duration-300 hover:border-olive/40"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex min-h-[48px] w-full items-center justify-between gap-4 p-6 text-left"
            >
              <span className="text-body font-light text-paper">
                {item.question}
              </span>
              <span
                aria-hidden
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-olive/40 text-[#7F9970] transition-transform duration-300",
                  isOpen && "rotate-45",
                )}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-sm leading-relaxed text-paper/70">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
