import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { NAV_LINKS } from '../data/site';
import Logo from './Logo';
import { useCart } from '../context/CartContext';

const CartButton = () => {
  const { totalQty, openDrawer } = useCart();
  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Open cart, ${totalQty} item${totalQty === 1 ? '' : 's'}`}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-maroon transition-colors hover:bg-maroon/5"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="17" cy="20" r="1.4" />
        <path d="M3 3h2l2.4 12.3a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L19.5 8H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <AnimatePresence>
        {totalQty > 0 && (
          <motion.span
            key={totalQty}
            initial={{ scale: 0.4 }}
            animate={{ scale: [0.4, 1.4, 1] }}
            transition={{ duration: 0.4, times: [0, 0.6, 1] }}
            id="cart-badge"
            className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gradient px-1 font-heading text-[11px] font-bold leading-none text-white shadow-glow"
            aria-live="polite"
          >
            {totalQty}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

/**
 * Navbar  -  Apple-style "liquid glass" floating bar: translucent cream tint,
 * heavy backdrop blur + saturation, white border and glossy top sheen.
 * Mobile: hamburger + slide-in drawer. All links keyboard/touch friendly.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const reduce = useReducedMotion();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change + lock body scroll while open
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const solid = scrolled || !isHome || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-2 sm:px-5 sm:pt-3">
      <div
        className={`relative mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 rounded-2xl border px-4 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 sm:h-16 sm:px-6 ${
          solid
            ? 'border-white/80 bg-[#FFF0BE]/75 shadow-[0_16px_40px_-12px_rgba(127,32,32,0.3),inset_0_1px_0_rgba(255,255,255,0.9)]'
            : 'border-white/60 bg-[#FFF0BE]/55 shadow-[0_12px_32px_-16px_rgba(127,32,32,0.28),inset_0_1px_0_rgba(255,255,255,0.8)]'
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/50 via-white/10 to-transparent opacity-70"
        />
        <nav className="relative flex h-full w-full items-center justify-between gap-4" aria-label="Main navigation">
        <Link to="/" aria-label="KUDOS  -  go to homepage" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative block rounded-full px-3.5 py-2 font-body text-[13px] font-medium transition-colors xl:px-4 xl:text-sm ${
                    isActive ? 'text-maroon' : 'text-neutral-700 hover:text-maroon'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layout={!reduce}
                        layoutId={reduce ? undefined : 'kudos-nav-pill'}
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute inset-0 overflow-hidden rounded-full border border-white/70 bg-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_14px_-2px_rgba(127,32,32,0.18)] backdrop-blur-xl backdrop-saturate-150"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-transparent"
                        />
                      </motion.span>
                    )}
                    <span className={`relative z-10 ${isActive ? 'font-semibold' : ''}`}>
                      {link.label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <CartButton />

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg lg:hidden"
            style={{ color: '#7F2020' }}
          >
            <span className="relative block h-5 w-6">
              <span
                className={`absolute left-0 top-0 h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                  open ? 'top-2 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                  open ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-4 h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                  open ? 'top-2 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-maroon/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
            />
            <motion.div
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="fixed right-0 top-0 z-50 flex h-dvh w-[85vw] max-w-sm flex-col bg-white shadow-2xl lg:hidden"
              initial={reduce ? { x: 0, opacity: 1 } : { x: '100%' }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduce ? undefined : { x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-16 items-center justify-between border-b border-neutral-100 px-5">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation menu"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-neutral-700"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <ul className="flex-1 overflow-y-auto px-5 py-4">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.to}
                    initial={reduce ? false : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) =>
                        `flex min-h-[48px] items-center rounded-lg px-3 font-body text-base font-medium transition-colors ${
                          isActive ? 'bg-orange/10 text-maroon' : 'text-neutral-700 hover:bg-neutral-50'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
