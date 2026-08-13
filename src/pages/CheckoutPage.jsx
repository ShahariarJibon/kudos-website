import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import QuantityStepper from '../components/ui/QuantityStepper';
import { useCart } from '../context/CartContext';
import { ACTIVE_OUTLETS } from '../data/outlets';
import { SITE } from '../data/site';

const PAYMENTS = [
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive your order' },
  { id: 'bkash', label: 'bKash', desc: `Send Money to ${SITE.phone}` },
  { id: 'nagad', label: 'Nagad', desc: `Send Money to ${SITE.phone}` },
  { id: 'card', label: 'Card', desc: 'Visa / Mastercard at delivery' },
];

const PICKUP_SLOTS = ['ASAP', 'In 30 minutes', 'In 1 hour', 'In 2 hours'];

/**
 * CheckoutPage  -  fully in-app checkout (/checkout).
 * Order summary (editable qty), pickup recap (Order for Prepare), contact +
 * method details, payment method, price breakdown and Place Order.
 * Submitting shows an in-app animated confirmation  -  NO external redirect.
 */
export default function CheckoutPage() {
  const { cart, subtotal, updateQty, removeItem, setOutlet, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [outlet, setOutletInput] = useState(
    cart.outlet || ACTIVE_OUTLETS.find((o) => o.flagship)?.name || ACTIVE_OUTLETS[0]?.name || ''
  );
  const [slot, setSlot] = useState(PICKUP_SLOTS[0]);
  const [payment, setPayment] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(null); // { orderId, eta }

  const total = subtotal;

  const canPlace = useMemo(() => {
    if (!name.trim() || phone.trim().length < 10) return false;
    return true;
  }, [name, phone]);

  const handlePlaceOrder = () => {
    if (!canPlace || placing) return;
    setPlacing(true);

    /**
     * Backend-ready: when a server exists, POST here instead of simulating.
     *   await fetch('/api/orders', {
     *     method: 'POST',
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify({
     *       items: cart.items, method: cart.orderMethod, contact: { name, phone },
     *       notes, outlet, slot, payment,
     *     }),
     *   });
     */
    const orderId = `KUDOS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setTimeout(() => {
      setPlaced({
        orderId,
        eta: SITE.pickupEta,
        method: 'pickup',
      });
      setPlacing(false);
    }, 900);
  };

  const handleBackToMenu = () => {
    clearCart();
    navigate('/');
  };

  // Empty cart guard
  if (cart.items.length === 0 && !placed) {
    return (
      <>
        <PageHeader kicker="Checkout" title="Your cart is empty" />
        <section className="section-pad bg-hero-gradient">
          <div className="container-kudos text-center">
            <p className="mx-auto max-w-md text-neutral-600">
              You haven&apos;t added anything yet. Explore the menu and come back with some cravings.
            </p>
            <Link to="/menu" className="btn-brand mt-8">
              Browse Menu
            </Link>
          </div>
        </section>
      </>
    );
  }

  // Confirmation screen
  if (placed) {
    return (
      <section className="section-pad bg-hero-gradient min-h-[80vh]">
        <div className="container-kudos max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-maroon/5"
          >
            <div className="flex flex-col items-center bg-brand-gradient px-6 py-12 text-center text-white">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur"
              >
                <motion.svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M4.5 12.5l5 5 10-11"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  />
                </motion.svg>
              </motion.span>
              <h1 className="mt-5 font-heading text-2xl font-extrabold sm:text-3xl">
                Order Placed!
              </h1>
              <p className="mt-2 text-white/90">
                Order <span className="font-bold">{placed.orderId}</span>  -  pickup in approximately {placed.eta}.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="font-heading text-lg font-bold text-maroon">Order Summary</h2>
              <ul className="mt-4 divide-y divide-neutral-100">
                {cart.items.map((i) => (
                  <li key={i.name} className="flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0 truncate text-sm font-medium text-neutral-700">
                      {i.name} <span className="text-neutral-400">× {i.qty}</span>
                    </span>
                    <span className="font-heading text-sm font-bold text-maroon">
                      ৳{(i.price * i.qty).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                <span className="font-heading font-semibold uppercase tracking-wide text-neutral-500">
                  Total
                </span>
                <span className="font-heading text-2xl font-extrabold text-redOrange">
                  ৳{total.toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Paid via <span className="font-semibold text-neutral-700">{PAYMENTS.find((p) => p.id === payment)?.label}</span> ·{' '}
                Pickup at {outlet}
              </p>

              <button type="button" onClick={handleBackToMenu} className="btn-brand mt-8 w-full !min-h-[52px]">
                Back to Menu
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        kicker="Checkout"
        title="Complete your order"
        subtitle="Review your items, add contact details and choose how you want to pay. All handled right here  -  no redirects."
      />

      <section className="section-pad bg-hero-gradient">
        <div className="container-kudos grid gap-8 lg:grid-cols-5">
          {/* Left: order details */}
          <div className="space-y-6 lg:col-span-3">
            {/* Order summary */}
            <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-maroon/5 sm:p-8">
              <h2 className="font-heading text-lg font-bold text-maroon">Order Summary</h2>
              <ul className="mt-4 divide-y divide-neutral-100">
                {cart.items.map((i) => (
                  <li key={i.name} className="flex items-center gap-4 py-4">
                    <img
                      src={i.image}
                      alt={i.name}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-maroon/10"
                      width={56}
                      height={56}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-heading text-sm font-bold text-maroon">{i.name}</p>
                      <p className="font-heading text-sm text-orange">৳{i.price} each</p>
                      <p className="text-xs text-neutral-400">Subtotal ৳{(i.price * i.qty).toLocaleString()}</p>
                    </div>
                    <QuantityStepper
                      compact
                      qty={i.qty}
                      min={0}
                      onChange={(q) => updateQty(i.name, q - i.qty)}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(i.name)}
                      aria-label={`Remove ${i.name} from order`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-redOrange"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order method recap (pickup only) */}
            <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-maroon/5 sm:p-8">
              <h2 className="font-heading text-lg font-bold text-maroon">Order for Prepare</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="co-outlet" className="mb-1.5 block font-heading text-sm font-semibold text-neutral-700">
                    Pickup Outlet
                  </label>
                  <select
                    id="co-outlet"
                    value={outlet}
                    onChange={(e) => {
                      setOutletInput(e.target.value);
                      setOutlet(e.target.value);
                    }}
                    className="w-full rounded-xl border border-maroon/15 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors focus:border-orange focus:bg-white"
                  >
                    {ACTIVE_OUTLETS.map((o) => (
                      <option key={o.name} value={o.name}>
                        {o.name}  -  {o.city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="co-slot" className="mb-1.5 block font-heading text-sm font-semibold text-neutral-700">
                    Pickup Time
                  </label>
                  <select
                    id="co-slot"
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="w-full rounded-xl border border-maroon/15 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors focus:border-orange focus:bg-white"
                  >
                    {PICKUP_SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="mt-3 text-xs text-neutral-500">
                We&apos;ll prepare your order fresh and it will be ready for pickup at the selected outlet.
              </p>
            </div>

            {/* Contact info */}
            <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-maroon/5 sm:p-8">
              <h2 className="font-heading text-lg font-bold text-maroon">Contact Info</h2>
              <p className="mt-1 text-sm text-neutral-500">
                We&apos;ll call you at this number to confirm your order.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="co-name" className="mb-1.5 block font-heading text-sm font-semibold text-neutral-700">
                    Name
                  </label>
                  <input
                    id="co-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="w-full rounded-xl border border-maroon/15 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors focus:border-orange focus:bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="co-phone" className="mb-1.5 block font-heading text-sm font-semibold text-neutral-700">
                    Phone Number
                  </label>
                  <input
                    id="co-phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    required
                    className="w-full rounded-xl border border-maroon/15 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors focus:border-orange focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-maroon/5 sm:p-8">
              <h2 className="font-heading text-lg font-bold text-maroon">Payment Method</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
                {PAYMENTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={payment === p.id}
                    onClick={() => setPayment(p.id)}
                    className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                      payment === p.id
                        ? 'border-orange bg-orange/5 shadow-glow'
                        : 'border-neutral-100 hover:border-maroon/20'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        payment === p.id ? 'border-transparent bg-brand-gradient' : 'border-maroon/30'
                      }`}
                    >
                      {payment === p.id && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span>
                      <span className="block font-heading text-sm font-bold text-maroon">{p.label}</span>
                      <span className="block text-xs text-neutral-500">{p.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: price breakdown + place order */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-card ring-1 ring-maroon/5 sm:p-8">
              <h2 className="font-heading text-lg font-bold text-maroon">Price Breakdown</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-neutral-600">Subtotal</dt>
                  <dd className="font-heading font-semibold text-maroon">৳{subtotal.toLocaleString()}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                  <dt className="font-heading font-semibold uppercase tracking-wide text-neutral-500">
                    Total
                  </dt>
                  <dd className="font-heading text-2xl font-extrabold text-redOrange">
                    ৳{total.toLocaleString()}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-xs leading-relaxed text-neutral-400">
                Cash on Delivery is the default. bKash / Nagad payments can be confirmed over the
                phone before we prepare your order.
              </p>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!canPlace || placing}
                className="btn-brand mt-6 w-full !min-h-[52px] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {placing ? (
                    <motion.span
                      key="placing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                      Placing Order…
                    </motion.span>
                  ) : (
                    <motion.span key="place" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Place Order · ৳{total.toLocaleString()}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <p className="mt-3 text-center text-xs text-neutral-400">
                By placing this order you agree to receive a confirmation call.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}