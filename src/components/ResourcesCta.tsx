import Link from "next/link";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";

/** Atalhos para o blog e o FAQ, na página principal. */
export default function ResourcesCta() {
  return (
    <section className="bg-paper pb-20 md:pb-32">
      <Container>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <Link
            href="/blog"
            data-surface="dark"
            className="group flex flex-col justify-between gap-8 rounded-2xl border border-white/10 bg-dark-card p-8 text-paper transition-colors duration-300 hover:border-olive/40 md:p-10"
          >
            <div>
              <Mono className="text-paper/50">Central editorial</Mono>
              <h3 className="text-heading mt-4 text-balance font-light leading-[1.12]">
                Artigos técnicos da a.tec
              </h3>
              <p className="mt-3 max-w-[42ch] text-body text-paper/70">
                Medicina legal, engenharia, psicologia e estratégia
                processual, direto de quem faz a perícia.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 text-sm font-medium text-olive-light">
              Ler o blog
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>

          <div
            data-surface="dark"
            className="flex flex-col justify-between gap-8 rounded-2xl border border-white/10 bg-dark-card p-8 text-paper md:p-10"
          >
            <div>
              <Mono className="text-paper/50">Dúvidas frequentes</Mono>
              <h3 className="text-heading mt-4 text-balance font-light leading-[1.12]">
                Ainda com perguntas?
              </h3>
              <p className="mt-3 max-w-[42ch] text-body text-paper/70">
                Reunimos as perguntas mais comuns de pessoas físicas e de
                escritórios que já atendemos.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/pessoa-fisica/faq"
                className="inline-flex min-h-11 items-center rounded-full bg-paper/[0.08] px-5 py-3 text-sm text-paper transition-colors duration-300 hover:bg-olive hover:text-dark"
              >
                FAQ Pessoa Física
              </Link>
              <Link
                href="/empresas/faq"
                className="inline-flex min-h-11 items-center rounded-full bg-paper/[0.08] px-5 py-3 text-sm text-paper transition-colors duration-300 hover:bg-olive hover:text-dark"
              >
                FAQ Empresas
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
