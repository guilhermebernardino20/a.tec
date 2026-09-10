"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Deslocamento sutil conforme a seção atravessa a viewport. Como o Lenis
 * roda no scroll nativo, `useScroll` lê a mesma posição — os dois andam
 * juntos sem sincronização extra.
 */
export default function Parallax({
  children,
  className,
  /** deslocamento total em px ao longo da travessia (negativo = sobe) */
  distance = -60,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  as?: "div" | "figure" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-distance / 2, distance / 2]);

  const Tag = motion[as];

  return (
    <Tag
      ref={ref}
      className={cn(className)}
      style={reduced ? undefined : { y, willChange: "transform" }}
    >
      {children}
    </Tag>
  );
}
