import { adminServices, checkAdminPassword, jsonError, methodNotAllowed, readBody } from '../../lib/admin.js';

export default async function handler(req, res) {
  if (!checkAdminPassword(req, res)) return;
  const { db } = adminServices();
  const col = db.collection('galleryImages');

  try {
    if (req.method === 'GET') {
      const snap = await col.orderBy('order', 'asc').get();
      return res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }

    if (req.method === 'POST') {
      const body = await readBody(req);
      const ref = await col.add({
        imageUrl: body.imageUrl || '',
        caption: body.caption || '',
        order: Number(body.order) || 0,
      });
      return res.json({ id: ref.id });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'Missing image id' });
      await col.doc(id).delete();
      return res.json({ ok: true });
    }

    return methodNotAllowed(res);
  } catch (err) {
    return jsonError(res, err);
  }
}