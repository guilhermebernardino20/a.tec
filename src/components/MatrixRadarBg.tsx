/**
 * Fundo tático do painel da Matrix: anéis concêntricos, eixos e um feixe
 * de radar girando. Puro SVG + CSS — sem estado, sem rAF, e a rotação
 * roda no compositor.
 */
export default function MatrixRadarBg({ active = false }: { active?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    >
      <defs>
        <linearGradient id="matrix-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7F9970" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#7F9970" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* grade: anéis e eixos */}
      <g fill="none" stroke="#7F9970" strokeOpacity="0.045" strokeWidth="0.4">
        {[46, 86, 126].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} />
        ))}
        <line x1="-40" y1="100" x2="240" y2="100" />
        <line x1="100" y1="-40" x2="100" y2="240" />
      </g>

      {/* feixe */}
      <g
        style={{
          transformOrigin: "100px 100px",
          animation: `radar-spin ${active ? 5 : 16}s linear infinite`,
          willChange: "transform",
        }}
      >
        <path d="M100 100 L100 -20 A120 120 0 0 1 185 35 Z" fill="url(#matrix-sweep)" />
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="-20"
          stroke="#A3B899"
          strokeOpacity="0.07"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
}
