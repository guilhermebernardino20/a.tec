import { ABOUT } from "@/lib/content";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import Pill from "@/components/ui/Pill";
import GlowRule from "@/components/ui/GlowRule";
import TextReveal from "@/components/ui/TextReveal";
import { InViewGroup, InViewItem } from "@/components/ui/InView";

export default function About() {
  return (
    <section id="sobre" className="bg-paper py-20 md:py-32">
      <Container>
        <GlowRule />
        <div className="flex items-baseline justify-between pb-12 pt-6">
          <Mono className="text-ink-mute">{ABOUT.label}</Mono>
          <Mono className="text-ink-mute">Curitiba · Paraná</Mono>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <TextReveal
              as="h2"
              lines={[
                "Assistência técnica",
                "especializada em",
                "perícias judiciais.",
              ]}
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
    </section>
  );
}
