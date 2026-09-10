import { cn } from "@/lib/utils";

/**
 * Filete de 1px com um brilho que o percorre lentamente — marca as
 * divisões estruturais sem pesar no layout.
 */
export default function GlowRule({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const base = tone === "dark" ? "bg-paper/15" : "bg-ink/10";
  const sheen =
    tone === "dark"
      ? "rgba(207, 227, 180, 0.85)"
      : "rgba(58, 71, 40, 0.55)";

  return (
    <div aria-hidden className={cn("relative h-px w-full overflow-hidden", base, className)}>
      <span
        className="absolute inset-y-0 left-0 w-full animate-[rule-sweep_7s_linear_infinite]"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent 0%, ${sheen} 50%, transparent 100%)`,
          backgroundSize: "38% 100%",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
