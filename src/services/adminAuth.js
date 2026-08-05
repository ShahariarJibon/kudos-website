/**
 * Self-contained admin login — works without Firebase.
 * Default credentials: admin@gmail.com / admin123.
 * Credentials are changeable from Admin → Settings and stored per-device
 * (hashed, or plain when the browser has no Web Crypto in non-secure contexts).
 */

const CREDS_KEY = 'kudos-admin-creds-v1';
const SESSION_KEY = 'kudos-admin-session-v1';
const SESSION_HOURS = 12;

export const DEFAULT_EMAIL = 'admin@gmail.com';
export const DEFAULT_PASSWORD = 'admin123';

const b64 = (s) => (typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(s))) : s);

async function hashPassword(pw) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
      return (
        'sha256:' +
        Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')
      );
    } catch {
      /* fall through to plain */
    }
  }
  return 'plain:' + b64(pw);
}

function persistCredentials(creds) {
  localStorage.setItem(CREDS_KEY, JSON.stringify(creds));
}

function ensureCredentials() {
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email) return parsed;
    }
  } catch {
    /* fall through */
  }
  return { email: DEFAULT_EMAIL, passwordHash: null };
}

export function currentAdminEmail() {
  return ensureCredentials().email;
}

export async function verifyAdminLogin(email, password) {
  const creds = ensureCredentials();
  if (creds.email !== email.trim()) return false;
  const hashed = await hashPassword(password);
  if (creds.passwordHash) return creds.passwordHash === hashed;
  // First run / partial seed — accept the known default and upgrade storage.
  if (creds.email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
    persistCredentials({ email: creds.email, passwordHash: hashed });
    return true;
  }
  if (creds.passwordPlain && creds.passwordPlain === password) {
    persistCredentials({ ...creds, passwordHash: hashed, passwordPlain: undefined });
    return true;
  }
  return false;
}

export async function updateAdminLogin(currentPassword, { email, password }) {
  const creds = ensureCredentials();
  if (!(await verifyAdminLogin(creds.email, currentPassword))) {
    const err = new Error('Current password is incorrect');
    err.code = 'auth/wrong-password';
    throw err;
  }
  const emailNext = String(email || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailNext)) throw new Error('Enter a valid email address');
  if (password.length < 6) throw new Error('Password must be at least 6 characters');
  persistCredentials({ email: emailNext, passwordHash: await hashPassword(password) });
  return { email: emailNext };
}

export async function resetAdminLogin() {
  persistCredentials({
    email: DEFAULT_EMAIL,
    passwordHash: await hashPassword(DEFAULT_PASSWORD),
  });
  return { email: DEFAULT_EMAIL };
}

/* ------------------------------ Session ------------------------------ */

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || !s.email || !s.exp) return null;
    if (Date.now() > s.exp) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function createSession(email) {
  const s = { email, exp: Date.now() + SESSION_HOURS * 3600 * 1000 };
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  return s;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}