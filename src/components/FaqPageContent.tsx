"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import FaqAccordion from "@/components/FaqAccordion";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/data/faq-data";

/** Corpo compartilhado das páginas de FAQ de Pessoa Física e Empresas. */
export default function FaqPageContent({
  eyebrow,
  title,
  lead,
  items,
  categories,
  ctaTitle,
  ctaLead,
  ctaLabel,
  ctaHref,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  items: FaqItem[];
  categories: readonly string[];
  ctaTitle: string;
  ctaLead: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  const [category, setCategory] = useState<string>("Todos");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = category === "Todos" || item.category === category;
      const matchesQuery =
        q.length === 0 ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, category, query]);

  return (
    <section className="bg-paper py-20 md:py-32">
      <Container>
        <Mono className="text-ink-mute">{eyebrow}</Mono>
        <h1 className="text-title mt-6 max-w-[20ch] text-balance font-light leading-[1.08] text-ink">
          {title}
        </h1>
        <p className="mt-6 max-w-[52ch] text-body text-ink-soft">{lead}</p>

        {/* busca + categorias */}
        <div className="mt-12 flex flex-col gap-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por palavra-chave"
            aria-label="Buscar pergunta"
            className="min-h-[48px] w-full max-w-md rounded-full border border-ink/15 bg-transparent px-5 text-base text-ink outline-none transition-colors duration-300 placeholder:text-ink/40 focus:border-olive-brand"
          />
          <div className="flex flex-wrap gap-2">
            {["Todos", ...categories].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  "min-h-[48px] rounded-full border px-4 py-2.5 text-sm transition-all duration-300 active:scale-[0.99]",
                  category === c
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 text-ink-soft hover:border-olive-brand/40 hover:text-ink",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* lista, em vidro escuro sobre o fundo claro da página */}
        <div className="mt-10 rounded-2xl bg-dark-card p-4 md:p-6" data-surface="dark">
          <FaqAccordion items={filtered} />
        </div>

        {/* card fixo no rodapé da página */}
        <div className="mt-12 flex flex-col items-start gap-6 rounded-2xl border border-white/10 bg-dark-card p-8 text-paper md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-heading font-light">{ctaTitle}</p>
            <p className="mt-2 max-w-[46ch] text-sm text-paper/70">{ctaLead}</p>
          </div>
          <Link
            href={ctaHref}
            target={ctaHref.startsWith("http") ? "_blank" : undefined}
            rel={ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-olive px-6 py-3 text-sm font-medium text-dark transition-colors duration-300 hover:bg-olive-light"
          >
            {ctaLabel}
          </Link>
        </div>
      </Container>
    </section>
  );
}
