import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Triagem from "@/components/Triagem";
import FaqPageContent from "@/components/FaqPageContent";
import { faqPessoaFisica, PF_CATEGORIES } from "@/data/faq-data";
import { getGeneralWhatsAppUrl } from "@/utils/whatsapp";

export const metadata: Metadata = {
  title: "Perguntas Frequentes | Pessoa Física",
  description:
    "Tire suas dúvidas sobre erro médico, invalidez, perícia trabalhista, custos e prazos da assistência técnica a.tec.",
};

export default function FaqPessoaFisica() {
  return (
    <>
      <Header />
      <main className="w-full max-w-full flex-1 overflow-x-clip">
        <FaqPageContent
          eyebrow="Perguntas frequentes"
          title="Tire suas dúvidas sobre a defesa técnica do seu processo"
          lead="Reunimos as perguntas mais comuns de quem já passou pela a.tec, em linguagem simples."
          items={faqPessoaFisica}
          categories={PF_CATEGORIES}
          ctaTitle="Sua dúvida não está aqui?"
          ctaLead="Fale diretamente com a equipe pelo WhatsApp e receba uma resposta rápida."
          ctaLabel="Falar no WhatsApp"
          ctaHref={getGeneralWhatsAppUrl()}
        />
      </main>
      <Footer />
      <Triagem />
    </>
  );
}
