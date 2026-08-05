import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, initFirebase } from '../../lib/firebase';
import { AdminPageHeader, Spinner } from '../../components/admin/AdminUI';
import { ensureSeeded } from '../../services/publicData';
import { isAdminReady } from '../../services/adminService';

const CARDS = [
  { to: '/admin/menu-items', label: 'Menu Items', icon: 'menu', countKey: 'menuItems', hint: 'Products shown on the public menu' },
  { to: '/admin/categories', label: 'Categories', icon: 'categories', countKey: 'categories', hint: 'Menu grouping on the Menu page' },
  { to: '/admin/gallery', label: 'Gallery Images', icon: 'gallery', countKey: 'galleryImages', hint: 'Photos in the public gallery' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: 'testimonials', countKey: 'testimonials', hint: 'Reviews in the slider' },
  { to: '/admin/business-info', label: 'Business Info', icon: 'business', countKey: 'business', hint: 'Hours, contact and socials' },
];

const cardIcons = {
  menu: <path d="M4 6h16M4 12h16M4 18h10" />,
  categories: <path d="M3 7h11v4H3zM16 7h5v4h-5zM3 13h6v4H3zM11 13h10v4H11z" />,
  gallery: <path d="M4 4h16v16H4zM4 15l4-4 3 3 4-5 5 6" />,
  testimonials: <path d="M12 3a5 5 0 0 1 5 5c0 2-1 3.5-2.5 4.5V15H9.5v-2.5C8 11.5 7 10 7 8a5 5 0 0 1 5-5zM9.5 17h5v2h-5z" />,
  business: <path d="M4 10h16v10H4zM8 10V6a4 4 0 0 1 8 0v4" />,
};

export default function DashboardPage() {
  const [counts, setCounts] = useState(null);
  const [seeding, setSeeding] = useState(true);

  useEffect(() => {
    if (!isAdminReady()) {
      setSeeding(false);
      return undefined;
    }
    let unsubs = [];
    initFirebase().then(() => {
      if (!db) return;
      unsubs = [
        onSnapshot(collection(db, 'menuItems'), (s) => setCounts((c) => ({ ...c, menuItems: s.size }))),
        onSnapshot(collection(db, 'categories'), (s) => setCounts((c) => ({ ...c, categories: s.size }))),
        onSnapshot(collection(db, 'galleryImages'), (s) => setCounts((c) => ({ ...c, galleryImages: s.size }))),
        onSnapshot(collection(db, 'testimonials'), (s) => setCounts((c) => ({ ...c, testimonials: s.size }))),
      ];
      ensureSeeded().finally(() => setSeeding(false));
    });
    return () => unsubs.forEach((u) => u());
  }, []);

  const countOf = (key) => (counts && counts[key] !== undefined ? counts[key] : null);

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Dashboard"
        subtitle="Manage everything your customers see — changes appear on the public site instantly."
      />

      {!isAdminReady() && (
        <div className="mt-8 rounded-2xl bg-redOrange/10 p-6 text-redOrange">
          <p className="font-heading font-bold">Firebase is not configured</p>
          <p className="mt-1 text-sm leading-relaxed">
            To save edits to the live site: create a Firebase project
            (console.firebase.google.com), add a web app, enable Firestore and
            Storage, publish the rules in <span className="font-semibold">firestore.rules</span> and{' '}
            <span className="font-semibold">storage.rules</span>, then set the six{' '}
            <span className="font-semibold">VITE_FIREBASE_*</span> variables in Vercel → Settings →
            Environment Variables and redeploy. Firebase Authentication is not needed — the panel
            uses its own login.
          </p>
        </div>
      )}

      {seeding ? (
        <Spinner label="Syncing bundled data…" />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group rounded-2xl bg-white p-5 shadow-card ring-1 ring-maroon/5 transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className="flex items-start justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    {cardIcons[card.icon]}
                  </svg>
                </span>
                <span className="font-heading text-3xl font-extrabold text-maroon">
                  {card.countKey === 'business'
                    ? '—'
                    : countOf(card.countKey) ?? '—'}
                </span>
              </div>
              <h2 className="mt-4 font-heading text-base font-bold text-maroon group-hover:text-orange">
                {card.label}
              </h2>
              <p className="mt-1 text-xs text-neutral-500">{card.hint}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-2xl bg-maroon p-6 text-white">
        <h2 className="font-heading text-lg font-bold">Staff access</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/80">
          Sign in at <span className="font-semibold text-orange">/admin/login</span> with your admin
          credentials (default <span className="font-semibold text-orange">admin@gmail.com</span> /{' '}
          <span className="font-semibold text-orange">admin123</span>). Change them from{' '}
          <span className="font-semibold text-orange">Settings</span>. The panel is never linked on
          the public site and is excluded from search indexing.
        </p>
      </div>
    </div>
  );
}