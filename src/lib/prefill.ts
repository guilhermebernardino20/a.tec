/**
 * Ponte entre os CTAs do site e o formulário de contato: quem dispara
 * manda o texto inicial e, quando existe, a origem do contato — área e
 * tipo de caso — para o lead chegar classificado no e-mail.
 */
export const PREFILL_EVENT = "atec:prefill";

export type PrefillDetail = {
  text: string;
  area?: string;
  caso?: string;
};

export function prefillContact(text: string, origem?: Omit<PrefillDetail, "text">) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<PrefillDetail>(PREFILL_EVENT, {
      detail: { text, ...origem },
    }),
  );
}
