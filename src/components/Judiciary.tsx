import { JUDICIARY_DATA, METRICS } from "@/lib/content";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import Pill from "@/components/ui/Pill";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { InViewGroup, InViewItem } from "@/components/ui/InView";
import Parallax from "@/components/ui/Parallax";

const [featured, ...rest] = JUDICIARY_DATA;

/** Bloco arredondado com o retrato do Judiciário — destaque + lista. */
export default function Judiciary() {
  return (
    <section id="dados" className="bg-paper">
      <div className="overflow-clip rounded-2xl bg-mist">
        <Container className="py-20 md:py-32">
          {/* números da própria a.tec, antes do retrato do Judiciário */}
          <InViewGroup
            as="ul"
            className="grid grid-cols-2 pb-14 lg:grid-cols-4"
          >
            {METRICS.map((m) => (
              <InViewItem as="li" key={m.label}>
                <SpotlightCard className="h-full rounded-sm px-4 py-8 md:px-6 md:py-10">
                  <div className="text-[clamp(2.5rem,4.6vw,4rem)] font-extralight leading-none text-ink">
                    <AnimatedNumber value={m.value} prefix={m.prefix} />
                  </div>
                  <p className="mt-2 max-w-[20ch] text-body text-ink">
                    {m.label}
                  </p>
                  <p className="mt-2 text-[13px] text-ink-mute">{m.note}</p>
                </SpotlightCard>
              </InViewItem>
            ))}
          </InViewGroup>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 data-text-reveal className="text-title font-light text-ink">
              O peso da prova
            </h2>
            <Pill href="#contato" variant="outline">
              Falar sobre um caso
            </Pill>
          </div>

          <InViewGroup className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
            <InViewItem className="lg:col-span-5">
              <Parallax distance={-46} className="lg:h-full">
                <div className="flex flex-col justify-between gap-10 rounded-2xl border border-white/10 bg-dark-card p-8 text-paper backdrop-blur-md transition-colors duration-300 hover:border-olive/40 md:p-10 lg:h-full">
                  <div className="flex flex-col gap-2">
                    <Mono className="text-paper/60">Judiciário brasileiro</Mono>
                    <Mono className="text-paper/40">{featured.source}</Mono>
                  </div>
                  <div>
                    <p className="font-sans text-[clamp(2.5rem,5vw,4.25rem)] font-light leading-none tracking-tight">
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
              </Parallax>
            </InViewItem>

            <ul className="lg:col-span-7">
              {rest.map((d) => (
                <InViewItem
                  as="li"
                  key={d.index}
                  className="border-b border-ink/10 first:border-t"
                >
                  <div className="py-8 md:py-10">
                    {/* período em linha própria, com respiro antes do número */}
                    <Mono className="block text-ink-mute">{d.source}</Mono>
                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[8.5rem_minmax(0,1fr)] md:items-baseline md:gap-6">
                      <span className="font-sans text-[clamp(1.5rem,2.6vw,2.1rem)] font-light leading-none tracking-tight text-ink">
                        {d.figure}
                      </span>
                      <div>
                        <p className="text-lead font-light text-ink">
                          {d.caption}
                        </p>
                        <p className="mt-2 max-w-[52ch] text-body text-ink-soft">
                          {d.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </InViewItem>
              ))}
              <InViewItem as="li" className="pt-8">
                <p className="text-[11px] leading-normal text-ink-mute">
                  Fontes: CNJ · INSS · Justiça Federal
                </p>
              </InViewItem>
            </ul>
          </InViewGroup>
        </Container>
      </div>
    </section>
  );
}
