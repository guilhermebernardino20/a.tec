"use client";

import { useEffect, useRef } from "react";

type Node = {
  /** posição em espaço normalizado (-1..1), com profundidade */
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  r: number;
  /** 0 = campo jurídico · 1 = campo técnico */
  side: 0 | 1;
};

const COUNT = 82;
const LINK_DIST = 0.34; // em espaço normalizado
const POINTER_RADIUS = 0.42;
const LINK_RGB = "127, 153, 112";

/**
 * Rede de nós sobre o herói: a ponte entre o processo e a técnica.
 *
 * Física simples em espaço normalizado, projetada em perspectiva:
 * — o cursor atrai os nós próximos e acelera a rotação do conjunto;
 * — o scroll empurra a câmera para dentro da nuvem (parallax de profundidade).
 *
 * Pausa fora da viewport e congela sob `prefers-reduced-motion`.
 */
export default function HeroCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // sem cursor não há o que perseguir: no toque a rede fica mais enxuta
    // e não assina eventos de ponteiro
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const count = small ? 42 : COUNT;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let rotation = 0;
    let spin = 0.02; // velocidade-base de rotação
    let depth = 0; // avanço da câmera, guiado pelo scroll
    let scrollTarget = 0;

    const pointer = { x: 0, y: 0, active: false };

    const nodes: Node[] = Array.from({ length: count }, (_, i) => ({
      x: (Math.random() * 2 - 1) * 1.15,
      y: (Math.random() * 2 - 1) * 1.15,
      z: Math.random() * 2 - 1,
      vx: (Math.random() - 0.5) * 0.0016,
      vy: (Math.random() - 0.5) * 0.0016,
      r: Math.random() * 1.1 + 0.7,
      side: (i % 3 === 0 ? 1 : 0) as 0 | 1,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onScroll = () => {
      const rect = canvas.getBoundingClientRect();
      const span = rect.height + window.innerHeight;
      // 0 no topo do herói, 1 quando ele termina de sair da tela
      scrollTarget = Math.min(1.6, Math.max(0, (window.innerHeight - rect.top) / span));
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointer.x = nx * (rect.width / rect.height) * 0.5;
      pointer.y = ny * 0.5;
      pointer.active =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    // projeção em perspectiva: z e o avanço da câmera definem a escala
    const project = (n: Node) => {
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      const rx = n.x * cos - n.z * sin;
      const rz = n.x * sin + n.z * cos;
      const camera = 2.4 - depth * 1.35;
      const scale = camera / Math.max(0.35, camera + rz);
      const unit = Math.min(width, height) * 0.62;
      return {
        sx: width / 2 + rx * unit * scale,
        sy: height / 2 + n.y * unit * scale,
        scale,
        rx,
        rz,
      };
    };

    const frame = () => {
      // suaviza a resposta ao scroll e ao cursor
      depth += (scrollTarget - depth) * 0.06;
      const targetSpin = pointer.active ? 0.075 : 0.02;
      spin += (targetSpin - spin) * 0.04;
      if (!reduced) rotation += spin * 0.016;

      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
        }

        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < POINTER_RADIUS && d > 0.001) {
            const pull = (1 - d / POINTER_RADIUS) * 0.012;
            n.x += dx * pull;
            n.y += dy * pull;
          }
        }

        // mundo toroidal: nada some nas bordas
        if (n.x < -1.25) n.x = 1.25;
        if (n.x > 1.25) n.x = -1.25;
        if (n.y < -1.25) n.y = 1.25;
        if (n.y > 1.25) n.y = -1.25;
      }

      const projected = nodes.map(project);

      // conexões
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const pa = projected[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = (a.z - b.z) * 0.5;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 > LINK_DIST * LINK_DIST) continue;

          const pb = projected[j];
          const t = 1 - Math.sqrt(d2) / LINK_DIST;
          const bridge = a.side !== b.side; // liga os dois campos
          const alpha = t * 0.25 * (bridge ? 1.35 : 0.8) * Math.min(1, pa.scale);

          ctx.strokeStyle = `rgba(${LINK_RGB}, ${alpha.toFixed(3)})`;
          ctx.lineWidth = bridge ? 0.8 : 0.55;
          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.stroke();
        }
      }

      // ligação viva com o cursor
      if (pointer.active) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const d = Math.hypot(pointer.x - n.x, pointer.y - n.y);
          if (d > POINTER_RADIUS) continue;
          const p = projected[i];
          ctx.strokeStyle = `rgba(198, 212, 191, ${((1 - d / POINTER_RADIUS) * 0.3).toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(width / 2 + pointer.x * Math.min(width, height) * 0.62, height / 2 + pointer.y * Math.min(width, height) * 0.62);
          ctx.lineTo(p.sx, p.sy);
          ctx.stroke();
        }
      }

      // nós
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const p = projected[i];
        const radius = n.r * p.scale;
        if (radius < 0.15) continue;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle =
          n.side === 1
            ? `rgba(198, 212, 191, ${(0.62 * Math.min(1, p.scale)).toFixed(3)})`
            : `rgba(127, 153, 112, ${(0.5 * Math.min(1, p.scale)).toFixed(3)})`;
        ctx.fill();
      }

      if (running) raf = requestAnimationFrame(frame);
    };

    resize();
    onScroll();
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === running) return;
        running = entry.isIntersecting;
        if (running) raf = requestAnimationFrame(frame);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    window.addEventListener("scroll", onScroll, { passive: true });
    if (!coarse) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
