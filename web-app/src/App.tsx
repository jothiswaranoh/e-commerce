import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './layout/MainLayout';
import AdminLayout from './layout/AdminLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import EmailVerification from './pages/Auth/EmailVerification';
import Profile from './pages/Profile';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import { ROUTES } from './config/routes.constants';
import ToastProvider from './components/ToastProvider';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminCategories from './pages/admin/AdminCategories';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ThemeBootstrap() {
  useEffect(() => {
    const orgSlug = import.meta.env.VITE_ORG_SLUG;
    if (!orgSlug) return;

    fetch(`${import.meta.env.VITE_API_URL}/theme`, {
      headers: { 'X-Org-Slug': orgSlug },
    })
      .then(r => r.json())
      .then((data) => {
        if (!data.primary_color) return;

        const hex = data.primary_color.replace("#", "");
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        const lighten = (percent: number) => {
          const rv = Math.min(255, r + Math.round(255 * percent / 100));
          const gv = Math.min(255, g + Math.round(255 * percent / 100));
          const bv = Math.min(255, b + Math.round(255 * percent / 100));
          return `${rv} ${gv} ${bv}`;
        };

        const darken = (percent: number) => {
          const rv = Math.max(0, r - Math.round(255 * percent / 100));
          const gv = Math.max(0, g - Math.round(255 * percent / 100));
          const bv = Math.max(0, b - Math.round(255 * percent / 100));
          return `${rv} ${gv} ${bv}`;
        };

        const root = document.documentElement;

        root.style.setProperty("--color-primary-50",  lighten(45));
        root.style.setProperty("--color-primary-100", lighten(38));
        root.style.setProperty("--color-primary-200", lighten(28));
        root.style.setProperty("--color-primary-300", lighten(18));
        root.style.setProperty("--color-primary-400", lighten(10));
        root.style.setProperty("--color-primary-500", lighten(5));
        root.style.setProperty("--color-primary-600", `${r} ${g} ${b}`);
        root.style.setProperty("--color-primary-700", darken(10));
        root.style.setProperty("--color-primary-800", darken(20));
        root.style.setProperty("--color-primary-900", darken(30));

        if (data.store_name) document.title = data.store_name;
      })
      .catch(() => {});
  }, []);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <Router>

        <ThemeBootstrap />

        {/* Toast outside contexts to avoid hook timing issues */}
        <ToastProvider />

        <AuthProvider>
          <CartProvider>

            <Routes>

              {/* Customer Routes */}
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path={ROUTES.PRODUCTS} element={<MainLayout><Products /></MainLayout>} />
              <Route path={ROUTES.PRODUCT_DETAIL} element={<MainLayout><ProductDetail /></MainLayout>} />

              <Route
                path={ROUTES.CART}
                element={
                  <ProtectedRoute>
                    <MainLayout><Cart /></MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Auth Routes */}
              <Route path={ROUTES.LOGIN} element={<MainLayout><Login /></MainLayout>} />
              <Route path={ROUTES.REGISTER} element={<MainLayout><Register /></MainLayout>} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<MainLayout><ForgotPassword /></MainLayout>} />
              <Route path={ROUTES.RESET_PASSWORD} element={<MainLayout><ResetPassword /></MainLayout>} />
              <Route path={ROUTES.VERIFY_EMAIL} element={<MainLayout><EmailVerification /></MainLayout>} />

              {/* Protected Customer Routes */}
              <Route
                path={ROUTES.CHECKOUT}
                element={
                  <ProtectedRoute>
                    <MainLayout><Checkout /></MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path={ROUTES.PROFILE}
                element={
                  <ProtectedRoute>
                    <MainLayout><Profile /></MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Redirect */}
              <Route path={ROUTES.ADMIN} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />

              {/* Admin Routes */}
              <Route
                path={ROUTES.ADMIN_DASHBOARD}
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout><Dashboard /></AdminLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path={ROUTES.ADMIN_PRODUCTS}
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout><AdminProducts /></AdminLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path={ROUTES.ADMIN_ORDERS}
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout><AdminOrders /></AdminLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path={ROUTES.ADMIN_USERS}
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout><AdminUsers /></AdminLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path={ROUTES.ADMIN_CATEGORY}
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout><AdminCategories /></AdminLayout>
                  </ProtectedRoute>
                }
              />

            </Routes>

          </CartProvider>
        </AuthProvider>

      </Router>

    </QueryClientProvider>
  );
}

export default App;