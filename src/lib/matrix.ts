/**
 * Base da A.TEC Matrix — central de inteligência pericial.
 *
 * Cada tipo de litígio traz o ponto cego mais frequente nos laudos, a
 * linha de raciocínio científico a perseguir nos quesitos e a leitura de
 * risco x oportunidade da prova.
 *
 * Conteúdo redigido a partir da documentação institucional e da prática
 * corrente em assistência técnica — deve ser validado pela equipe da
 * a.tec antes da publicação.
 */

/**
 * Papel da prova técnica na tese — escala qualitativa, sem número:
 * `CRÍTICO` decide o mérito · `ESSENCIAL` sustenta a tese ·
 * `ALTO` pesa de forma relevante ao lado de outros elementos.
 */
export type Impact = "CRÍTICO" | "ESSENCIAL" | "ALTO";

/** Rigor metodológico exigido, de padrão a máximo. */
export type RigorLevel = 1 | 2 | 3 | 4;

export const RIGOR_LABEL: Record<RigorLevel, string> = {
  1: "Padrão",
  2: "Elevado",
  3: "Estrito",
  4: "Máximo",
};

export type MatrixCase = {
  id: string;
  label: string;
  /** [01] falha mais comum no laudo da parte contrária ou do juízo */
  blindSpot: string;
  /** [02] linha de raciocínio científico dos quesitos */
  questioning: string[];
  /** [03] prova e viabilidade */
  evidence: {
    risk: string;
    opportunity: string;
    /** peso da prova técnica na sustentação da tese */
    impact: Impact;
    /** rigor metodológico exigido pelo caso, em quatro degraus */
    rigor: RigorLevel;
    horizon: string;
  };
};

export type MatrixArea = {
  id: string;
  index: string;
  label: string;
  cases: MatrixCase[];
};

export const MATRIX: MatrixArea[] = [
  {
    id: "medicina",
    index: "01",
    label: "Medicina",
    cases: [
      {
        id: "erro-cirurgico",
        label: "Erro médico em cirurgia",
        blindSpot:
          "O laudo costuma concluir pela ausência de erro apoiado apenas na descrição cirúrgica, sem confrontá-la com a evolução de enfermagem e a ficha anestésica, que são justamente onde a intercorrência aparece em tempo real.",
        questioning: [
          "Estabelecer a linha do tempo minuto a minuto a partir de todas as fontes do prontuário, não só da descrição cirúrgica.",
          "Confrontar cada conduta com o protocolo institucional e as diretrizes da especialidade vigentes à data do ato.",
          "Separar complicação previsível e informada de desvio de técnica.",
          "Demonstrar o nexo entre o desvio apontado e a sequela documentada nos exames posteriores.",
        ],
        evidence: {
          risk: "Prontuário incompleto ou com registros feitos após o evento enfraquece a linha do tempo e é o principal ponto de ataque da defesa.",
          opportunity:
            "Divergência entre descrição cirúrgica e evolução de enfermagem costuma ser decisiva e passa despercebida na perícia oficial.",
          impact: "CRÍTICO",
          rigor: 4,
          horizon: "Análise preliminar em 5 a 10 dias úteis",
        },
      },
      {
        id: "invalidez-inss",
        label: "Invalidez previdenciária",
        blindSpot:
          "A perícia do INSS avalia a doença, não a atividade: raramente confronta a limitação funcional com as exigências reais do trabalho exercido, e quase nunca fixa corretamente a data de início da incapacidade.",
        questioning: [
          "Descrever tecnicamente as exigências físicas e cognitivas da função efetivamente exercida.",
          "Correlacionar a limitação documentada em exames com cada uma dessas exigências.",
          "Fixar a data de início da incapacidade com base em documento contemporâneo, não em declaração.",
          "Avaliar possibilidade real de reabilitação profissional considerando idade, escolaridade e histórico.",
        ],
        evidence: {
          risk: "Ausência de exame contemporâneo ao pedido administrativo dificulta a fixação da DII e limita os efeitos financeiros.",
          opportunity:
            "Laudos administrativos padronizados costumam ignorar a função exercida, ponto em que a contraprova técnica é mais eficaz.",
          impact: "ESSENCIAL",
          rigor: 3,
          horizon: "Parecer em 7 a 12 dias úteis",
        },
      },
      {
        id: "interdicao",
        label: "Interdição e curatela",
        blindSpot:
          "O laudo se apoia no diagnóstico e no CID, sem demonstrar o impacto funcional concreto sobre os atos da vida civil, que é o que o Estatuto da Pessoa com Deficiência exige para dimensionar a curatela.",
        questioning: [
          "Traduzir o diagnóstico em capacidade concreta para atos patrimoniais e negociais.",
          "Dimensionar o grau e a extensão da curatela, evitando restrição maior que a necessária.",
          "Avaliar flutuação do quadro e necessidade de reavaliação periódica.",
        ],
        evidence: {
          risk: "Relatórios desatualizados ou genéricos levam a laudo inconclusivo e a nova perícia.",
          opportunity:
            "Avaliação funcional bem documentada encurta a instrução e sustenta a extensão pedida.",
          impact: "ESSENCIAL",
          rigor: 3,
          horizon: "Análise preliminar em 5 dias úteis",
        },
      },
    ],
  },
  {
    id: "psicologia",
    index: "02",
    label: "Psicologia",
    cases: [
      {
        id: "tea-escolar",
        label: "TEA / acompanhante escolar",
        blindSpot:
          "A negativa se apoia no nível de suporte declarado no laudo, sem avaliar a demanda concreta da criança na rotina escolar, que é o que determina a necessidade do profissional de apoio.",
        questioning: [
          "Descrever o perfil de desenvolvimento e a autonomia observada em ambiente escolar.",
          "Correlacionar as demandas de suporte com as atividades efetivamente exigidas em sala.",
          "Avaliar risco de regressão terapêutica na ausência do acompanhamento.",
        ],
        evidence: {
          risk: "Relatórios escolares genéricos enfraquecem a demonstração da necessidade.",
          opportunity:
            "Relatório da escola alinhado ao laudo clínico costuma ser suficiente para a tutela de urgência.",
          impact: "ALTO",
          rigor: 3,
          horizon: "Parecer em 5 a 8 dias úteis",
        },
      },
      {
        id: "aba",
        label: "TEA / tratamento ABA",
        blindSpot:
          "A operadora contesta a carga horária sem discutir a indicação clínica; o laudo oficial, por sua vez, raramente examina os objetivos terapêuticos e a resposta já documentada no acompanhamento.",
        questioning: [
          "Justificar tecnicamente a intensidade de horas frente ao quadro individual.",
          "Demonstrar evolução e resposta terapêutica com base nos relatórios de acompanhamento.",
          "Avaliar a adequação das alternativas oferecidas pela operadora.",
        ],
        evidence: {
          risk: "Prescrição sem justificativa da carga horária é o ponto mais atacado pela operadora.",
          opportunity:
            "Série histórica de evolução terapêutica sustenta a manutenção da intensidade prescrita.",
          impact: "ALTO",
          rigor: 3,
          horizon: "Parecer em 5 a 8 dias úteis",
        },
      },
      {
        id: "guarda",
        label: "Guarda, convivência e alienação parental",
        blindSpot:
          "O estudo psicossocial frequentemente não explicita o método aplicado nem as fontes de cada conclusão, o que impede o contraditório técnico sobre o que foi efetivamente observado.",
        questioning: [
          "Verificar método, instrumentos e número de sessões que sustentam cada conclusão.",
          "Distinguir resistência espontânea da criança de interferência de um dos genitores.",
          "Avaliar a rotina de convivência praticada, e não apenas a declarada.",
        ],
        evidence: {
          risk: "Análise sem contato direto com a criança tem alcance limitado e precisa ser declarada como tal.",
          opportunity:
            "Estudo psicossocial sem metodologia explicitada é tecnicamente impugnável.",
          impact: "ALTO",
          rigor: 2,
          horizon: "Análise dos autos em 5 a 10 dias úteis",
        },
      },
    ],
  },
  {
    id: "engenharias",
    index: "03",
    label: "Engenharias",
    cases: [
      {
        id: "fissura",
        label: "Fissura e dano estrutural em obra",
        blindSpot:
          "Sem vistoria cautelar prévia, o laudo tende a atribuir as fissuras a retração ou acomodação natural, sem investigar o método executivo da obra vizinha nem a sondagem do solo da região.",
        questioning: [
          "Classificar a tipologia das fissuras e correlacioná-la ao mecanismo de dano.",
          "Confrontar a evolução temporal registrada com o cronograma da obra vizinha.",
          "Analisar método executivo de fundação e características geotécnicas do terreno.",
          "Quantificar o custo de recomposição com composição de preços auditável.",
        ],
        evidence: {
          risk: "Ausência de vistoria cautelar prévia transfere ao autor um ônus probatório maior.",
          opportunity:
            "Registro fotográfico datado com evolução no tempo supre parcialmente a cautelar e costuma ser subaproveitado.",
          impact: "CRÍTICO",
          rigor: 4,
          horizon: "Vistoria e parecer em 10 a 15 dias úteis",
        },
      },
      {
        id: "conformidade",
        label: "Vício construtivo e conformidade de obra",
        blindSpot:
          "A perícia verifica o que está aparente e deixa de confrontar o executado com o memorial descritivo e a planilha contratada, onde estão as supressões de escopo e a troca de especificação de materiais.",
        questioning: [
          "Confrontar projeto aprovado, memorial e planilha com o efetivamente executado.",
          "Classificar cada anomalia por origem, severidade e responsabilidade.",
          "Quantificar o custo de correção e o abatimento proporcional cabível.",
        ],
        evidence: {
          risk: "Obra já reparada dificulta a caracterização das anomalias originais.",
          opportunity:
            "Divergências entre memorial e execução são objetivas e de difícil contestação.",
          impact: "ESSENCIAL",
          rigor: 3,
          horizon: "Vistoria e parecer em 10 a 15 dias úteis",
        },
      },
      {
        id: "insalubridade",
        label: "Insalubridade e periculosidade",
        blindSpot:
          "O laudo conclui pela descaracterização com base na entrega de EPI, sem avaliar a eficácia real do equipamento para o agente em questão nem o tempo efetivo de exposição na jornada.",
        questioning: [
          "Reconstituir a exposição efetiva ao agente ao longo da jornada real.",
          "Avaliar a adequação e a eficácia do EPI fornecido para aquele agente específico.",
          "Confrontar o enquadramento adotado com a norma regulamentadora aplicável.",
        ],
        evidence: {
          risk: "Empresa desativada ou layout alterado limita a reconstituição das condições originais.",
          opportunity:
            "Ficha de EPI sem certificado de aprovação compatível costuma derrubar a descaracterização.",
          impact: "ALTO",
          rigor: 3,
          horizon: "Diligência e parecer em 10 dias úteis",
        },
      },
    ],
  },
  {
    id: "avaliacoes",
    index: "04",
    label: "Avaliações Imobiliárias",
    cases: [
      {
        id: "avaliacao-urbana",
        label: "Avaliação patrimonial urbana",
        blindSpot:
          "Avaliações apresentadas nos autos costumam trazer valor sem amostra rastreável, sem pesquisa de mercado documentada, sem tratamento estatístico e sem declarar grau de fundamentação e precisão.",
        questioning: [
          "Verificar método adotado e aderência à NBR 14.653.",
          "Auditar a amostra: origem, data, saneamento e homogeneização dos comparáveis.",
          "Conferir o grau de fundamentação e precisão declarado frente ao efetivamente alcançado.",
          "Checar a data-base do valor em relação ao pedido.",
        ],
        evidence: {
          risk: "Mercado com poucos comparáveis reduz o grau de precisão alcançável na região.",
          opportunity:
            "Laudo sem pesquisa rastreável é tecnicamente frágil e raramente resiste à impugnação.",
          impact: "CRÍTICO",
          rigor: 4,
          horizon: "Laudo em 8 a 15 dias úteis",
        },
      },
      {
        id: "partilha",
        label: "Partilha e disputa patrimonial",
        blindSpot:
          "Benfeitorias, reformas e restrições urbanísticas costumam ficar fora da conta, e a data-base do valor é fixada sem correspondência com o marco discutido no processo.",
        questioning: [
          "Levantar benfeitorias e reformas com comprovação documental.",
          "Identificar restrições urbanísticas que limitem o aproveitamento e o valor.",
          "Definir a data-base coerente com o marco jurídico da partilha.",
        ],
        evidence: {
          risk: "Acesso negado ao imóvel obriga avaliação por elementos externos, com precisão menor.",
          opportunity:
            "Reformas comprovadas e não computadas alteram o valor de forma relevante.",
          impact: "ESSENCIAL",
          rigor: 3,
          horizon: "Laudo em 8 a 15 dias úteis",
        },
      },
      {
        id: "rural",
        label: "Avaliação de imóvel rural",
        blindSpot:
          "Laudos tratam a propriedade como área homogênea: não separam terra nua de benfeitorias nem consideram aptidão agrícola, recursos hídricos, logística e restrições ambientais.",
        questioning: [
          "Separar valor da terra nua do valor das benfeitorias reprodutivas e não reprodutivas.",
          "Considerar aptidão do solo, disponibilidade hídrica e logística de escoamento.",
          "Verificar restrições ambientais e a situação do cadastro rural.",
        ],
        evidence: {
          risk: "Pesquisa de mercado regionalizada exige amostra específica e leva mais tempo.",
          opportunity:
            "Reserva legal e áreas de preservação mal consideradas distorcem o valor de forma significativa.",
          impact: "ESSENCIAL",
          rigor: 4,
          horizon: "Laudo em 12 a 20 dias úteis",
        },
      },
    ],
  },
];
