import { JUDICIARY_DATA } from "@/lib/content";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import Pill from "@/components/ui/Pill";
import { InViewGroup, InViewItem } from "@/components/ui/InView";

/**
 * "O peso da prova" na página inicial: um único painel escuro com os
 * quatro dados lado a lado, em vez do destaque + lista usado em
 * `Judiciary` (página Empresas).
 */
export default function PesoDaProvaHome() {
  return (
    <section id="dados" className="bg-paper py-20 md:py-32">
      <Container>
        <div
          data-surface="dark"
          className="overflow-hidden rounded-2xl border border-white/10 bg-dark-card text-paper"
        >
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 px-6 pb-8 pt-8 md:px-12 md:pt-12">
            <div>
              <Mono className="text-paper/45">Judiciário brasileiro</Mono>
              <h2
                data-text-reveal
                className="text-title mt-4 font-light leading-[1.08]"
              >
                O peso da prova
              </h2>
            </div>
            <Pill href="#contato" variant="light">
              Falar sobre um caso
            </Pill>
          </div>

          <InViewGroup
            as="ul"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {JUDICIARY_DATA.map((d) => (
              <InViewItem
                as="li"
                key={d.index}
                className="border-b border-white/10 px-6 py-10 last:border-b-0 sm:border-b-0 sm:[&:nth-child(-n+2)]:border-b sm:odd:border-r lg:border-r lg:border-b-0 lg:px-8 lg:last:border-r-0"
              >
                <Mono className="text-paper/40">{d.source}</Mono>
                <p className="mt-4 font-sans text-[clamp(2rem,3.4vw,2.75rem)] font-light leading-none tracking-tight">
                  {d.figure}
                </p>
                <p className="mt-4 text-body font-light text-paper/85">
                  {d.caption}
                </p>
                <p className="mt-2 max-w-[32ch] text-sm text-paper/55">
                  {d.body}
                </p>
              </InViewItem>
            ))}
          </InViewGroup>

          <p className="border-t border-white/10 px-6 py-6 text-[11px] leading-normal text-paper/40 md:px-12">
            Fontes: CNJ · INSS · Justiça Federal
          </p>
        </div>
      </Container>
    </section>
  );
}
