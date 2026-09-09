"use server";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"nome" | "sobrenome" | "email" | "mensagem", string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const sobrenome = String(formData.get("sobrenome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const mensagem = String(formData.get("mensagem") ?? "").trim();

  // honeypot anti-spam — campo invisível para pessoas
  if (String(formData.get("empresa") ?? "").length > 0) {
    return { status: "success", message: "Recebemos sua mensagem." };
  }

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (nome.length < 2) fieldErrors.nome = "Informe seu nome.";
  if (sobrenome.length < 2) fieldErrors.sobrenome = "Informe seu sobrenome.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Informe um e-mail válido.";
  if (mensagem.length < 10)
    fieldErrors.mensagem = "Descreva brevemente o caso (mín. 10 caracteres).";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Revise os campos destacados.",
      fieldErrors,
    };
  }

  // TODO(integração): encaminhar para o e-mail institucional
  // (Resend, SendGrid, SMTP ou CRM). Enquanto não houver provedor
  // configurado, a submissão é apenas registrada no servidor.
  console.info("[contato a.tec]", { nome, sobrenome, email, mensagem });

  return {
    status: "success",
    message:
      "Recebemos sua mensagem. Nossa equipe retornará com o melhor caminho técnico para o seu caso.",
  };
}
