"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query como fonte externa: sem estado espelhado em efeito, sem
 * flash de valor errado na hidratação (no servidor devolve `false`).
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (notify: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
