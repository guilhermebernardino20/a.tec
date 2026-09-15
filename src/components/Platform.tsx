import { PLATFORM } from "@/lib/content";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import Pill from "@/components/ui/Pill";
import { InViewGroup, InViewItem } from "@/components/ui/InView";
import TextReveal from "@/components/ui/TextReveal";

export default function Platform() {
  return (
    <section id="servicos" className="bg-paper">
      <Container>
        <InViewGroup className="grid grid-cols-1 gap-x-8 gap-y-8 py-20 md:py-32 lg:grid-cols-12">
          <InViewItem className="lg:col-span-3">
            <Mono className="text-ink-mute">{PLATFORM.label}</Mono>
          </InViewItem>

          <div className="lg:col-span-9">
            <TextReveal
              as="h2"
              text={PLATFORM.headline}
              split="words"
              stagger={0.035}
              duration={0.95}
              className="text-title max-w-[20ch] text-balance font-light leading-[1.06] text-ink"
            />

            <InViewItem className="mt-10 max-w-[62ch] md:mt-12">
              <p className="text-body text-ink-soft md:text-lg md:leading-[1.45]">
                {PLATFORM.body}
              </p>
            </InViewItem>

            <InViewItem className="mt-10">
              <Pill href="#sobre">Conheça a a.tec</Pill>
            </InViewItem>
          </div>
        </InViewGroup>
      </Container>
    </section>
  );
}
