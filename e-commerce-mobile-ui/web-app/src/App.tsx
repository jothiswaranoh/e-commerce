import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CartProvider>
            <ToastProvider />
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path={ROUTES.PRODUCTS} element={<MainLayout><Products /></MainLayout>} />
              <Route path={ROUTES.PRODUCT_DETAIL} element={<MainLayout><ProductDetail /></MainLayout>} />
              <Route path={ROUTES.CART}element={<ProtectedRoute><MainLayout><Cart /></MainLayout></ProtectedRoute>}/>

              {/* Auth Routes */}
              <Route path={ROUTES.LOGIN} element={<MainLayout><Login /></MainLayout>} />
              <Route path={ROUTES.REGISTER} element={<MainLayout><Register /></MainLayout>} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<MainLayout><ForgotPassword /></MainLayout>} />
              <Route path={ROUTES.RESET_PASSWORD} element={<MainLayout><ResetPassword /></MainLayout>} />
              <Route path={ROUTES.VERIFY_EMAIL} element={<MainLayout><EmailVerification /></MainLayout>} />

              {/* Protected Customer Routes */}
              <Route path={ROUTES.CHECKOUT} element={
                <ProtectedRoute>
                  <MainLayout><Checkout /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.PROFILE} element={
                <ProtectedRoute>
                  <MainLayout><Profile /></MainLayout>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path={ROUTES.ADMIN} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
              <Route path={ROUTES.ADMIN_DASHBOARD} element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout><Dashboard /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.ADMIN_PRODUCTS} element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout><AdminProducts /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.ADMIN_ORDERS} element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout><AdminOrders /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.ADMIN_USERS} element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout><AdminUsers /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.ADMIN_CATEGORY} element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout><AdminCategories /></AdminLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;


