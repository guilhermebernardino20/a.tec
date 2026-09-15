"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV } from "@/lib/content";
import Container from "@/components/ui/Container";
import Pill from "@/components/ui/Pill";
import { setScrollLock } from "@/lib/scroll-lock";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(true);
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
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    // o herói abre com escala: mede de novo quando a moldura assenta
    const settle = window.setTimeout(measure, 1900);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    setScrollLock(true);
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      setScrollLock(false);
    };
  }, [open]);

  const light = onDark;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <Container className="pointer-events-auto">
        <motion.div
          // entra depois que a moldura do herói termina de abrir
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "mt-3 flex items-center justify-between rounded-2xl px-4 py-3 transition-colors duration-500 md:mt-4 md:px-5",
            !scrolled
              ? "bg-transparent"
              : light
                ? "bg-olive-deep/45 backdrop-blur-xl"
                : "bg-paper/80 backdrop-blur-xl",
          )}
        >
          <Link
            href="/"
            aria-label="a.tec, página principal"
            className="flex min-h-11 items-center gap-3"
          >
            <Image
              src={light ? "/brand/atec-offwhite.png" : "/brand/atec-olive.png"}
              alt="a.tec"
              width={2070}
              height={622}
              priority
              className="h-[17px] w-auto md:h-[19px]"
            />
          </Link>

          <div className="flex items-center gap-1">
            <nav className="hidden items-center lg:flex">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-full px-5 text-xs font-medium uppercase tracking-[0.18em] leading-none transition-colors duration-500",
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
                "inline-flex min-h-11 items-center rounded-full px-5 text-xs font-medium uppercase tracking-[0.18em] leading-none transition-colors duration-500 lg:hidden",
                light ? "bg-paper/15 text-paper" : "bg-ink text-paper",
              )}
            >
              {open ? "Fechar" : "Menu"}
            </button>
          </div>
        </motion.div>
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
            {/* véu: isola o menu do conteúdo que fica atrás */}
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
              className="fixed inset-0 -z-10 h-full w-full cursor-default bg-dark/85 backdrop-blur-sm"
            />

            <Container>
              <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-dark/95 text-paper backdrop-blur-2xl">
                <ul>
                  {NAV.map((item) => (
                    <li key={item.href} className="border-b border-white/5">
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex min-h-14 items-center justify-between px-6 py-3.5 text-lg font-medium transition-colors active:bg-white/5"
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
                      className="flex min-h-14 items-center bg-olive px-6 py-3.5 text-lg font-medium text-dark transition-transform active:scale-[0.99]"
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
