import { PRACTICES, TEAM, TEAM_MEMBERS } from "@/lib/content";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import { InViewGroup, InViewItem } from "@/components/ui/InView";
import { getJoinTeamWhatsAppUrl } from "@/utils/whatsapp";

/**
 * Nosso time: as pessoas por trás da rede, a rede multidisciplinar por
 * especialidade e, por fim, o convite para profissionais entrarem nela.
 */
export default function NossoTime() {
  return (
    <section id="time" className="bg-paper py-20 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 pb-12 lg:grid-cols-12">
          <Mono className="text-ink-mute lg:col-span-3">{TEAM.label}</Mono>
          <div className="lg:col-span-9">
            <h2 className="text-title max-w-[20ch] text-balance font-light leading-[1.06] text-ink">
              {TEAM.headline}
            </h2>
            <p className="mt-6 max-w-[58ch] text-body text-ink-soft">
              {TEAM.body}
            </p>
          </div>
        </div>

        {/*
          Placeholder: aguardando da a.tec o nome, o cargo e a foto de
          cada profissional. Por ora, silhueta genérica e texto indicativo
          no lugar de dados reais.
        */}
        <InViewGroup
          as="ul"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4"
        >
          {TEAM_MEMBERS.map((m) => (
            <InViewItem as="li" key={m.id}>
              <article className="flex h-full flex-col items-center rounded-2xl border border-white/10 bg-dark-card p-7 text-center text-paper">
                <span
                  aria-hidden
                  className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white/[0.06] text-paper/35"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-9 w-9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                  </svg>
                </span>
                <p className="mt-5 text-body font-light italic text-paper/50">
                  Nome do profissional
                </p>
                <p className="mt-1 text-sm text-paper/70">{m.role}</p>
              </article>
            </InViewItem>
          ))}
        </InViewGroup>

        <Mono className="mt-14 block text-ink-mute">Áreas de atuação</Mono>
        <InViewGroup
          as="ul"
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4"
        >
          {PRACTICES.map((p) => (
            <InViewItem as="li" key={p.id}>
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-dark-card p-7 text-paper">
                <span className="font-mono text-mono text-olive-light">
                  {p.index}
                </span>
                <h3 className="text-heading mt-6 text-balance font-light leading-[1.12]">
                  {p.name}
                </h3>
                <p className="mt-3 text-sm text-paper/70">{p.headline}</p>
              </article>
            </InViewItem>
          ))}
        </InViewGroup>

        {/* convite para profissionais entrarem na rede */}
        <div className="mt-12 flex flex-col items-start gap-6 rounded-2xl border border-olive/30 bg-dark-card p-8 text-paper md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <Mono className="text-olive-light">Junte-se a nós</Mono>
            <p className="text-heading mt-3 font-light">{TEAM.joinTitle}</p>
            <p className="mt-3 max-w-[52ch] text-body text-paper/70">
              {TEAM.joinBody}
            </p>
          </div>
          <a
            href={getJoinTeamWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${TEAM.joinCta}: falar com a a.tec pelo WhatsApp`}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-olive px-7 py-4 text-sm font-medium text-dark transition-colors duration-300 hover:bg-olive-light active:scale-[0.98]"
          >
            {TEAM.joinCta}
            <span aria-hidden>↗</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
