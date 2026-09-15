/**
 * Conteúdo das duas entradas do site: Pessoa Física e Empresas / PJ.
 */
import type { Profile } from "@/lib/triagem";

export type SegmentArea = {
  index: string;
  title: string;
  body: string;
  bullets: string[];
  /** área pré-selecionada na triagem (só PF) */
  triageArea?: string;
};

export type Segment = {
  profile: Profile;
  href: string;
  tag: string;
  cardTitle: string;
  cardBody: string;
  cardCta: string;
  heroTitle: string[];
  heroLead: string;
  areasLabel: string;
  areasTitle: string;
  areas: SegmentArea[];
};

export const SEGMENTS: Record<Profile, Segment> = {
  pf: {
    profile: "pf",
    href: "/pessoa-fisica",
    tag: "Atendimento individual",
    cardTitle: "Sou Pessoa Física",
    cardBody:
      "Preciso de defesa técnica e acompanhamento pericial para o meu processo (Erro Médico, Invalidez, Perícia Trabalhista ou Previdenciária).",
    cardCta: "Acessar atendimento para Pessoa Física",
    heroTitle: ["Você não precisa", "enfrentar a perícia sozinho."],
    heroLead:
      "Explicamos cada etapa em linguagem simples e colocamos um especialista ao seu lado, da leitura dos documentos ao dia da perícia.",
    areasLabel: "Como podemos ajudar",
    areasTitle: "Casos em que a prova técnica faz diferença na sua vida.",
    areas: [
      {
        index: "01",
        title: "Perícia Médica",
        body: "Quando um tratamento ou uma cirurgia deu errado, analisamos o prontuário e mostramos, com base técnica, o que aconteceu.",
        bullets: [
          "Suposto erro médico",
          "Interdição e curatela",
          "Laudos e exames contestados",
        ],
        triageArea: "medicina",
      },
      {
        index: "02",
        title: "Psicologia Jurídica",
        body: "Em disputas que envolvem crianças e família, cuidamos para que a avaliação psicológica seja justa e bem fundamentada.",
        bullets: [
          "TEA: acompanhante escolar e tratamento ABA",
          "Guarda e convivência",
          "Alienação parental",
        ],
        triageArea: "psicologia",
      },
      {
        index: "03",
        title: "Fins Previdenciários",
        body: "Se o INSS, a seguradora ou a empresa negou o seu direito, preparamos o parecer que mostra a sua real limitação para o trabalho.",
        bullets: [
          "Benefício do INSS negado",
          "Seguro por invalidez",
          "Perícia trabalhista",
        ],
        triageArea: "medicina",
      },
      {
        index: "04",
        title: "Engenharia Imobiliária",
        body: "Rachaduras, infiltrações ou defeitos no imóvel que você comprou ou reformou: identificamos a causa e quem responde por ela.",
        bullets: [
          "Vícios construtivos e infiltrações",
          "Imóvel novo entregue com defeito",
          "Danos causados por obra vizinha",
        ],
        triageArea: "engenharias",
      },
    ],
  },
  pj: {
    profile: "pj",
    href: "/empresas",
    tag: "Corporativo & jurídico",
    cardTitle: "Sou Empresa ou Advogado",
    cardBody:
      "Busco pareceres técnicos blindados, quesitos estratégicos e assistência em perícias de Engenharia, Medicina e Avaliações Imobiliárias.",
    cardCta: "Acessar soluções corporativas",
    heroTitle: ["Prova técnica blindada", "para litígios complexos."],
    heroLead:
      "Pareceres com método declarado, quesitos direcionados ao ponto cego do laudo e assistência pericial com rigor científico, caso a caso ou em carteira.",
    areasLabel: "Soluções corporativas",
    areasTitle: "Autoridade pericial onde o contencioso é decidido.",
    areas: [
      {
        index: "01",
        title: "Engenharia Diagnosticativa",
        body: "Investigação da origem, do mecanismo e da responsabilidade de falhas construtivas, com custo de recomposição auditável.",
        bullets: [
          "Patologias e vícios construtivos",
          "Impacto entre obras",
          "Insalubridade e periculosidade",
        ],
      },
      {
        index: "02",
        title: "Avaliações Imobiliárias",
        body: "Laudos conforme a NBR 14.653, com amostra rastreável e grau de fundamentação e precisão declarados.",
        bullets: [
          "Imóveis urbanos e rurais",
          "Partilhas e disputas patrimoniais",
          "Indenizações e garantias",
        ],
      },
      {
        index: "03",
        title: "Assistência Técnica em Lote",
        body: "Atendimento recorrente para carteiras de contencioso: quesitos padronizados por tese, prazos acordados e relatórios de gestão.",
        bullets: [
          "Carteiras trabalhistas e securitárias",
          "Padronização de quesitos e impugnações",
          "Relatório consolidado por processo",
        ],
      },
    ],
  },
};
