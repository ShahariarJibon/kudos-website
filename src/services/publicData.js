/**
 * Public data layer — single source of truth for what the public site renders.
 *
 * - Without Firebase configured: returns the bundled local data (identical output).
 * - With Firebase configured: seeds Firestore from the bundled data on first run,
 *   then streams live via onSnapshot so /admin edits appear without a redeploy.
 *
 * Firebase modules are loaded lazily so the public bundle stays small when the
 * VITE_FIREBASE_* env vars aren't present.
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

/* ------------------------------ Seeding ------------------------------ */

let seedPromise = null;

/** Push bundled data into Firestore once, if the collections are empty. */
export function ensureSeeded() {
  if (!firebaseEnabled) return Promise.resolve();
  if (!seedPromise) {
    seedPromise = initFirebase()
      .then(async () => {
        if (!db) return;
        await seed();
      })
      .catch((err) => {
        console.error('Firestore seed failed', err);
        seedPromise = null;
      });
  }
  return seedPromise;
}

async function seed() {
  const { collection, doc, getDocs, orderBy, query, setDoc, writeBatch } = await getFs();
  const batch = writeBatch(db);

  const categoriesSnap = await getDocs(query(collection(db, 'categories'), orderBy('order')));
  if (categoriesSnap.size === 0) {
    MENU_CATEGORIES.forEach((c, ci) => {
      batch.set(doc(db, 'categories', c.id), { name: c.label, slug: c.id, order: ci });
      c.items.forEach((it, ii) => {
        batch.set(doc(db, 'menuItems', `seed-${c.id}-${ii}`), {
          name: it.name,
          price: priceToNumber(it.price),
          category: c.id,
          imageUrl: it.image,
          description: it.desc,
          available: true,
          order: ii,
        });
      });
    });
  }

  const gallerySnap = await getDocs(query(collection(db, 'galleryImages'), orderBy('order')));
  if (gallerySnap.size === 0) {
    GALLERY_FALLBACK.forEach((g, i) => {
      batch.set(doc(db, 'galleryImages', `seed-g-${i}`), {
        imageUrl: g.src,
        caption: g.alt,
        order: i,
      });
    });
  }

  const testimonialsSnap = await getDocs(query(collection(db, 'testimonials'), orderBy('order')));
  if (testimonialsSnap.size === 0) {
    TESTIMONIALS.forEach((t, i) => {
      batch.set(doc(db, 'testimonials', `seed-t-${i}`), {
        customerName: t.name,
        text: t.text,
        rating: 5,
        role: t.role,
        branch: t.branch,
        imageUrl: '',
        order: i,
      });
    });
  }

  const biSnap = await getDoc(doc(db, 'businessInfo', 'main'));
  if (!biSnap.exists()) {
    batch.set(doc(db, 'businessInfo', 'main'), {
      hours: SITE.hours,
      phone: SITE.phone,
      email: SITE.email,
      facebookUrl: SITE.socials.facebook.url,
      instagramUrl: SITE.socials.instagram.url,
      outletAddress: '',
    });
  }

  await batch.commit();
}

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
    ensureSeeded().then(async () => {
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
      }));

    const categories = liveCategories.map((c) => {
      const fallback = MENU_CATEGORIES.find((m) => m.id === c.slug || m.id === c.id);
      return {
        id: c.slug || c.id,
        label: c.name || c.id,
        blurb: fallback?.blurb || '',
        items: items.filter((it) => it.category === (c.name || c.id)),
      };
    });

    return { categories, items };
  }, [liveCategories, liveItems]);

  return data;
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
    ensureSeeded().then(async () => {
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