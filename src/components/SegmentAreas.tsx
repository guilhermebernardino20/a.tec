"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import { InViewGroup, InViewItem } from "@/components/ui/InView";
import { openTriage } from "@/lib/triagem";
import type { Segment } from "@/lib/segments";
import { cn } from "@/lib/utils";

/** Áreas em destaque de cada segmento, com a ação de entrada. */
export default function SegmentAreas({
  segment,
  showCards = true,
}: {
  segment: Segment;
  /** Empresas usa os 4 cards de atuação logo abaixo */
  showCards?: boolean;
}) {
  const pf = segment.profile === "pf";

  return (
    <section
      id="areas"
      className={cn("bg-paper pt-20 md:pt-32", showCards && "pb-20 md:pb-32")}
    >
      <Container>
        <div className="flex flex-col items-start gap-6 pb-12">
          <Mono className="text-ink-mute">{segment.areasLabel}</Mono>
          <h2 className="text-title text-balance font-light leading-[1.06] text-ink max-w-[22ch]">
            {segment.areasTitle}
          </h2>
        </div>

        {showCards ? (
          <InViewGroup
            as="ul"
            className={cn(
              "grid grid-cols-1 gap-4 md:gap-6",
              segment.areas.length === 5
                ? "md:grid-cols-2 lg:grid-cols-6"
                : segment.areas.length === 4
                  ? "md:grid-cols-2 lg:grid-cols-4"
                  : "md:grid-cols-3",
            )}
          >
            {segment.areas.map((area, i) => (
              <InViewItem
                as="li"
                key={area.title}
                // 5 cards: três em cima, dois embaixo
                className={cn(
                  segment.areas.length === 5 &&
                    (i < 3 ? "lg:col-span-2" : "lg:col-span-3"),
                  segment.areas.length === 5 && i === 4 && "md:col-span-2",
                )}
              >
                <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-dark-card p-7 text-paper md:p-8">
                  <span className="font-mono text-mono text-olive-light">
                    {area.index}
                  </span>
                  <h3
                    className={cn(
                      "text-heading mt-6 text-balance font-light leading-[1.12] [overflow-wrap:anywhere]",
                      segment.areas.length === 4 &&
                        "lg:text-[clamp(1.5rem,1.9vw,1.875rem)]",
                    )}
                  >
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
        ) : null}
      </Container>
    </section>
  );
}
