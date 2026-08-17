/**
 * Public data layer  -  single source of truth for what the public site renders.
 *
 * - Without Firebase configured: returns the bundled local data (identical output).
 * - With Firebase configured: streams live via onSnapshot so /admin edits appear
 *   without a redeploy. Seeding happens server-side (api/admin/seed.js) after
 *   the first admin sign-in.
 *
 * Firestore reads only  -  all writes go through the password-protected
 * /api/admin/* serverless functions.
 */
import { useEffect, useMemo, useState } from 'react';
import { db, firebaseEnabled, initFirebase } from '../lib/firebase';
import { MENU_CATEGORIES, ALL_ITEMS } from '../data/menu';
import { TESTIMONIALS } from '../data/testimonials';
import { SITE } from '../data/site';

let fsPromise = null;
const getFs = () => {
  if (!fsPromise) fsPromise = import('firebase/firestore');
  return fsPromise;
};

const priceToNumber = (p) => parseInt(String(p ?? '').replace(/[^0-9]/g, ''), 10) || 0;
const taka = (n) => `৳${Number(n) || 0}`;
const docOf = (snap) => ({ id: snap.id, ...snap.data() });

/* --------------------------- Live collection -------------------------- */

/**
 * Subscribe to a Firestore collection (live) with a local fallback.
 * Falls back immediately when Firebase isn't configured; otherwise swaps
 * to live data as soon as the snapshot arrives (no layout flash).
 */
function useCollectionData(collectionName, { fallback, map = docOf } = {}) {
  const [data, setData] = useState(fallback);

  useEffect(() => {
    if (!firebaseEnabled) return undefined;
    let unsub = null;
    let cancelled = false;
    initFirebase().then(async () => {
      if (cancelled || !db) return;
      const { collection, orderBy, query, onSnapshot } = await getFs();
      const q = query(collection(db, collectionName), orderBy('order', 'asc'));
      unsub = onSnapshot(
        q,
        (snap) => setData(snap.docs.map(map)),
        (err) => console.error(`[kudos] ${collectionName} snapshot error`, err)
      );
    });
    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return data;
}

/* -------------------------------- Menu ------------------------------- */

const FALLBACK_CATEGORIES = MENU_CATEGORIES.map((c) => ({
  id: c.id,
  slug: c.id,
  label: c.label,
  order: MENU_CATEGORIES.indexOf(c),
  blurb: c.blurb,
  items: c.items,
}));

const FALLBACK_ITEMS = ALL_ITEMS.map((it) => ({ ...it, available: true }));

export function useMenuData() {
  const liveCategories = useCollectionData('categories', { fallback: FALLBACK_CATEGORIES });
  const liveItems = useCollectionData('menuItems', { fallback: FALLBACK_ITEMS });

  const data = useMemo(() => {
    if (!firebaseEnabled) {
      return { categories: FALLBACK_CATEGORIES, items: ALL_ITEMS };
    }
    const catById = new Map();
    liveCategories.forEach((c) => catById.set(c.slug || c.id, c.name || c.label || c.id));

    const items = liveItems
      .filter((it) => it.available !== false)
      .map((it) => ({
        name: it.name,
        image: it.imageUrl,
        price: taka(it.price),
        desc: it.description,
        category: catById.get(it.category) || it.category,
        order: it.order ?? 0,
      }));

    // Deterministic per-category order  -  order value, then name as a
    // tiebreaker so items never look scrambled, even on stale data.
    const byCategory = (name) =>
      items
        .filter((it) => it.category === name)
        .sort((a, b) => a.order - b.order || String(a.name).localeCompare(String(b.name)))
        .map(({ order, ...rest }) => rest);

    const categories = liveCategories.map((c) => {
      const fallback = MENU_CATEGORIES.find((m) => m.id === c.slug || m.id === c.id);
      return {
        id: c.slug || c.id,
        label: c.name || c.id,
        blurb: fallback?.blurb || '',
        items: byCategory(c.name || c.id),
      };
    });

    return { categories, items };
  }, [liveCategories, liveItems]);

  return data;
}

/* ------------------------- Deals & offers ---------------------------- */

/**
 * Home page specials  -  "Our Hot Deals" carousel items (deals collection)
 * and "Today's Offer" cards with discount % (offers collection). Both store
 * a menuItemId + order and are joined against live menuItems, so edits in
 * the admin panel appear on the public site without a redeploy.
 */
export function useDeals() {
  const liveDeals = useCollectionData('deals', { fallback: [] });
  const liveOffers = useCollectionData('offers', { fallback: [] });
  const liveItems = useCollectionData('menuItems', { fallback: [] });

  return useMemo(() => {
    const itemById = new Map(
      liveItems
        .filter((it) => it.available !== false)
        .map((it) => [
          it.id,
          {
            name: it.name,
            image: it.imageUrl,
            price: taka(it.price),
            desc: it.description,
            category: it.category,
          },
        ])
    );

    const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0) || String(a.name ?? '').localeCompare(String(b.name ?? ''));

    const deals = liveDeals
      .map((d) => ({ ...itemById.get(d.menuItemId), id: d.id, order: d.order ?? 0 }))
      .filter((d) => d && d.name)
      .sort(byOrder);

    const offers = liveOffers
      .map((d) => ({
        ...itemById.get(d.menuItemId),
        id: d.id,
        discountPercent: Number(d.discountPercent) || 0,
        order: d.order ?? 0,
      }))
      .filter((d) => d && d.name && d.discountPercent > 0)
      .sort(byOrder);

    return { deals, offers };
  }, [liveDeals, liveOffers, liveItems]);
}

/* ------------------------------- Gallery ------------------------------ */

export const GALLERY_FALLBACK = [
  { src: '/images/hero-burger.png', alt: 'KUDOS signature burger', category: 'Food' },
  ...ALL_ITEMS.map((it) => ({ src: it.image, alt: it.name, category: it.category })),
  { src: '/images/about-flagship.jpg', alt: 'KUDOS flagship branch', category: 'Outlet' },
  { src: '/images/kudocafe-menu.jpg', alt: 'KudoCafe menu', category: 'Cafe' },
];

export function useGalleryImages() {
  const live = useCollectionData('galleryImages', {
    fallback: GALLERY_FALLBACK.map((g) => ({ id: g.src, ...g })),
    map: (d) => ({ id: d.id, src: d.data().imageUrl, alt: d.data().caption || 'KUDOS gallery image', category: 'Gallery' }),
  });
  return firebaseEnabled ? live : GALLERY_FALLBACK;
}

/* ----------------------------- Testimonials --------------------------- */

export function useTestimonials() {
  const live = useCollectionData('testimonials', {
    fallback: TESTIMONIALS.map((t, i) => ({ ...t, id: `seed-t-${i}`, rating: 5 })),
    map: (d) => ({
      id: d.id,
      name: d.data().customerName,
      text: d.data().text,
      rating: d.data().rating || 5,
      imageUrl: d.data().imageUrl || '',
      role: d.data().role || 'Verified Customer',
      branch: d.data().branch || 'KUDOS',
    }),
  });
  return firebaseEnabled ? live : TESTIMONIALS;
}

/* ---------------------------- Business info --------------------------- */

/** Hours/phone/email/socials merged over the static SITE defaults. */
export function useBusinessInfo() {
  const [info, setInfo] = useState(SITE);

  useEffect(() => {
    if (!firebaseEnabled) return undefined;
    let unsub = null;
    let cancelled = false;
    initFirebase().then(async () => {
      if (cancelled || !db) return;
      const { collection, doc: fsDoc, onSnapshot } = await getFs();
      unsub = onSnapshot(
        fsDoc(collection(db, 'businessInfo'), 'main'),
        (snap) => {
          if (!snap.exists()) return;
          const d = snap.data();
          setInfo({
            ...SITE,
            hours: Array.isArray(d.hours) && d.hours.length ? d.hours : SITE.hours,
            phone: d.phone || SITE.phone,
            email: d.email || SITE.email,
            phoneHref: `tel:${String(d.phone || SITE.phone).replace(/[^+\d]/g, '')}`,
            socials: {
              ...SITE.socials,
              facebook: { ...SITE.socials.facebook, url: d.facebookUrl || SITE.socials.facebook.url },
              instagram: { ...SITE.socials.instagram, url: d.instagramUrl || SITE.socials.instagram.url },
            },
            outletAddress: d.outletAddress || '',
          });
        },
        (err) => console.error('[kudos] businessInfo error', err)
      );
    });
    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, []);

  return info;
}