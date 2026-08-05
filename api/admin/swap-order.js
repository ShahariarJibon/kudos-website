import { adminServices, checkAdminPassword, jsonError, methodNotAllowed, readBody } from '../../lib/admin.js';

const COLLECTIONS = ['menuItems', 'categories', 'galleryImages', 'testimonials'];

export default async function handler(req, res) {
  if (!checkAdminPassword(req, res)) return;
  const { db } = adminServices();

  try {
    if (req.method !== 'POST') return methodNotAllowed(res);
    const body = await readBody(req);
    const { collection, idA, orderA, idB, orderB } = body;
    if (!COLLECTIONS.includes(collection)) {
      return res.status(400).json({ error: 'Unknown collection' });
    }
    if (!idA || !idB) return res.status(400).json({ error: 'Missing ids' });
    const batch = db.batch();
    batch.update(db.collection(collection).doc(idA), { order: Number(orderB) || 0 });
    batch.update(db.collection(collection).doc(idB), { order: Number(orderA) || 0 });
    await batch.commit();
    return res.json({ ok: true });
  } catch (err) {
    return jsonError(res, err);
  }
}