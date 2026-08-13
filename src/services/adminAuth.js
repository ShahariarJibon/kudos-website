/**
 * Admin session  -  a single shared password, kept in sessionStorage only.
 * Closing the tab clears it; the password is sent as the x-admin-password
 * header to /api/admin/* on every request.
 */

const SESSION_KEY = 'kudos-admin-password-v1';

export function hasAdminSession() {
  try {
    return Boolean(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return false;
  }
}

export function saveAdminPassword(password) {
  try {
    sessionStorage.setItem(SESSION_KEY, password);
  } catch {
    /* ignore */
  }
}

export function clearAdminSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
