"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WORD_CLASS = "tr-word";
const OVERLAY_CLASS = "tr-overlay";

/**
 * Revelação palavra a palavra: cada palavra nasce coberta por um bloco
 * da própria cor do texto, que encolhe de cima para baixo ao entrar na
 * viewport (scaleY 1 → 0, origem embaixo, expo.out, stagger).
 *
 * Marque qualquer elemento com `data-text-reveal`; ajustes finos por
 * `data-tr-stagger`, `data-tr-duration` e `data-tr-delay`.
 */
export default function TextRevealRoot() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const triggers: ScrollTrigger[] = [];

    const splitWords = (root: HTMLElement) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const texts: Text[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.trim()) texts.push(node as Text);
      }

      for (const text of texts) {
        const frag = document.createDocumentFragment();
        const parts = text.nodeValue!.split(/(\s+)/);
        for (const part of parts) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            continue;
          }
          const word = document.createElement("span");
          word.className = WORD_CLASS;
          word.style.cssText = "position:relative;display:inline-block;";
          word.textContent = part;

          const overlay = document.createElement("span");
          overlay.className = OVERLAY_CLASS;
          overlay.style.cssText =
            "position:absolute;left:0;right:0;top:-0.06em;bottom:-0.04em;background-color:currentColor;transform-origin:bottom;transform:scaleY(1);pointer-events:none;z-index:1;";
          word.appendChild(overlay);
          frag.appendChild(word);
        }
        text.replaceWith(frag);
      }

      return Array.from(
        root.querySelectorAll<HTMLElement>(`.${OVERLAY_CLASS}`),
      );
    };

    const setup = () => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-text-reveal]"),
      );

      for (const el of elements) {
        if (el.dataset.trProcessed === "true") continue;
        el.dataset.trProcessed = "true";

        const overlays = splitWords(el);
        if (overlays.length === 0) continue;

        gsap.set(overlays, { scaleY: 1 });

        const stagger = Number(el.dataset.trStagger ?? 0.1);
        const duration = Number(el.dataset.trDuration ?? 0.8);
        const delay = Number(el.dataset.trDelay ?? 0);

        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 80%",
            once: true,
            onEnter: () => {
              gsap.to(overlays, {
                scaleY: 0,
                duration,
                delay,
                ease: "expo.out",
                stagger,
                onComplete: () => {
                  overlays.forEach((o) => o.remove());
                },
              });
            },
          }),
        );
      }
    };

    let raf = 0;
    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => {
      raf = requestAnimationFrame(() => {
        setup();
        ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return null;
}
