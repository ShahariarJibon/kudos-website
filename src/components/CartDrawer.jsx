import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ACTIVE_OUTLETS } from '../data/outlets';
import QuantityStepper from './ui/QuantityStepper';

/**
 * CartDrawer  -  slide-in drawer (desktop) / full-screen sheet (mobile).
 * Inline quantity editing, pickup outlet selection (Order for Prepare),
 * subtotal, and a single checkout action that moves to the in-app /checkout route.
 */
export default function CartDrawer() {
  const {
    cart,
    drawerOpen,
    closeDrawer,
    updateQty,
    removeItem,
    setOutlet,
    totalQty,
    subtotal,
  } = useCart();
  const reduce = useReducedMotion();
  const navigate = useNavigate();

  const [outlet, setOutletInput] = useState(
    cart.outlet || ACTIVE_OUTLETS.find((o) => o.flagship)?.name || ACTIVE_OUTLETS[0]?.name || ''
  );

  useEffect(() => {
    setOutletInput(cart.outlet || ACTIVE_OUTLETS.find((o) => o.flagship)?.name || ACTIVE_OUTLETS[0]?.name || '');
  }, [cart.outlet, drawerOpen]);

  // Escape + scroll lock
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => e.key === 'Escape' && closeDrawer();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [drawerOpen, closeDrawer]);

  const handleCheckout = () => {
    // Persist any inline outlet edits before leaving the drawer
    if (outlet) setOutlet(outlet);
    closeDrawer();
    navigate('/checkout'); // in-app checkout  -  never redirects off-site
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-[75]">
          <motion.button
            type="button"
            aria-label="Close cart"
            onClick={closeDrawer}
            className="absolute inset-0 bg-maroon/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            className="absolute right-0 top-0 flex h-dvh w-full flex-col bg-white shadow-2xl sm:w-[420px]"
            initial={reduce ? { x: 0 } : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reduce ? undefined : { x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h2 className="font-heading text-lg font-bold text-maroon">
                Your Cart{' '}
                <span className="ml-1 rounded-full bg-orange/10 px-2.5 py-0.5 text-sm font-bold text-orange">
                  {totalQty}
                </span>
              </h2>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close cart"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-neutral-700 transition-colors hover:text-maroon"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Order for Prepare (pickup only) */}
            {cart.items.length > 0 && (
              <div className="border-b border-neutral-100 px-5 py-4">
                <p className="font-heading text-xs font-bold uppercase tracking-wide text-neutral-500">
                  Order for Prepare
                </p>
                <div className="mt-2">
                  <label htmlFor="cart-outlet" className="font-heading text-sm font-semibold text-neutral-700">
                    Pickup Outlet
                  </label>
                  <select
                    id="cart-outlet"
                    value={outlet}
                    onChange={(e) => {
                      setOutletInput(e.target.value);
                      setOutlet(e.target.value);
                    }}
                    className="mt-1.5 w-full rounded-xl border border-maroon/15 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors focus:border-orange focus:bg-white"
                  >
                    {ACTIVE_OUTLETS.map((o) => (
                      <option key={o.name} value={o.name}>
                        {o.name}  -  {o.city}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-neutral-500">Ready in 15 - 20 min after confirmation.</p>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5">
              {cart.items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-neutral-400" aria-hidden="true">
                      <circle cx="9" cy="20" r="1.4" />
                      <circle cx="17" cy="20" r="1.4" />
                      <path d="M3 3h2l2.4 12.3a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L19.5 8H6" />
                    </svg>
                  </span>
                  <p className="font-heading font-semibold text-neutral-600">Your cart is empty</p>
                  <p className="text-sm text-neutral-500">Tap the + on any item to add it.</p>
                  <Link to="/menu" onClick={closeDrawer} className="btn-brand">
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-neutral-100">
                  {cart.items.map((i) => (
                    <li key={i.name} className="flex items-center gap-4 py-4">
                      <img
                        src={i.image}
                        alt={i.name}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-maroon/10"
                        width={64}
                        height={64}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-heading text-sm font-bold text-maroon">{i.name}</p>
                        <p className="mt-0.5 font-heading text-sm text-orange">৳{i.price} each</p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <QuantityStepper
                            compact
                            qty={i.qty}
                            min={0}
                            onChange={(q) => updateQty(i.name, q - i.qty)}
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(i.name)}
                            aria-label={`Remove ${i.name} from cart`}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-redOrange"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path d="M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="border-t border-neutral-100 bg-white p-5 pb-8 sm:pb-5">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm font-semibold uppercase tracking-wide text-neutral-500">
                    Subtotal
                  </span>
                  <span className="font-heading text-xl font-bold text-maroon">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Taxes added at checkout.
                </p>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="btn-brand mt-4 w-full !min-h-[52px]"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}