/**
 * Admin data service  -  all calls go through the password-protected Vercel
 * serverless functions under /api/admin/* (Firebase Admin SDK server-side).
 * No direct Firestore/Storage writes happen from the browser anymore.
 */
const API_BASE = '/api/admin';
const SESSION_KEY = 'kudos-admin-password-v1';

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48);

function adminHeaders() {
  let password = '';
  try {
    password = sessionStorage.getItem(SESSION_KEY) || '';
  } catch {
    /* non-browser environment */
  }
  return {
    'Content-Type': 'application/json',
    'x-admin-password': password,
  };
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers: adminHeaders() });
  } catch (err) {
    throw new Error('Could not reach the admin API  -  check your connection');
  }

  if (res.status === 401) {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    window.location.assign('/admin/login');
    throw new Error('Session expired  -  sign in again');
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* keep status text */
    }
    throw new Error(message);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

const get = (path) => request(path);
const post = (path, data) => request(path, { method: 'POST', body: JSON.stringify(data || {}) });
const put = (path, data) => request(path, { method: 'PUT', body: JSON.stringify(data || {}) });
const del = (path) => request(path, { method: 'DELETE' });

/* ------------------------------ Uploads ------------------------------ */

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve(result.includes('base64,') ? result.split('base64,')[1] : result);
    };
    reader.onerror = () => reject(new Error('Could not read the selected file'));
    reader.readAsDataURL(file);
  });

/** Upload an image (server-side, via the API) and return its public URL. */
export async function uploadImage(file, folder = 'menu') {
  if (!file) throw new Error('No file selected');
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file');
  const data = await fileToBase64(file);
  const result = await post('/upload', {
    folder,
    fileName: file.name,
    mimeType: file.type,
    data,
  });
  return result.url;
}

/* ----------------------------- Menu items ----------------------------- */

export const fetchMenuItems = () => get('/menu-items');
export const addMenuItem = (data) => post('/menu-items', data);
export const updateMenuItem = (id, data) => put('/menu-items', { id, ...data });
export const deleteMenuItem = (id) => del(`/menu-items?id=${encodeURIComponent(id)}`);

/* ----------------------------- Categories ----------------------------- */

export const fetchCategories = () => get('/categories');
export const addCategory = (data) => post('/categories', data);
export const updateCategory = (id, data) => put('/categories', { id, ...data });
export const deleteCategory = (id) => del(`/categories?id=${encodeURIComponent(id)}`);

/* ------------------------------ Gallery ------------------------------- */

export const fetchGallery = () => get('/gallery');
export const addGalleryImage = (data) => post('/gallery', data);
export const deleteGalleryImage = (id) => del(`/gallery?id=${encodeURIComponent(id)}`);

/* ----------------------------- Testimonials --------------------------- */

export const fetchTestimonials = () => get('/testimonials');
export const addTestimonial = (data) => post('/testimonials', data);
export const updateTestimonial = (id, data) => put('/testimonials', { id, ...data });
export const deleteTestimonial = (id) => del(`/testimonials?id=${encodeURIComponent(id)}`);

/* ----------------------------- Business info -------------------------- */

export const fetchBusinessInfo = () => get('/business-info');
export const saveBusinessInfo = (data) => put('/business-info', data);

/* ------------------------- Deals & offers ---------------------------- */

export const fetchDeals = () => get('/deals');
export const addDeal = (menuItemId, id) => post('/deals', { kind: 'deal', menuItemId, id });
export const addOffer = (menuItemId, discountPercent, id) =>
  post('/deals', { kind: 'offer', menuItemId, discountPercent, id });
export const updateOffer = (id, discountPercent) =>
  put('/deals', { kind: 'offer', id, discountPercent });
export const deleteDeal = (id) => del(`/deals?kind=deal&id=${encodeURIComponent(id)}`);
export const deleteOffer = (id) => del(`/deals?kind=offer&id=${encodeURIComponent(id)}`);

/* ------------------------------ Misc --------------------------------- */

export const swapOrder = (collection, idA, idB) =>
  post('/swap-order', { collection, idA, idB });

export const renumberCollection = (collection) => post('/renumber', { collection });

/**
 * If any entries share the same order value (old data from before swaps were
 * renumbered), fix them locally right away and persist the fix in the
 * background so the public side stops showing a scrambled sequence.
 */
export function healOrdering(list, collection) {
  const seen = new Set();
  for (const it of list) {
    const o = it.order ?? 0;
    if (seen.has(o)) {
      const healed = list.map((it2, i) => ({ ...it2, order: i }));
      renumberCollection(collection).catch(() => {
        /* server-side heal retried on the next swap or page load */
      });
      return healed;
    }
    seen.add(o);
  }
  return list;
}

/** Seed Firestore from the bundled data (server-side) if collections are empty. */
export const seedDatabase = () => post('/seed');
