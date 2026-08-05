import { adminServices, checkAdminPassword, jsonError, methodNotAllowed, readBody } from '../../lib/admin.js';

export default async function handler(req, res) {
  if (!checkAdminPassword(req, res)) return;
  const { db } = adminServices();
  const col = db.collection('menuItems');

  try {
    if (req.method === 'GET') {
      const snap = await col.orderBy('order', 'asc').get();
      return res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }

    if (req.method === 'POST') {
      const body = await readBody(req);
      const ref = await col.add({
        name: body.name || '',
        category: body.category || '',
        price: Number(body.price) || 0,
        imageUrl: body.imageUrl || '',
        description: body.description || '',
        available: body.available !== false,
        order: Number(body.order) || 0,
      });
      return res.json({ id: ref.id });
    }

    if (req.method === 'PUT') {
      const body = await readBody(req);
      const { id, ...data } = body;
      if (!id) return res.status(400).json({ error: 'Missing item id' });
      const patch = { ...data };
      delete patch.id;
      delete patch.order;
      if (data.order !== undefined) patch.order = Number(data.order) || 0;
      await col.doc(id).update(patch);
      return res.json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'Missing item id' });
      await col.doc(id).delete();
      return res.json({ ok: true });
    }

    return methodNotAllowed(res);
  } catch (err) {
    return jsonError(res, err);
  }
}