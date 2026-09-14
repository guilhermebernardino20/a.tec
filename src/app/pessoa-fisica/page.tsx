import type { Metadata } from "next";
import Header from "@/components/Header";
import TextRevealRoot from "@/components/TextRevealRoot";
import SegmentHero from "@/components/SegmentHero";
import SegmentAreas from "@/components/SegmentAreas";
import AtecAjuda from "@/components/AtecAjuda";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Triagem from "@/components/Triagem";
import { SEGMENTS } from "@/lib/segments";

export const metadata: Metadata = {
  title: "Pessoa Física",
  description:
    "Defesa técnica e acompanhamento pericial para o seu processo: erro médico, invalidez, psicologia jurídica e perícias previdenciárias.",
};

export default function PessoaFisica() {
  const segment = SEGMENTS.pf;
  return (
    <>
      <Header />
      <TextRevealRoot />
      <main className="w-full max-w-full flex-1 overflow-x-clip">
        <SegmentHero segment={segment} />
        <SegmentAreas segment={segment} />
        <AtecAjuda />
        <BeforeAfterSlider />
        <Contact
          title="Conte o seu caso. A gente explica o caminho."
          lead="Prefere escrever? Envie a mensagem e, se quiser, os documentos. Respondemos em linguagem simples."
        />
      </main>
      <Footer />
      <Triagem />
    </>
  );
}
