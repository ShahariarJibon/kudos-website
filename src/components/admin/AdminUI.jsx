/**
 * Shared admin UI primitives — brand-styled (#7F2020 / #FB6C00 / #E73F1E / white),
 * visually distinct from the public site (dashboard look).
 */
import { AnimatePresence, motion } from 'framer-motion';

const inputCls =
  'w-full rounded-lg border border-maroon/15 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800 outline-none transition-colors focus:border-orange focus:bg-white disabled:cursor-not-allowed disabled:opacity-50';

export function AdminPageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-maroon">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, required, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-wide text-neutral-600">
        {label}
        {required && <span className="text-redOrange"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-neutral-400">{hint}</span>}
    </label>
  );
}

export const TextInput = (props) => <input {...props} className={`${inputCls} ${props.className || ''}`} />;

export const TextArea = (props) => (
  <textarea {...props} className={`${inputCls} resize-none ${props.className || ''}`} />
);

export const Select = (props) => (
  <select {...props} className={`${inputCls} ${props.className || ''}`} />
);

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label || 'Toggle'}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 ${
        checked ? 'bg-brand-gradient' : 'bg-neutral-300'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export function Spinner({ label = 'Loading…', full = false }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-neutral-500 ${
        full ? 'min-h-[40vh]' : 'py-6'
      }`}
      role="status"
      aria-label={label}
    >
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-maroon/10 border-t-orange" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function EmptyState({ message = 'Nothing here yet.', action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-maroon/20 bg-white/60 py-14 text-center">
      <p className="text-sm text-neutral-500">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadError({ message, onRetry }) {
  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-redOrange/10 p-6 text-redOrange">
      <p className="font-heading text-base font-bold">Could not load data</p>
      <p className="mt-1 break-words text-sm leading-relaxed">{message}</p>
      <p className="mt-3 text-xs leading-relaxed text-redOrange/80">
        The admin API could not reach Firestore/Storage. Check that ADMIN_PASSWORD and
        FIREBASE_SERVICE_ACCOUNT_KEY are set in Vercel (and the project was redeployed), that
        you&apos;re signed in with the shared password, and that the rules in firestore.rules are published.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-full bg-redOrange px-5 py-2 font-heading text-xs font-bold uppercase tracking-wide text-white transition-all hover:brightness-110"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide = false }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute inset-0 bg-maroon/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`relative w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl ${
              wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'
            } max-h-[92vh] overflow-y-auto`}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-6 py-4">
              <h2 className="font-heading text-lg font-bold text-maroon">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-maroon"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', busy = false, onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title={title || 'Are you sure?'}>
      <p className="text-sm leading-relaxed text-neutral-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="rounded-full border-2 border-maroon/15 px-5 py-2.5 font-heading text-sm font-bold text-maroon transition-colors hover:border-orange hover:bg-orange hover:text-white disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="rounded-full bg-redOrange px-5 py-2.5 font-heading text-sm font-bold text-white shadow transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export const adminBtn =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 font-heading text-sm font-bold uppercase tracking-wide text-white shadow transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50';

export const adminBtnGhost =
  'inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-maroon/15 px-4 py-2 font-heading text-xs font-bold uppercase tracking-wide text-maroon transition-colors hover:border-orange hover:bg-orange/5 disabled:cursor-not-allowed disabled:opacity-40';

export const adminBtnDanger =
  'inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-redOrange/30 px-4 py-2 font-heading text-xs font-bold uppercase tracking-wide text-redOrange transition-colors hover:bg-redOrange hover:text-white disabled:cursor-not-allowed disabled:opacity-40';