import { adminServices, checkAdminPassword, jsonError, methodNotAllowed, readBody } from '../../lib/admin.js';

export default async function handler(req, res) {
  if (!checkAdminPassword(req, res)) return;
  const { db } = adminServices();
  const ref = db.collection('businessInfo').doc('main');

  try {
    if (req.method === 'GET') {
      const snap = await ref.get();
      return res.json(snap.exists ? snap.data() : {});
    }

    if (req.method === 'PUT') {
      const body = await readBody(req);
      await ref.set({
        hours: Array.isArray(body.hours) ? body.hours : [],
        phone: body.phone || '',
        email: body.email || '',
        facebookUrl: body.facebookUrl || '',
        instagramUrl: body.instagramUrl || '',
        outletAddress: body.outletAddress || '',
      });
      return res.json({ ok: true });
    }

    return methodNotAllowed(res);
  } catch (err) {
    return jsonError(res, err);
  }
}