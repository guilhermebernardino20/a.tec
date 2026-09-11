import { NextResponse } from "next/server";
import { deliver, type Attachment } from "./deliver";
import {
  CONTACT_SUCCESS,
  attachmentExtension,
  checkAttachments,
  matchesSignature,
  safeFileName,
  validateContact,
  type ContactResponse,
} from "@/lib/contact";

/**
 * Recebe o formulário de contato em `multipart/form-data`: valida os
 * campos e o anexo no servidor, descarta robô pelo honeypot e entrega o
 * lead por e-mail (`./deliver`).
 */

const json = (body: ContactResponse, status = 200) =>
  NextResponse.json(body, { status });

/** `formData.get` pode devolver `File`; aqui só texto interessa. */
const text = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
};

export async function POST(request: Request) {
  let form: FormData;

  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, message: "Requisição inválida." }, 400);
  }

  const { data, fieldErrors, valid } = validateContact({
    nome: text(form, "nome"),
    sobrenome: text(form, "sobrenome"),
    email: text(form, "email"),
    telefone: text(form, "telefone"),
    mensagem: text(form, "mensagem"),
    area: text(form, "area"),
    caso: text(form, "caso"),
    empresa: text(form, "empresa"),
  });

  // honeypot: responde como sucesso e não entrega nada
  if (data.empresa) {
    return json({ ok: true, message: CONTACT_SUCCESS });
  }

  // ---- anexos (opcionais, vários) ------------------------------------
  const attachments: Attachment[] = [];
  const files = form
    .getAll("anexo")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const problem = checkAttachments(files);
  if (problem) {
    fieldErrors.anexo = problem;
  } else {
    for (const file of files) {
      const content = Buffer.from(await file.arrayBuffer());
      const ext = attachmentExtension(file.name)!;
      // a extensão se troca renomeando; a assinatura binária, não
      if (!matchesSignature(ext, content.subarray(0, 8))) {
        fieldErrors.anexo = `${file.name}: o conteúdo não corresponde a um PDF ou Word válido.`;
        break;
      }
      attachments.push({ filename: safeFileName(file.name), content });
    }
  }

  if (!valid || fieldErrors.anexo) {
    return json(
      { ok: false, message: "Revise os campos destacados.", fieldErrors },
      400,
    );
  }

  const result = await deliver(data, attachments);

  switch (result) {
    case "sent":
      return json({ ok: true, message: CONTACT_SUCCESS });
    case "simulated":
      return json({ ok: true, message: "Simulado com sucesso no ambiente local." });
    case "unconfigured":
      return json(
        {
          ok: false,
          message:
            "O envio por formulário está temporariamente indisponível. Fale conosco pelo WhatsApp.",
        },
        503,
      );
    default:
      return json(
        {
          ok: false,
          message:
            "Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.",
        },
        502,
      );
  }
}
