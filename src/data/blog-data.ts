/**
 * Artigos do blog. Conteúdo redigido a partir da prática institucional da
 * a.tec, para revisão da equipe técnica antes de publicação.
 */

export type BlogCategory =
  | "Medicina Legal"
  | "Engenharia"
  | "Psicologia"
  | "Avaliações"
  | "Estratégia Processual";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** corpo em HTML semântico: p, h2, blockquote */
  content: string;
  category: BlogCategory;
  readTime: string;
  publishedAt: string;
  author: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "prontuario-erro-medico-linha-do-tempo",
    title: "O prontuário não mente: como reconstituir a linha do tempo em casos de erro médico",
    excerpt:
      "A descrição cirúrgica isolada raramente conta a história inteira. É no cruzamento com a evolução de enfermagem e a ficha anestésica que a intercorrência aparece.",
    category: "Medicina Legal",
    readTime: "6 min",
    publishedAt: "15 de Setembro, 2026",
    author: "Alan, Perito Chefe A.TEC",
    content: `
      <p>Em ações de responsabilidade civil na saúde, o laudo pericial costuma concluir pela ausência de erro apoiado apenas na descrição cirúrgica. É um ponto cego recorrente: a descrição cirúrgica é redigida depois do procedimento, com o desfecho já conhecido, enquanto a evolução de enfermagem e a ficha anestésica registram o que aconteceu em tempo real.</p>
      <h2>Onde a intercorrência realmente aparece</h2>
      <p>Reconstituir a linha do tempo minuto a minuto, a partir de todas as fontes do prontuário, é o primeiro passo de qualquer assistência técnica séria. Isso inclui exames de imagem e laboratoriais, prescrições, e a evolução da equipe de enfermagem, não apenas o relatório do cirurgião responsável.</p>
      <blockquote>Divergência entre a descrição cirúrgica e a evolução de enfermagem costuma ser decisiva e passa despercebida na perícia oficial.</blockquote>
      <p>O segundo passo é confrontar cada conduta registrada com o protocolo institucional e as diretrizes da especialidade vigentes à data do ato. Só assim é possível separar uma complicação previsível e informada de um desvio de técnica.</p>
      <h2>O nexo é o que sustenta a tese</h2>
      <p>Por fim, é preciso demonstrar o nexo entre o desvio apontado e a sequela documentada nos exames posteriores. Sem esse nexo, mesmo um desvio de conduta bem caracterizado não sustenta a indenização pretendida.</p>
    `,
  },
  {
    id: "2",
    slug: "vistoria-cautelar-fissuras-obra-vizinha",
    title: "Vistoria cautelar: a peça que decide os casos de fissura em obra vizinha",
    excerpt:
      "Sem vistoria cautelar prévia, o laudo tende a atribuir fissuras a retração natural. O registro fotográfico datado pode suprir parte dessa lacuna.",
    category: "Engenharia",
    readTime: "5 min",
    publishedAt: "10 de Setembro, 2026",
    author: "Equipe Técnica A.TEC",
    content: `
      <p>Quando uma obra vizinha avança e fissuras surgem no imóvel ao lado, a primeira pergunta técnica não é apenas de onde vêm as fissuras, mas se existe prova do estado do imóvel antes do início da obra.</p>
      <h2>O ônus que ninguém percebe a tempo</h2>
      <p>A ausência de vistoria cautelar prévia transfere ao autor um ônus probatório maior: sem um retrato técnico do imóvel antes da obra, cada fissura pode ser atribuída a retração ou acomodação natural.</p>
      <blockquote>Registro fotográfico datado, com evolução no tempo, supre parcialmente a cautelar e costuma ser subaproveitado.</blockquote>
      <p>A classificação da tipologia das fissuras, o confronto com o cronograma da obra vizinha e a análise do método executivo de fundação e das características geotécnicas do terreno formam o núcleo técnico do parecer. Por fim, o custo de recomposição precisa vir com composição de preços auditável, não uma estimativa genérica.</p>
    `,
  },
  {
    id: "3",
    slug: "metodologia-estudo-psicossocial-guarda",
    title: "Guarda e convivência: por que o método do estudo psicossocial importa tanto quanto a conclusão",
    excerpt:
      "Um estudo psicossocial sem método explicitado é tecnicamente impugnável, mesmo quando a conclusão parece razoável.",
    category: "Psicologia",
    readTime: "4 min",
    publishedAt: "5 de Setembro, 2026",
    author: "Equipe Técnica A.TEC",
    content: `
      <p>Em disputas de guarda, convivência e alienação parental, é comum que o estudo psicossocial não explicite o método aplicado nem as fontes de cada conclusão. Isso impede o contraditório técnico sobre o que foi efetivamente observado.</p>
      <h2>Verificar antes de contestar</h2>
      <p>Antes de qualquer impugnação, verificamos o método, os instrumentos e o número de sessões que sustentam cada conclusão do estudo. Em seguida, distinguimos resistência espontânea da criança de eventual interferência de um dos genitores.</p>
      <blockquote>Análise sem contato direto com a criança tem alcance limitado e precisa ser declarada como tal.</blockquote>
      <p>Também avaliamos a rotina de convivência praticada, e não apenas a declarada pelas partes. É esse conjunto, método mais evidência de campo, que permite construir quesitos que realmente movem o processo.</p>
    `,
  },
  {
    id: "4",
    slug: "nbr-14653-laudo-avaliacao-imovel",
    title: "NBR 14.653 na prática: o que torna um laudo de avaliação imobiliária difícil de contestar",
    excerpt:
      "Amostra rastreável, tratamento estatístico e grau de fundamentação declarado. É isso que separa um laudo sólido de um número sem lastro.",
    category: "Avaliações",
    readTime: "5 min",
    publishedAt: "1 de Setembro, 2026",
    author: "Equipe Técnica A.TEC",
    content: `
      <p>Laudos de avaliação apresentados em processos judiciais costumam trazer um valor final sem que se possa rastrear a amostra que o sustenta. É esse o primeiro ponto que auditamos.</p>
      <h2>O que uma amostra rastreável exige</h2>
      <p>Verificamos a origem, a data, o saneamento e a homogeneização dos comparáveis usados. Sem esse tratamento estatístico, o valor apresentado não resiste a uma impugnação bem fundamentada.</p>
      <blockquote>Laudo sem pesquisa rastreável é tecnicamente frágil e raramente resiste à impugnação.</blockquote>
      <p>Por fim, conferimos o grau de fundamentação e precisão declarado frente ao efetivamente alcançado, e a coerência da data-base do valor com o marco discutido no processo, seja uma partilha, uma indenização ou uma disputa patrimonial.</p>
    `,
  },
  {
    id: "5",
    slug: "quesitos-suplementares-quando-usar",
    title: "Quesitos suplementares: quando vale a pena voltar ao laudo já respondido",
    excerpt:
      "O laudo pericial respondido não é o fim da instrução técnica. Lacunas e contradições ainda podem ser exploradas com quesitos suplementares bem direcionados.",
    category: "Estratégia Processual",
    readTime: "4 min",
    publishedAt: "27 de Agosto, 2026",
    author: "Alan, Perito Chefe A.TEC",
    content: `
      <p>Depois que o perito judicial responde aos quesitos iniciais, muitos advogados encerram ali a participação técnica no processo. É um erro estratégico comum.</p>
      <h2>O que procurar no laudo já respondido</h2>
      <p>Lemos o laudo em busca de respostas evasivas, contradições internas e pontos que o perito reconheceu não ter avaliado. Cada um desses achados vira a base de um quesito suplementar.</p>
      <blockquote>Quesito suplementar bem direcionado custa pouco e pode reabrir um ponto que parecia encerrado.</blockquote>
      <p>O prazo processual para isso costuma ser curto, então a leitura crítica do laudo precisa começar assim que ele é juntado aos autos, não na véspera da audiência de instrução.</p>
    `,
  },
  {
    id: "6",
    slug: "insalubridade-epi-eficacia-real",
    title: "Insalubridade: por que a entrega de EPI não encerra a discussão",
    excerpt:
      "Ficha de entrega assinada não comprova eficácia do equipamento para o agente em questão, nem o tempo real de exposição na jornada.",
    category: "Engenharia",
    readTime: "5 min",
    publishedAt: "20 de Agosto, 2026",
    author: "Equipe Técnica A.TEC",
    content: `
      <p>Um argumento recorrente para descaracterizar a insalubridade é a simples entrega de Equipamento de Proteção Individual. Tecnicamente, isso não encerra a análise.</p>
      <h2>Dois pontos que costumam faltar</h2>
      <p>Primeiro, reconstituímos a exposição efetiva ao agente ao longo da jornada real de trabalho, não apenas a descrição genérica da função. Segundo, avaliamos a adequação e a eficácia do EPI fornecido especificamente para aquele agente.</p>
      <blockquote>Ficha de EPI sem certificado de aprovação compatível costuma derrubar a descaracterização.</blockquote>
      <p>Por fim, confrontamos o enquadramento adotado pela empresa com a norma regulamentadora aplicável. Quando esses três pontos não se sustentam juntos, a descaracterização cai.</p>
    `,
  },
];

export function getFeaturedPost(): BlogPost {
  return BLOG_POSTS[0];
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
