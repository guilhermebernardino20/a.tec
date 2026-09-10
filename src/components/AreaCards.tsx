"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRACTICES } from "@/lib/content";
import TiltCard from "@/components/ui/TiltCard";
import ScanEdge from "@/components/ui/ScanEdge";
import Parallax from "@/components/ui/Parallax";

const TONES: Record<string, string> = {
  mint: "bg-mint text-olive-deep",
  ink: "bg-ink text-paper",
  stone: "bg-stone text-ink",
  sage: "bg-sage text-olive-deep",
};

const GLYPHS: Record<string, ReactNode> = {
  medicina: (
    <g>
      <circle cx="57" cy="57" r="40" />
      <path d="M57 33v48M33 57h48" />
    </g>
  ),
  psicologia: (
    <g>
      <path d="M57 20c-20 0-33 14-33 32 0 12 6 18 6 26v14h42V72c8-6 12-12 12-20 0-18-13-32-27-32Z" />
      <path d="M45 52c4-6 12-6 16 0" />
    </g>
  ),
  engenharias: (
    <g>
      <path d="M20 92 57 20l37 72Z" />
      <path d="M36 62h42" />
    </g>
  ),
  avaliacoes: (
    <g>
      <path d="M22 52 57 22l35 30v40H22Z" />
      <path d="M46 92V66h22v26" />
    </g>
  ),
};

/**
 * Cartões que se abrem em clip-path, um após o outro, e só então
 * revelam o conteúdo interno — mesma coreografia da referência.
 */
export default function AreaCards() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || window.innerWidth < 1025) return;

    const ctx = gsap.context(() => {
      gsap.set(".area-card", { clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)" });
      gsap.set(".area-card-content > *", { opacity: 0, y: 24 });

      gsap.to(".area-card", {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        duration: 1,
        ease: "expo.out",
        stagger: 0.15,
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });

      gsap.to(".area-card-content > *", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.6,
        ease: "expo.out",
        stagger: 0.2,
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="bg-paper">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {PRACTICES.map((p, i) => (
          <li key={p.id} className="[perspective:1200px]">
            <Parallax distance={i % 2 === 0 ? -34 : -62}>
            <TiltCard
              intensity={5}
              glare={p.tone === "ink"}
              className={`area-card flex min-h-[340px] flex-col justify-between gap-10 p-8 md:min-h-[420px] md:p-10 ${TONES[p.tone]}`}
            >
              <ScanEdge orientation="x" duration={6.5} delay={i * 1.2} />
              <ScanEdge orientation="y" duration={8} delay={i * 1.2 + 0.6} />

              <div className="area-card-content flex h-full flex-col justify-between gap-10">
              <div className="flex items-start justify-between">
                <span className="font-mono text-mono uppercase opacity-70">
                  {p.index}.
                </span>
                <svg
                  viewBox="0 0 114 114"
                  className="h-16 w-16 opacity-80 md:h-[72px] md:w-[72px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {GLYPHS[p.id]}
                </svg>
              </div>

                <div>
                  <h3 className="text-heading font-light">{p.name}</h3>
                  <p className="mt-4 max-w-[34ch] text-body opacity-80">{p.cardBody}</p>
                </div>
              </div>
            </TiltCard>
            </Parallax>
          </li>
        ))}
      </ul>
    </section>
  );
}
