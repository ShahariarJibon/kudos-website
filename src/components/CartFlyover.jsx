import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useCart } from '../context/CartContext';

/**
 * CartFlyover  -  micro fly-to-cart animation.
 * A small brand-colored circle travels from the tapped item to the navbar cart badge.
 */
export default function CartFlyover() {
  const { fly } = useCart();
  const [particle, setParticle] = useState(null);
  const mounted = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!fly || reduce) return;
    const badge = document.getElementById('cart-badge');
    const to = badge
      ? {
          x: badge.getBoundingClientRect().left + badge.getBoundingClientRect().width / 2,
          y: badge.getBoundingClientRect().top + badge.getBoundingClientRect().height / 2,
        }
      : { x: window.innerWidth - 36, y: 24 };
    setParticle({ id: fly.ts, from: fly.from, to, dx: to.x - fly.from.x, dy: to.y - fly.from.y });
  }, [fly, reduce]);

  if (!mounted.current || reduce) return null;

  return createPortal(
    <AnimatePresence>
      {particle && (
        <motion.span
          key={particle.id}
          aria-hidden="true"
          className="pointer-events-none fixed z-[95] block h-5 w-5 rounded-full bg-brand-gradient shadow-glow"
          style={{ top: particle.from.y - 10, left: particle.from.x - 10 }}
          initial={{ x: 0, y: 0, scale: 0.5, opacity: 1 }}
          animate={{ x: particle.dx, y: particle.dy, scale: 0.35, opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => setParticle(null)}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}