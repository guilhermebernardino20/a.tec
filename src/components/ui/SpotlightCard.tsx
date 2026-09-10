"use client";

import { useCallback, useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

/**
 * Cartão com holofote de cursor: um gradiente radial verde a.tec segue o
 * ponteiro sobre a superfície. A posição é escrita direto em CSS vars,
 * dentro de um rAF — nenhum re-render por movimento de mouse.
 */
export default function SpotlightCard({
  children,
  className,
  as: Tag = "div",
  tone = "light",
  size = 420,
  strength = 0.15,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** `light` para superfícies claras, `dark` para as escuras */
  tone?: Tone;
  size?: number;
  strength?: number;
} & Omit<React.ButtonHTMLAttributes<HTMLElement>, "color">) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || frame.current) return;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${clientX - rect.left}px`);
      el.style.setProperty("--spot-y", `${clientY - rect.top}px`);
    });
  }, []);

  const setVisible = useCallback((v: number) => {
    ref.current?.style.setProperty("--spot-opacity", String(v));
  }, []);

  // no claro o verde entra como sombra suave; no escuro, como luz
  const color =
    tone === "dark"
      ? `rgba(163, 184, 153, ${strength * 1.35})`
      : `rgba(127, 153, 112, ${strength})`;

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setVisible(1)}
      onMouseLeave={() => setVisible(0)}
      className={cn("group/spot relative isolate", className)}
      style={{ "--spot-opacity": 0 } as React.CSSProperties}
      {...rest}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[var(--spot-opacity,0)] transition-opacity duration-500"
        style={{
          background: `radial-gradient(${size}px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${color}, transparent 70%)`,
        }}
      />
      {children}
    </Tag>
  );
}
