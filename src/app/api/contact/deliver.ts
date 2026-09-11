import { Resend } from "resend";
import type { ContactPayload } from "@/lib/contact";

/**
 * Entrega do lead por e-mail.
 *
 * Sem `RESEND_API_KEY` — desenvolvimento, preview, CI — cai no log e
 * devolve sucesso, para o formulário continuar testável sem credencial.
 */

const DESTINATION =
  process.env.CONTACT_DESTINATION_EMAIL ?? "contato@chomabettegaadvocacia.com.br";

const FROM = process.env.CONTACT_FROM_EMAIL ?? "A.TEC Site <onboarding@resend.dev>";

/**
 * O conteúdo vem de um formulário público e é interpolado em HTML: sem
 * escapar, qualquer visitante consegue injetar marcação no e-mail que a
 * equipe abre (link falso, conteúdo forjado).
 */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string) {
  return `<tr>
      <td style="padding: 8px 0; color: #888; width: 120px;"><strong>${label}:</strong></td>
      <td style="padding: 8px 0; color: #FFF;">${value}</td>
    </tr>`;
}

/** Exportado para teste: monta o corpo do e-mail já escapado. */
export function template(data: ContactPayload) {
  const nome = escapeHtml(`${data.nome} ${data.sobrenome}`.trim());
  const email = escapeHtml(data.email);
  const telefone = data.telefone ? escapeHtml(data.telefone) : "";
  const digits = data.telefone?.replace(/\D/g, "") ?? "";
  const area = data.area ? escapeHtml(data.area) : "";
  const caso = data.caso ? escapeHtml(data.caso) : "";
  const mensagem = escapeHtml(data.mensagem);

  return `
    <div style="font-family: sans-serif; background-color: #0A0A0A; color: #E5E5E5; padding: 32px; border-radius: 8px;">
      <h2 style="color: #7F9970; border-bottom: 1px solid #333; padding-bottom: 12px; margin-top: 0;">
        Nova Solicitação de Análise Técnica
      </h2>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        ${row("Nome", nome)}
        <tr>
          <td style="padding: 8px 0; color: #888;"><strong>E-mail:</strong></td>
          <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #7F9970;">${email}</a></td>
        </tr>
        ${
          telefone
            ? `<tr>
          <td style="padding: 8px 0; color: #888;"><strong>Telefone:</strong></td>
          <td style="padding: 8px 0;"><a href="https://wa.me/55${digits}" style="color: #7F9970;">${telefone}</a></td>
        </tr>`
            : ""
        }
        ${area ? row("Área", area) : ""}
        ${caso ? row("Litígio/Caso", caso) : ""}
      </table>

      <div style="background-color: #141414; padding: 16px; border-left: 3px solid #7F9970; border-radius: 4px;">
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Mensagem:</p>
        <p style="margin: 0; white-space: pre-wrap; color: #DDD;">${mensagem}</p>
      </div>

      <p style="font-size: 11px; color: #555; margin-top: 32px; text-align: center;">
        Enviado via formulário do site A.TEC Assistência Técnica.
      </p>
    </div>
  `;
}

export type Attachment = { filename: string; content: Buffer };

/**
 * `sent` — e-mail entregue ao Resend
 * `simulated` — desenvolvimento local sem chave: registrado no terminal
 * `unconfigured` — produção sem chave: nada foi enviado
 * `failed` — o Resend recusou ou a rede caiu
 */
export type DeliveryResult = "sent" | "simulated" | "unconfigured" | "failed";

export async function deliver(
  data: ContactPayload,
  attachments: Attachment[] = [],
): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[LOCAL DEV - SIMULAÇÃO DE ENVIO DE E-MAIL]", {
        name: `${data.nome} ${data.sobrenome}`.trim(),
        email: data.email,
        phone: data.telefone || null,
        message: data.mensagem,
        area: data.area || null,
        caso: data.caso || null,
        files: attachments.map((a) => ({
          fileName: a.filename,
          fileSize: a.content.byteLength,
        })),
      });
      return "simulated";
    }

    // em produção, fingir sucesso sem chave faria o lead sumir em silêncio
    console.error(
      "[contato a.tec] RESEND_API_KEY ausente em produção — solicitação NÃO enviada",
      { email: data.email, files: attachments.map((a) => a.filename) },
    );
    return "unconfigured";
  }

  try {
    const resend = new Resend(apiKey);
    const assunto = `[Novo Lead A.TEC] ${data.area ? `${data.area} — ` : ""}${data.nome} ${data.sobrenome}`.trim();

    const { error } = await resend.emails.send({
      from: FROM,
      to: DESTINATION,
      // responder no cliente de e-mail cai direto no lead
      replyTo: data.email,
      subject: assunto,
      html: template(data),
      attachments: attachments.length
        ? attachments.map((a) => ({ filename: a.filename, content: a.content }))
        : undefined,
    });

    if (error) {
      console.error("[contato a.tec · Resend]", error);
      return "failed";
    }

    return "sent";
  } catch (error) {
    console.error("[contato a.tec · Resend]", error);
    return "failed";
  }
}
