import { createContext, useContext, useState } from 'react';
import {
  clearSession,
  createSession,
  getSession,
  verifyAdminLogin,
} from '../services/adminAuth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const s = getSession();
    return s ? { email: s.email } : null;
  });

  const login = async (email, password) => {
    const ok = await verifyAdminLogin(email, password);
    if (!ok) {
      const err = new Error('Invalid email or password');
      err.code = 'auth/invalid-credential';
      throw err;
    }
    const s = createSession(email.trim());
    setUser({ email: s.email });
    return s;
  };

  const updateUserEmail = (email) => {
    const s = createSession(email);
    setUser({ email: s.email });
    return s;
  };

  const logout = async () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, initializing: false, login, updateUserEmail, logout, enabled: true }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);