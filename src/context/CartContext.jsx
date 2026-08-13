import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { priceToNumber } from '../data/menu';

const CartContext = createContext(null);

const CART_KEY = 'kudos-cart-v1';
const ADDRESS_KEY = 'kudos-saved-address';

const emptyCart = () => ({ items: [], orderMethod: null, address: '', outlet: null });

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return emptyCart();
    return { ...emptyCart(), ...JSON.parse(raw), orderMethod: null };
  } catch {
    return emptyCart();
  }
}

function loadSavedAddress() {
  try {
    return localStorage.getItem(ADDRESS_KEY) || '';
  } catch {
    return '';
  }
}

const rectCenter = (rect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

/**
 * Global cart store.
 * - orderMethod is cart-level (set once on first add) to avoid mixed carts.
 * - Persisted to localStorage.
 * - Also hosts ordering UI state (active item modal, cart drawer, fly-to-cart).
 */
export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [savedAddress, setSavedAddress] = useState(loadSavedAddress);
  const [activeItem, setActiveItem] = useState(null); // { item, sourceRect }
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(null); // { name, ts }  -  for checkmark feedback
  const [fly, setFly] = useState(null); // { from: {x,y}, ts }  -  fly-to-cart animation

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* storage unavailable */
    }
  }, [cart]);

  const addItem = useCallback((item, { qty = 1, method, address, outlet, sourceRect } = {}) => {
    setCart((prev) => {
      const orderMethod = method ?? prev.orderMethod;
      const exists = prev.items.some((i) => i.name === item.name);
      const items = exists
        ? prev.items.map((i) =>
            i.name === item.name ? { ...i, qty: i.qty + qty } : i
          )
        : [
            ...prev.items,
            {
              name: item.name,
              image: item.image,
              price: priceToNumber(item.price),
              hasPrice: Boolean(item.price),
              qty,
            },
          ];
      return {
        ...prev,
        items,
        orderMethod,
        address: address ?? prev.address,
        outlet: outlet ?? prev.outlet,
      };
    });
    setLastAdded({ name: item.name, ts: Date.now() });
    if (sourceRect) {
      setFly({ from: rectCenter(sourceRect), ts: Date.now() });
    }
  }, []);

  const updateQty = useCallback((name, delta) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items
        .map((i) => (i.name === name ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    }));
  }, []);

  const removeItem = useCallback((name) => {
    setCart((prev) => ({ ...prev, items: prev.items.filter((i) => i.name !== name) }));
  }, []);

  const setOrderMethod = useCallback((method) => {
    setCart((prev) => ({ ...prev, orderMethod: method }));
  }, []);

  const setAddress = useCallback((address) => {
    setCart((prev) => ({ ...prev, address }));
  }, []);

  const setOutlet = useCallback((outlet) => {
    setCart((prev) => ({ ...prev, outlet }));
  }, []);

  const rememberAddress = useCallback((address) => {
    setSavedAddress(address);
    try {
      localStorage.setItem(ADDRESS_KEY, address);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart(emptyCart());
  }, []);

  const openItem = useCallback((item, sourceRect = null) => {
    setActiveItem({ item, sourceRect });
  }, []);

  const closeItem = useCallback(() => setActiveItem(null), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const totalQty = useMemo(
    () => cart.items.reduce((sum, i) => sum + i.qty, 0),
    [cart.items]
  );
  const subtotal = useMemo(
    () => cart.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart.items]
  );

  const value = useMemo(
    () => ({
      cart,
      savedAddress,
      activeItem,
      drawerOpen,
      lastAdded,
      fly,
      totalQty,
      subtotal,
      addItem,
      updateQty,
      removeItem,
      setOrderMethod,
      setAddress,
      setOutlet,
      rememberAddress,
      clearCart,
      openItem,
      closeItem,
      openDrawer,
      closeDrawer,
    }),
    [
      cart,
      savedAddress,
      activeItem,
      drawerOpen,
      lastAdded,
      fly,
      totalQty,
      subtotal,
      addItem,
      updateQty,
      removeItem,
      setOrderMethod,
      setAddress,
      setOutlet,
      rememberAddress,
      clearCart,
      openItem,
      closeItem,
      openDrawer,
      closeDrawer,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}