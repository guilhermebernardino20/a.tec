"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type Split = "lines" | "words";

/**
 * Revelação editorial por máscara: cada linha (ou palavra) nasce fora do
 * quadro e sobe de `y: 100%` para `0%` atrás de um `overflow-hidden`.
 *
 * O observador fica no contêiner, nunca na peça mascarada — dentro da
 * máscara a razão de interseção é sempre zero e a animação não dispara.
 */
export default function TextReveal({
  text,
  lines,
  split = "lines",
  as: Tag = "span",
  className,
  pieceClassName,
  trigger = "view",
  delay = 0,
  stagger = 0.08,
  duration = 1.1,
}: {
  /** texto corrido — quebrado conforme `split` */
  text?: string;
  /** ou as linhas já definidas pelo layout */
  lines?: string[];
  split?: Split;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
  pieceClassName?: string;
  trigger?: "view" | "mount";
  delay?: number;
  stagger?: number;
  duration?: number;
}) {
  const pieces =
    lines ?? (split === "words" ? (text ?? "").split(" ") : [text ?? ""]);
  const inline = split === "words" && !lines;

  const piece: Variants = {
    hidden: { y: "100%" },
    show: (i: number) => ({
      y: "0%",
      transition: { duration, ease: EASE, delay: delay + stagger * i },
    }),
  };

  return (
    <Tag className={cn(inline ? "inline" : "block", className)}>
      <motion.span
        className={inline ? "inline" : "block"}
        initial="hidden"
        {...(trigger === "mount"
          ? { animate: "show" as const }
          : {
              whileInView: "show" as const,
              viewport: { once: true, amount: 0.3 },
            })}
      >
        {pieces.map((text, i) => (
          <span
            key={`${text}-${i}`}
            className={cn(
              "overflow-hidden pb-[0.06em]",
              inline ? "inline-block align-bottom" : "block",
            )}
          >
            <motion.span
              className={cn(inline ? "inline-block" : "block", pieceClassName)}
              variants={piece}
              custom={i}
            >
              {text}
              {inline && i < pieces.length - 1 ? " " : null}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
