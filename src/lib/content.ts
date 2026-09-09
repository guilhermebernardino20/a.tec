/**
 * Conteúdo institucional da a.tec.
 * Fonte: "Documentação site A.tec" e "Manual de Marca" (2025).
 */

export const NAV = [
  { index: "01", label: "Atuação", href: "#servicos" },
  { index: "02", label: "Sobre", href: "#sobre" },
  { index: "03", label: "Dados", href: "#dados" },
  { index: "04", label: "Contato", href: "#contato" },
] as const;

export const METRICS = [
  { value: 1000, prefix: "+", label: "Processos atendidos", note: "Desde a fundação" },
  { value: 1000, prefix: "+", label: "Perícias realizadas", note: "Presenciais e online" },
  { value: 100, prefix: "+", label: "Profissionais especializados", note: "Rede técnica multidisciplinar" },
  { value: 3, prefix: "", label: "Estados atendidos", note: "Atuação regional" },
] as const;

export const JUDICIARY_DATA = [
  {
    index: "01",
    figure: "75,5 mi",
    caption: "processos em tramitação",
    body: "Em um Judiciário dessa dimensão, cada elemento da prova pode fazer diferença.",
    source: "CNJ · Justiça em Números",
  },
  {
    index: "02",
    figure: "7 mi+",
    caption: "exames médico-periciais em um ano",
    body: "A perícia faz parte da realidade de milhões de demandas.",
    source: "2024",
  },
  {
    index: "03",
    figure: "≈70%",
    caption: "da demanda do INSS",
    body: "Depende de avaliação médico-pericial. A análise técnica pode ser determinante.",
    source: "2025",
  },
  {
    index: "04",
    figure: "1 em 3",
    caption: "processos da Justiça Federal",
    body: "Quase um terço é previdenciário — e muitos deles dependem de prova técnica.",
    source: "2024",
  },
] as const;

export const STEPS = [
  {
    index: "01",
    short: "Viabilidade",
    title: "Estudo de Viabilidade Técnica",
    body: "Analisamos previamente o caso e identificamos se há fundamentação técnica suficiente para sustentar a ação ou a defesa.",
  },
  {
    index: "02",
    short: "Documentos",
    title: "Análise de Documentos e Laudos",
    body: "Examinamos prontuários, exames, relatórios e laudos periciais para apontar inconsistências e aspectos técnicos relevantes às suas teses.",
  },
  {
    index: "03",
    short: "Pareceres",
    title: "Pareceres e Contraprovas",
    body: "Elaboramos pareceres técnicos e contraprovas com linguagem acessível ao Judiciário, fundamentando tecnicamente os argumentos jurídicos.",
  },
  {
    index: "04",
    short: "Quesitos",
    title: "Formulação de Quesitos e Impugnações",
    body: "Apoiamos o advogado na elaboração de quesitos e na impugnação de laudos, assegurando precisão técnica e coerência estratégica.",
  },
  {
    index: "05",
    short: "Perícias",
    title: "Acompanhamento em Perícias",
    body: "Participamos das perícias no modelo presencial ou online, garantindo que o procedimento técnico seja conduzido com clareza e imparcialidade.",
  },
] as const;

export type Practice = {
  id: string;
  index: string;
  name: string;
  /** frase curta usada no cartão da grade de atuação */
  cardBody: string;
  /** preenchimento do cartão na grade */
  tone: "mint" | "ink" | "stone" | "sage";
  headline: string;
  intro: string;
  specialties: { title: string; body: string }[];
};

export const PRACTICES: Practice[] = [
  {
    id: "medicina",
    cardBody:
      "Erro médico, interdição judicial e invalidez — prontuários, exames e laudos lidos com rigor científico.",
    tone: "mint",
    index: "01",
    name: "Medicina",
    headline: "Apoio técnico especializado para fortalecer estratégias jurídicas diante das demandas de saúde.",
    intro:
      "Analisamos prontuários, laudos e exames com rigor científico, traduzindo informações técnicas em argumentos jurídicos claros e consistentes.",
    specialties: [
      {
        title: "Suposto Erro Médico",
        body: "Suporte para ações de responsabilidade civil na saúde, caracterizando negligência (omissão de cuidados ou descumprimento de protocolos), imprudência (ação precipitada que expõe o paciente a danos) e imperícia (falta de conhecimento técnico na execução de procedimentos).",
      },
      {
        title: "Interdição Judicial",
        body: "Fundamentação técnica para processos de curatela: laudos e relatórios médicos necessários à instrução da causa e à comprovação da incapacidade civil.",
      },
      {
        title: "Invalidez",
        body: "Suporte em demandas previdenciárias, securitárias e trabalhistas — ações contra o INSS, seguradoras ou empregadores. Pareceres médicos que fortalecem a petição inicial e a instrução probatória.",
      },
    ],
  },
  {
    id: "psicologia",
    cardBody:
      "TEA, guarda e convivência, alienação parental — avaliações traduzidas em elementos técnicos para o processo.",
    tone: "ink",
    index: "02",
    name: "Psicologia",
    headline: "Análises psicológicas fundamentadas para demandas que envolvem crianças, relações familiares e acompanhamento especializado.",
    intro:
      "Auxiliamos advogados em processos de família, cíveis e penais, transformando avaliações psicológicas em argumentos claros e relevantes para a estratégia processual.",
    specialties: [
      {
        title: "TEA e Acompanhamento Escolar",
        body: "Avaliamos aspectos psicológicos relacionados ao desenvolvimento, à autonomia e às necessidades específicas da criança, oferecendo fundamentação técnica quanto à necessidade de professor especializado ou pedagogo.",
      },
      {
        title: "TEA e Tratamento ABA",
        body: "Análise do desenvolvimento e das necessidades individuais da criança para contribuir tecnicamente em discussões sobre a indicação e a necessidade de tratamento baseado em ABA.",
      },
      {
        title: "Guarda e Convivência",
        body: "Em disputas de guarda, a análise psicológica contribui para compreender vínculos, relações familiares e necessidades da criança, oferecendo elementos técnicos para a avaliação da situação.",
      },
      {
        title: "Alienação Parental",
        body: "Avaliação técnica das dinâmicas familiares, oferecendo ao advogado uma leitura especializada dos elementos psicológicos relevantes ao processo.",
      },
    ],
  },
  {
    id: "engenharias",
    cardBody:
      "Obras, terrenos, impacto ambiental e condições de trabalho — falhas, responsabilidades e extensão de danos.",
    tone: "stone",
    index: "03",
    name: "Engenharias",
    headline: "Análises técnicas para esclarecer questões relacionadas a obras, terrenos, estruturas e condições de trabalho.",
    intro:
      "Identificamos falhas técnicas, responsabilidades e a real extensão de danos por meio de análises criteriosas, pareceres técnicos e acompanhamento em perícias judiciais.",
    specialties: [
      {
        title: "Qualidade e Conformidade de Obras",
        body: "Analisamos a execução, os materiais e as características construtivas para identificar falhas, irregularidades e desconformidades em relação a projetos, normas e padrões aplicáveis.",
      },
      {
        title: "Impactos entre Obras",
        body: "Avaliamos as relações entre a execução de uma obra e danos, alterações ou impactos provocados em imóveis próximos, esclarecendo a origem e a extensão dos efeitos identificados.",
      },
      {
        title: "Medição e Uso de Terrenos",
        body: "Medições e análises da área disponível ou pretendida, fornecendo dados técnicos para questões de limites, ocupação e aproveitamento da propriedade.",
      },
      {
        title: "Impacto Ambiental",
        body: "Analisamos os possíveis impactos decorrentes de obras, atividades ou intervenções, considerando as características da área e os efeitos ambientais envolvidos.",
      },
      {
        title: "Insalubridade e Periculosidade",
        body: "Avaliação técnica das condições do ambiente laboral, verificando agentes insalubres ou situações de periculosidade às quais os trabalhadores estão expostos.",
      },
    ],
  },
  {
    id: "avaliacoes",
    cardBody:
      "Valor de mercado de imóveis urbanos e rurais em partilhas, indenizações e disputas patrimoniais.",
    tone: "sage",
    index: "04",
    name: "Avaliações Imobiliárias",
    headline: "Informações técnicas para dar mais clareza a questões patrimoniais, avaliações e disputas envolvendo imóveis.",
    intro:
      "Elaboramos laudos e pareceres que traduzem a complexidade do mercado imobiliário em informações claras e fundamentadas.",
    specialties: [
      {
        title: "Avaliação de Imóvel",
        body: "Consideramos características físicas, localização, padrão construtivo e condições de mercado para determinar o valor do bem de forma técnica — recurso importante em compra e venda, partilha, indenizações, financiamentos e disputas patrimoniais.",
      },
      {
        title: "Imóveis Urbanos",
        body: "Avaliamos localização, características construtivas, uso e condições do imóvel, produzindo informações que subsidiam demandas judiciais e extrajudiciais relacionadas ao patrimônio.",
      },
      {
        title: "Imóveis Rurais",
        body: "Consideramos as particularidades da propriedade rural — localização, características da área, benfeitorias e potencial de utilização — para uma análise compatível com o imóvel.",
      },
    ],
  },
];

export const CONTACT = {
  address: "Av. João Gualberto, 1342, Sala 1912 — Alto da Glória, Curitiba, Paraná",
  email: "contato@chomabettegaadvocacia.com.br",
  phone: "(41) 9830-5580",
  phoneHref: "+554198305580",
} as const;

export const MARQUEE_TEXT = "Transformamos técnica em estratégia";

export const PLATFORM = {
  label: "A engrenagem a.tec",
  headline:
    "Conhecimento processual e expertise técnica reunidos em um único método de prova.",
  body: "Atuamos desde a análise inicial do caso até a elaboração de pareceres e o acompanhamento em perícias, unindo fundamentação sólida, clareza e rigor metodológico. Nosso objetivo é transformar informações técnicas em argumentos consistentes, capazes de fortalecer a estratégia jurídica.",
} as const;

export const ABOUT = {
  label: "Sobre a a.tec",
  headline: "Assistência técnica especializada em perícias judiciais.",
  columns: [
    "Somos uma empresa de assistência técnica criada com o propósito de apoiar as partes e seus advogados na busca por resultados favoráveis em processos judiciais que envolvem prova pericial.",
    "Aliamos o conhecimento processual à expertise técnica das áreas em discussão, oferecendo análises criteriosas e pareceres fundamentados, de modo a assegurar que nossos clientes tenham a melhor estratégia possível diante das demandas judiciais.",
  ],
  closing:
    "Nossa atuação abrange Medicina, Psicologia, Engenharias e Avaliações Imobiliárias — sempre com foco em qualidade, rigor técnico e compromisso ético.",
} as const;
