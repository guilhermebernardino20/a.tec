import { cn } from "@/lib/utils";
import Mono from "@/components/ui/Mono";

/** Indicador de disponibilidade — LED verde com halo pulsante. */
export default function StatusLed({
  className,
  label = "Equipe técnica disponível",
  tone = "dark",
}: {
  className?: string;
  label?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-2 w-2 place-items-center">
        <span className="absolute inset-0 rounded-full bg-lime animate-[led-halo_2.6s_ease-out_infinite]" />
        <span className="relative h-2 w-2 rounded-full bg-lime animate-[led-pulse_2.6s_ease-in-out_infinite]" />
      </span>
      <Mono className={tone === "dark" ? "text-paper/70" : "text-ink-mute"}>{label}</Mono>
    </span>
  );
}
