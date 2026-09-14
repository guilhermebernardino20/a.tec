import Image from "next/image";
import { CONTACT, NAV } from "@/lib/content";
import Container from "@/components/ui/Container";
import OrganicCanvas from "@/components/OrganicCanvas";
import Mono from "@/components/ui/Mono";
import Pill from "@/components/ui/Pill";
import { getGeneralWhatsAppUrl } from "@/utils/whatsapp";

export default function Footer() {
  const year = new Date().getFullYear();
  // quebra permitida logo após o @, nunca no meio do domínio
  const [emailLocal, emailDomain] = CONTACT.email.split("@");

  return (
    <footer
      data-surface="dark"
      className="relative overflow-clip rounded-t-2xl bg-olive-deep pb-6 pt-10 text-paper"
    >
      <OrganicCanvas className="pointer-events-none absolute inset-0 h-full w-full opacity-45" />

      <Container className="relative">
        <div className="grid grid-cols-1 gap-14 pb-16 pt-14 xl:grid-cols-12 xl:gap-10">
          <div className="xl:col-span-5">
            <p
              data-text-reveal
              className="text-heading max-w-[20ch] font-light"
            >
              Assistência técnica para decisões que dependem de prova.
            </p>
            <Pill href="#contato" variant="light" className="mt-10">
              Agendar análise técnica
            </Pill>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)_minmax(0,1fr)] xl:col-span-7 xl:col-start-6">
            <div>
              <Mono className="text-paper/45">Navegar</Mono>
              <ul className="mt-4 flex flex-col">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="inline-flex min-h-11 items-center text-body text-paper/85 underline-offset-4 transition-colors hover:text-paper hover:underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-last col-span-2 sm:order-none sm:col-span-1">
              <Mono className="text-paper/45">Contato</Mono>
              <ul className="mt-4 flex flex-col">
                <li>
                  <a
                    href={CONTACT.emailHref}
                    aria-label={`Enviar e-mail para ${CONTACT.email} com o assunto Solicitação de Análise Técnica`}
                    className="block min-h-11 py-2.5 text-body [overflow-wrap:anywhere] text-paper/85 underline-offset-4 transition-colors hover:text-paper hover:underline"
                  >
                    {emailLocal}@<wbr />
                    {emailDomain}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${CONTACT.phoneHref}`}
                    aria-label={`Ligar para ${CONTACT.phone}`}
                    className="inline-flex min-h-11 items-center text-body text-paper/85 underline-offset-4 transition-colors hover:text-paper hover:underline"
                  >
                    {CONTACT.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={getGeneralWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Abrir conversa no WhatsApp com a a.tec"
                    className="inline-flex min-h-11 items-center text-body text-paper/85 underline-offset-4 transition-colors hover:text-paper hover:underline"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <Mono className="text-paper/45">Localização</Mono>
              <address className="mt-6 max-w-[26ch] text-body not-italic text-paper/85">
                <a
                  href={CONTACT.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir o endereço da a.tec no Google Maps"
                  className="inline-flex min-h-11 items-center underline-offset-4 transition-colors hover:text-paper hover:underline"
                >
                  {CONTACT.address}
                </a>
              </address>
            </div>
          </div>
        </div>

        <div className="border-t border-paper/15 pt-10">
          <Image
            src="/brand/atec-offwhite.png"
            alt="a.tec"
            width={2070}
            height={622}
            className="w-full max-w-[1100px] opacity-90"
          />
        </div>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] leading-normal text-paper/45">
            © {year} a.tec · Assistência Técnica Judicial
          </p>
          <p className="text-[11px] leading-normal text-paper/45">
            Todos os direitos reservados
          </p>
        </div>
      </Container>
    </footer>
  );
}
