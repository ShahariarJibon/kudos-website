/**
 * Shared server-side helpers for the /api/admin/* Vercel functions.
 * Uses the Firebase Admin SDK (service account) — bypasses Firestore/Storage
 * security rules entirely.
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

let app = null;

function getApp() {
  const raw = process.env.FIREBASE_SERVER_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set on the server');
  if (!app) {
    const sa = JSON.parse(raw);
    app = initializeApp({
      credential: cert(sa),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${sa.project_id}.firebasestorage.app`,
    });
  }
  return app;
}

/** Firestore + Storage handles (Admin SDK — rules do not apply). */
export function adminServices() {
  return {
    db: getFirestore(getApp()),
    bucket: getStorage(getApp()).bucket(),
  };
}

/** Reject every /api/admin/* call unless x-admin-password matches ADMIN_PASSWORD. */
export function checkAdminPassword(req, res) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    res.status(500).json({ error: 'ADMIN_PASSWORD is not set on the server' });
    return false;
  }
  if (String(req.headers['x-admin-password'] || '') !== expected) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

/** Parse the JSON request body (with a safe size cap). */
export function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 4 * 1024 * 1024) {
        req.destroy(new Error('Body too large'));
        return;
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

export function jsonError(res, err) {
  const message = err?.message || 'Internal server error';
  console.error(`[kudos-admin] ${message}`);
  const status = /not found/i.test(message) ? 404 : 500;
  res.status(status).json({ error: message });
}

export function methodNotAllowed(res) {
  res.status(405).json({ error: 'Method not allowed' });
}

export const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48);