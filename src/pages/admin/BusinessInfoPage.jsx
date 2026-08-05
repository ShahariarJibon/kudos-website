import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AdminPageHeader, Field, Spinner, TextInput, adminBtn } from '../../components/admin/AdminUI';
import { fetchBusinessInfo, saveBusinessInfo } from '../../services/adminService';

const defaultHours = () => [
  { days: 'Saturday – Thursday', open: '12:00 PM', close: '10:30 PM' },
  { days: 'Friday', open: '3:00 PM', close: '11:00 PM' },
];

export default function BusinessInfoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    hours: defaultHours(),
    phone: '',
    email: '',
    facebookUrl: '',
    instagramUrl: '',
    outletAddress: '',
  });

  useEffect(() => {
    fetchBusinessInfo()
      .then((data) => {
        setForm({
          hours: Array.isArray(data.hours) && data.hours.length ? data.hours : defaultHours(),
          phone: data.phone || '',
          email: data.email || '',
          facebookUrl: data.facebookUrl || '',
          instagramUrl: data.instagramUrl || '',
          outletAddress: data.outletAddress || '',
        });
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const setHour = (i, key, value) => {
    const hours = [...form.hours];
    hours[i] = { ...hours[i], [key]: value };
    setForm({ ...form, hours });
  };

  const handleSave = async () => {
    if (!form.phone.trim() && !form.email.trim()) {
      return toast.error('Add at least a phone number or email');
    }
    setSaving(true);
    try {
      await saveBusinessInfo(form);
      toast.success('Business info saved — live on the site now');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner full label="Loading business info…" />;

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="Business Info"
        subtitle="Hours, contact details and socials — reflected live on the Home page, Outlet page and Footer."
      />

      <div className="mt-8 space-y-6">
        {/* Hours */}
        <section className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-maroon/5">
          <h2 className="font-heading text-base font-bold text-maroon">Opening Hours</h2>
          <p className="mt-1 text-xs text-neutral-500">Each row is one time range shown on the public site.</p>
          <div className="mt-4 space-y-3">
            {form.hours.map((h, i) => (
              <div key={i} className="flex flex-wrap items-end gap-3">
                <Field label="Days" className="min-w-44 flex-1">
                  <TextInput value={h.days} onChange={(e) => setHour(i, 'days', e.target.value)} placeholder="Saturday – Thursday" />
                </Field>
                <Field label="Open">
                  <TextInput value={h.open} onChange={(e) => setHour(i, 'open', e.target.value)} placeholder="12:00 PM" className="w-32" />
                </Field>
                <Field label="Close">
                  <TextInput value={h.close} onChange={(e) => setHour(i, 'close', e.target.value)} placeholder="10:30 PM" className="w-32" />
                </Field>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, hours: form.hours.filter((_, j) => j !== i) })}
                  aria-label="Remove this hours row"
                  className="inline-flex h-[42px] w-10 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-redOrange/10 hover:text-redOrange"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, hours: [...form.hours, { days: '', open: '', close: '' }] })}
            className="mt-3 inline-flex min-h-[40px] items-center gap-1.5 rounded-full border-2 border-dashed border-maroon/25 px-4 font-heading text-xs font-bold uppercase tracking-wide text-maroon transition-colors hover:border-orange hover:bg-orange/5"
          >
            + Add row
          </button>
        </section>

        {/* Contact */}
        <section className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-maroon/5">
          <h2 className="font-heading text-base font-bold text-maroon">Contact</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Phone" required>
              <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+88-01750-209096" />
            </Field>
            <Field label="Email" required>
              <TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="kudoseat@gmail.com" />
            </Field>
          </div>
        </section>

        {/* Socials + address */}
        <section className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-maroon/5">
          <h2 className="font-heading text-base font-bold text-maroon">Socials &amp; Outlet Address</h2>
          <div className="mt-4 grid gap-4">
            <Field label="Facebook URL">
              <TextInput type="url" value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} placeholder="https://facebook.com/kudoseat" />
            </Field>
            <Field label="Instagram URL">
              <TextInput type="url" value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} placeholder="https://instagram.com/kudos_eat" />
            </Field>
            <Field label="Outlet Address" hint="Optional — headline address / map link.">
              <TextInput value={form.outletAddress} onChange={(e) => setForm({ ...form, outletAddress: e.target.value })} placeholder="House 12, Road 3, Block A, Bashundhara R/A, Dhaka" />
            </Field>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="button" onClick={handleSave} disabled={saving} className={adminBtn}>
            {saving ? 'Saving…' : 'Save Business Info'}
          </button>
        </div>
      </div>
    </div>
  );
}