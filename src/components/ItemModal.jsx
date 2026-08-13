import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ACTIVE_OUTLETS } from '../data/outlets';
import { priceToNumber } from '../data/menu';
import { SITE } from '../data/site';
import QuantityStepper from './ui/QuantityStepper';

/**
 * ItemModal  -  bottom sheet (mobile) / centered modal (desktop) for ordering one item.
 * Quantity stepper + pickup outlet selection (Order for Prepare) + Add to Cart.
 * Closes via X, backdrop click, Escape, or swipe-down on mobile.
 */
export default function ItemModal() {
  const { activeItem, cart, closeItem, addItem } = useCart();
  const reduce = useReducedMotion();
  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches,
    []
  );

  const [qty, setQty] = useState(1);
  const [outlet, setOutlet] = useState(
    cart.outlet || ACTIVE_OUTLETS.find((o) => o.flagship)?.name || ACTIVE_OUTLETS[0]?.name || ''
  );

  // Reset local state whenever a new item opens
  useEffect(() => {
    if (!activeItem) return;
    setQty(1);
    setOutlet(
      cart.outlet || ACTIVE_OUTLETS.find((o) => o.flagship)?.name || ACTIVE_OUTLETS[0]?.name || ''
    );
  }, [activeItem, cart.outlet]);

  // Escape to close + body scroll lock
  useEffect(() => {
    if (!activeItem) return;
    const onKey = (e) => e.key === 'Escape' && closeItem();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeItem, closeItem]);

const handleAdd = () => {
    if (!activeItem) return;
    addItem(activeItem.item, {
      qty,
      method: 'pickup',
      outlet,
      sourceRect: activeItem.sourceRect,
    });
    closeItem();
  };

  return (
    <AnimatePresence>
      {activeItem && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center sm:justify-center sm:p-4">
          <motion.button
            type="button"
            aria-label="Close item dialog"
            onClick={closeItem}
            className="absolute inset-0 bg-maroon/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Order ${activeItem.item.name}`}
            className="relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
            initial={reduce ? { opacity: 0, y: 0 } : { y: isMobile ? '100%' : 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: isMobile ? '100%' : 40, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            drag={isMobile && !reduce ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 500) closeItem();
            }}
          >
            {/* Swipe handle (mobile) */}
            <span
              aria-hidden="true"
              className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-neutral-200 sm:hidden"
            />

            {/* Close */}
            <button
              type="button"
              onClick={closeItem}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-card transition-colors hover:text-maroon"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <div className="overflow-y-auto">
              {/* Image */}
              <div className="aspect-[16/9] w-full overflow-hidden">
                <img
                  src={activeItem.item.image}
                  alt={activeItem.item.name}
                  className="h-full w-full object-cover"
                  width={800}
                  height={450}
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-maroon sm:text-2xl">
                      {activeItem.item.name}
                    </h2>
                    <p className="mt-1 font-heading text-lg font-bold tracking-wide text-orange">
                      {activeItem.item.price ?? 'Price at outlet'}
                    </p>
                  </div>
                  <QuantityStepper qty={qty} onChange={setQty} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {activeItem.item.desc ?? activeItem.item.category}
                </p>

{/* Order for Prepare  -  pickup outlet */}
                <p className="mt-5 font-heading text-sm font-bold uppercase tracking-wide text-neutral-700">
                  Order for Prepare
                </p>
                <div className="mt-2 rounded-2xl bg-neutral-50 p-4">
                  <label htmlFor="item-outlet" className="font-heading text-sm font-semibold text-neutral-700">
                    Pickup Outlet
                  </label>
                  <select
                    id="item-outlet"
                    value={outlet}
                    onChange={(e) => setOutlet(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-maroon/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-orange"
                  >
                    {ACTIVE_OUTLETS.map((o) => (
                      <option key={o.name} value={o.name}>
                        {o.name}  -  {o.city}
                      </option>
                    ))}
                  </select>
                  <p className="mt-3 text-xs text-neutral-500">
                    Ready in approximately <span className="font-semibold text-neutral-700">{SITE.pickupEta}</span> after
                    confirmation. Same prices at all branches.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="border-t border-neutral-100 p-4 sm:p-5">
<button
                type="button"
                onClick={handleAdd}
                className="btn-brand w-full !min-h-[52px]"
              >
{activeItem.item.price
                  ? `Add to Cart · ৳${(
                      parseInt(activeItem.item.price.replace(/[^0-9]/g, ''), 10) * qty
                    ).toLocaleString()}`
                  : 'Add to Cart · Outlet price'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
