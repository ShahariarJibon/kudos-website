import { readBody } from '../../lib/admin.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      return res.status(500).json({ error: 'ADMIN_PASSWORD is not set on the server' });
    }

    const body = await readBody(req);
    if (String(body?.password || '') !== expected) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    const message = err?.message || 'Internal server error';
    console.error(`[kudos-admin] ${message}`);
    return res.status(500).json({ error: message });
  }
}