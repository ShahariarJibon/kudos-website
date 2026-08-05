import { useState } from 'react';

/**
 * AutoCarousel — GPU-friendly infinite marquee.
 * - Pauses on hover / focus / touch (interaction).
 * - Reduced motion: renders static scrollable row (no animation).
 */
export default function AutoCarousel({ children, ariaLabel = 'Food showcase', duration = 40 }) {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [paused, setPaused] = useState(false);

  const pauseHandlers = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
    onTouchStart: () => setPaused(true),
    onTouchEnd: () => setPaused(false),
  };

  if (reduce) {
    return (
      <div className="overflow-x-auto py-5 -my-5 pb-5" role="region" aria-label={ariaLabel}>
        <div className="flex w-max gap-5 pr-5">{children}</div>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="group overflow-hidden py-5 -my-5"
      {...pauseHandlers}
    >
      <div
        className="flex w-max animate-marquee gap-5 pr-5"
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}