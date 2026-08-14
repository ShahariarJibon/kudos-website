import { adminServices, checkAdminPassword, jsonError, methodNotAllowed, readBody } from '../../lib/admin.js';

const COLLECTIONS = ['menuItems', 'categories', 'galleryImages', 'testimonials'];

export default async function handler(req, res) {
  if (!checkAdminPassword(req, res)) return;

  try {
    const { db } = adminServices();
    if (req.method !== 'POST') return methodNotAllowed(res);
    const body = await readBody(req);
    const { collection } = body;
    if (!COLLECTIONS.includes(collection)) {
      return res.status(400).json({ error: 'Unknown collection' });
    }

    // Renumber every doc 0..n (ties keep doc-id order) so order values are
    // unique again  -  heals old data created before swap renumbering existed.
    const col = db.collection(collection);
    const snap = await col.orderBy('order', 'asc').get();
    const batch = db.batch();
    snap.docs.forEach((d, index) => {
      batch.update(col.doc(d.id), { order: index });
    });
    await batch.commit();
    return res.json({ ok: true });
  } catch (err) {
    return jsonError(res, err);
  }
}