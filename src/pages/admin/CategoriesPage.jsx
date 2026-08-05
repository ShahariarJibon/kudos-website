import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  AdminPageHeader,
  ConfirmDialog,
  EmptyState,
  Field,
  Modal,
  Spinner,
  TextInput,
  adminBtn,
  adminBtnGhost,
} from '../../components/admin/AdminUI';
import {
  addCategory,
  deleteCategory,
  fetchCategories,
  fetchMenuItems,
  swapOrder,
  updateCategory,
} from '../../services/adminService';

export default function CategoriesPage() {
  const [categories, setCategories] = useState(null);
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
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

  const sorted = useMemo(
    () => (categories ? [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : []),
    [categories]
  );

  const itemCount = (slug) => items.filter((it) => it.category === slug).length;

  const openAdd = () => {
    setEditing(null);
    setName('');
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setName(c.name);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Category name is required');
    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing.id, { name });
        toast.success('Category updated');
      } else {
        const nextOrder = categories.length ? Math.max(...categories.map((c) => c.order ?? 0)) + 1 : 0;
        await addCategory({ name, order: nextOrder });
        toast.success('Category added');
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
    if (itemCount(deleting.id) > 0) {
      toast.error(`Cannot delete — ${itemCount(deleting.id)} menu item(s) still use this category.`);
      setDeleting(null);
      return;
    }
    setDeleteBusy(true);
    try {
      await deleteCategory(deleting.id);
      toast.success('Category deleted');
      setDeleting(null);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteBusy(false);
    }
  };

  const move = async (cat, dir) => {
    const idx = sorted.findIndex((c) => c.id === cat.id);
    const target = sorted[idx + dir];
    if (!target) return;
    try {
      await swapOrder('categories', cat.id, cat.order ?? 0, target.id, target.order ?? 0);
      await load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!categories) return <Spinner full label="Loading categories…" />;

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="Categories"
        subtitle="Groups used on the public menu (e.g. Burgers, Rice Meals)."
        action={
          <button type="button" onClick={openAdd} className={adminBtn}>
            + Add Category
          </button>
        }
      />

      {sorted.length === 0 ? (
        <div className="mt-6">
          <EmptyState message="No categories yet — add one to start grouping menu items." />
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-neutral-100 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-maroon/5">
          {sorted.map((c, i) => (
            <li key={c.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-heading text-sm font-bold text-maroon">{c.name}</p>
                <p className="text-xs text-neutral-500">
                  slug: /{c.slug || c.id} · {itemCount(c.id)} item{itemCount(c.id) === 1 ? '' : 's'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(c, -1)}
                  disabled={i === 0}
                  aria-label={`Move ${c.name} up`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-maroon disabled:opacity-30"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => move(c, 1)}
                  disabled={i === sorted.length - 1}
                  aria-label={`Move ${c.name} down`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-maroon disabled:opacity-30"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(c)}
                  aria-label={`Edit ${c.name}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-maroon"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17zM13.5 6.5l3 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(c)}
                  aria-label={`Delete ${c.name}`}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'}>
        <Field label="Category Name" required hint="Displayed on the menu page. Slug is auto-generated on creation.">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Burgers" />
        </Field>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setModalOpen(false)} disabled={saving} className={adminBtnGhost}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className={adminBtn}>
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Category'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete category?"
        message={`"${deleting?.name}" will be removed from the menu page. Categories that still have items assigned cannot be deleted.`}
        busy={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}