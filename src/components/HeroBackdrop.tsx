"use client";

import { useEffect, useRef } from "react";

/**
 * Fundo do herói: lâminas curvas e lustrosas que giram lentamente, com
 * profundidade de campo e um fio de luz especular nas quinas — o mesmo
 * papel do loop de vídeo da referência, aqui gerado em WebGL na paleta
 * da a.tec (verde profundo, oliva, sage e creme).
 *
 * Sem dependências: quad em tela cheia + shader. Cai para um gradiente
 * estático se o WebGL não estiver disponível.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;

out vec4 fragColor;

// ---- paleta a.tec -----------------------------------------------------
const vec3 VOID   = vec3(0.020, 0.047, 0.031); // verde quase preto
const vec3 DEEP   = vec3(0.047, 0.113, 0.070);
const vec3 FOREST = vec3(0.086, 0.243, 0.133);
const vec3 OLIVE  = vec3(0.227, 0.278, 0.157); // #3A4728 — verde da marca
const vec3 SAGE   = vec3(0.788, 0.796, 0.745); // #C9CBBE
const vec3 CREAM  = vec3(0.937, 0.929, 0.898);
const vec3 KHAKI  = vec3(0.667, 0.510, 0.310); // faixa quente, como o bronze da referência

mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

/** Distância assinada a um arco amplo — a "lâmina" curva do render. */
float arc(vec2 p, float angle, vec2 center, vec2 scale, float radius, float wobble) {
  vec2 q = rot(angle) * (p - center);
  float r = length(q * scale);
  float w = (noise(q * 0.42 + uTime * 0.015) - 0.5) * wobble;
  return r - (radius + w);
}

/** Sombreado lustroso: claro do lado da luz, fundo no lado oposto. */
vec3 gloss(vec2 p, vec2 center, float angle, vec3 dark, vec3 light, float power) {
  vec2 q = rot(angle) * (p - center);
  float lambert = clamp(dot(normalize(q + 1e-5), normalize(vec2(0.72, 0.7))) * 0.5 + 0.5, 0.0, 1.0);
  return mix(dark, light, pow(lambert, power));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;

  float t = uTime * 0.05;
  // enquadramento macro: as formas são maiores que o quadro
  vec2 p = uv * 0.8 + uPointer * 0.04;
  p = rot(sin(t * 0.3) * 0.06) * p;

  // --- 1. campo de base: verde profundo à esquerda, luz à direita ----
  float sweep = smoothstep(-1.1, 1.25, p.x * 0.85 + p.y * 0.45 + sin(t * 0.5) * 0.12);
  vec3 col = mix(FOREST, mix(SAGE, CREAM, 0.28), sweep);
  col = mix(col, DEEP, smoothstep(0.2, -1.1, p.x + p.y * 0.3) * 0.85);

  // massa verde fora de foco no alto à esquerda
  vec2 lobeC = vec2(-0.85 + sin(t * 0.37) * 0.1, 0.95 + cos(t * 0.29) * 0.08);
  float lobe = 1.0 - smoothstep(0.1, 1.5, length((p - lobeC) * vec2(0.9, 1.05)));
  col = mix(col, mix(FOREST, OLIVE, 0.55), smoothstep(0.0, 1.0, lobe) * 0.8);

  // --- 2. lente escura: a concavidade central, quase preta ----------
  float dLens = arc(p, 0.62 + sin(t * 0.31) * 0.05,
                    vec2(-0.15 + cos(t * 0.24) * 0.08, 0.35), vec2(1.0, 0.66), 0.92, 0.16);
  float lens = smoothstep(0.12, -0.22, dLens);
  vec3 lensCol = gloss(p, vec2(-0.15, 0.35), 0.62, VOID, FOREST * 1.25, 1.6);
  col = mix(col, lensCol, lens);

  // --- 3. fita quente que varre o quadro (o "bronze" da referência) --
  float angleW = 2.05 + sin(t * 0.27) * 0.035;
  vec2 centerW = vec2(0.55, -1.35 + sin(t * 0.21) * 0.08);
  float dWarm = arc(p, angleW, centerW, vec2(1.0, 0.6), 1.58, 0.07);
  float band = smoothstep(0.4, 0.2, abs(dWarm));
  vec3 warmCol = gloss(p, centerW, angleW, KHAKI * 0.45, mix(KHAKI, CREAM, 0.38), 1.05);
  col = mix(col, warmCol, band * 0.97);
  // sombra rente à quina interna + fio de luz na quina externa
  col = mix(col, VOID * 0.7, smoothstep(0.4, 0.34, abs(dWarm)) * 0.7);
  col += vec3(1.0, 0.98, 0.92) * exp(-abs(dWarm + 0.34) * 260.0) * 0.75
         * smoothstep(-1.2, 0.1, p.x) * smoothstep(1.5, 0.5, p.x);

  // --- 4. lâmina frontal escura, ancorando a base ------------------
  float dFront = arc(p, -1.3 + cos(t * 0.19) * 0.04,
                     vec2(-0.5, 1.72 + cos(t * 0.17) * 0.07), vec2(1.0, 0.8), 1.6, 0.1);
  float front = smoothstep(0.05, -0.3, dFront);
  col = mix(col, gloss(p, vec2(-0.5, 1.72), -1.3, VOID * 0.85, OLIVE * 1.1, 1.7), front * 0.98);
  col += vec3(0.72, 0.8, 0.66) * exp(-abs(dFront) * 260.0) * 0.28
         * smoothstep(-0.9, 0.5, p.x);

  // --- 5. acabamento ------------------------------------------------
  float vig = smoothstep(2.1, 0.45, length(uv * vec2(0.66, 1.0)));
  col *= mix(0.7, 1.0, vig);
  // assenta o texto branco no canto inferior esquerdo
  col = mix(col, VOID, smoothstep(0.0, 1.3, -uv.x - uv.y * 0.35) * 0.55);
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.014;

  fragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function HeroBackdrop({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });

    if (!gl) {
      // fallback: gradiente estático, na mesma família cromática
      canvas.style.background =
        "radial-gradient(120% 90% at 78% 18%, #6e8a5b 0%, #2c3a23 45%, #0b160e 100%)";
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uPointer = gl.getUniformLocation(program, "uPointer");

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let running = true;
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // meia resolução: a imagem é suave, ninguém percebe — e economiza GPU
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * 0.62;
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    const render = (now: number) => {
      const t = reduced ? 8 : (now - start) / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!reduced && running) raf = requestAnimationFrame(render);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = 1 - (e.clientY / window.innerHeight) * 2;
    };

    resize();
    raf = requestAnimationFrame(render);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) requestAnimationFrame(render);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === running) return;
        running = entry.isIntersecting;
        if (running && !reduced) raf = requestAnimationFrame(render);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
