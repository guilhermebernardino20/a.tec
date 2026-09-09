import { ABOUT, METRICS } from "@/lib/content";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import Pill from "@/components/ui/Pill";
import Counter from "@/components/ui/Counter";
import OrganicCanvas from "@/components/OrganicCanvas";
import ClipReveal from "@/components/ui/ClipReveal";
import { InViewGroup, InViewItem } from "@/components/ui/InView";

export default function About() {
  return (
    <section id="sobre" className="bg-paper">
      <Container>
        <div className="flex items-baseline justify-between border-t border-ink/10 pb-12 pt-6">
          <Mono className="text-ink-mute">{ABOUT.label}</Mono>
          <Mono className="text-ink-mute">Curitiba · Paraná</Mono>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-12 pb-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2
              data-text-reveal
              className="text-title max-w-[16ch] font-light text-ink"
            >
              {ABOUT.headline}
            </h2>
          </div>

          <InViewGroup className="lg:col-span-5">
            <InViewItem>
              <p className="text-body text-ink-soft md:text-lg md:leading-[1.45]">
                {ABOUT.columns[0]}
              </p>
            </InViewItem>
            <InViewItem className="mt-6">
              <p className="text-body text-ink-soft md:text-lg md:leading-[1.45]">
                {ABOUT.columns[1]}
              </p>
            </InViewItem>
            <InViewItem className="mt-6">
              <p className="text-body text-ink-soft md:text-lg md:leading-[1.45]">
                {ABOUT.closing}
              </p>
            </InViewItem>
            <InViewItem className="mt-10">
              <Pill href="#contato">Fale com a nossa equipe</Pill>
            </InViewItem>
          </InViewGroup>
        </div>
      </Container>

      <Container>
        <ClipReveal as="figure" className="relative overflow-hidden rounded-[40px]">
          <OrganicCanvas className="h-[280px] w-full md:h-[420px] lg:h-[520px]" />
          <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 p-8 md:p-12">
            <p className="text-lead max-w-[24ch] font-light text-paper">
              Rigor técnico, qualidade e compromisso ético em cada laudo.
            </p>
            <Mono className="text-paper/70">a.tec — assistência técnica judicial</Mono>
          </figcaption>
        </ClipReveal>
      </Container>

      <Container>
        <InViewGroup
          as="ul"
          className="grid grid-cols-2 gap-x-5 gap-y-10 border-t border-ink/10 py-16 md:py-20 lg:grid-cols-4"
        >
          {METRICS.map((m) => (
            <InViewItem as="li" key={m.label}>
              <div className="text-[clamp(2.75rem,5vw,4.5rem)] font-extralight leading-none tracking-[-0.03em] text-ink">
                <Counter value={m.value} prefix={m.prefix} />
              </div>
              <p className="mt-5 max-w-[20ch] text-body text-ink">{m.label}</p>
              <Mono className="mt-2 block text-ink-mute">{m.note}</Mono>
            </InViewItem>
          ))}
        </InViewGroup>
      </Container>
    </section>
  );
}
