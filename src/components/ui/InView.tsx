"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const TAGS = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  header: motion.header,
  figure: motion.figure,
} as const;

export const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

/** Bloco que revela os filhos em cascata ao entrar na viewport. */
export function InViewGroup({
  children,
  className,
  as = "div",
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  as?: keyof typeof TAGS;
  amount?: number;
}) {
  const Tag = TAGS[as];
  return (
    <Tag
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </Tag>
  );
}

/** Item de uma cascata (ou reveal isolado, com `standalone`). */
export function InViewItem({
  children,
  className,
  as = "div",
  standalone = false,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: keyof typeof TAGS;
  standalone?: boolean;
  delay?: number;
}) {
  const Tag = TAGS[as];
  return (
    <Tag
      className={cn(className)}
      variants={itemVariants}
      transition={delay ? { duration: 1, ease: EASE, delay } : undefined}
      {...(standalone
        ? {
            initial: "hidden" as const,
            whileInView: "show" as const,
            viewport: { once: true, amount: 0.25 },
          }
        : {})}
    >
      {children}
    </Tag>
  );
}

/**
 * Título revelado linha a linha por baixo de uma máscara.
 * O observador fica no contêiner: a máscara `overflow-hidden` zeraria
 * a razão de interseção da linha deslocada.
 */
export function MaskLines({
  lines,
  className,
  lineClassName,
  trigger = "view",
  startDelay = 0,
  step = 0.075,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  trigger?: "view" | "mount";
  startDelay?: number;
  step?: number;
}) {
  const line: Variants = {
    hidden: { y: "115%" },
    show: (i: number) => ({
      y: 0,
      transition: { duration: 1.15, ease: EASE, delay: startDelay + step * i },
    }),
  };

  return (
    <motion.span
      className={cn("block", className)}
      initial="hidden"
      {...(trigger === "mount"
        ? { animate: "show" as const }
        : {
            whileInView: "show" as const,
            viewport: { once: true, amount: 0.35 },
          })}
    >
      {lines.map((text, i) => (
        <span
          key={`${text}-${i}`}
          className="block overflow-hidden pb-[0.04em]"
        >
          <motion.span
            className={cn("block", lineClassName)}
            variants={line}
            custom={i}
          >
            {text}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
