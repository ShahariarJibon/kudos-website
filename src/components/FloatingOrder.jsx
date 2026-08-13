import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SITE } from '../data/site';

/**
 * FloatingOrder  -  sticky bottom "Order Now" bar for mobile,
 * appears after scrolling past the hero. Desktop uses the nav CTA instead.
 */
export default function FloatingOrder() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 lg:hidden"
          initial={reduce ? false : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? undefined : { y: 80, opacity: 0 }}
          transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto max-w-md rounded-2xl bg-white/95 p-2.5 shadow-card ring-1 ring-maroon/10 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div className="pl-3">
                <p className="font-heading text-sm font-bold text-maroon">KUDOS</p>
                <p className="text-xs text-neutral-500">Craving something?</p>
              </div>
              <a
                href={SITE.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand !min-h-[48px]"
                aria-label="Order Now on the KUDOS ordering platform"
              >
                Order Now
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}