/**
 * Ponte entre os CTAs do site e o formulário de contato: quem dispara
 * manda um texto inicial, o formulário escuta e preenche a mensagem.
 */
export const PREFILL_EVENT = "atec:prefill";

export function prefillContact(text: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: { text } }));
}
