/**
 * Admin data service — Firestore CRUD + Firebase Storage uploads used by /admin.
 * Every call awaits Firebase init (lazy bootstrap) first.
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage, firebaseEnabled, initFirebase } from '../lib/firebase';

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48);

async function ready() {
  if (!firebaseEnabled) throw new Error('Firebase is not configured');
  await initFirebase();
  if (!db) throw new Error('Firebase did not initialize');
}

/* ------------------------------ Uploads ------------------------------ */

/** Upload an image file to Storage and return its download URL. */
export async function uploadImage(file, folder = 'menu') {
  await ready();
  if (!file) throw new Error('No file selected');
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file');
  const safeName = file.name.replace(/[^\w.-]/g, '_');
  const storageRef = ref(storage, `${folder}/${uid()}-${safeName}`);
  const snap = await uploadBytes(storageRef, file);
  return getDownloadURL(snap.ref);
}

/* ----------------------------- Menu items ----------------------------- */

export async function fetchMenuItems() {
  await ready();
  const snap = await getDocs(query(collection(db, 'menuItems'), orderBy('order', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addMenuItem(data) {
  await ready();
  await addDoc(collection(db, 'menuItems'), {
    ...data,
    imageUrl: data.imageUrl || '',
    available: data.available !== false,
    order: Number(data.order) || 0,
  });
}

export async function updateMenuItem(id, data) {
  await ready();
  if (!id) throw new Error('Missing item id');
  const patch = { ...data };
  delete patch.order;
  if (data.order !== undefined) patch.order = Number(data.order) || 0;
  await updateDoc(doc(db, 'menuItems', id), patch);
}

export async function deleteMenuItem(id) {
  await ready();
  await deleteDoc(doc(db, 'menuItems', id));
}

/** Swap `order` between two docs (for up/down reordering). */
export async function swapOrder(collectionName, idA, orderA, idB, orderB) {
  await ready();
  const batch = writeBatch(db);
  batch.update(doc(db, collectionName, idA), { order: orderB });
  batch.update(doc(db, collectionName, idB), { order: orderA });
  await batch.commit();
}

/* ----------------------------- Categories ----------------------------- */

export async function fetchCategories() {
  await ready();
  const snap = await getDocs(query(collection(db, 'categories'), orderBy('order', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addCategory({ name, slug, order }) {
  await ready();
  const clean = slugify(slug || name || '');
  if (!clean) throw new Error('Category name is required');
  const exists = await getDoc(doc(db, 'categories', clean));
  if (exists.exists()) throw new Error('A category with this name already exists');
  await setDoc(doc(db, 'categories', clean), {
    name: String(name).trim(),
    slug: clean,
    order: Number(order) || 0,
  });
  return clean;
}

export async function updateCategory(id, data) {
  await ready();
  const patch = { ...data };
  delete patch.order;
  if (data.order !== undefined) patch.order = Number(data.order) || 0;
  await updateDoc(doc(db, 'categories', id), patch);
}

export async function deleteCategory(id) {
  await ready();
  await deleteDoc(doc(db, 'categories', id));
}

/* ------------------------------ Gallery ------------------------------- */

export async function fetchGallery() {
  await ready();
  const snap = await getDocs(query(collection(db, 'galleryImages'), orderBy('order', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addGalleryImage({ imageUrl, caption, order }) {
  await ready();
  await addDoc(collection(db, 'galleryImages'), {
    imageUrl,
    caption: caption || '',
    order: Number(order) || 0,
  });
}

export async function deleteGalleryImage(id) {
  await ready();
  await deleteDoc(doc(db, 'galleryImages', id));
}

/* ----------------------------- Testimonials --------------------------- */

export async function fetchTestimonials() {
  await ready();
  const snap = await getDocs(query(collection(db, 'testimonials'), orderBy('order', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addTestimonial(data) {
  await ready();
  await addDoc(collection(db, 'testimonials'), {
    customerName: data.customerName,
    text: data.text,
    rating: Number(data.rating) || 5,
    role: data.role || '',
    branch: data.branch || '',
    imageUrl: data.imageUrl || '',
    order: Number(data.order) || 0,
  });
}

export async function updateTestimonial(id, data) {
  await ready();
  await updateDoc(doc(db, 'testimonials', id), {
    customerName: data.customerName,
    text: data.text,
    rating: Number(data.rating) || 5,
    role: data.role || '',
    branch: data.branch || '',
    imageUrl: data.imageUrl || '',
  });
}

export async function deleteTestimonial(id) {
  await ready();
  await deleteDoc(doc(db, 'testimonials', id));
}

/* ----------------------------- Business info -------------------------- */

export async function fetchBusinessInfo() {
  await ready();
  const snap = await getDoc(doc(db, 'businessInfo', 'main'));
  return snap.exists() ? snap.data() : {};
}

export async function saveBusinessInfo(data) {
  await ready();
  await setDoc(doc(db, 'businessInfo', 'main'), {
    hours: Array.isArray(data.hours) ? data.hours : [],
    phone: data.phone || '',
    email: data.email || '',
    facebookUrl: data.facebookUrl || '',
    instagramUrl: data.instagramUrl || '',
    outletAddress: data.outletAddress || '',
  });
}

/* ------------------------------ Misc --------------------------------- */

export const isAdminReady = () => Boolean(firebaseEnabled);