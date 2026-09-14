/**
 * Links de WhatsApp com mensagem já escrita, conforme o ponto do site em
 * que o contato começou — a equipe recebe a conversa com contexto.
 */

/** Número institucional, no formato exigido pelo wa.me (só dígitos). */
export const WHATSAPP_NUMBER = "5541985305580";

/**
 * Contato direto do Alan, destino da triagem PF/PJ. Enquanto o número
 * dele não for informado, a conversa cai no institucional.
 */
export const WHATSAPP_ALAN_NUMBER = WHATSAPP_NUMBER;

const build = (message: string, number = WHATSAPP_NUMBER) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

/** Síntese montada pela triagem de entrada. */
export function getTriageWhatsAppUrl(message: string) {
  return build(message, WHATSAPP_ALAN_NUMBER);
}

/** Contato genérico — cabeçalho, rodapé e CTAs institucionais. */
export function getGeneralWhatsAppUrl() {
  return build(
    "Olá! Gostaria de entender como a A.TEC pode auxiliar em nossos processos judiciais.",
  );
}

/** Contato a partir de um resultado da A.TEC Matrix. */
export function getMatrixWhatsAppUrl(area: string, caseType: string) {
  return build(
    `Olá! Utilizei a A.TEC Matrix no site e preciso de suporte em um caso de ${area} (${caseType}).`,
  );
}

/** Contato a partir do painel de uma especialidade. */
export function getSpecialtyWhatsAppUrl(specialtyName: string) {
  return build(
    `Olá! Gostaria de solicitar suporte da A.TEC para uma demanda de ${specialtyName}.`,
  );
}
