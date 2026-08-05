import { createContext, useContext, useEffect, useState } from 'react';
import { auth, firebaseEnabled, initFirebase } from '../lib/firebase';

const AuthContext = createContext(null);

let authModulePromise = null;
const getAuthModule = () => {
  if (!authModulePromise) authModulePromise = import('firebase/auth');
  return authModulePromise;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let unsub = null;
    initFirebase().then(async () => {
      if (!auth) {
        setInitializing(false);
        return;
      }
      const { onAuthStateChanged } = await getAuthModule();
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setInitializing(false);
      });
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  const login = async (email, password) => {
    const { signInWithEmailAndPassword } = await getAuthModule();
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    const { signOut } = await getAuthModule();
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, initializing, login, logout, enabled: firebaseEnabled }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);