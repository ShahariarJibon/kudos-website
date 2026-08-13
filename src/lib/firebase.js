/**
 * Firebase bootstrap (lazy)  -  all Firebase SDK modules are dynamic imports, so
 * the public bundle stays lean when Firebase isn't configured. Once the VITE_*
 * env vars are set and initFirebase() runs, Firestore/Auth/Storage activate.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId
);

let app = null;
let db = null;
let auth = null;
let storage = null;
let initPromise = null;

/** Resolves true once Firebase is initialized (idempotent). */
export function initFirebase() {
  if (!firebaseEnabled) return Promise.resolve(false);
  if (!initPromise) {
    initPromise = Promise.all([
      import('firebase/app'),
      import('firebase/firestore'),
      import('firebase/auth'),
      import('firebase/storage'),
    ]).then(([appMod, fs, authMod, storageMod]) => {
      app = appMod.initializeApp(firebaseConfig);
      db = fs.getFirestore(app);
      auth = authMod.getAuth(app);
      storage = storageMod.getStorage(app);
      return true;
    });
    initPromise.catch(() => {
      initPromise = null;
    });
  }
  return initPromise;
}

export { app, db, auth, storage };