/**
 * DiscountStar  -  many-pointed burst badge for offer images.
 * Bright yellow star with the discount percentage in bold red.
 */
function burstPoints(points = 12, outerR = 50, innerR = 42) {
  const pts = [];
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? outerR : innerR;
    const deg = (i * 180) / points - 90;
    const rad = (deg * Math.PI) / 180;
    pts.push(`${(50 + r * Math.cos(rad)).toFixed(2)}% ${(50 + r * Math.sin(rad)).toFixed(2)}%`);
  }
  return pts.join(',');
}

const STAR_CLIP = `polygon(${burstPoints(12, 50, 42)})`;

export default function DiscountStar({ percent, className = '' }) {
  return (
    <span
      aria-label={`${percent}% off`}
      className={`pointer-events-none absolute right-2.5 top-2.5 z-10 inline-flex items-center justify-center sm:right-3 sm:top-3 ${className}`}
      style={{
        width: 78,
        height: 78,
        background: '#FFD500',
        clipPath: STAR_CLIP,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))',
      }}
    >
      <span className="-mt-1 font-heading text-base font-extrabold leading-none text-[#D32F2F] sm:text-lg">
        -{percent}%
      </span>
    </span>
  );
}