import type { Metadata } from "next";
import Header from "@/components/Header";
import TextRevealRoot from "@/components/TextRevealRoot";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Faça parte do nosso time",
  description:
    "Médicos, psicólogos, engenheiros e avaliadores: deixe seus dados para atuar como assistente técnico com a a.tec.",
};

export default function FacaParteDoTime() {
  return (
    <>
      <Header />
      <TextRevealRoot />
      <main className="w-full max-w-full flex-1 overflow-x-clip pt-24 md:pt-28">
        <Contact
          label="Faça parte do nosso time"
          title="Deixe seus dados e entraremos em contato."
          lead="Se você é médico, psicólogo, engenheiro ou avaliador e quer atuar como assistente técnico em processos judiciais, informe sua área de atuação e anexe seu currículo."
          submitLabel="Enviar meus dados"
        />
      </main>
      <Footer />
    </>
  );
}
