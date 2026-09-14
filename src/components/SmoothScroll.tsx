"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { SCROLL_LOCK_EVENT } from "@/lib/scroll-lock";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll macio + sincronização com o ScrollTrigger.
 * Parâmetros iguais aos da referência: lerp 0.1, duração 1.2 e
 * easing exponencial; o rAF do Lenis passa a ser o ticker do GSAP.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // A instância do Lenis só existe depois que o ReactLenis monta, então
    // ela é resolvida na hora do uso — capturá-la aqui deixaria o handler
    // com `undefined` e as âncoras cancelariam o clique sem rolar nada.
    const getLenis = () => lenisRef.current?.lenis;

    let subscribed: ReturnType<typeof getLenis>;
    const subscribe = () => {
      const lenis = getLenis();
      if (!lenis) return;
      lenis.on("scroll", ScrollTrigger.update);
      subscribed = lenis;
    };
    subscribe();
    const subscribeFrame = requestAnimationFrame(() => {
      if (!subscribed) subscribe();
    });

    // âncoras internas percorrem o caminho com o mesmo easing do scroll
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank") return;

      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      let target: Element | null = null;
      try {
        target = document.querySelector(id);
      } catch {
        return; // href que não é um seletor válido
      }
      if (!target) return;

      event.preventDefault();
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, { duration: 1.4, offset: 0 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // camadas sobrepostas pedem a pausa do scroll virtual; o contador
    // segura o caso de duas se abrirem uma sobre a outra
    let locks = 0;
    const onLock = (event: Event) => {
      const locked = (event as CustomEvent<{ locked: boolean }>).detail?.locked;
      locks = Math.max(0, locks + (locked ? 1 : -1));
      const lenis = getLenis();
      if (!lenis) return;
      if (locks > 0) lenis.stop();
      else lenis.start();
    };

    document.addEventListener("click", onClick);
    window.addEventListener(SCROLL_LOCK_EVENT, onLock);

    return () => {
      cancelAnimationFrame(subscribeFrame);
      gsap.ticker.remove(update);
      subscribed?.off("scroll", ScrollTrigger.update);
      document.removeEventListener("click", onClick);
      window.removeEventListener(SCROLL_LOCK_EVENT, onLock);
      getLenis()?.start();
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        duration: 1.2,
        lerp: 0.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        autoRaf: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
