/**
 * Trava de rolagem para camadas sobrepostas (drawer, menu).
 *
 * `document.documentElement.style.overflow` sozinho não resolve: quem
 * rola a página é o Lenis, com scroll virtual sobre o evento de roda —
 * ele continua andando mesmo com o documento travado. Aqui o pedido
 * chega ao SmoothScroll, que pausa a instância de verdade.
 */
export const SCROLL_LOCK_EVENT = "atec:scroll-lock";

export function setScrollLock(locked: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(SCROLL_LOCK_EVENT, { detail: { locked } }),
  );
}
