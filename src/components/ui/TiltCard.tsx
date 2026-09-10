"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Cartão com inclinação 3D: o cursor comanda `rotateX`/`rotateY` através
 * de molas, e um bisel de luz esmeralda acompanha o ponteiro na borda.
 * Sob movimento reduzido, fica plano.
 */
export default function TiltCard({
  children,
  className,
  intensity = 7,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  /** amplitude máxima da inclinação, em graus */
  intensity?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 150, damping: 18, mass: 0.4 };
  const rotateX = useSpring(
    useTransform(py, [0, 1], [intensity, -intensity]),
    spring,
  );
  const rotateY = useSpring(
    useTransform(px, [0, 1], [-intensity, intensity]),
    spring,
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduced) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
    el.style.setProperty("--tilt-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--tilt-y", `${e.clientY - rect.top}px`);
  };

  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    ref.current?.style.setProperty("--tilt-glare", "0");
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => ref.current?.style.setProperty("--tilt-glare", "1")}
      onMouseLeave={onLeave}
      style={
        reduced
          ? undefined
          : ({
              rotateX,
              rotateY,
              transformPerspective: 1100,
              transformStyle: "preserve-3d",
              "--tilt-glare": 0,
            } as React.CSSProperties)
      }
      className={cn("relative isolate", className)}
    >
      {glare ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-[var(--tilt-glare,0)] transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(360px circle at var(--tilt-x, 50%) var(--tilt-y, 50%), rgba(255,255,255,0.14), transparent 62%)",
          }}
        />
      ) : null}
      {children}
    </motion.div>
  );
}
