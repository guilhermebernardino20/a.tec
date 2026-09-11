/**
 * Contrato do formulário de contato — usado pelo cliente para tipar o
 * envio e pela Route Handler para validar o que chega.
 */

export type ContactField =
  | "nome"
  | "sobrenome"
  | "email"
  | "telefone"
  | "mensagem"
  | "anexo";

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

// ---------------------------------------------------------------------
// Anexo (petições, laudos, documentos)
// ---------------------------------------------------------------------

export const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
export const ATTACHMENT_MAX_FILES = 5;
/** teto do conjunto: com a codificação base64, ~33 MB — abaixo dos 40 MB do Resend */
export const ATTACHMENT_MAX_TOTAL_BYTES = 25 * 1024 * 1024;
export const ATTACHMENT_ACCEPT = ".pdf,.doc,.docx";
const ATTACHMENT_EXTENSIONS = ["pdf", "doc", "docx"] as const;
type AttachmentExtension = (typeof ATTACHMENT_EXTENSIONS)[number];

export function attachmentExtension(name: string): AttachmentExtension | null {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return (ATTACHMENT_EXTENSIONS as readonly string[]).includes(ext)
    ? (ext as AttachmentExtension)
    : null;
}

/**
 * Checagem que roda dos dois lados (nome e tamanho). No servidor ela é
 * complementada pela assinatura binária do arquivo — extensão se troca
 * renomeando, os primeiros bytes não.
 */
export function checkAttachment(file: { name: string; size: number }): string | null {
  if (!attachmentExtension(file.name)) {
    return "Envie um arquivo PDF ou Word (.pdf, .doc, .docx).";
  }
  if (file.size > ATTACHMENT_MAX_BYTES) {
    return "O anexo precisa ter até 10 MB.";
  }
  if (file.size === 0) {
    return "O arquivo selecionado está vazio.";
  }
  return null;
}

/** Regras do conjunto: quantidade, cada arquivo e o total somado. */
export function checkAttachments(files: { name: string; size: number }[]): string | null {
  if (files.length > ATTACHMENT_MAX_FILES) {
    return `Envie no máximo ${ATTACHMENT_MAX_FILES} arquivos.`;
  }
  for (const file of files) {
    const problem = checkAttachment(file);
    if (problem) return `${file.name}: ${problem}`;
  }
  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total > ATTACHMENT_MAX_TOTAL_BYTES) {
    return "Os anexos somados precisam ter até 25 MB.";
  }
  return null;
}

/** Assinaturas (magic bytes) de cada formato aceito. */
const SIGNATURES: Record<AttachmentExtension, number[]> = {
  pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
  docx: [0x50, 0x4b, 0x03, 0x04], // contêiner ZIP do Office Open XML
  doc: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1], // OLE2 do Word 97-2003
};

export function matchesSignature(ext: AttachmentExtension, bytes: Uint8Array) {
  const signature = SIGNATURES[ext];
  return signature.every((byte, i) => bytes[i] === byte);
}

/** Nome seguro para o anexo: sem caminho, sem caractere de controle. */
export function safeFileName(name: string) {
  const base = name.split(/[\\/]/).pop() ?? "anexo";
  return base.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 120) || "anexo";
}

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString("pt-BR")} KB`;
  }
  return `${(bytes / (1024 * 1024)).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })} MB`;
}
