"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import { InViewGroup, InViewItem } from "@/components/ui/InView";
import { openTriage } from "@/lib/triagem";
import type { Segment } from "@/lib/segments";

/** Áreas em destaque de cada segmento, com a ação de entrada. */
export default function SegmentAreas({ segment }: { segment: Segment }) {
  const pf = segment.profile === "pf";

  return (
    <section id="areas" className="bg-paper py-20 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 pb-12 lg:grid-cols-12">
          <Mono className="text-ink-mute lg:col-span-3">
            {segment.areasLabel}
          </Mono>
          <h2 className="text-title text-balance font-light leading-[1.06] tracking-[-0.03em] [word-spacing:-0.05em] text-ink lg:col-span-9">
            {segment.areasTitle}
          </h2>
        </div>

        <InViewGroup
          as="ul"
          className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6"
        >
          {segment.areas.map((area) => (
            <InViewItem as="li" key={area.title}>
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-dark-card p-7 text-paper md:p-8">
                <span className="font-mono text-mono text-olive-light">
                  {area.index}
                </span>
                <h3 className="text-heading mt-6 text-balance font-light leading-[1.12]">
                  {area.title}
                </h3>
                <p className="mt-4 text-body text-paper/70">{area.body}</p>
                <ul className="mt-6 space-y-2 border-t border-paper/10 pt-6">
                  {area.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-paper/80">
                      <span
                        aria-hidden
                        className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-olive-light"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  {pf ? (
                    <button
                      type="button"
                      onClick={() => openTriage("pf", area.triageArea)}
                      className="min-h-11 w-full rounded-full bg-paper/[0.08] px-5 py-3 text-sm text-paper transition-colors duration-300 hover:bg-olive hover:text-dark"
                    >
                      Iniciar triagem →
                    </button>
                  ) : (
                    <Link
                      href="#contato"
                      className="flex min-h-11 w-full items-center justify-center rounded-full bg-paper/[0.08] px-5 py-3 text-sm text-paper transition-colors duration-300 hover:bg-olive hover:text-dark"
                    >
                      Agendar análise técnica →
                    </Link>
                  )}
                </div>
              </article>
            </InViewItem>
          ))}
        </InViewGroup>
      </Container>
    </section>
  );
}
