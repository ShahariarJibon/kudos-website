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
import {
  addDeal,
  addOffer,
  deleteDeal,
  deleteOffer,
  fetchDeals,
  fetchMenuItems,
  healOrdering,
  swapOrder,
  uid,
  updateOffer,
} from '../../services/adminService';

const moveBtn =
  'inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-maroon disabled:opacity-30';
const rowImg = 'h-12 w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-maroon/10';

function OfferPercentEditor({ row, onSave }) {
  const [value, setValue] = useState(row.discountPercent);
  const dirty = Number(value) !== row.discountPercent;
  return (
    <div className="flex items-center gap-2">
      <Field label="Discount %" className="w-28">
        <TextInput
          type="number"
          min={1}
          max={99}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="!py-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave(value);
          }}
        />
      </Field>
      <button
        type="button"
        onClick={() => onSave(value)}
        disabled={!dirty}
        aria-label={`Save discount for ${row.name}`}
        className={`mt-6 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors disabled:opacity-30 ${
          dirty ? 'bg-orange/10 text-maroon hover:bg-brand-gradient hover:text-white' : 'bg-neutral-100 text-neutral-400'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function ListRow({ item, first, last, onMoveUp, onMoveDown, onDelete, children }) {
  return (
    <li className="flex flex-wrap items-center gap-4 px-5 py-4">
      <div className={rowImg}>
        <img src={item.image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-heading text-sm font-bold text-maroon">{item.name}</p>
        <p className="truncate text-xs text-neutral-500">
          {item.category} · {item.price}
        </p>
      </div>
      {children}
      <div className="flex items-center gap-1">
        <button type="button" onClick={onMoveUp} disabled={first} aria-label={`Move ${item.name} up`} className={moveBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" onClick={onMoveDown} disabled={last} aria-label={`Move ${item.name} down`} className={moveBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Remove ${item.name}`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-redOrange/10 hover:text-redOrange"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </li>
  );
}

export default function DealsPage() {
  const [deals, setDeals] = useState(null);
  const [offers, setOffers] = useState(null);
  const [items, setItems] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [picker, setPicker] = useState(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    const [d, i] = await Promise.all([fetchDeals(), fetchMenuItems()]);
    setDeals(healOrdering(d.deals, 'deals'));
    setOffers(healOrdering(d.offers, 'offers'));
    setItems(i);
  };

  useEffect(() => {
    load().catch((err) => setLoadError(err?.message || 'Something went wrong'));
  }, []);

  const retry = () => {
    setLoadError(null);
    setDeals(null);
    setOffers(null);
    load().catch((err) => setLoadError(err?.message || 'Something went wrong'));
  };

  const itemById = useMemo(() => new Map(items.map((it) => [it.id, it])), [items]);

  const join = (list) =>
    (list || [])
      .map((d) => {
        const it = itemById.get(d.menuItemId);
        return it
          ? {
              id: d.id,
              menuItemId: d.menuItemId,
              order: d.order ?? 0,
              discountPercent: Number(d.discountPercent) || 0,
              name: it.name,
              image: it.imageUrl,
              price: it.price,
              category: it.category,
            }
          : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.order - b.order || String(a.name).localeCompare(String(b.name)));

  const dealRows = useMemo(() => join(deals), [deals, itemById]);
  const offerRows = useMemo(() => join(offers), [offers, itemById]);

  const excludedIds = (kind) => (kind === 'deal' ? dealRows : offerRows).map((r) => r.menuItemId);
  const pickable = useMemo(() => {
    if (!picker || !items.length) return [];
    const excluded = new Set(excludedIds(picker.kind));
    const q = search.trim().toLowerCase();
    return items
      .filter((it) => it.available !== false && !excluded.has(it.id))
      .filter((it) => !q || String(it.name || '').toLowerCase().includes(q))
      .slice(0, 60);
  }, [picker, items, search, dealRows, offerRows]);

  const openPicker = (kind) => {
    setPicker({ kind });
    setSearch('');
    setSelected(new Set());
  };

  /**
   * Add several menu items at once. Each row appears instantly (optimistic,
   * client-generated id, saved in the background) so the picker can stay open.
   */
  const addEntries = (kind, itemIds) => {
    const setter = kind === 'deal' ? setDeals : setOffers;
    const rows = kind === 'deal' ? dealRows : offerRows;
    let nextOrder = rows.length ? Math.max(...rows.map((r) => r.order ?? 0)) + 1 : 0;
    itemIds.forEach((itemId) => {
      const id = uid();
      const entry = {
        id,
        menuItemId: itemId,
        order: nextOrder,
        ...(kind === 'offer' ? { discountPercent: 20 } : {}),
      };
      nextOrder += 1;
      setter((l) => [...l, entry]);
      const save = kind === 'offer' ? addOffer.bind(null, itemId, 20) : addDeal.bind(null, itemId);
      save(id).catch((err) => {
        setter((l) => l.filter((d) => d.id !== id));
        toast.error(err.message);
      });
    });
  };

  const handleAddSelected = () => {
    if (!picker || selected.size === 0) return;
    addEntries(picker.kind, [...selected]);
    setSelected(new Set());
  };

  const move = (kind, row, dir) => {
    const rows = kind === 'deal' ? dealRows : offerRows;
    const idx = rows.findIndex((r) => r.id === row.id);
    const target = rows[idx + dir];
    if (!target) return;
    const colName = kind === 'deal' ? 'deals' : 'offers';
    const prev = kind === 'deal' ? deals : offers;
    const patch = (list) =>
      list.map((d) =>
        d.id === row.id
          ? { ...d, order: target.order }
          : d.id === target.id
            ? { ...d, order: row.order }
            : d
      );
    if (kind === 'deal') setDeals(patch);
    else setOffers(patch);
    swapOrder(colName, row.id, target.id).catch((err) => {
      if (kind === 'deal') setDeals(prev);
      else setOffers(prev);
      toast.error(err.message);
    });
  };

  const savePercent = (row, value) => {
    const pct = Math.max(1, Math.min(99, Math.round(Number(value) || 0)));
    const current = (offers || []).find((d) => d.id === row.id);
    if (!current || pct === Number(current.discountPercent)) return;
    const prevOffers = offers;
    // Optimistic  -  update the badge value instantly, save in the background.
    setOffers((l) => l.map((d) => (d.id === row.id ? { ...d, discountPercent: pct } : d)));
    updateOffer(row.id, pct).catch((err) => {
      setOffers(prevOffers);
      toast.error(err.message);
    });
  };

  const handleDelete = () => {
    if (!deleting) return;
    const { kind, id, name } = deleting;
    const setter = kind === 'deal' ? setDeals : setOffers;
    const list = kind === 'deal' ? deals : offers;
    const entry = (list || []).find((d) => d.id === id);
    const remove = kind === 'deal' ? deleteDeal : deleteOffer;
    setDeleting(null);
    // Optimistic  -  the row disappears instantly, deletion happens in the background.
    setter((l) => l.filter((d) => d.id !== id));
    remove(id).catch((err) => {
      if (entry) setter((l) => [...l, entry]);
      toast.error(err.message);
      toast.error(`"${name}" could not be removed`);
    });
  };

  if (!deals || !offers) {
    if (loadError) return <LoadError message={loadError} onRetry={retry} />;
    return <Spinner full label="Loading deals & offers…" />;
  }

  const Panel = ({ title, subtitle, rows, onAdd, badgeClass }) => (
    <section className="rounded-2xl bg-white shadow-card ring-1 ring-maroon/5">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4">
        <div>
          <h2 className="font-heading text-base font-bold text-maroon">{title}</h2>
          <p className="text-xs text-neutral-500">{subtitle}</p>
        </div>
        <button type="button" onClick={onAdd} className={adminBtn}>
          + Add
        </button>
      </header>
      {rows.length === 0 ? (
        <EmptyState message="No items yet  -  add menu items to this list." />
      ) : (
        <ul className="divide-y divide-neutral-100">
          {rows.map((row, i) => (
            <ListRow
              key={row.id}
              item={row}
              first={i === 0}
              last={i === rows.length - 1}
              onMoveUp={() => move(badgeClass, row, -1)}
              onMoveDown={() => move(badgeClass, row, 1)}
              onDelete={() => setDeleting({ kind: badgeClass, id: row.id, name: row.name })}
            >
              {badgeClass === 'offer' && (
                <OfferPercentEditor row={row} onSave={(v) => savePercent(row, v)} />
              )}
            </ListRow>
          ))}
        </ul>
      )}
    </section>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <AdminPageHeader
        title="Deals & Offers"
        subtitle="Pick which menu items appear on the home page and set their discounts."
      />

      <Panel
        title="Hot Deals  -  home carousel"
        subtitle="Photos that move in the 'OUR HOT DEALS' strip. Use the arrows to rearrange."
        rows={dealRows}
        onAdd={() => openPicker('deal')}
        badgeClass="deal"
      />

      <Panel
        title="Today's Offer  -  discount badges"
        subtitle="Items shown with a yellow discount star. Set the percentage per item and rearrange with the arrows."
        rows={offerRows}
        onAdd={() => openPicker('offer')}
        badgeClass="offer"
      />

      <Modal open={Boolean(picker)} onClose={() => setPicker(null)} title="Add menu items" wide>
        <Field label="Search menu items" hint="Tick several items, then add them all at once. Already-added items are hidden.">
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Chicken Burger"
            autoFocus
          />
        </Field>
        {pickable.length === 0 ? (
          <EmptyState message="No matching items left  -  everything is already added or the search found nothing." />
        ) : (
          <>
            <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
              <span>{pickable.length} item{pickable.length === 1 ? '' : 's'}</span>
              <button
                type="button"
                onClick={() =>
                  setSelected(
                    selected.size === pickable.length
                      ? new Set()
                      : new Set(pickable.map((it) => it.id))
                  )
                }
                className="font-semibold text-maroon hover:text-orange"
              >
                {selected.size === pickable.length ? 'Clear all' : 'Select all'}
              </button>
            </div>
            <ul className="mt-2 max-h-80 divide-y divide-neutral-100 overflow-y-auto rounded-xl ring-1 ring-maroon/10">
              {pickable.map((it) => {
                const checked = selected.has(it.id);
                return (
                  <li key={it.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected((s) => {
                          const next = new Set(s);
                          if (next.has(it.id)) next.delete(it.id);
                          else next.add(it.id);
                          return next;
                        });
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                        checked ? 'bg-orange/10' : 'hover:bg-neutral-50'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                          checked ? 'border-orange bg-brand-gradient text-white' : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {checked && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className={rowImg}>
                        <img src={it.imageUrl} alt="" className="h-full w-full object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-heading text-sm font-bold text-maroon">{it.name}</span>
                        <span className="block truncate text-xs text-neutral-500">
                          {it.category} · {it.price}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">
            {selected.size} selected  -  they appear instantly, saved in the background.
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setPicker(null)} className={adminBtnGhost}>
              Done
            </button>
            <button
              type="button"
              onClick={handleAddSelected}
              disabled={selected.size === 0}
              className={adminBtn}
            >
              + Add {selected.size || ''}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Remove from list?"
        message={`"${deleting?.name}" will be removed from this section on the home page. The menu item itself is not deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}