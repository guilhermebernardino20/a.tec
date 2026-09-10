import Mono from "@/components/ui/Mono";

/**
 * Cartão de credibilidade do herói: as quatro frentes periciais e a nota
 * de posicionamento. Conteúdo estático — nenhum estado, nenhum efeito.
 */
const FRENTES = [
  { index: "01", label: "Perícia Médica & Valoração do Dano" },
  { index: "02", label: "Psicologia Jurídica & Apuração" },
  { index: "03", label: "Engenharia Diagnóstica" },
  { index: "04", label: "Avaliações Imobiliárias Complexas" },
] as const;

export default function EditorialBadgePanel() {
  return (
    <aside className="space-y-6 rounded-2xl border border-white/10 bg-neutral-900/60 p-6 shadow-2xl backdrop-blur-md md:p-8">
      <Mono className="block text-[10px] tracking-widest text-[#7F9970]">
        [&nbsp;Áreas de atuação pericial&nbsp;]
      </Mono>

      <ul className="divide-y divide-white/10">
        {FRENTES.map((frente) => (
          <li key={frente.index} className="flex items-baseline gap-4 py-4 first:pt-0">
            <span className="font-mono text-[11px] text-neutral-500">{frente.index}.</span>
            <span className="text-base leading-snug text-neutral-200">{frente.label}</span>
          </li>
        ))}
      </ul>

      <p className="border-t border-white/10 pt-6 text-sm leading-relaxed text-neutral-400">
        Atuação técnica focada na construção de quesitos imbatíveis e
        impugnação de laudos.
      </p>
    </aside>
  );
}
