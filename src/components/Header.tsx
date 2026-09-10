"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV } from "@/lib/content";
import Container from "@/components/ui/Container";
import Pill from "@/components/ui/Pill";
import { setScrollLock } from "@/lib/scroll-lock";
import { cn } from "@/lib/utils";

/** Etapas do percurso, na ordem em que aparecem na página. */
const STAGES = [
  { id: "topo", label: "Visão geral" },
  { id: "dados", label: "Peso da prova" },
  { id: "processo", label: "Metodologia" },
  { id: "matrix", label: "Matriz pericial" },
  { id: "servicos", label: "Áreas" },
  { id: "contato", label: "Contato" },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const [stage, setStage] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > 40);

      // o cabeçalho só troca de registro quando deixa uma superfície escura
      const bar = 88;
      const dark = Array.from(
        document.querySelectorAll<HTMLElement>("[data-surface='dark']"),
      ).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= bar && r.bottom >= bar;
      });
      setOnDark(dark);

      // etapa ativa: a última cujo topo já passou pelo terço superior da tela
      const line = window.innerHeight * 0.35;
      let active = 0;
      STAGES.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) active = i;
      });
      setStage(active);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    setScrollLock(true);
    return () => {
      document.documentElement.style.overflow = "";
      setScrollLock(false);
    };
  }, [open]);

  const light = onDark;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <Container className="pointer-events-auto">
        <div
          className={cn(
            "mt-3 flex items-center justify-between rounded-2xl px-4 py-3 transition-colors duration-500 md:mt-4 md:px-5",
            !scrolled
              ? "bg-transparent"
              : light
                ? "bg-olive-deep/45 backdrop-blur-xl"
                : "bg-paper/80 backdrop-blur-xl",
          )}
        >
          <a href="#topo" aria-label="a.tec — início" className="flex items-center gap-3">
            <Image
              src={light ? "/brand/atec-offwhite.png" : "/brand/atec-olive.png"}
              alt="a.tec"
              width={2070}
              height={622}
              priority
              className="h-[17px] w-auto md:h-[19px]"
            />
            <span
              className={cn(
                "hidden font-mono text-[10px] uppercase leading-none transition-colors duration-500 sm:block md:hidden",
                light ? "text-paper/70" : "text-ink/50",
              )}
            >
              Assistência Técnica Judicial
            </span>
          </a>

          {/* indicador técnico da etapa em que a leitura está */}
          <div
            aria-hidden
            className={cn(
              "hidden items-center gap-1 font-mono text-[10px] uppercase leading-none transition-colors duration-500 md:flex",
              light ? "text-paper/60" : "text-ink/45",
            )}
          >
            <span>[</span>
            <span className={light ? "text-paper/85" : "text-ink/70"}>
              {String(stage + 1).padStart(2, "0")}/{String(STAGES.length).padStart(2, "0")}
            </span>
            <span className="px-1">•</span>
            <span className="relative block h-3 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={STAGES[stage].id}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={cn("block whitespace-nowrap", light ? "text-paper" : "text-ink")}
                >
                  {STAGES[stage].label}
                </motion.span>
              </AnimatePresence>
            </span>
            <span>]</span>
          </div>

          <div className="flex items-center gap-1">
            <nav className="hidden items-center lg:flex">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-[17px] py-[11px] font-mono text-mono uppercase leading-none transition-colors duration-500",
                    light
                      ? "text-paper/85 hover:bg-paper/15 hover:text-paper"
                      : "text-ink/75 hover:bg-ink/[0.06] hover:text-ink",
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <Pill
              href="#contato"
              variant={light ? "light" : "dark"}
              aria-label="Ir para o formulário e agendar uma análise técnica"
              className="hidden md:inline-flex"
            >
              Agendar análise
            </Pill>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              className={cn(
                "rounded-lg px-[17px] py-[11px] font-mono text-mono uppercase leading-none transition-colors duration-500 lg:hidden",
                light ? "bg-paper/15 text-paper" : "bg-ink text-paper",
              )}
            >
              {open ? "Fechar" : "Menu"}
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto lg:hidden"
          >
            <Container>
              <div className="mt-2 overflow-hidden rounded-2xl bg-ink text-paper">
                <ul>
                  {NAV.map((item) => (
                    <li key={item.href} className="border-b border-paper/10">
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between px-6 py-5 font-mono text-mono uppercase"
                      >
                        {item.label}
                        <span className="text-paper/40">{item.index}</span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href="#contato"
                      onClick={() => setOpen(false)}
                      className="block bg-mint px-6 py-5 font-mono text-mono uppercase text-olive-deep"
                    >
                      Agendar análise técnica
                    </a>
                  </li>
                </ul>
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
