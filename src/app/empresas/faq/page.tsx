import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqPageContent from "@/components/FaqPageContent";
import { faqEmpresas, PJ_CATEGORIES } from "@/data/faq-data";

export const metadata: Metadata = {
  title: "Perguntas Frequentes | Empresas",
  description:
    "Esclarecimentos técnicos sobre quesitos estratégicos, impugnação de laudos, prazos urgentes e atuação em lote para advogados e departamentos jurídicos.",
};

export default function FaqEmpresas() {
  return (
    <>
      <Header />
      <main className="w-full max-w-full flex-1 overflow-x-clip">
        <FaqPageContent
          eyebrow="Perguntas frequentes"
          title="Esclarecimentos técnicos para advogados e departamentos jurídicos"
          lead="Quesitos, impugnação de laudos, assistência em audiências e prazos processuais, respondidos com o mesmo rigor de um parecer."
          items={faqEmpresas}
          categories={PJ_CATEGORIES}
          ctaTitle="Precisa avaliar a viabilidade técnica de um caso?"
          ctaLead="Agende a análise técnica e receba o retorno da equipe em até 1 dia útil."
          ctaLabel="Agendar análise técnica"
          ctaHref="/empresas#contato"
        />
      </main>
      <Footer />
    </>
  );
}
