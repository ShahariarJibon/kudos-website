import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNoIndex } from './LoginPage';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true, icon: 'dashboard' },
  { to: '/admin/menu-items', label: 'Menu Items', icon: 'menu' },
  { to: '/admin/categories', label: 'Categories', icon: 'categories' },
  { to: '/admin/gallery', label: 'Gallery', icon: 'gallery' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: 'testimonials' },
  { to: '/admin/business-info', label: 'Business Info', icon: 'business' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
  { to: '/admin/orders', label: 'Orders', icon: 'orders', placeholder: true },
];

const icons = {
  dashboard: <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" />,
  menu: <path d="M4 6h16M4 12h16M4 18h10" />,
  categories: <path d="M3 7h11v4H3zM16 7h5v4h-5zM3 13h6v4H3zM11 13h10v4H11z" />,
  gallery: <path d="M4 4h16v16H4zM4 15l4-4 3 3 4-5 5 6" />,
  testimonials: <path d="M12 3a5 5 0 0 1 5 5c0 2-1 3.5-2.5 4.5V15H9.5v-2.5C8 11.5 7 10 7 8a5 5 0 0 1 5-5zM9.5 17h5v2h-5zM9.5 20.5h5V22h-5z" />,
  business: <path d="M4 10h16v10H4zM8 10V6a4 4 0 0 1 8 0v4" />,
  settings: <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2a2 2 0 1 1-4 0V21a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1h.2a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1z" />,
  orders: <path d="M6 3h12l1 5v13H5V8zM9 8V6a3 3 0 0 1 6 0v2" />,
};

function SidebarLink({ link, onNavigate }) {
  return (
    <li>
      {link.placeholder ? (
        <span
          title="Coming soon"
          className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            {icons[link.icon]}
          </svg>
          {link.label}
          <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide">Soon</span>
        </span>
      ) : (
        <NavLink
          to={link.to}
          end={link.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-brand-gradient text-white shadow' : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            {icons[link.icon]}
          </svg>
          {link.label}
        </NavLink>
      )}
    </li>
  );
}

export default function AdminLayout() {
  useNoIndex();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login', { replace: true });
    } catch (err) {
      toast.error('Could not sign out');
    }
  };

  const email = user?.email || 'staff';

  return (
    <div className="min-h-dvh bg-neutral-100 font-body">
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif' } }} />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-maroon text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-md ring-1 ring-black/10">
              <img src="/images/logo.png" alt="KUDOS logo" className="h-full w-full object-contain" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-heading text-lg font-extrabold italic tracking-wide text-white">
                KUDOS <span className="bg-gradient-to-r from-orange to-redOrange bg-clip-text text-transparent">Admin</span>
              </span>
              <span className="font-heading text-[9px] font-bold uppercase tracking-[0.3em] text-white/60">
                Management Panel
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <SidebarLink key={link.to} link={link} onNavigate={() => setSidebarOpen(false)} />
            ))}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="truncate px-2 text-xs text-white/60">{email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 font-heading text-sm font-bold text-white transition-colors hover:bg-white/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile scrim */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-maroon/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Top bar */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-maroon/10 bg-white/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-maroon hover:bg-maroon/5 lg:hidden"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            </button>
            <span className="hidden text-sm text-neutral-400 sm:block">
              Signed in as <span className="font-semibold text-maroon">{email}</span>
            </span>
          </div>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border-2 border-maroon/15 px-4 font-heading text-xs font-bold uppercase tracking-wide text-maroon transition-colors hover:border-orange hover:bg-orange hover:text-white"
          >
            View public site
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </header>

        <main className="px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}