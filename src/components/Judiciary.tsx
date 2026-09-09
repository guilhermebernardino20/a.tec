import { JUDICIARY_DATA } from "@/lib/content";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import Pill from "@/components/ui/Pill";
import { InViewGroup, InViewItem } from "@/components/ui/InView";

const [featured, ...rest] = JUDICIARY_DATA;

/** Bloco arredondado com o retrato do Judiciário — destaque + lista. */
export default function Judiciary() {
  return (
    <section id="dados" className="bg-paper">
      <div className="overflow-clip rounded-[40px] bg-mist">
        <Container className="py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 data-text-reveal className="text-title font-light text-ink">
              O peso da prova
            </h2>
            <Pill href="#contato" variant="outline">
              Falar sobre um caso
            </Pill>
          </div>

          <InViewGroup className="mt-14 grid grid-cols-1 gap-x-5 gap-y-12 lg:grid-cols-12">
            <InViewItem className="lg:col-span-5">
              <div className="flex flex-col justify-between gap-10 rounded-[24px] bg-ink p-8 text-paper md:p-10 lg:h-full">
                <div className="flex flex-col gap-2">
                  <Mono className="text-paper/60">Judiciário brasileiro</Mono>
                  <Mono className="text-paper/40">{featured.source}</Mono>
                </div>
                <div>
                  <p className="text-[clamp(3rem,6vw,5rem)] font-extralight leading-none tracking-[-0.03em]">
                    {featured.figure}
                  </p>
                  <p className="mt-4 text-lead font-light text-paper/85">
                    {featured.caption}
                  </p>
                  <p className="mt-6 max-w-[38ch] text-body text-paper/60">
                    {featured.body}
                  </p>
                </div>
              </div>
            </InViewItem>

            <ul className="lg:col-span-7">
              {rest.map((d) => (
                <InViewItem
                  as="li"
                  key={d.index}
                  className="border-b border-ink/10 first:border-t"
                >
                  <div className="grid grid-cols-1 gap-4 py-8 md:grid-cols-12 md:items-baseline md:gap-5 md:py-10">
                    <div className="flex items-baseline gap-4 md:col-span-4">
                      <Mono className="text-ink-mute">{d.source}</Mono>
                      <span className="text-[clamp(1.75rem,3vw,2.5rem)] font-extralight leading-none tracking-[-0.03em] text-ink">
                        {d.figure}
                      </span>
                    </div>
                    <div className="md:col-span-8">
                      <p className="text-lead font-light text-ink">{d.caption}</p>
                      <p className="mt-2 max-w-[52ch] text-body text-ink-soft">{d.body}</p>
                    </div>
                  </div>
                </InViewItem>
              ))}
              <InViewItem as="li" className="pt-8">
                <Mono className="text-ink-mute">
                  Fontes: CNJ · INSS · Justiça Federal
                </Mono>
              </InViewItem>
            </ul>
          </InViewGroup>
        </Container>
      </div>
    </section>
  );
}
