import { adminServices, checkAdminPassword, jsonError, methodNotAllowed, readBody } from '../../lib/admin.js';

const COLLECTIONS = ['menuItems', 'categories', 'galleryImages', 'testimonials'];

export default async function handler(req, res) {
  if (!checkAdminPassword(req, res)) return;

  try {
    const { db } = adminServices();
    if (req.method !== 'POST') return methodNotAllowed(res);
    const body = await readBody(req);
    const { collection, idA, idB } = body;
    if (!COLLECTIONS.includes(collection)) {
      return res.status(400).json({ error: 'Unknown collection' });
    }
    if (!idA || !idB) return res.status(400).json({ error: 'Missing ids' });

    const col = db.collection(collection);
    const snap = await col.orderBy('order', 'asc').get();
    let docs = snap.docs.map((d) => d.id);
    const ia = docs.indexOf(idA);
    const ib = docs.indexOf(idB);
    if (ia === -1 || ib === -1) return res.status(404).json({ error: 'One or both items were not found' });

    // Swap positions then renumber the whole collection so every order is unique,
    // avoiding no-op swaps when multiple documents share the same order value.
    [docs[ia], docs[ib]] = [docs[ib], docs[ia]];
    const batch = db.batch();
    docs.forEach((docId, index) => {
      batch.update(col.doc(docId), { order: index });
    });
    await batch.commit();
    return res.json({ ok: true });
  } catch (err) {
    return jsonError(res, err);
  }
}