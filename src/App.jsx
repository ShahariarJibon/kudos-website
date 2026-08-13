import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingOrder from './components/FloatingOrder';
import ScrollToTop from './components/ScrollToTop';
import ItemModal from './components/ItemModal';
import CartDrawer from './components/CartDrawer';
import CartFlyover from './components/CartFlyover';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Code-split pages  -  only load what's needed.
const Home = lazy(() => import('./pages/Home'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const KudoCafe = lazy(() => import('./pages/KudoCafe'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const OutletLocation = lazy(() => import('./pages/OutletLocation'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BoardPage = lazy(() => import('./pages/BoardPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));

// /admin is a separate, protected section  -  never rendered inside public chrome.
const AdminLogin = lazy(() => import('./pages/admin/LoginPage'));
const RequireAuth = lazy(() => import('./components/admin/RequireAuth'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AdminMenuItems = lazy(() => import('./pages/admin/MenuItemsPage'));
const AdminCategories = lazy(() => import('./pages/admin/CategoriesPage'));
const AdminGallery = lazy(() => import('./pages/admin/GalleryPage'));
const AdminTestimonials = lazy(() => import('./pages/admin/TestimonialsPage'));
const AdminBusinessInfo = lazy(() => import('./pages/admin/BusinessInfoPage'));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center gap-4">
        <span className="h-12 w-12 animate-spin rounded-full border-4 border-maroon/10 border-t-orange" />
        <span className="font-heading text-sm font-medium text-neutral-500">Loading…</span>
      </div>
    </div>
  );
}

function AdminRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="menu-items" element={<AdminMenuItems />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="business-info" element={<AdminBusinessInfo />} />
          <Route path="orders" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Suspense>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/kudocafe" element={<KudoCafe />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/outlets" element={<OutletLocation />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function Shell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Admin panel: standalone layout, no public nav/footer/cart chrome.
  if (isAdmin) return <AdminRoutes />;

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
      <FloatingOrder />
      <ItemModal />
      <CartDrawer />
      <CartFlyover />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Shell />
      </CartProvider>
    </AuthProvider>
  );
}