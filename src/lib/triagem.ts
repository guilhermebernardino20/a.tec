/**
 * Triagem de entrada: perfil (PF ou PJ), área, situação do processo e
 * relato. O resultado é a síntese que segue pronta para o WhatsApp.
 */
import { PRACTICES } from "@/lib/content";
import { SPECIALTY_DETAILS } from "@/lib/specialties";

export const TRIAGE_EVENT = "atec:triagem";

export type Profile = "pf" | "pj";

export const PROFILE_LABEL: Record<Profile, string> = {
  pf: "Pessoa Física",
  pj: "Empresa / PJ",
};

/** Abre a triagem de qualquer ponto do site. */
export type TriageOpen = { profile: Profile; areaId?: string };

export function openTriage(profile: Profile, areaId?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<TriageOpen>(TRIAGE_EVENT, { detail: { profile, areaId } }),
  );
}

export const UNKNOWN_SPECIALTY = "Ainda não sei";

export const TRIAGE_AREAS = PRACTICES.map((p) => ({
  id: p.id,
  label: p.name,
  specialties: [...p.specialties.map((s) => s.title), UNKNOWN_SPECIALTY],
}));

export type Stage = "antes" | "andamento" | "pericia";

export const STAGES: { id: Stage; label: string }[] = [
  { id: "antes", label: "Ainda não há processo" },
  { id: "andamento", label: "Processo em andamento" },
  { id: "pericia", label: "Perícia marcada ou já realizada" },
];

type Range = readonly [number, number];

/**
 * VALORES DE REFERÊNCIA PROVISÓRIOS: precisam ser validados pela a.tec
 * antes da publicação. Faixa por área para as duas frentes de serviço.
 */
const PRICE: Record<string, { parecer: Range; assistencia: Range }> = {
  medicina: { parecer: [2500, 5000], assistencia: [5000, 12000] },
  psicologia: { parecer: [2000, 4500], assistencia: [4500, 10000] },
  engenharias: { parecer: [3000, 6000], assistencia: [6000, 15000] },
  avaliacoes: { parecer: [2500, 5000], assistencia: [5000, 12000] },
};

const SERVICE: Record<
  Stage,
  { kind: "parecer" | "assistencia"; label: string }
> = {
  antes: { kind: "parecer", label: "Estudo de viabilidade e parecer técnico" },
  andamento: {
    kind: "parecer",
    label: "Formulação de quesitos e parecer técnico",
  },
  pericia: {
    kind: "assistencia",
    label: "Assistência técnica na perícia e impugnação do laudo",
  },
};

const brl = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

export type TriageAnswers = {
  profile: Profile;
  areaId: string;
  specialty: string;
  stage: Stage;
  nome: string;
  relato: string;
};

export function estimate(areaId: string, stage: Stage) {
  const service = SERVICE[stage];
  const range = PRICE[areaId]?.[service.kind];
  return {
    service: service.label,
    range: range ? `${brl(range[0])} a ${brl(range[1])}` : null,
  };
}

export function nextSteps(
  answers: Pick<TriageAnswers, "profile" | "specialty">,
) {
  const docs = SPECIALTY_DETAILS[answers.specialty]?.documents.slice(0, 4) ?? [
    "Petição inicial ou notificação recebida, se houver",
    "Laudos, relatórios e exames já produzidos",
    "Documentos pessoais ou societários das partes",
  ];

  const steps =
    answers.profile === "pj"
      ? [
          "Envie a síntese pelo WhatsApp: o Alan recebe o caso já organizado.",
          "Informe quantos processos ou unidades estão envolvidos, para dimensionarmos a equipe técnica.",
          "Retornamos com proposta sob medida, inclusive para atendimento recorrente da carteira.",
        ]
      : [
          "Envie a síntese pelo WhatsApp: o Alan recebe o caso já organizado.",
          "Separe os documentos abaixo; a equipe indica o que faltar depois da primeira leitura.",
          "Retornamos com a análise inicial e a proposta em até 1 dia útil.",
        ];

  return { steps, docs };
}

export function triageMessage(answers: TriageAnswers) {
  const area = TRIAGE_AREAS.find((a) => a.id === answers.areaId);
  const stage = STAGES.find((s) => s.id === answers.stage);
  const { service, range } = estimate(answers.areaId, answers.stage);

  return [
    "Olá, Alan! Fiz a triagem no site da A.TEC e gostaria de uma análise.",
    "",
    `• Perfil: ${PROFILE_LABEL[answers.profile]}`,
    answers.nome.trim() ? `• Nome: ${answers.nome.trim()}` : null,
    `• Área: ${area?.label ?? answers.areaId}`,
    `• Tipo de perícia: ${answers.specialty}`,
    `• Situação: ${stage?.label ?? answers.stage}`,
    "",
    "Relato:",
    answers.relato.trim(),
    "",
    `Serviço indicado na triagem: ${service}${range ? ` (referência ${range})` : ""}.`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export const RELATO_MIN = 20;
export const RELATO_MAX = 800;
