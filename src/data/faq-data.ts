/** Perguntas frequentes, segmentadas por público. */

export type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export const PF_CATEGORIES = [
  "Erro Médico",
  "Invalidez",
  "Perícia Trabalhista",
  "Custos e Prazos",
  "Como Funciona",
  "Assistente Técnico",
] as const;

export const faqPessoaFisica: FaqItem[] = [
  {
    id: "pf-1",
    category: "Erro Médico",
    question: "Como saber se realmente houve erro médico no meu caso?",
    answer:
      "Analisamos o prontuário completo, a evolução de enfermagem e os exames à luz dos protocolos vigentes à época do atendimento. Só depois dessa leitura técnica dizemos, com honestidade, se há fundamentação suficiente para sustentar a tese.",
  },
  {
    id: "pf-2",
    category: "Erro Médico",
    question: "Preciso ter todos os documentos médicos antes de procurar a A.TEC?",
    answer:
      "Não. Comece com o que já tem em mãos. Depois da primeira leitura, a equipe indica exatamente quais prontuários, exames ou laudos ainda faltam para fechar a análise.",
  },
  {
    id: "pf-3",
    category: "Invalidez",
    question: "O INSS negou meu benefício. A A.TEC pode ajudar?",
    answer:
      "Sim. Preparamos o parecer técnico que confronta a limitação funcional real com as exigências da sua atividade, um ponto que a perícia administrativa costuma deixar de lado.",
  },
  {
    id: "pf-4",
    category: "Invalidez",
    question: "O parecer serve também para seguro por invalidez e perícia trabalhista?",
    answer:
      "Serve. O método é o mesmo: leitura técnica da limitação, correlação com a atividade exercida e fixação da data de início da incapacidade com base em documento contemporâneo.",
  },
  {
    id: "pf-5",
    category: "Custos e Prazos",
    question: "Quanto custa uma análise técnica?",
    answer:
      "Varia com a área e a complexidade do caso. Na triagem gratuita do site você recebe uma estimativa preliminar em poucos minutos, sem compromisso.",
  },
  {
    id: "pf-6",
    category: "Custos e Prazos",
    question: "Em quanto tempo recebo um retorno?",
    answer:
      "A primeira leitura do caso sai em até 1 dia útil. O prazo do parecer completo depende do volume de documentos e é combinado com você antes de começarmos.",
  },
  {
    id: "pf-7",
    category: "Como Funciona",
    question: "Um especialista acompanha a perícia junto comigo?",
    answer:
      "Sim, presencial ou online. O assistente técnico participa do ato pericial, acompanha os quesitos e garante que o procedimento seja conduzido com clareza e imparcialidade.",
  },
  {
    id: "pf-8",
    category: "Como Funciona",
    question: "Preciso de advogado para contratar a A.TEC?",
    answer:
      "Não é obrigatório para iniciar a conversa, mas a assistência técnica atua dentro de um processo judicial ou administrativo, então o ideal é já ter (ou estar buscando) representação jurídica.",
  },
  {
    id: "pf-9",
    category: "Assistente Técnico",
    question: "O que faz o assistente técnico?",
    answer:
      "É o profissional de confiança contratado por uma das partes para acompanhar a atuação do perito. Dentro do processo, auxilia na formulação de quesitos, acompanha o exame pericial e elabora parecer técnico que aponta concordâncias ou inconsistências do laudo, além de propor quesitos complementares.",
  },
  {
    id: "pf-10",
    category: "Assistente Técnico",
    question: "Quem paga o assistente técnico?",
    answer:
      "A parte que contratou o assistente técnico é responsável pelos honorários. Mesmo em casos de Justiça Gratuita, os honorários do assistente técnico particular não são custeados pelo Estado.",
  },
  {
    id: "pf-11",
    category: "Assistente Técnico",
    question: "Quanto ganha o assistente técnico?",
    answer:
      "Assistentes técnicos judiciais não recebem salário pelo trabalho no processo. Os honorários são definidos pela parte que os contrata e variam de acordo com a complexidade do caso, o tipo de perícia, o tempo de análise dos documentos e a extensão do trabalho.",
  },
  {
    id: "pf-12",
    category: "Assistente Técnico",
    question: "Qual a diferença entre perito judicial e assistente técnico?",
    answer:
      "O perito atua como auxiliar do juiz na análise dos aspectos técnicos do processo. O assistente técnico trabalha junto à parte que o contratou, oferecendo suporte especializado para que ela compreenda e se posicione diante da prova pericial.",
  },
  {
    id: "pf-13",
    category: "Assistente Técnico",
    question: "A própria parte pode ser assistente técnico?",
    answer:
      "Pode, desde que tenha conhecimento técnico ou científico relacionado ao objeto da perícia. A legislação não exige que o assistente técnico seja uma pessoa diferente da parte, mas exige qualificação adequada para acompanhar e se manifestar sobre a prova técnica.",
  },
];

export const PJ_CATEGORIES = [
  "Quesitos",
  "Impugnação de Laudos",
  "Prazos e Urgência",
  "Atuação em Lote",
  "Assistente Técnico",
] as const;

export const faqEmpresas: FaqItem[] = [
  {
    id: "pj-1",
    category: "Quesitos",
    question: "Como a A.TEC elabora quesitos estratégicos?",
    answer:
      "Partimos do ponto cego mais comum daquele tipo de litígio, identificado a partir do padrão de decisões e da prática pericial. Os quesitos são redigidos para expor exatamente esse ponto, não genéricos retirados de modelo.",
  },
  {
    id: "pj-2",
    category: "Quesitos",
    question: "Vocês também elaboram quesitos suplementares?",
    answer:
      "Sim. Depois do laudo pericial, avaliamos as respostas e propomos quesitos suplementares direcionados às lacunas ou contradições identificadas, dentro do prazo processual.",
  },
  {
    id: "pj-3",
    category: "Impugnação de Laudos",
    question: "A A.TEC assina parecer técnico para impugnar laudo pericial?",
    answer:
      "Assina. O parecer técnico corporativo confronta a metodologia, a fundamentação e as conclusões do laudo oficial, em linguagem acessível ao magistrado.",
  },
  {
    id: "pj-4",
    category: "Impugnação de Laudos",
    question: "Atuam em audiência de instrução e julgamento?",
    answer:
      "Sim, com assistente técnico presencial ou online para acompanhar a oitiva do perito e subsidiar as perguntas do advogado em tempo real.",
  },
  {
    id: "pj-5",
    category: "Prazos e Urgência",
    question: "Conseguem atender prazos processuais urgentes?",
    answer:
      "Temos fluxo de urgência para quesitos e pareceres com prazo fatal em poucos dias. Informe o prazo já na primeira mensagem para priorizarmos a triagem.",
  },
  {
    id: "pj-6",
    category: "Atuação em Lote",
    question: "É possível contratar a A.TEC para uma carteira inteira de processos?",
    answer:
      "Sim. Padronizamos os quesitos por tese, acordamos prazos e entregamos relatório consolidado de acompanhamento, com um ponto de contato único para o escritório.",
  },
  {
    id: "pj-7",
    category: "Atuação em Lote",
    question: "Como funciona o relatório de gestão da carteira?",
    answer:
      "Reunimos, por período, o status técnico de cada processo em atendimento, os prazos em aberto e as recomendações pendentes, em um único documento de gestão.",
  },
  {
    id: "pj-8",
    category: "Assistente Técnico",
    question: "Qual a diferença entre perito judicial e assistente técnico?",
    answer:
      "O perito atua como auxiliar do juiz na análise dos aspectos técnicos do processo. O assistente técnico trabalha junto à parte que o contratou, oferecendo suporte especializado para que ela compreenda e se posicione diante da prova pericial.",
  },
  {
    id: "pj-9",
    category: "Assistente Técnico",
    question: "Quem paga os honorários do assistente técnico?",
    answer:
      "A parte que contrata o assistente técnico é responsável pelo pagamento. Os honorários são definidos conforme a complexidade do caso, o tipo de perícia e a extensão do trabalho, não seguem tabela de salário.",
  },
];
