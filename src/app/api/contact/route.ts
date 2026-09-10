import { NextResponse } from "next/server";
import { deliver } from "./deliver";
import {
  CONTACT_SUCCESS,
  validateContact,
  type ContactPayload,
  type ContactResponse,
} from "@/lib/contact";

/**
 * Recebe o formulário de contato: valida no servidor, descarta robô pelo
 * honeypot e entrega o lead por e-mail (`./deliver`).
 */

const json = (body: ContactResponse, status = 200) =>
  NextResponse.json(body, { status });

export async function POST(request: Request) {
  let body: Partial<ContactPayload>;

  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Requisição inválida." }, 400);
  }

  const { data, fieldErrors, valid } = validateContact(body);

  // honeypot: responde como sucesso e não entrega nada
  if (data.empresa) {
    return json({ ok: true, message: CONTACT_SUCCESS });
  }

  if (!valid) {
    return json(
      { ok: false, message: "Revise os campos destacados.", fieldErrors },
      400,
    );
  }

  const entregue = await deliver(data);

  if (!entregue) {
    return json(
      {
        ok: false,
        message:
          "Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.",
      },
      502,
    );
  }

  return json({ ok: true, message: CONTACT_SUCCESS });
}
