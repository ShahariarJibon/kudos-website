import { createContext, useContext, useState } from 'react';
import { clearAdminSession, hasAdminSession, saveAdminPassword } from '../services/adminAuth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (hasAdminSession() ? { email: 'admin' } : null));

  const login = async (password) => {
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.status === 401) {
      const err = new Error('Invalid password');
      err.code = 'auth/invalid-credential';
      throw err;
    }
    if (!res.ok) {
      let message = 'Admin API is unavailable  -  check the server configuration';
      try {
        const body = await res.json();
        if (body?.error) message = body.error;
      } catch {
        /* keep default */
      }
      throw new Error(message);
    }
    saveAdminPassword(password);
    setUser({ email: 'admin' });
  };

  const logout = async () => {
    clearAdminSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, initializing: false, login, logout, enabled: true }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);