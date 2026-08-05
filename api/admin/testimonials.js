import { adminServices, checkAdminPassword, jsonError, methodNotAllowed, readBody } from '../../lib/admin.js';

export default async function handler(req, res) {
  if (!checkAdminPassword(req, res)) return;
  const { db } = adminServices();
  const col = db.collection('testimonials');

  try {
    if (req.method === 'GET') {
      const snap = await col.orderBy('order', 'asc').get();
      return res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }

    if (req.method === 'POST') {
      const body = await readBody(req);
      const ref = await col.add({
        customerName: body.customerName || '',
        text: body.text || '',
        rating: Number(body.rating) || 5,
        role: body.role || '',
        branch: body.branch || '',
        imageUrl: body.imageUrl || '',
        order: Number(body.order) || 0,
      });
      return res.json({ id: ref.id });
    }

    if (req.method === 'PUT') {
      const body = await readBody(req);
      if (!body.id) return res.status(400).json({ error: 'Missing testimonial id' });
      const patch = { ...body };
      delete patch.id;
      delete patch.order;
      await col.doc(body.id).update(patch);
      return res.json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'Missing testimonial id' });
      await col.doc(id).delete();
      return res.json({ ok: true });
    }

    return methodNotAllowed(res);
  } catch (err) {
    return jsonError(res, err);
  }
}