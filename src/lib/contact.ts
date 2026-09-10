/**
 * Contrato do formulário de contato — usado pelo cliente para tipar o
 * envio e pela Route Handler para validar o que chega.
 */

export type ContactField =
  | "nome"
  | "sobrenome"
  | "email"
  | "telefone"
  | "mensagem";

export type ContactPayload = {
  nome: string;
  sobrenome: string;
  email: string;
  /** opcional: abre o retorno por WhatsApp direto do e-mail do lead */
  telefone?: string;
  mensagem: string;
  /** contexto de origem, quando o contato nasce da Matrix ou de uma especialidade */
  area?: string;
  caso?: string;
  /** honeypot: preenchido só por robô */
  empresa?: string;
};

export type ContactResponse = {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Mesmas regras dos dois lados: nada é aceito só porque o cliente disse que sim. */
export function validateContact(input: Partial<ContactPayload>) {
  const data: ContactPayload = {
    nome: String(input.nome ?? "").trim(),
    sobrenome: String(input.sobrenome ?? "").trim(),
    email: String(input.email ?? "").trim(),
    telefone: String(input.telefone ?? "").trim(),
    mensagem: String(input.mensagem ?? "").trim(),
    area: String(input.area ?? "").trim(),
    caso: String(input.caso ?? "").trim(),
    empresa: String(input.empresa ?? "").trim(),
  };

  const fieldErrors: Partial<Record<ContactField, string>> = {};
  if (data.nome.length < 2) fieldErrors.nome = "Informe seu nome.";
  if (data.sobrenome.length < 2) fieldErrors.sobrenome = "Informe seu sobrenome.";
  if (!EMAIL_RE.test(data.email)) fieldErrors.email = "Informe um e-mail válido.";
  if (data.mensagem.length < 10)
    fieldErrors.mensagem = "Descreva brevemente o caso (mín. 10 caracteres).";
  // telefone é opcional; se vier, precisa ter dígitos suficientes
  if (data.telefone && data.telefone.replace(/\D/g, "").length < 10)
    fieldErrors.telefone = "Informe um telefone com DDD.";

  return { data, fieldErrors, valid: Object.keys(fieldErrors).length === 0 };
}

export const CONTACT_SUCCESS =
  "Solicitação enviada com sucesso! Nossa equipe retornará em breve.";
