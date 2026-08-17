import { adminServices, checkAdminPassword, jsonError, methodNotAllowed, readBody } from '../../lib/admin.js';

const collections = { deal: 'deals', offer: 'offers' };

export default async function handler(req, res) {
  if (!checkAdminPassword(req, res)) return;
  const { db } = adminServices();

  try {
    if (req.method === 'GET') {
      const [deals, offers] = await Promise.all([
        db.collection('deals').orderBy('order', 'asc').get(),
        db.collection('offers').orderBy('order', 'asc').get(),
      ]);
      return res.json({
        deals: deals.docs.map((d) => ({ id: d.id, ...d.data() })),
        offers: offers.docs.map((d) => ({ id: d.id, ...d.data() })),
      });
    }

    if (req.method === 'POST') {
      const body = await readBody(req);
      const colName = collections[body.kind];
      if (!colName) return res.status(400).json({ error: 'Missing or invalid kind (deal|offer)' });
      if (!body.menuItemId) return res.status(400).json({ error: 'Choose a menu item' });

      const col = db.collection(colName);
      const existing = await col.where('menuItemId', '==', body.menuItemId).get();
      if (existing.size > 0) {
        return res.status(400).json({ error: 'This item is already in the list' });
      }

      const doc = col.doc();
      await doc.set({
        menuItemId: body.menuItemId,
        ...(body.kind === 'offer'
          ? { discountPercent: Math.min(99, Math.max(1, Number(body.discountPercent) || 0)) }
          : {}),
        order: Number(body.order) || 0,
      });
      return res.json({ id: doc.id });
    }

    if (req.method === 'PUT') {
      const body = await readBody(req);
      const colName = collections[body.kind];
      if (!colName) return res.status(400).json({ error: 'Missing or invalid kind (deal|offer)' });
      if (!body.id) return res.status(400).json({ error: 'Missing id' });
      const patch = {};
      if (body.discountPercent !== undefined) {
        patch.discountPercent = Math.min(99, Math.max(1, Number(body.discountPercent) || 0));
      }
      await db.collection(colName).doc(body.id).update(patch);
      return res.json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const { kind, id } = req.query;
      const colName = collections[kind];
      if (!colName || !id) return res.status(400).json({ error: 'Missing kind or id' });
      await db.collection(colName).doc(id).delete();
      return res.json({ ok: true });
    }

    return methodNotAllowed(res);
  } catch (err) {
    return jsonError(res, err);
  }
}