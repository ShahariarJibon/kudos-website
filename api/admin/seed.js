import { adminServices, checkAdminPassword, jsonError, methodNotAllowed } from '../../lib/admin.js';
import { ALL_ITEMS, MENU_CATEGORIES } from '../../src/data/menu.js';
import { TESTIMONIALS } from '../../src/data/testimonials.js';
import { SITE } from '../../src/data/site.js';

const priceToNumber = (p) => parseInt(String(p ?? '').replace(/[^0-9]/g, ''), 10) || 0;

const GALLERY_SEED = [
  { imageUrl: '/images/hero-burger.png', caption: 'KUDOS signature burger' },
  ...ALL_ITEMS.map((it) => ({ imageUrl: it.image, caption: it.name })),
  { imageUrl: '/images/about-flagship.jpg', caption: 'KUDOS flagship branch' },
  { imageUrl: '/images/kudocafe-menu.jpg', caption: 'KudoCafe menu' },
];

export default async function handler(req, res) {
  if (!checkAdminPassword(req, res)) return;

  try {
    const { db } = adminServices();
    if (req.method !== 'POST') return methodNotAllowed(res);

    const categoriesSnap = await db.collection('categories').orderBy('order').get();
    if (categoriesSnap.size === 0) {
      const batch = db.batch();
      MENU_CATEGORIES.forEach((c, ci) => {
        batch.set(db.collection('categories').doc(c.id), { name: c.label, slug: c.id, order: ci });
        c.items.forEach((it, ii) => {
          batch.set(db.collection('menuItems').doc(`seed-${c.id}-${ii}`), {
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
      await batch.commit();
    }

    const gallerySnap = await db.collection('galleryImages').orderBy('order').get();
    if (gallerySnap.size === 0) {
      const batch = db.batch();
      GALLERY_SEED.forEach((g, i) => {
        batch.set(db.collection('galleryImages').doc(`seed-g-${i}`), {
          imageUrl: g.imageUrl,
          caption: g.caption,
          order: i,
        });
      });
      await batch.commit();
    }

    const testimonialsSnap = await db.collection('testimonials').orderBy('order').get();
    if (testimonialsSnap.size === 0) {
      const batch = db.batch();
      TESTIMONIALS.forEach((t, i) => {
        batch.set(db.collection('testimonials').doc(`seed-t-${i}`), {
          customerName: t.name,
          text: t.text,
          rating: 5,
          role: t.role,
          branch: t.branch,
          imageUrl: '',
          order: i,
        });
      });
      await batch.commit();
    }

    const biSnap = await db.collection('businessInfo').doc('main').get();
    if (!biSnap.exists) {
      await db.collection('businessInfo').doc('main').set({
        hours: SITE.hours,
        phone: SITE.phone,
        email: SITE.email,
        facebookUrl: SITE.socials.facebook.url,
        instagramUrl: SITE.socials.instagram.url,
        outletAddress: '',
      });
    }

    return res.json({ ok: true });
  } catch (err) {
    return jsonError(res, err);
  }
}