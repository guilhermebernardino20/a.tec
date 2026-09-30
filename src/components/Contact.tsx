import { CONTACT } from "@/lib/content";
import { getGeneralWhatsAppUrl } from "@/utils/whatsapp";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import ContactForm from "@/components/ContactForm";

/**
 * Seção de contato: coluna institucional (endereço, e-mail, WhatsApp) e o
 * formulário em si, que vive em `ContactForm` — o mesmo componente usado
 * no modal de orçamento online.
 */
export default function Contact({
  label = "Contato",
  title = "Transforme a técnica em vantagem processual.",
  lead = "Preencha o formulário e nossa equipe indicará o melhor caminho para auxiliar no seu caso.",
  submitLabel = "Enviar",
}: {
  label?: string;
  title?: string;
  lead?: string;
  submitLabel?: string;
} = {}) {
  return (
    <section id="contato" className="bg-paper py-20 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Mono className="text-ink-mute">{label}</Mono>
            <div className="w-fit">
              <h2
                data-text-reveal
                className="text-title mt-8 max-w-[16ch] text-balance font-light text-ink"
              >
                {title}
              </h2>
              <p className="mt-8 w-0 min-w-full text-body text-ink-soft md:text-lg md:leading-[1.45]">
                {lead}
              </p>
            </div>

            <dl className="mt-12 grid grid-cols-1 gap-8 border-t border-ink/10 pt-8 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <dt>
                  <Mono className="text-ink-mute">Localização</Mono>
                </dt>
                <dd className="mt-3 max-w-[30ch] text-body text-ink">
                  <a
                    href={CONTACT.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Abrir o endereço da a.tec no Google Maps"
                    className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                  >
                    {CONTACT.address}
                  </a>
                </dd>
              </div>
              <div>
                <dt>
                  <Mono className="text-ink-mute">Contato</Mono>
                </dt>
                <dd className="mt-1 flex flex-col text-body text-ink">
                  <a
                    href={CONTACT.emailHref}
                    aria-label={`Enviar e-mail para ${CONTACT.email} com o assunto Solicitação de Análise Técnica`}
                    className="inline-flex min-h-11 items-center break-all underline-offset-4 hover:underline"
                  >
                    {CONTACT.email}
                  </a>
                  <a
                    href={`tel:${CONTACT.phoneHref}`}
                    aria-label={`Ligar para ${CONTACT.phone}`}
                    className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                  >
                    {CONTACT.phone}
                  </a>
                  <a
                    href={getGeneralWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Abrir conversa no WhatsApp com a a.tec"
                    className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                  >
                    WhatsApp: atendimento direto
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <ContactForm submitLabel={submitLabel} />
          </div>
        </div>
      </Container>
    </section>
  );
}
