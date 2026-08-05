import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import LazyImage from './ui/LazyImage';
import { useCart } from '../context/CartContext';

/**
 * MenuCard — hover lift/shadow/image zoom on desktop; tap feedback on mobile.
 * The "+" button NEVER navigates: if a cart order method is set and the item
 * is already in the cart it adds +1 instantly; otherwise it opens the item
 * sheet (first add prompts for Delivery/Pickup once, cart-level).
 */
export default function MenuCard({ item, index = 0, showCategory = false }) {
  const reduce = useReducedMotion();
  const { cart, openItem, addItem, lastAdded } = useCart();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (lastAdded && lastAdded.name === item.name) {
      setChecked(true);
      const t = setTimeout(() => setChecked(false), 900);
      return () => clearTimeout(t);
    }
  }, [lastAdded]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (cart.orderMethod) {
      // Order method already chosen once — subsequent + taps add instantly
      addItem(item, { qty: 1, sourceRect: rect });
    } else {
      // First add — open the sheet to pick Delivery/Pickup once (cart-level)
      openItem(item, rect);
    }
  };

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -8 }}
      whileTap={{ scale: 0.97 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-maroon/5 transition-shadow duration-300 hover:shadow-glow"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <LazyImage
          src={item.image}
          alt={`${item.name} — KUDOS`}
          className="h-full w-full"
          imgClassName="transition-transform duration-500 group-hover:scale-110"
          width={600}
          height={450}
        />
      </div>
      <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          {showCategory && (
            <span className="mb-1 inline-block font-heading text-[11px] font-semibold uppercase tracking-widest text-orange">
              {item.category}
            </span>
          )}
          <h3 className="truncate font-heading text-base font-bold text-maroon sm:text-lg">
            {item.name}
          </h3>
          {item.price && (
            <span className="font-heading text-sm font-bold tracking-wide text-orange">{item.price}</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          aria-label={checked ? `${item.name} added to cart` : `Add ${item.name} to cart`}
          aria-live="polite"
          disabled={checked}
          className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 active:scale-90 ${
            checked
              ? 'bg-brand-gradient text-white shadow-glow'
              : 'bg-orange/10 text-maroon group-hover:bg-brand-gradient group-hover:text-white group-hover:shadow-glow'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {checked ? (
              <motion.span
                key="check"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.span>
            ) : (
              <motion.span
                key="plus"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center justify-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.article>
  );
}