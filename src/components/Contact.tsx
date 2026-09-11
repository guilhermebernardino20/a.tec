"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Paperclip, X } from "lucide-react";
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_MAX_FILES,
  CONTACT_SUCCESS,
  checkAttachments,
  formatBytes,
  type ContactField,
  type ContactResponse,
} from "@/lib/contact";
import { CONTACT } from "@/lib/content";
import { PREFILL_EVENT, type PrefillDetail } from "@/lib/prefill";
import { getGeneralWhatsAppUrl } from "@/utils/whatsapp";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";

import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "error" | "success";

const HELP =
  "Nome, e-mail e mensagem são obrigatórios. Retornamos em até 1 dia útil.";

function Field({
  name,
  label,
  type = "text",
  error,
  textarea = false,
  optional = false,
  className,
}: {
  name: string;
  label: string;
  type?: string;
  error?: string;
  textarea?: boolean;
  optional?: boolean;
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
          required={!optional}
          placeholder="Descreva brevemente o caso"
          aria-invalid={Boolean(error)}
          className={cn(base, "resize-none")}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={!optional}
          placeholder={
            type === "email"
              ? "nome@escritorio.com.br"
              : type === "tel"
                ? "(41) 90000-0000"
                : "—"
          }
          aria-invalid={Boolean(error)}
          className={base}
        />
      )}
      {error ? (
        <p className="mt-3 text-[13px] leading-normal text-olive-brand">{error}</p>
      ) : null}
    </div>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Enviar solicitação de análise técnica"
      aria-busy={pending}
      className="group inline-flex min-h-11 items-center gap-3 rounded-lg bg-ink px-[17px] py-[13px] font-mono text-mono uppercase text-paper transition-colors duration-500 hover:bg-olive hover:text-dark disabled:cursor-wait disabled:opacity-70"
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
        className="mt-4 flex min-h-11 items-center justify-between gap-3 rounded-lg bg-paper px-4 py-3 font-mono text-mono uppercase text-ink transition-colors duration-300 hover:bg-mint"
      >
        Acelerar atendimento via WhatsApp
        <span aria-hidden>↗</span>
      </a>
    </motion.div>
  );
}

/**
 * Anexos opcionais: petições, laudos, documentos — até 5 arquivos. O
 * `<input>` fica visualmente escondido mas focável (Tab chega nele), e a
 * área inteira aceita arrastar e soltar.
 */
function AttachmentField({
  files,
  error,
  onPick,
  onRemove,
}: {
  files: File[];
  error?: string;
  onPick: (files: File[]) => void;
  onRemove: (index: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const total = files.reduce((sum, f) => sum + f.size, 0);
  const cheio = files.length >= ATTACHMENT_MAX_FILES;

  return (
    <div className="sm:col-span-2">
      <span className="mb-3 flex items-baseline justify-between gap-4">
        <Mono className="text-ink-mute">Anexos (opcional)</Mono>
        {files.length ? (
          <span className="text-[11px] text-ink-mute">
            {files.length} de {ATTACHMENT_MAX_FILES} · {formatBytes(total)}
          </span>
        ) : null}
      </span>

      {files.length ? (
        <ul className="mb-3 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-ink/15 bg-ink/[0.03] px-4 py-2"
            >
              <span className="flex min-w-0 items-center gap-3">
                <FileText aria-hidden size={18} strokeWidth={1.5} className="shrink-0 text-olive-brand" />
                <span className="min-w-0 truncate text-sm text-ink">
                  {file.name}{" "}
                  <span className="text-ink-mute">({formatBytes(file.size)})</span>
                </span>
              </span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Remover o anexo ${file.name}`}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/15 text-ink transition-all hover:border-olive-brand hover:bg-olive-brand/10 active:scale-[0.96]"
              >
                <X aria-hidden size={16} strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {cheio ? null : (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const dropped = Array.from(e.dataTransfer.files ?? []);
            if (dropped.length) onPick(dropped);
          }}
          className={cn(
            "flex min-h-11 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-4 text-center transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#7f9970]",
            dragging
              ? "border-olive-brand bg-olive-brand/[0.06]"
              : "border-ink/20 bg-ink/[0.02] hover:border-olive-brand/50 hover:bg-ink/[0.04]",
          )}
        >
          <input
            type="file"
            name="anexo-seletor"
            accept={ATTACHMENT_ACCEPT}
            multiple
            className="sr-only"
            onChange={(e) => {
              const picked = Array.from(e.target.files ?? []);
              if (picked.length) onPick(picked);
              e.target.value = "";
            }}
          />
          <Paperclip aria-hidden size={18} strokeWidth={1.5} className="text-ink-mute" />
          <span className="text-sm text-ink-soft">
            {files.length
              ? "Adicionar mais documentos"
              : "Clique ou arraste petições, laudos ou documentos"}
          </span>
          <span className="text-[11px] text-ink-mute">
            PDF ou Word • até {ATTACHMENT_MAX_FILES} arquivos, 10 MB cada
          </span>
        </label>
      )}

      {error ? (
        <p className="mt-3 text-[13px] leading-normal text-olive-brand">{error}</p>
      ) : null}
    </div>
  );
}

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ContactField, string>>
  >({});
  const [dismissed, setDismissed] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  // origem do contato (Matrix, especialidade): segue junto no envio
  const origem = useRef<{ area?: string; caso?: string }>({});

  // novos arquivos somam aos já escolhidos; o conjunto é validado inteiro
  const pickFiles = useCallback(
    (picked: File[]) => {
      const chave = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;
      const vistos = new Set(files.map(chave));
      const proximo = [...files, ...picked.filter((f) => !vistos.has(chave(f)))];
      const problem = checkAttachments(proximo);
      setFieldErrors((erros) => ({ ...erros, anexo: problem ?? undefined }));
      if (!problem) setFiles(proximo);
    },
    [files],
  );

  // o aviso deriva do estado do envio; o local guarda só a dispensa
  const toastOpen = status === "success" && !dismissed;

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setDismissed(false);
    setStatus("sending");
    setMessage(null);
    setFieldErrors({});

    const body = new FormData();
    for (const key of ["nome", "sobrenome", "email", "telefone", "mensagem", "empresa"]) {
      body.append(key, String(data.get(key) ?? ""));
    }
    if (origem.current.area) body.append("area", origem.current.area);
    if (origem.current.caso) body.append("caso", origem.current.caso);
    for (const f of files) body.append("anexo", f);

    try {
      // sem content-type: o navegador monta o boundary do multipart
      const response = await fetch("/api/contact", { method: "POST", body });

      const result = (await response.json()) as ContactResponse;

      if (!response.ok || !result.ok) {
        setStatus("error");
        setMessage(result.message ?? "Não foi possível enviar agora.");
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }

      setStatus("success");
      setMessage(result.message ?? CONTACT_SUCCESS);
      form.reset();
      setFiles([]);
      origem.current = {};
    } catch {
      setStatus("error");
      setMessage(
        "Falha de conexão. Tente novamente ou fale conosco pelo WhatsApp.",
      );
    }
  }, [files]);

  // o aviso de sucesso se retira sozinho
  useEffect(() => {
    if (status !== "success") return;
    const timer = window.setTimeout(() => setDismissed(true), 12000);
    return () => window.clearTimeout(timer);
  }, [status]);

  // CTAs do site podem chegar com um assunto já escrito
  useEffect(() => {
    const onPrefill = (event: Event) => {
      const detail = (event as CustomEvent<PrefillDetail>).detail;
      if (!detail?.text) return;
      origem.current = { area: detail.area, caso: detail.caso };
      const field = formRef.current?.elements.namedItem("mensagem");
      if (!(field instanceof HTMLTextAreaElement)) return;
      field.value = detail.text;
      window.setTimeout(() => field.focus({ preventScroll: true }), 900);
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  return (
    <section id="contato" className="bg-paper py-20 md:py-32">
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
                    WhatsApp — atendimento direto
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              className="grid grid-cols-1 gap-10 sm:grid-cols-2"
            >
              <Field name="nome" label="Nome" error={fieldErrors.nome} />
              <Field
                name="sobrenome"
                label="Sobrenome"
                error={fieldErrors.sobrenome}
              />
              <Field name="email" label="E-mail" type="email" error={fieldErrors.email} />
              <Field
                name="telefone"
                label="Telefone / WhatsApp (opcional)"
                type="tel"
                optional
                error={fieldErrors.telefone}
              />
              <Field
                name="mensagem"
                label="Mensagem"
                textarea
                error={fieldErrors.mensagem}
                className="sm:col-span-2"
              />

              <AttachmentField
                files={files}
                error={fieldErrors.anexo}
                onPick={pickFiles}
                onRemove={(index) => {
                  setFiles((prev) => prev.filter((_, i) => i !== index));
                  setFieldErrors((prev) => ({ ...prev, anexo: undefined }));
                }}
              />

              {/* honeypot */}
              <div aria-hidden className="hidden">
                <label htmlFor="empresa">Empresa</label>
                <input id="empresa" name="empresa" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="flex flex-col gap-6 sm:col-span-2">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <SubmitButton pending={status === "sending"} />
                  <p
                    aria-live="polite"
                    className={cn(
                      "max-w-[40ch] text-sm leading-relaxed",
                      status === "success" || status === "error"
                        ? "text-olive-brand"
                        : "text-ink-mute",
                    )}
                  >
                    {message ?? HELP}
                  </p>
                </div>

                {status === "success" ? (
                  <a
                    href={getGeneralWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Acelerar atendimento pelo WhatsApp"
                    className="inline-flex min-h-11 w-fit items-center gap-3 rounded-lg border border-ink/20 px-[17px] py-[13px] font-mono text-mono uppercase text-ink transition-colors duration-300 hover:border-olive-brand hover:bg-olive-brand/10"
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
                  message={message ?? CONTACT_SUCCESS}
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
