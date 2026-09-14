"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { setScrollLock } from "@/lib/scroll-lock";
import { prefillContact } from "@/lib/prefill";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import {
  PROFILE_LABEL,
  RELATO_MAX,
  RELATO_MIN,
  STAGES,
  TRIAGE_AREAS,
  TRIAGE_EVENT,
  UNKNOWN_SPECIALTY,
  estimate,
  nextSteps,
  triageMessage,
  type Profile,
  type TriageOpen,
  type Stage,
} from "@/lib/triagem";
import { getTriageWhatsAppUrl } from "@/utils/whatsapp";
import Mono from "@/components/ui/Mono";

const EASE = [0.16, 1, 0.3, 1] as const;
const BOTTOM_SHEET = "(max-width: 767px)";
const STEP_TITLES = ["Área e situação", "Relato do caso", "Próximos passos"];

/** Opção em pílula, usada nas escolhas de área, perícia e situação. */
function Choice({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "min-h-11 rounded-full border px-4 py-2.5 text-left text-sm transition-all duration-300 active:scale-[0.99]",
        selected
          ? "border-paper bg-paper text-ink"
          : "border-white/10 text-paper/75 hover:border-olive/40 hover:bg-white/[0.03] hover:text-paper",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Triagem interativa aberta pelos botões "Sou Pessoa Física" e "Sou
 * Empresa / PJ": três etapas curtas e a síntese pronta para o WhatsApp.
 */
export default function Triagem() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [step, setStep] = useState(0);
  const [areaId, setAreaId] = useState<string | null>(null);
  const [specialty, setSpecialty] = useState(UNKNOWN_SPECIALTY);
  const [stage, setStage] = useState<Stage | null>(null);
  const [nome, setNome] = useState("");
  const [relato, setRelato] = useState("");
  const [tried, setTried] = useState(false);

  const dialog = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const sheet = useMediaQuery(BOTTOM_SHEET);
  const ids = useId();
  const open = profile !== null;

  const close = useCallback(() => setProfile(null), []);

  // abertura pelo evento: recomeça a triagem com o perfil escolhido
  useEffect(() => {
    const onOpen = (event: Event) => {
      const next = (event as CustomEvent<TriageOpen>).detail;
      opener.current = document.activeElement as HTMLElement | null;
      setProfile(next.profile);
      if (next.areaId) {
        setAreaId(next.areaId);
        setSpecialty(UNKNOWN_SPECIALTY);
      }
      setStep(0);
      setTried(false);
    };
    window.addEventListener(TRIAGE_EVENT, onOpen);
    return () => window.removeEventListener(TRIAGE_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      // o foco não sai da janela enquanto ela está aberta
      if (e.key === "Tab" && dialog.current) {
        const focusable = dialog.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    setScrollLock(true);

    const trigger = opener.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
      setScrollLock(false);
      trigger?.focus({ preventScroll: true });
    };
  }, [open, close]);

  // cada etapa começa pelo título, para leitor de tela e teclado
  useEffect(() => {
    if (open) heading.current?.focus({ preventScroll: true });
  }, [open, step]);

  const area = TRIAGE_AREAS.find((a) => a.id === areaId);
  const relatoOk = relato.trim().length >= RELATO_MIN;

  const advance = () => {
    setTried(true);
    if (step === 0 && (!areaId || !stage)) return;
    if (step === 1 && !relatoOk) return;
    setTried(false);
    setStep((s) => Math.min(2, s + 1));
  };

  const answers =
    profile && areaId && stage
      ? { profile, areaId, specialty, stage, nome, relato }
      : null;

  return (
    <AnimatePresence>
      {open && profile ? (
        <motion.div
          key="triagem"
          className="fixed inset-0 z-[75] flex items-end justify-center md:items-center md:p-6"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            aria-hidden
            onClick={close}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute inset-0 bg-olive-deep/60 backdrop-blur-md"
          />

          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${ids}-titulo`}
            variants={
              sheet
                ? { hidden: { y: "100%" }, visible: { y: 0 } }
                : {
                    hidden: { opacity: 0, y: 24, scale: 0.98 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }
            }
            transition={{ duration: 0.5, ease: EASE }}
            className={cn(
              "relative flex max-h-[92svh] w-full flex-col bg-neutral-900/90 text-paper shadow-2xl backdrop-blur-md",
              sheet
                ? "rounded-t-2xl border-t border-white/10"
                : "max-w-2xl rounded-2xl border border-white/10",
            )}
          >
            {/* cabeçalho: perfil, progresso e fechar */}
            <header className="flex items-start justify-between gap-6 px-6 pb-5 pt-6 md:px-10 md:pt-8">
              <div className="min-w-0">
                <Mono className="text-paper/50">
                  {PROFILE_LABEL[profile]} · Etapa {step + 1} de 3
                </Mono>
                <h2
                  id={`${ids}-titulo`}
                  ref={heading}
                  tabIndex={-1}
                  className="text-heading mt-3 text-balance font-light leading-[1.12]"
                >
                  {STEP_TITLES[step]}
                </h2>
                <div className="mt-5 grid w-40 grid-cols-3 gap-1.5" aria-hidden>
                  {STEP_TITLES.map((t, i) => (
                    <span
                      key={t}
                      className={cn(
                        "h-[3px] rounded-full transition-colors duration-500",
                        i <= step ? "bg-olive-light" : "bg-paper/15",
                      )}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Fechar triagem"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper/[0.07] transition-colors duration-300 hover:bg-paper/[0.16]"
              >
                <span aria-hidden className="relative block h-3.5 w-3.5">
                  <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-paper" />
                  <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-paper" />
                </span>
              </button>
            </header>

            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto overscroll-contain border-t border-paper/10 px-6 py-7 md:px-10"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  {step === 0 ? (
                    <div className="space-y-8">
                      <fieldset>
                        <legend className="text-body text-paper/85">
                          Qual área técnica envolve o seu caso?
                        </legend>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {TRIAGE_AREAS.map((a) => (
                            <Choice
                              key={a.id}
                              selected={a.id === areaId}
                              onClick={() => {
                                setAreaId(a.id);
                                setSpecialty(UNKNOWN_SPECIALTY);
                              }}
                            >
                              {a.label}
                            </Choice>
                          ))}
                        </div>
                      </fieldset>

                      {area ? (
                        <fieldset>
                          <legend className="text-body text-paper/85">
                            Que tipo de perícia você precisa?
                          </legend>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {area.specialties.map((s) => (
                              <Choice
                                key={s}
                                selected={s === specialty}
                                onClick={() => setSpecialty(s)}
                              >
                                {s}
                              </Choice>
                            ))}
                          </div>
                        </fieldset>
                      ) : null}

                      <fieldset>
                        <legend className="text-body text-paper/85">
                          Em que momento está a questão?
                        </legend>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {STAGES.map((s) => (
                            <Choice
                              key={s.id}
                              selected={s.id === stage}
                              onClick={() => setStage(s.id)}
                            >
                              {s.label}
                            </Choice>
                          ))}
                        </div>
                      </fieldset>

                      {tried && (!areaId || !stage) ? (
                        <p role="alert" className="text-sm text-mint">
                          Escolha a área e o momento do caso para continuar.
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {step === 1 ? (
                    <div className="space-y-7">
                      <label className="block">
                        <span className="text-body text-paper/85">
                          {profile === "pj"
                            ? "Nome e empresa"
                            : "Como podemos te chamar?"}{" "}
                          <span className="text-paper/45">(opcional)</span>
                        </span>
                        <input
                          value={nome}
                          onChange={(e) =>
                            setNome(e.target.value.slice(0, 120))
                          }
                          autoComplete={
                            profile === "pj" ? "organization" : "name"
                          }
                          className="mt-3 block min-h-11 w-full rounded-xl border border-paper/15 bg-paper/[0.05] px-4 py-3 text-body text-paper placeholder:text-paper/35 focus:border-olive-light focus:outline-none"
                          placeholder={
                            profile === "pj"
                              ? "Ana Souza, Construtora Exemplo"
                              : "Seu nome"
                          }
                        />
                      </label>

                      <label className="block">
                        <span className="text-body text-paper/85">
                          Conte brevemente o que aconteceu
                        </span>
                        <textarea
                          value={relato}
                          onChange={(e) =>
                            setRelato(e.target.value.slice(0, RELATO_MAX))
                          }
                          rows={6}
                          aria-invalid={tried && !relatoOk}
                          aria-describedby={`${ids}-relato-ajuda`}
                          className="mt-3 block w-full resize-none rounded-xl border border-paper/15 bg-paper/[0.05] px-4 py-3 text-body leading-relaxed text-paper placeholder:text-paper/35 focus:border-olive-light focus:outline-none"
                          placeholder="O que ocorreu, quando, e o que já existe de laudo ou processo."
                        />
                        <span
                          id={`${ids}-relato-ajuda`}
                          className={cn(
                            "mt-2 flex justify-between gap-4 text-xs",
                            tried && !relatoOk ? "text-mint" : "text-paper/45",
                          )}
                        >
                          <span>
                            {tried && !relatoOk
                              ? `Escreva pelo menos ${RELATO_MIN} caracteres.`
                              : "Não inclua dados sensíveis de terceiros."}
                          </span>
                          <span>
                            {relato.length}/{RELATO_MAX}
                          </span>
                        </span>
                      </label>
                    </div>
                  ) : null}

                  {step === 2 && answers ? (
                    <Resultado answers={answers} />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ações */}
            <footer className="flex flex-col-reverse gap-3 border-t border-paper/10 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:flex-row sm:items-center sm:justify-between md:px-10">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="min-h-11 rounded-full px-5 py-3 text-sm text-paper/70 transition-colors hover:text-paper"
                >
                  ← Voltar
                </button>
              ) : (
                <span className="hidden sm:block" />
              )}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={advance}
                  className="min-h-11 rounded-full bg-paper px-7 py-3 text-sm font-medium text-ink transition-colors duration-300 hover:bg-mint"
                >
                  Continuar →
                </button>
              ) : answers ? (
                <div className="flex flex-col gap-3 sm:flex-row-reverse">
                  <a
                    href={getTriageWhatsAppUrl(triageMessage(answers))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-olive px-7 py-3 text-sm font-semibold text-dark transition-colors duration-300 hover:bg-olive-light"
                  >
                    Enviar ao Alan pelo WhatsApp ↗
                  </a>
                  <a
                    href="#contato"
                    onClick={() => {
                      prefillContact(triageMessage(answers), {
                        area: TRIAGE_AREAS.find((a) => a.id === answers.areaId)
                          ?.label,
                        caso: answers.specialty,
                      });
                      close();
                    }}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-paper/[0.07] px-6 py-3 text-sm text-paper transition-colors duration-300 hover:bg-paper/[0.14]"
                  >
                    Prefiro o formulário
                  </a>
                </div>
              ) : null}
            </footer>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Etapa final: síntese, próximos passos e estimativa. */
function Resultado({
  answers,
}: {
  answers: Parameters<typeof triageMessage>[0];
}) {
  const areaLabel = TRIAGE_AREAS.find((a) => a.id === answers.areaId)?.label;
  const stageLabel = STAGES.find((s) => s.id === answers.stage)?.label;
  const { service, range } = estimate(answers.areaId, answers.stage);
  const { steps, docs } = nextSteps(answers);

  return (
    <div className="space-y-8">
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        {[
          ["Área", areaLabel],
          ["Tipo de perícia", answers.specialty],
          ["Situação", stageLabel],
          ["Perfil", PROFILE_LABEL[answers.profile]],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-paper/45">{k}</dt>
            <dd className="mt-0.5 text-paper">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="rounded-2xl bg-paper/[0.06] p-5 md:p-6">
        <Mono className="text-paper/50">Estimativa prévia</Mono>
        <p className="mt-3 text-body text-paper">{service}</p>
        <p className="mt-1 text-lead font-light text-olive-light">
          {range ?? "Orçamento após a leitura do caso"}
        </p>
        <p className="mt-3 text-xs leading-normal text-paper/50">
          Referência preliminar, não constitui proposta. O valor final depende
          do volume de documentos, da complexidade técnica e da necessidade de
          diligência.
        </p>
      </section>

      <section>
        <Mono className="text-paper/50">Próximos passos</Mono>
        <ol className="mt-4 space-y-3">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-4 text-body text-paper/85">
              <span className="mt-[3px] w-5 shrink-0 font-mono text-mono text-olive-light">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <Mono className="text-paper/50">Documentos para separar</Mono>
        <ul className="mt-4 space-y-2">
          {docs.map((d) => (
            <li key={d} className="flex gap-3 text-sm text-paper/75">
              <span
                aria-hidden
                className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-olive-light"
              />
              {d}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
