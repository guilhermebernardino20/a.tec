/**
 * Detalhamento metodológico das especialidades, exibido no painel lateral.
 *
 * Redigido a partir da documentação institucional da a.tec e da prática
 * corrente em assistência técnica pericial. As listas de documentos são
 * um ponto de partida para o advogado — devem ser validadas pela equipe
 * técnica antes de irem ao ar.
 */

export type SpecialtyDetail = {
  /** Como a a.tec conduz tecnicamente esse tipo de caso. */
  method: string;
  /** O que o advogado deve reunir antes da análise. */
  documents: string[];
};

export const SPECIALTY_DETAILS: Record<string, SpecialtyDetail> = {
  // ---------- Medicina ----------
  "Suposto Erro Médico": {
    method:
      "Reconstituímos a linha do tempo do atendimento a partir do prontuário e confrontamos cada conduta com os protocolos e diretrizes vigentes à época do fato. O objetivo é separar intercorrência previsível de desvio de conduta, identificando onde houve negligência, imprudência ou imperícia — e demonstrando o nexo entre a conduta e o dano alegado.",
    documents: [
      "Prontuário médico completo, incluindo evolução de enfermagem",
      "Descrição cirúrgica e ficha anestésica, quando houver procedimento",
      "Exames de imagem e laboratoriais, com laudos e mídias originais",
      "Termo de consentimento informado assinado",
      "Receituários, prescrições e relatórios de alta",
      "Relatórios médicos posteriores que documentem a sequela",
    ],
  },
  "Interdição Judicial": {
    method:
      "Avaliamos a capacidade civil sob o recorte funcional exigido pelo Estatuto da Pessoa com Deficiência: não basta o diagnóstico, é preciso demonstrar o impacto concreto sobre os atos da vida civil e patrimonial. Apontamos o grau de comprometimento, a extensão adequada da curatela e os pontos que o laudo oficial precisa endereçar.",
    documents: [
      "Relatórios médicos e neuropsicológicos atualizados",
      "Histórico de internações e tratamentos em curso",
      "Prescrição medicamentosa vigente",
      "Documentos que demonstrem atos patrimoniais de risco",
      "Relato familiar sobre autonomia nas atividades diárias",
    ],
  },
  Invalidez: {
    method:
      "Analisamos a compatibilidade entre a limitação funcional documentada e as exigências reais da atividade laboral, além da data de início da incapacidade. Verificamos se a conclusão administrativa do INSS, da seguradora ou do empregador se sustenta tecnicamente e preparamos o contraponto para a perícia judicial.",
    documents: [
      "Laudos e exames que documentem a patologia e sua evolução",
      "Comunicação de acidente de trabalho (CAT), se houver",
      "Indeferimento administrativo e cópia do laudo do perito do INSS",
      "CNIS, carteira de trabalho e descrição detalhada da função exercida",
      "Apólice e cláusulas contratuais, nos casos securitários",
    ],
  },

  // ---------- Psicologia ----------
  "TEA e Acompanhamento Escolar": {
    method:
      "Avaliamos o perfil de desenvolvimento, a autonomia e as demandas de suporte da criança no ambiente escolar, correlacionando-os ao nível de apoio indicado. A análise fundamenta tecnicamente a necessidade — ou a insuficiência — do acompanhamento por profissional especializado, com linguagem que o Judiciário consegue aplicar.",
    documents: [
      "Laudo diagnóstico com CID e nível de suporte",
      "Relatórios da escola e do professor de referência",
      "Relatórios de terapias em curso (fono, TO, psicologia)",
      "Plano educacional individualizado, se existir",
      "Negativa formal da instituição de ensino ou do plano de saúde",
    ],
  },
  "TEA e Tratamento ABA": {
    method:
      "Examinamos a indicação clínica do tratamento baseado em ABA à luz do quadro individual: intensidade de horas proposta, objetivos terapêuticos e evidências de resposta. Apontamos a coerência entre a prescrição e as necessidades documentadas, elemento central quando a operadora contesta a carga horária.",
    documents: [
      "Prescrição médica com a carga horária indicada e justificativa",
      "Laudo diagnóstico e avaliações de desenvolvimento",
      "Relatórios de evolução terapêutica",
      "Negativa da operadora de saúde, por escrito",
      "Orçamentos e comprovantes de custeio do tratamento",
    ],
  },
  "Guarda e Convivência": {
    method:
      "Analisamos vínculos, rotina e necessidades da criança a partir dos elementos já produzidos nos autos, indicando o que o estudo psicológico oficial precisa investigar. Trabalhamos sobre dinâmicas observáveis — não sobre juízos morais a respeito dos genitores.",
    documents: [
      "Estudo psicossocial já produzido nos autos",
      "Relatórios escolares e de acompanhamento terapêutico",
      "Registro da rotina de convivência praticada",
      "Comunicações entre os genitores relevantes ao caso",
      "Boletins de ocorrência ou medidas protetivas, se houver",
    ],
  },
  "Alienação Parental": {
    method:
      "Avaliamos a dinâmica familiar buscando indicadores objetivos de interferência na convivência, distinguindo-os de resistência espontânea da criança ou de reação legítima a um contexto de risco. O parecer indica quais elementos sustentam — ou afastam — a alegação.",
    documents: [
      "Histórico documentado das tentativas de convivência",
      "Estudo psicossocial e relatórios terapêuticos",
      "Registros escolares e de saúde da criança",
      "Comunicações e mensagens entre as partes",
      "Decisões judiciais anteriores sobre guarda e visitação",
    ],
  },

  // ---------- Engenharias ----------
  "Qualidade e Conformidade de Obras": {
    method:
      "Confrontamos o executado com o contratado: projeto, memorial descritivo, normas técnicas aplicáveis e boas práticas construtivas. Levantamos as manifestações patológicas em vistoria, classificamos origem e severidade e quantificamos o custo de recomposição.",
    documents: [
      "Contrato, memorial descritivo e planilha orçamentária",
      "Projetos aprovados e as versões efetivamente executadas",
      "Diário de obra, medições e notas fiscais de materiais",
      "Registro fotográfico datado das anomalias",
      "Notificações e correspondências trocadas com a construtora",
    ],
  },
  "Impactos entre Obras": {
    method:
      "Investigamos o nexo entre a obra vizinha e os danos alegados, considerando o tipo de fundação, o método executivo, a distância e as características do solo. A vistoria cautelar prévia, quando existe, é a peça decisiva — e a sua ausência também é um dado técnico relevante.",
    documents: [
      "Vistoria cautelar de vizinhança, anterior ao início da obra",
      "Registro fotográfico das trincas com evolução no tempo",
      "Projeto e método executivo da obra vizinha, se acessíveis",
      "Sondagem do solo da região",
      "Reclamações formais e protocolos junto à prefeitura",
    ],
  },
  "Medição e Uso de Terrenos": {
    method:
      "Executamos o levantamento planialtimétrico e confrontamos a área medida com a matrícula, o memorial e a ocupação real. Identificamos sobreposições, invasões e divergências de confrontação, e avaliamos o aproveitamento permitido pela legislação urbanística local.",
    documents: [
      "Matrícula atualizada do imóvel e dos confrontantes",
      "Memorial descritivo e planta de parcelamento",
      "Levantamentos topográficos anteriores",
      "Escrituras, contratos e cadeia dominial",
      "Legislação de uso e ocupação do solo aplicável",
    ],
  },
  "Impacto Ambiental": {
    method:
      "Caracterizamos a área e os efeitos ambientais atribuídos à intervenção, verificando a conformidade com o licenciamento e as condicionantes impostas. Delimitamos a extensão do dano e as medidas de recuperação tecnicamente cabíveis.",
    documents: [
      "Licenças ambientais e respectivas condicionantes",
      "Estudos ambientais já produzidos (EIA/RIMA, PRAD)",
      "Autos de infração e notificações dos órgãos ambientais",
      "Imagens de satélite ou aerofotogrametria da área",
      "Documentação fundiária e cadastro ambiental rural",
    ],
  },
  "Insalubridade e Periculosidade": {
    method:
      "Reconstituímos as condições reais do ambiente de trabalho e a exposição efetiva do trabalhador aos agentes alegados, com o enquadramento nas normas regulamentadoras aplicáveis. Avaliamos a eficácia dos EPIs fornecidos — ponto em que a maioria dos laudos oficiais é atacável.",
    documents: [
      "PPRA/PGR, PCMSO, LTCAT e PPP da empresa",
      "Fichas de entrega e certificados de aprovação dos EPIs",
      "Descrição detalhada das atividades e da jornada",
      "Laudos ambientais anteriores e medições existentes",
      "Contracheques com eventuais adicionais já pagos",
    ],
  },

  // ---------- Avaliações Imobiliárias ----------
  "Avaliação de Imóvel": {
    method:
      "Aplicamos os métodos previstos na NBR 14.653, com pesquisa de mercado documentada e tratamento estatístico da amostra. O laudo explicita grau de fundamentação e precisão, o que torna o valor sustentável em contraditório — e permite atacar avaliações sem amostra rastreável.",
    documents: [
      "Matrícula atualizada e IPTU do imóvel",
      "Projeto ou planta com áreas construídas e privativas",
      "Documentação de benfeitorias e reformas realizadas",
      "Avaliações anteriores apresentadas nos autos",
      "Registro fotográfico interno e externo",
    ],
  },
  "Imóveis Urbanos": {
    method:
      "Avaliamos localização, padrão construtivo, estado de conservação e vocação de uso, com pesquisa de ofertas e transações comparáveis na mesma região. Consideramos restrições urbanísticas que afetem o aproveitamento e, por consequência, o valor.",
    documents: [
      "Matrícula, IPTU e certidão de valor venal",
      "Planta baixa e habite-se",
      "Convenção de condomínio e regimento, quando aplicável",
      "Comprovantes de reformas e melhorias",
      "Restrições urbanísticas incidentes sobre o lote",
    ],
  },
  "Imóveis Rurais": {
    method:
      "Consideramos aptidão agrícola, benfeitorias reprodutivas e não reprodutivas, recursos hídricos, logística de escoamento e restrições ambientais. A pesquisa de mercado é regionalizada, e o laudo separa o valor da terra nua do das benfeitorias.",
    documents: [
      "Matrícula, CCIR e ITR do imóvel",
      "Cadastro Ambiental Rural e georreferenciamento",
      "Levantamento de benfeitorias e culturas implantadas",
      "Contratos de arrendamento ou parceria vigentes",
      "Estudos de aptidão do solo, se existirem",
    ],
  },
};
