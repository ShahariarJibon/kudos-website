import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  AdminPageHeader,
  ConfirmDialog,
  EmptyState,
  Field,
  LoadError,
  Modal,
  Spinner,
  TextInput,
  adminBtn,
  adminBtnGhost,
} from '../../components/admin/AdminUI';
import { addGalleryImage, deleteGalleryImage, fetchGallery, swapOrder, uploadImage } from '../../services/adminService';

export default function GalleryAdminPage() {
  const [images, setImages] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const load = async () => {
    setImages(await fetchGallery());
  };

  useEffect(() => {
    load().catch((err) => setLoadError(err?.message || 'Something went wrong'));
  }, []);

  const retry = () => {
    setLoadError(null);
    setImages(null);
    load().catch((err) => setLoadError(err?.message || 'Something went wrong'));
  };

  const sorted = useMemo(
    () => (images ? [...images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : []),
    [images]
  );

  const handleUpload = async () => {
    if (!files.length) return toast.error('Choose at least one image');
    setUploading(true);
    const nextOrder = images.length ? Math.max(...images.map((g) => g.order ?? 0)) + 1 : 0;
    try {
      let order = nextOrder;
      for (const file of files) {
        const imageUrl = await uploadImage(file, 'gallery');
        await addGalleryImage({ imageUrl, caption: caption.trim(), order });
        order += 1;
      }
      toast.success(`${files.length} image${files.length === 1 ? '' : 's'} uploaded`);
      setUploadOpen(false);
      setFiles([]);
      setCaption('');
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const move = async (img, dir) => {
    const idx = sorted.findIndex((g) => g.id === img.id);
    const target = sorted[idx + dir];
    if (!target) return;
    try {
      await swapOrder('galleryImages', img.id, img.order ?? 0, target.id, target.order ?? 0);
      await load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteGalleryImage(deleting.id);
      toast.success('Image removed from gallery');
      setDeleting(null);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteBusy(false);
    }
  };

  if (!images) {
    if (loadError) return <LoadError message={loadError} onRetry={retry} />;
    return <Spinner full label="Loading gallery…" />;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Gallery"
        subtitle="Photos shown in the public gallery. Upload multiple at once  -  they appear in order."
        action={
          <button type="button" onClick={() => setUploadOpen(true)} className={adminBtn}>
            + Upload Images
          </button>
        }
      />

      {sorted.length === 0 ? (
        <div className="mt-6">
          <EmptyState message="The gallery is empty  -  upload your first photos." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((g, i) => (
            <div key={g.id} className="group relative overflow-hidden rounded-xl bg-white shadow-card ring-1 ring-maroon/5">
              <img src={g.imageUrl} alt={g.caption || 'Gallery image'} className="aspect-[3/4] w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-maroon/60 via-transparent to-maroon/80 p-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => setDeleting(g)}
                    aria-label="Delete image"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-redOrange transition-colors hover:bg-redOrange hover:text-white"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate px-1 text-xs font-medium text-white">{g.caption || 'Gallery'}</span>
                  <div className="flex shrink-0">
                    <button
                      type="button"
                      onClick={() => move(g, -1)}
                      disabled={i === 0}
                      aria-label="Move image up"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40 disabled:opacity-30"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => move(g, 1)}
                      disabled={i === sorted.length - 1}
                      aria-label="Move image down"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40 disabled:opacity-30"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload modal */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Gallery Images">
        <Field label="Images" required hint="JPG/PNG, max 5 MB each. Multiple files allowed.">
          <label className="flex min-h-[48px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-maroon/25 px-4 py-6 text-center transition-colors hover:border-orange hover:bg-orange/5">
            {files.length ? (
              <>
                <span className="font-heading text-sm font-bold text-maroon">{files.length} file{files.length === 1 ? '' : 's'} selected</span>
                <span className="text-xs text-neutral-500">{files.map((f) => f.name).join(', ')}</span>
              </>
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-maroon" aria-hidden="true">
                  <path d="M12 16V4m0 0L7 9m5-5 5 5M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-heading text-sm font-bold text-maroon">Click to choose images</span>
              </>
            )}
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
          </label>
        </Field>
        <div className="mt-4">
          <Field label="Caption" hint="Optional  -  applied to all selected images.">
            <TextInput value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Bashundhara flagship outlet" />
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setUploadOpen(false)} disabled={uploading} className={adminBtnGhost}>
            Cancel
          </button>
          <button type="button" onClick={handleUpload} disabled={uploading || !files.length} className={adminBtn}>
            {uploading ? `Uploading ${files.length}…` : 'Upload'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Remove image?"
        message="This image will disappear from the public gallery immediately."
        busy={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}