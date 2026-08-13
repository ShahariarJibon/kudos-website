import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * TestimonialSlider  -  auto-playing, manually swipeable testimonial carousel.
 * Features: arrow buttons, dots, touch drag, keyboard accessible.
 */
export default function TestimonialSlider({ items, autoInterval = 6000 }) {
  const [[index, dir], setIndex] = useState([0, 0]);
  const reduce = useReducedMotion();
  const timer = useRef(null);

  const go = useCallback(
    (next, direction = next > index ? 1 : -1) => {
      setIndex([((next % items.length) + items.length) % items.length, direction]);
    },
    [index, items.length]
  );

  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);

  const restartTimer = useCallback(() => {
    if (reduce) return;
    clearInterval(timer.current);
    timer.current = setInterval(next, autoInterval);
  }, [next, autoInterval, reduce]);

  useEffect(() => {
    restartTimer();
    return () => clearInterval(timer.current);
  }, [restartTimer]);

  const item = items[index];

  return (
    <div className="relative mx-auto max-w-3xl" aria-roledescription="carousel" aria-label="Customer testimonials">
      <div
        className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-card ring-1 ring-maroon/5 sm:p-12"
        onMouseEnter={() => clearInterval(timer.current)}
        onMouseLeave={restartTimer}
      >
        {/* Quote mark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 left-6 font-heading text-8xl font-black text-orange/15"
        >
          &ldquo;
        </span>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.figure
            key={index}
            custom={dir}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            drag={reduce ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) next();
              else if (info.offset.x > 60) prev();
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <blockquote className="text-lg leading-relaxed text-neutral-800 sm:text-xl">
              &ldquo;{item.text}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-4">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient font-heading text-lg font-bold text-white"
              >
                {item.name.charAt(0)}
              </span>
              <div>
                <p className="font-heading font-bold text-maroon">{item.name}</p>
                <p className="text-sm text-neutral-500">{item.role} · {item.branch}</p>
              </div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => {
            prev();
            restartTimer();
          }}
          aria-label="Previous testimonial"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-maroon/15 text-maroon transition-all hover:border-orange hover:bg-orange hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Choose testimonial">
          {items.map((t, i) => (
            <button
              key={t.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show testimonial ${i + 1} of ${items.length}`}
              onClick={() => {
                go(i, i > index ? 1 : -1);
                restartTimer();
              }}
              className="flex h-11 items-center"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === index ? 'h-2.5 w-8 bg-brand-gradient' : 'h-2.5 w-2.5 bg-maroon/20'
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            next();
            restartTimer();
          }}
          aria-label="Next testimonial"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-maroon/15 text-maroon transition-all hover:border-orange hover:bg-orange hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}