import { adminServices, checkAdminPassword, jsonError, methodNotAllowed, readBody } from '../../lib/admin.js';

const FOLDERS = new Set(['menu', 'gallery']);
const MAX_BYTES = 3 * 1024 * 1024; // keeps base64 payloads under Vercel's body limit

export default async function handler(req, res) {
  if (!checkAdminPassword(req, res)) return;
  const { bucket } = adminServices();

  try {
    if (req.method !== 'POST') return methodNotAllowed(res);
    const body = await readBody(req);
    const folder = body.folder;
    const mimeType = body.mimeType || '';
    const base64 = body.data || '';

    if (!FOLDERS.has(folder)) return res.status(400).json({ error: 'Unknown upload folder' });
    if (!mimeType.startsWith('image/')) return res.status(400).json({ error: 'Please choose an image file' });

    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length === 0) return res.status(400).json({ error: 'Empty file' });
    if (buffer.length > MAX_BYTES) {
      return res.status(413).json({ error: 'Image too large (max 3 MB)' });
    }

    const ext = (mimeType.split('/')[1] || 'jpg').replace(/[^\w]/g, '');
    const name = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}-${ext}`;
    const bucketName = bucket.name;
    const file = bucket.file(`${folder}/${name}`);

    await file.save(buffer, {
      contentType: mimeType,
      metadata: { cacheControl: 'public, max-age=31536000, immutable' },
    });
    await file.makePublic();
    const url = `https://storage.googleapis.com/${bucketName}/${file.name}`;

    return res.json({ url });
  } catch (err) {
    return jsonError(res, err);
  }
}