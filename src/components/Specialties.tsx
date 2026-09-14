"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRACTICES } from "@/lib/content";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import GlowRule from "@/components/ui/GlowRule";
import SpecialtyDrawer, {
  type DrawerSpecialty,
} from "@/components/SpecialtyDrawer";
import SpecialtyCard from "@/components/SpecialtyCard";
import { SPECIALTY_DETAILS } from "@/lib/specialties";

const EASE = [0.16, 1, 0.3, 1] as const;

type Edge = "top" | "bottom" | "left" | "right";

const OUT: Record<Edge, string> = {
  top: "translateY(-100%)",
  bottom: "translateY(100%)",
  left: "translateX(-100%)",
  right: "translateX(100%)",
};

/** Aresta mais próxima do ponteiro — define de onde o painel entra e sai. */
function closestEdge(e: React.MouseEvent, el: HTMLElement): Edge {
  const { left, top, width, height } = el.getBoundingClientRect();
  const x = e.clientX - left;
  const y = e.clientY - top;
  const distances: Record<Edge, number> = {
    left: x,
    right: width - x,
    top: y,
    bottom: height - y,
  };
  return (Object.keys(distances) as Edge[]).reduce((a, b) =>
    distances[a] <= distances[b] ? a : b,
  );
}

/**
 * Especialidades por área. As linhas têm hover direcional — o painel
 * entra pela borda por onde o cursor chegou e sai pela borda de saída —
 * e abrem em acordeão.
 */
export default function Specialties() {
  const [open, setOpen] = useState<string | null>(PRACTICES[0].id);
  const [detail, setDetail] = useState<DrawerSpecialty | null>(null);
  const panels = useRef<Record<string, HTMLSpanElement | null>>({});

  const onEnter = (id: string) => (e: React.MouseEvent<HTMLElement>) => {
    const panel = panels.current[id];
    if (!panel) return;
    const edge = closestEdge(e, e.currentTarget);
    panel.style.transition = "none";
    panel.style.transform = OUT[edge];
    void panel.offsetHeight;
    panel.style.transition = "";
    panel.style.transform = "translate(0, 0)";
  };

  const onLeave = (id: string) => (e: React.MouseEvent<HTMLElement>) => {
    const panel = panels.current[id];
    if (!panel) return;
    panel.style.transform = OUT[closestEdge(e, e.currentTarget)];
  };

  return (
    <section className="bg-paper">
      <Container>
        <GlowRule />
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 pt-14 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Mono className="text-ink-mute">Especialidades</Mono>
          </div>

          <ul className="lg:col-span-9">
            {PRACTICES.map((p) => {
              const isOpen = open === p.id;
              return (
                <li
                  key={p.id}
                  className="border-b border-ink/10 first:border-t"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : p.id)}
                    onMouseEnter={onEnter(p.id)}
                    onMouseLeave={onLeave(p.id)}
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? "Recolher" : "Expandir"} as especialidades de ${p.name}`}
                    className="group relative flex w-full items-center justify-between gap-6 overflow-hidden px-4 py-7 text-left md:py-9"
                  >
                    <span
                      aria-hidden
                      ref={(el) => {
                        panels.current[p.id] = el;
                      }}
                      className="absolute inset-0 -z-0 bg-mint transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ transform: "translateY(100%)" }}
                    />
                    <span className="relative z-10 flex items-baseline gap-5 md:gap-8">
                      <span className="font-mono text-mono uppercase text-ink-mute">
                        {p.index}
                      </span>
                      <span
                        className={`text-heading font-light transition-colors duration-500 ${
                          isOpen
                            ? "text-ink"
                            : "text-ink/70 group-hover:text-ink"
                        }`}
                      >
                        {p.name}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 transition-colors duration-500 group-hover:border-ink/50"
                    >
                      <span className="absolute h-px w-3.5 bg-ink" />
                      <span
                        className={`absolute h-3.5 w-px bg-ink transition-transform duration-500 ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-10">
                          <p className="text-lead max-w-[52ch] font-light text-ink-soft">
                            {p.headline}
                          </p>
                          <ul className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
                            {p.specialties.map((s, i) => (
                              <li
                                key={s.title}
                                className="border-t border-ink/10"
                              >
                                <SpecialtyCard
                                  index={String(i + 1).padStart(2, "0")}
                                  title={s.title}
                                  body={s.body}
                                  documents={
                                    SPECIALTY_DETAILS[s.title]?.documents
                                      .length ?? 0
                                  }
                                  onOpen={() =>
                                    setDetail({
                                      practice: p.name,
                                      index: String(i + 1).padStart(2, "0"),
                                      title: s.title,
                                      body: s.body,
                                    })
                                  }
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>

      <SpecialtyDrawer specialty={detail} onClose={() => setDetail(null)} />
    </section>
  );
}
