import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Field, TextInput, adminBtn } from '../../components/admin/AdminUI';

/** Injects a noindex meta so /admin is never indexed by search engines. */
export function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

export default function LoginPage() {
  useNoIndex();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error('Enter the admin password');
      return;
    }
    setBusy(true);
    try {
      await login(password.trim());
      toast.success('Welcome back!');
      navigate('/admin', { replace: true });
    } catch (err) {
      toast.error(err?.code === 'auth/invalid-credential' ? 'Invalid password' : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-hero-gradient px-4 py-10">
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'Inter, sans-serif' } }} />
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-maroon/5">
          <div className="bg-brand-gradient px-8 py-8 text-center text-white">
            <h1 className="font-heading text-2xl font-extrabold">KUDOS Admin</h1>
            <p className="mt-1 text-sm text-white/85">Staff panel — menu &amp; content management</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 px-8 py-8">
            <Field label="Admin password" required>
              <TextInput
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </Field>
            <button type="submit" disabled={busy} className={`${adminBtn} w-full`}>
              {busy ? 'Signing in…' : 'Sign In'}
            </button>
            <p className="rounded-xl bg-orange/10 px-4 py-3 text-center text-xs leading-relaxed text-neutral-600">
              One shared password — set as the{' '}
              <span className="font-semibold text-maroon">ADMIN_PASSWORD</span> environment variable
              in Vercel. No user accounts.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}