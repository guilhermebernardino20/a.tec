import { cn } from "@/lib/utils";

/**
 * Borda de 1px percorrida por um feixe esmeralda, em intervalos
 * defasados — dá a leitura de circuito ativo na malha do grid.
 */
export default function ScanEdge({
  orientation = "x",
  delay = 0,
  duration = 6,
  className,
}: {
  orientation?: "x" | "y";
  /** defasagem em segundos, para as bordas não pulsarem em uníssono */
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const horizontal = orientation === "x";

  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute overflow-hidden",
        horizontal ? "inset-x-0 top-0 h-px" : "inset-y-0 left-0 w-px",
        className,
      )}
    >
      <span
        className={cn("block", horizontal ? "h-px w-[42%]" : "h-[42%] w-px")}
        style={{
          animation: `${horizontal ? "scan-x" : "scan-y"} ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s infinite`,
          background: horizontal
            ? "linear-gradient(90deg, transparent, #7F9970, transparent)"
            : "linear-gradient(180deg, transparent, #7F9970, transparent)",
        }}
      />
    </span>
  );
}
