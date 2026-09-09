"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MARQUEE_TEXT } from "@/lib/content";

/**
 * Faixa em rotação contínua que inverte o sentido conforme a direção da
 * rolagem e acelera com a velocidade do scroll — como na referência.
 */
export default function Marquee() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".marquee-collection");
      if (!items.length) return;

      const width = items[0].offsetWidth;
      const scale = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;
      const duration = 15 * (width / window.innerWidth) * scale;

      const loop = gsap
        .to(items, { xPercent: -100, repeat: -1, duration, ease: "linear" })
        .totalProgress(0.5);

      gsap.set(items, { xPercent: -100 });
      loop.timeScale(-1);
      loop.play();

      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const direction = self.direction === -1 ? 1 : -1;
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 1600, 3);
          loop.timeScale(direction * boost);
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const item = `${MARQUEE_TEXT} – `;

  return (
    <section
      ref={root}
      aria-hidden
      className="overflow-hidden bg-paper py-24 md:py-32 lg:py-40"
    >
      <div className="flex w-max flex-nowrap">
        {[0, 1, 2].map((k) => (
          <span
            key={k}
            className="marquee-collection whitespace-nowrap pr-8 text-[clamp(3rem,9vw,9rem)] font-extralight leading-none tracking-[-0.03em] text-ink"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
