import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from './AdminUI';

/** Blocks /admin routes until a Firebase auth session exists. */
export default function RequireAuth({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <Spinner full label="Checking session…" />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}