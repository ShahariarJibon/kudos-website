import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  AdminPageHeader,
  ConfirmDialog,
  EmptyState,
  Field,
  Modal,
  Select,
  Spinner,
  TextArea,
  TextInput,
  Toggle,
  adminBtn,
  adminBtnDanger,
  adminBtnGhost,
} from '../../components/admin/AdminUI';
import {
  addMenuItem,
  deleteMenuItem,
  fetchCategories,
  fetchMenuItems,
  swapOrder,
  updateMenuItem,
  uploadImage,
} from '../../services/adminService';

const EMPTY_FORM = { name: '', category: '', price: '', imageUrl: '', description: '', available: true };

export default function MenuItemsPage() {
  const [items, setItems] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const load = async () => {
    const [c, i] = await Promise.all([fetchCategories(), fetchMenuItems()]);
    setCategories(c);
    setItems(i);
  };

  useEffect(() => {
    load().catch((err) => toast.error(err.message));
  }, []);

  const visible = useMemo(() => {
    if (!items) return [];
    const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return filter === 'all' ? sorted : sorted.filter((it) => it.category === filter);
  }, [items, filter]);

  const catLabel = (slug) => categories.find((c) => c.id === slug || c.slug === slug)?.name || slug;

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || '',
      category: item.category || '',
      price: String(item.price ?? ''),
      imageUrl: item.imageUrl || '',
      description: item.description || '',
      available: item.available !== false,
    });
    setFile(null);
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Name is required');
    if (!form.category) return toast.error('Category is required');
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) return toast.error('Price must be a number greater than 0');
    if (!form.imageUrl && !file) return toast.error('Image is required');
    setSaving(true);
    try {
      let imageUrl = form.imageUrl;
      if (file) imageUrl = await uploadImage(file, 'menu');
      const payload = {
        name: form.name.trim(),
        category: form.category,
        price,
        imageUrl,
        description: form.description.trim(),
        available: form.available,
      };
      if (editing) {
        await updateMenuItem(editing.id, payload);
        toast.success('Item updated');
      } else {
        const nextOrder = items.length ? Math.max(...items.map((it) => it.order ?? 0)) + 1 : 0;
        await addMenuItem({ ...payload, order: nextOrder });
        toast.success('Item added');
      }
      setFormOpen(false);
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
      await deleteMenuItem(deleting.id);
      toast.success('Item deleted');
      setDeleting(null);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteBusy(false);
    }
  };

  const toggleAvailable = async (item) => {
    const prev = items;
    const next = !(item.available !== false);
    setItems((list) => list.map((it) => (it.id === item.id ? { ...it, available: next } : it)));
    try {
      await updateMenuItem(item.id, { ...item, available: next });
      toast.success(next ? `"${item.name}" is now available` : `"${item.name}" hidden from menu`);
    } catch (err) {
      setItems(prev);
      toast.error(err.message);
    }
  };

  const move = async (item, dir) => {
    const group = visible;
    const idx = group.findIndex((it) => it.id === item.id);
    const target = group[idx + dir];
    if (!target) return;
    try {
      await swapOrder('menuItems', item.id, item.order ?? 0, target.id, target.order ?? 0);
      await load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!items) return <Spinner full label="Loading menu items…" />;

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Menu Items"
        subtitle="Add, edit, hide or reorder the items shown on the public menu."
        action={
          <button type="button" onClick={openAdd} className={adminBtn}>
            + Add Item
          </button>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="!w-auto min-w-44" aria-label="Filter by category">
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <span className="text-sm text-neutral-500">{visible.length} item{visible.length === 1 ? '' : 's'}</span>
      </div>

      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyState message={filter === 'all' ? 'No menu items yet — add your first one.' : 'No items in this category.'} />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-maroon/5">
          <ul className="divide-y divide-neutral-100">
            {visible.map((item, i) => (
              <li key={item.id} className="flex flex-wrap items-center gap-4 px-4 py-3 sm:px-5">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-maroon/10"
                  width={48}
                  height={48}
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-heading text-sm font-bold text-maroon">
                    {item.name}
                    {item.available === false && (
                      <span className="ml-2 rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                        Hidden
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {catLabel(item.category)} · ৳{item.price}
                  </p>
                </div>

                <Toggle checked={item.available !== false} onChange={() => toggleAvailable(item)} label={`Toggle availability of ${item.name}`} />

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(item, -1)}
                    disabled={i === 0}
                    aria-label={`Move ${item.name} up`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-maroon disabled:opacity-30"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => move(item, 1)}
                    disabled={i === visible.length - 1}
                    aria-label={`Move ${item.name} down`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-maroon disabled:opacity-30"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    aria-label={`Edit ${item.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-maroon"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17zM13.5 6.5l3 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(item)}
                    aria-label={`Delete ${item.name}`}
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
        </div>
      )}

      {/* Add / edit modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Item' : 'Add Item'} wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required>
            <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. 90s Classic Chicken Burger" />
          </Field>
          <Field label="Category" required>
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Price (৳)" required hint="Number only — the ৳ symbol is added automatically.">
            <TextInput type="number" min="0" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="169" />
          </Field>
          <Field label="Available on menu">
            <div className="flex h-[42px] items-center gap-3">
              <Toggle checked={form.available} onChange={(v) => setForm({ ...form, available: v })} label="Available on menu" />
              <span className="text-sm text-neutral-500">{form.available ? 'Visible to customers' : 'Hidden'}</span>
            </div>
          </Field>
          <Field label="Image" required={!form.imageUrl} hint={form.imageUrl ? 'Current image shown; pick a file to replace it.' : 'Upload a photo (JPG/PNG, max 5 MB).'}>
            <div className="flex items-center gap-3">
              {form.imageUrl && (
                <img src={form.imageUrl} alt="Item preview" className="h-14 w-14 rounded-lg object-cover ring-1 ring-maroon/10" width={56} height={56} />
              )}
              <label className="inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-full border-2 border-dashed border-maroon/25 px-4 font-heading text-xs font-bold uppercase tracking-wide text-maroon transition-colors hover:border-orange hover:bg-orange/5">
                {file ? 'Change file' : form.imageUrl ? 'Replace image' : 'Choose image'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            {file && <span className="mt-1 block text-xs text-neutral-500">{file.name}</span>}
          </Field>
          <Field label="Description">
            <TextArea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short tasty description…" />
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setFormOpen(false)} disabled={saving} className={adminBtnGhost}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className={adminBtn}>
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete menu item?"
        message={`"${deleting?.name}" will be removed from the public menu immediately. This cannot be undone.`}
        busy={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}