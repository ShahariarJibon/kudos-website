import {
  adminServices,
  checkAdminPassword,
  jsonError,
  methodNotAllowed,
  readBody,
  slugify,
} from '../../lib/admin.js';

export default async function handler(req, res) {
  if (!checkAdminPassword(req, res)) return;
  const { db } = adminServices();
  const col = db.collection('categories');

  try {
    if (req.method === 'GET') {
      const snap = await col.orderBy('order', 'asc').get();
      return res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }

    if (req.method === 'POST') {
      const body = await readBody(req);
      const slug = slugify(body.slug || body.name || '');
      if (!slug) return res.status(400).json({ error: 'Category name is required' });
      const existing = await col.doc(slug).get();
      if (existing.exists) return res.status(400).json({ error: 'A category with this name already exists' });
      await col.doc(slug).set({
        name: String(body.name || '').trim(),
        slug,
        order: Number(body.order) || 0,
      });
      return res.json({ id: slug });
    }

    if (req.method === 'PUT') {
      const body = await readBody(req);
      const { id, ...data } = body;
      if (!id) return res.status(400).json({ error: 'Missing category id' });
      const patch = { ...data };
      delete patch.id;
      delete patch.order;
      if (data.order !== undefined) patch.order = Number(data.order) || 0;
      await col.doc(id).update(patch);
      return res.json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'Missing category id' });
      const items = await db.collection('menuItems').where('category', '==', id).limit(1).get();
      if (items.size > 0) {
        return res.status(400).json({ error: 'Cannot delete  -  items are still assigned to this category' });
      }
      await col.doc(id).delete();
      return res.json({ ok: true });
    }

    return methodNotAllowed(res);
  } catch (err) {
    return jsonError(res, err);
  }
}