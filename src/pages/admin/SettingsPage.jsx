import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { updateAdminLogin, resetAdminLogin, DEFAULT_EMAIL, DEFAULT_PASSWORD } from '../../services/adminAuth';
import { AdminPageHeader, Field, TextInput, adminBtn, adminBtnGhost, adminBtnDanger } from '../../components/admin/AdminUI';

export default function SettingsPage() {
  const { user, updateUserEmail, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!email.trim() || password.length < 6) {
      toast.error('Enter a valid email and a password of at least 6 characters');
      return;
    }
    if (password !== confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (!currentPassword) {
      toast.error('Enter your current password');
      return;
    }
    setBusy(true);
    try {
      const next = await updateAdminLogin(currentPassword, { email, password });
      updateUserEmail(next.email);
      setPassword('');
      setConfirm('');
      setCurrentPassword('');
      toast.success('Login credentials updated');
    } catch (err) {
      toast.error(err?.message || 'Could not update credentials');
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const next = await resetAdminLogin();
      updateUserEmail(next.email);
      toast.success('Credentials reset to defaults');
      await logout();
      navigate('/admin/login', { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Could not reset credentials');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif' } }} />
      <AdminPageHeader
        title="Settings"
        subtitle="Change the admin sign-in email and password used to access this panel."
      />

      <form onSubmit={handleSave} className="mt-8 space-y-5 rounded-2xl bg-white p-6 shadow-card ring-1 ring-maroon/5 sm:p-8">
        <h2 className="font-heading text-base font-bold text-maroon">Login credentials</h2>

        <Field label="Current password" hint="Leave blank when using the default sign-in for the first time" required>
          <TextInput
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="New admin email" required>
            <TextInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              placeholder="admin@gmail.com"
            />
          </Field>
          <Field label="New password" required>
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </Field>
        </div>

        <Field label="Confirm new password" required>
          <TextInput
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </Field>

        <div className="flex justify-end">
          <button type="submit" disabled={busy} className={adminBtn}>
            {busy ? 'Saving…' : 'Update Credentials'}
          </button>
        </div>
      </form>

      <div className="mt-8 rounded-2xl border border-maroon/10 bg-white/70 p-6">
        <h2 className="font-heading text-base font-bold text-maroon">Reset to defaults</h2>
        <p className="mt-1 text-sm leading-relaxed text-neutral-500">
          Restore the original sign-in: <span className="font-semibold text-maroon">{DEFAULT_EMAIL}</span>{' '}
          / <span className="font-semibold text-maroon">{DEFAULT_PASSWORD}</span>. You will be signed out.
        </p>
        <button type="button" onClick={handleReset} disabled={busy} className={`mt-4 ${adminBtnDanger}`}>
          Reset credentials
        </button>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-neutral-400">
        Credentials are stored in this browser and are not shared across devices. Passwords are kept
        hashed whenever the browser supports Web Crypto.
      </p>
      <div className="mt-4 flex items-center">
        <button type="button" onClick={() => navigate('/admin')} className={adminBtnGhost}>
          Back to dashboard
        </button>
      </div>
    </div>
  );
}