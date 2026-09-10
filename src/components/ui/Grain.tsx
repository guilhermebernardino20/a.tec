/**
 * Granulado de filme sobre toda a aplicação — dá textura tátil e
 * editorial às superfícies chapadas. Puro CSS/SVG, sem custo de runtime.
 */
const NOISE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
     <filter id="n">
       <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/>
     </filter>
     <rect width="240" height="240" filter="url(#n)"/>
   </svg>`,
)}`;

export default function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.035] mix-blend-multiply"
      style={{
        backgroundImage: `url("${NOISE}")`,
        backgroundSize: "240px 240px",
      }}
    />
  );
}
