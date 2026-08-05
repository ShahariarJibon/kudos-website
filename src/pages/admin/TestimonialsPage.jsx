import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  AdminPageHeader,
  ConfirmDialog,
  EmptyState,
  Field,
  LoadError,
  Modal,
  Spinner,
  TextArea,
  TextInput,
  adminBtn,
  adminBtnGhost,
} from '../../components/admin/AdminUI';
import {
  addTestimonial,
  deleteTestimonial,
  fetchTestimonials,
  updateTestimonial,
  uploadImage,
} from '../../services/adminService';

const EMPTY_FORM = { customerName: '', rating: 5, text: '', role: '', branch: '', imageUrl: '' };

const Stars = ({ value, onChange, disabled }) => (
  <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        role="radio"
        aria-checked={value === n}
        aria-label={`${n} star${n === 1 ? '' : 's'}`}
        disabled={disabled}
        onClick={() => onChange?.(n)}
        className={`p-1 transition-transform ${disabled ? '' : 'hover:scale-125'}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"
            fill={n <= value ? '#FB6C00' : '#E5E0D8'}
          />
        </svg>
      </button>
    ))}
  </div>
);

const StarsReadonly = ({ value }) => (
  <span className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <svg key={n} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill={n <= value ? '#FB6C00' : '#E5E0D8'} />
      </svg>
    ))}
  </span>
);

export default function TestimonialsAdminPage() {
  const [list, setList] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const load = async () => {
    setList(await fetchTestimonials());
  };

  useEffect(() => {
    load().catch((err) => setLoadError(err?.message || 'Something went wrong'));
  }, []);

  const retry = () => {
    setLoadError(null);
    setList(null);
    load().catch((err) => setLoadError(err?.message || 'Something went wrong'));
  };

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      customerName: t.customerName || '',
      rating: t.rating || 5,
      text: t.text || '',
      role: t.role || '',
      branch: t.branch || '',
      imageUrl: t.imageUrl || '',
    });
    setFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.customerName.trim()) return toast.error('Customer name is required');
    if (!form.text.trim()) return toast.error('Review text is required');
    setSaving(true);
    try {
      let imageUrl = form.imageUrl;
      if (file) imageUrl = await uploadImage(file, 'gallery');
      const payload = {
        customerName: form.customerName.trim(),
        rating: form.rating,
        text: form.text.trim(),
        role: form.role.trim(),
        branch: form.branch.trim(),
        imageUrl,
      };
      if (editing) {
        await updateTestimonial(editing.id, payload);
        toast.success('Testimonial updated');
      } else {
        const nextOrder = list.length ? Math.max(...list.map((t) => t.order ?? 0)) + 1 : 0;
        await addTestimonial({ ...payload, order: nextOrder });
        toast.success('Testimonial added');
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteTestimonial(deleting.id);
      toast.success('Testimonial deleted');
      setDeleting(null);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteBusy(false);
    }
  };

  if (!list) {
    if (loadError) return <LoadError message={loadError} onRetry={retry} />;
    return <Spinner full label="Loading testimonials…" />;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Testimonials"
        subtitle="Reviews shown in the public testimonial slider."
        action={
          <button type="button" onClick={openAdd} className={adminBtn}>
            + Add Testimonial
          </button>
        }
      />

      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState message="No testimonials yet — add your first customer review." />
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-neutral-100 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-maroon/5">
          {list.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              {t.imageUrl ? (
                <img src={t.imageUrl} alt={t.customerName} className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-orange/30" width={48} height={48} loading="lazy" />
              ) : (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-gradient font-heading text-base font-bold text-white">
                  {(t.customerName || '?').charAt(0)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-heading text-sm font-bold text-maroon">{t.customerName}</p>
                  <StarsReadonly value={t.rating || 5} />
                </div>
                <p className="mt-0.5 line-clamp-2 text-sm text-neutral-600">{t.text}</p>
                {(t.role || t.branch) && (
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {t.role}
                    {t.role && t.branch ? ' · ' : ''}
                    {t.branch}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(t)}
                  aria-label={`Edit testimonial from ${t.customerName}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-maroon"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17zM13.5 6.5l3 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(t)}
                  aria-label={`Delete testimonial from ${t.customerName}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-redOrange/10 hover:text-redOrange"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'}>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Customer Name" required>
              <TextInput value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="e.g. Sultan Islam Joy" />
            </Field>
            <Field label="Rating" required>
              <div className="flex h-[42px] items-center rounded-lg bg-neutral-50 px-2">
                <Stars value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} />
              </div>
            </Field>
          </div>
          <Field label="Review Text" required>
            <TextArea rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="What did the customer say?" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role" hint="Optional, e.g. Google Review">
              <TextInput value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Google Review" />
            </Field>
            <Field label="Branch / Source" hint="Optional">
              <TextInput value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} placeholder="e.g. Lalbagh" />
            </Field>
          </div>
          <Field label="Photo" hint="Optional customer photo.">
            <div className="flex items-center gap-3">
              {(form.imageUrl || file) && (
                <img
                  src={file ? URL.createObjectURL(file) : form.imageUrl}
                  alt="Customer preview"
                  className="h-14 w-14 rounded-full object-cover ring-1 ring-maroon/10"
                  width={56}
                  height={56}
                />
              )}
              <label className="inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-full border-2 border-dashed border-maroon/25 px-4 font-heading text-xs font-bold uppercase tracking-wide text-maroon transition-colors hover:border-orange hover:bg-orange/5">
                {file ? 'Change photo' : 'Choose photo'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setModalOpen(false)} disabled={saving} className={adminBtnGhost}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className={adminBtn}>
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Testimonial'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete testimonial?"
        message={`The review from "${deleting?.customerName}" will be removed from the public slider immediately.`}
        busy={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}