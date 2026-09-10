import { ABOUT, METRICS } from "@/lib/content";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import Pill from "@/components/ui/Pill";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import SpotlightCard from "@/components/ui/SpotlightCard";
import GlowRule from "@/components/ui/GlowRule";
import TextReveal from "@/components/ui/TextReveal";
import Parallax from "@/components/ui/Parallax";
import OrganicCanvas from "@/components/OrganicCanvas";
import ClipReveal from "@/components/ui/ClipReveal";
import { InViewGroup, InViewItem } from "@/components/ui/InView";

export default function About() {
  return (
    <section id="sobre" className="bg-paper">
      <Container>
        <GlowRule />
        <div className="flex items-baseline justify-between pb-12 pt-6">
          <Mono className="text-ink-mute">{ABOUT.label}</Mono>
          <Mono className="text-ink-mute">Curitiba · Paraná</Mono>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-12 pb-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <TextReveal
              as="h2"
              lines={["Assistência técnica", "especializada em", "perícias judiciais."]}
              stagger={0.08}
              className="text-title max-w-[16ch] font-light text-ink"
            />
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
        <Parallax distance={-90}>
          <ClipReveal as="figure" className="relative overflow-hidden rounded-[40px]">
          <OrganicCanvas className="h-[280px] w-full md:h-[420px] lg:h-[520px]" />
          <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 p-8 md:p-12">
            <p className="text-lead max-w-[24ch] font-light text-paper">
              Rigor técnico, qualidade e compromisso ético em cada laudo.
            </p>
            <Mono className="text-paper/70">a.tec — assistência técnica judicial</Mono>
            </figcaption>
          </ClipReveal>
        </Parallax>
      </Container>

      <Container>
        <GlowRule />
        <InViewGroup as="ul" className="grid grid-cols-2 py-6 lg:grid-cols-4">
          {METRICS.map((m) => (
            <InViewItem as="li" key={m.label}>
              <SpotlightCard className="h-full rounded-sm px-5 py-10 md:px-7 md:py-12">
                <div className="text-[clamp(2.75rem,5vw,4.5rem)] font-extralight leading-none tracking-[-0.03em] text-ink">
                  <AnimatedNumber value={m.value} prefix={m.prefix} />
                </div>
                <p className="mt-5 max-w-[20ch] text-body text-ink">{m.label}</p>
                <Mono className="mt-2 block text-ink-mute">{m.note}</Mono>
              </SpotlightCard>
            </InViewItem>
          ))}
        </InViewGroup>
      </Container>
    </section>
  );
}
