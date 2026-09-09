"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/actions";
import { CONTACT } from "@/lib/content";
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
      className="group inline-flex items-center gap-3 rounded-lg bg-ink px-[17px] py-[13px] font-mono text-mono uppercase text-paper transition-colors duration-500 hover:bg-olive disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Enviando" : "Enviar"}
      <span
        aria-hidden
        className="inline-block transition-transform duration-500 group-hover:translate-x-1"
      >
        →
      </span>
    </button>
  );
}

export default function Contact() {
  const [state, formAction] = useActionState(submitContact, initialState);

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
                <dd className="mt-3 max-w-[30ch] text-body text-ink">{CONTACT.address}</dd>
              </div>
              <div>
                <dt>
                  <Mono className="text-ink-mute">Contato</Mono>
                </dt>
                <dd className="mt-3 space-y-1 text-body text-ink">
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="block break-all underline-offset-4 hover:underline"
                  >
                    {CONTACT.email}
                  </a>
                  <a
                    href={`tel:${CONTACT.phoneHref}`}
                    className="block underline-offset-4 hover:underline"
                  >
                    {CONTACT.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <form action={formAction} className="grid grid-cols-1 gap-10 sm:grid-cols-2">
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

              <div className="flex flex-col gap-6 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
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
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
