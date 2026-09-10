"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/actions";
import { CONTACT } from "@/lib/content";
import { PREFILL_EVENT } from "@/lib/prefill";
import { getGeneralWhatsAppUrl } from "@/utils/whatsapp";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";

import { cn } from "@/lib/utils";

const initialState: ContactState = { status: "idle" };

function Field({
  name,
  label,
  type = "text",
  error,
  textarea = false,
  className,
}: {
  name: string;
  label: string;
  type?: string;
  error?: string;
  textarea?: boolean;
  className?: string;
}) {
  const base =
    "w-full border-0 border-b border-ink/20 bg-transparent px-0 pb-3 pt-2 text-lead font-light text-ink outline-none transition-colors duration-300 placeholder:text-ink/30 focus:border-ink";
  return (
    <div className={cn(className)}>
      <label htmlFor={name} className="mb-3 block">
        <Mono className="text-ink-mute">{label}</Mono>
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          required
          placeholder="Descreva brevemente o caso"
          aria-invalid={Boolean(error)}
          className={cn(base, "resize-none")}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required
          placeholder={type === "email" ? "nome@escritorio.com.br" : "—"}
          aria-invalid={Boolean(error)}
          className={base}
        />
      )}
      {error ? (
        <Mono className="mt-3 block text-olive">{error}</Mono>
      ) : null}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Enviar solicitação de análise técnica"
      aria-busy={pending}
      className="group inline-flex items-center gap-3 rounded-lg bg-ink px-[17px] py-[13px] font-mono text-mono uppercase text-paper transition-colors duration-500 hover:bg-olive disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Enviando…" : "Enviar"}
      {pending ? (
        <span
          aria-hidden
          className="inline-block h-3.5 w-3.5 animate-spin rounded-full border border-paper/35 border-t-paper"
        />
      ) : (
        <span
          aria-hidden
          className="inline-block transition-transform duration-500 group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </button>
  );
}

/** Aviso de sucesso em vidro, com o atalho para acelerar o atendimento. */
function SuccessToast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-[420px] overflow-hidden rounded-2xl border border-paper/15 bg-olive-deep/85 p-5 text-paper shadow-2xl backdrop-blur-2xl sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lime text-[11px] font-medium text-olive-deep"
          >
            ✓
          </span>
          <p className="text-sm leading-relaxed text-paper/90">{message}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar aviso de envio"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-paper/20 text-paper/70 transition-colors hover:border-paper/60 hover:text-paper"
        >
          <span aria-hidden className="relative block h-2.5 w-2.5">
            <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
            <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <a
        href={getGeneralWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Acelerar atendimento pelo WhatsApp"
        className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-paper px-4 py-3 font-mono text-mono uppercase text-ink transition-colors duration-300 hover:bg-mint"
      >
        Acelerar atendimento via WhatsApp
        <span aria-hidden>↗</span>
      </a>
    </motion.div>
  );
}

export default function Contact() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [dismissed, setDismissed] = useState(false);

  // o aviso deriva do estado do envio; o local guarda só a dispensa
  const toastOpen = state.status === "success" && !dismissed;

  // envio aceito: limpa os campos e agenda o desaparecimento do aviso
  useEffect(() => {
    if (state.status !== "success") return;
    formRef.current?.reset();
    const timer = window.setTimeout(() => setDismissed(true), 12000);
    return () => window.clearTimeout(timer);
  }, [state]);

  // CTAs do site podem chegar com um assunto já escrito
  useEffect(() => {
    const onPrefill = (event: Event) => {
      const text = (event as CustomEvent<{ text: string }>).detail?.text;
      const field = formRef.current?.elements.namedItem("mensagem");
      if (!text || !(field instanceof HTMLTextAreaElement)) return;
      field.value = text;
      window.setTimeout(() => field.focus({ preventScroll: true }), 900);
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  return (
    <section id="contato" className="bg-paper py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-x-5 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Mono className="text-ink-mute">Contato</Mono>
            <h2
              data-text-reveal
              className="text-title mt-8 max-w-[14ch] font-light text-ink"
            >
              Transforme a técnica em vantagem processual.
            </h2>
            <p className="mt-8 max-w-[40ch] text-body text-ink-soft md:text-lg md:leading-[1.45]">
              Preencha o formulário e nossa equipe indicará o melhor caminho
              para auxiliar no seu caso.
            </p>

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
                    className="underline-offset-4 hover:underline"
                  >
                    {CONTACT.address}
                  </a>
                </dd>
              </div>
              <div>
                <dt>
                  <Mono className="text-ink-mute">Contato</Mono>
                </dt>
                <dd className="mt-3 space-y-1 text-body text-ink">
                  <a
                    href={CONTACT.emailHref}
                    aria-label={`Enviar e-mail para ${CONTACT.email} com o assunto Solicitação de Análise Técnica`}
                    className="block break-all underline-offset-4 hover:underline"
                  >
                    {CONTACT.email}
                  </a>
                  <a
                    href={`tel:${CONTACT.phoneHref}`}
                    aria-label={`Ligar para ${CONTACT.phone}`}
                    className="block underline-offset-4 hover:underline"
                  >
                    {CONTACT.phone}
                  </a>
                  <a
                    href={getGeneralWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Abrir conversa no WhatsApp com a a.tec"
                    className="block underline-offset-4 hover:underline"
                  >
                    WhatsApp — atendimento direto
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <form
              ref={formRef}
              action={formAction}
              onSubmit={() => setDismissed(false)}
              className="grid grid-cols-1 gap-10 sm:grid-cols-2"
            >
              <Field name="nome" label="Nome" error={state.fieldErrors?.nome} />
              <Field
                name="sobrenome"
                label="Sobrenome"
                error={state.fieldErrors?.sobrenome}
              />
              <Field
                name="email"
                label="E-mail"
                type="email"
                error={state.fieldErrors?.email}
                className="sm:col-span-2"
              />
              <Field
                name="mensagem"
                label="Mensagem"
                textarea
                error={state.fieldErrors?.mensagem}
                className="sm:col-span-2"
              />

              {/* honeypot */}
              <div aria-hidden className="hidden">
                <label htmlFor="empresa">Empresa</label>
                <input id="empresa" name="empresa" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="flex flex-col gap-6 sm:col-span-2">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <SubmitButton />
                  <p
                    aria-live="polite"
                    className={cn(
                      "max-w-[40ch] text-sm leading-relaxed",
                      state.status === "success" ? "text-olive" : "text-ink-mute",
                    )}
                  >
                    {state.message ??
                      "Todos os campos são obrigatórios. Retornamos em até 1 dia útil."}
                  </p>
                </div>

                {state.status === "success" ? (
                  <a
                    href={getGeneralWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Acelerar atendimento pelo WhatsApp"
                    className="inline-flex w-fit items-center gap-3 rounded-lg border border-ink/20 px-[17px] py-[13px] font-mono text-mono uppercase text-ink transition-colors duration-300 hover:border-olive hover:bg-olive/10"
                  >
                    Acelerar atendimento via WhatsApp
                    <span aria-hidden>↗</span>
                  </a>
                ) : null}
              </div>
            </form>

            <AnimatePresence>
              {toastOpen ? (
                <SuccessToast
                  message="Solicitação enviada com sucesso! Nossa equipe retornará em breve."
                  onDismiss={() => setDismissed(true)}
                />
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
