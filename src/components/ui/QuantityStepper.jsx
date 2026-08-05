/**
 * QuantityStepper — − / qty / + with 44px+ touch targets.
 */
export default function QuantityStepper({ qty, onChange, min = 1, compact = false }) {
  const size = compact ? 'h-9 w-9' : 'h-11 w-11';

  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label="Quantity selector">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, qty - 1))}
        disabled={qty <= min}
        aria-label="Decrease quantity"
        className={`${size} inline-flex items-center justify-center rounded-full border-2 border-maroon/15 font-heading text-lg font-bold text-maroon transition-all active:scale-90 disabled:cursor-not-allowed disabled:opacity-30`}
      >
        −
      </button>
      <span className="min-w-8 text-center font-heading text-lg font-bold text-maroon" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label="Increase quantity"
        className={`${size} inline-flex items-center justify-center rounded-full bg-brand-gradient font-heading text-lg font-bold text-white shadow-glow transition-all active:scale-90`}
      >
        +
      </button>
    </div>
  );
}