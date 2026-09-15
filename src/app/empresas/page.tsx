import type { Metadata } from "next";
import Header from "@/components/Header";
import TextRevealRoot from "@/components/TextRevealRoot";
import SegmentHero from "@/components/SegmentHero";
import SegmentAreas from "@/components/SegmentAreas";
import AreaCards from "@/components/AreaCards";
import Judiciary from "@/components/Judiciary";
import AtecMatrix from "@/components/AtecMatrix";
import AtecAjuda from "@/components/AtecAjuda";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SEGMENTS } from "@/lib/segments";

export const metadata: Metadata = {
  title: "Empresas e Advogados",
  description:
    "Pareceres técnicos blindados, quesitos estratégicos e assistência pericial em Engenharia, Medicina e Avaliações Imobiliárias, caso a caso ou em lote.",
};

export default function Empresas() {
  const segment = SEGMENTS.pj;
  return (
    <>
      <Header />
      <TextRevealRoot />
      <main className="w-full max-w-full flex-1 overflow-x-clip">
        <SegmentHero segment={segment} />
        <SegmentAreas segment={segment} showCards={false} />
        <AreaCards />
        <AtecMatrix />
        <Judiciary />
        <AtecAjuda />
        <BeforeAfterSlider />
        <Contact
          label="Atendimento corporativo"
          title="Agende a análise técnica do seu caso."
          lead="Envie a síntese e anexe petições ou laudos (PDF ou Word, até 10 MB cada). Retornamos com a leitura técnica e a proposta."
          submitLabel="Agendar análise técnica"
        />
      </main>
      <Footer />
    </>
  );
}
