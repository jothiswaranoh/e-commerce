import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  User, Shield, Package, CheckCircle2,
  Mail, Phone, MapPin
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../config/routes.constants';
import Input from '../components/ui/Input';
import { toast } from 'react-toastify';
import { validatePassword } from '../utils/validators';
import PasswordStrengthIndicator from '../components/auth/PasswordStrengthIndicator';
import { apiService } from '../api/apiService';
import { orderService } from '../services/orderService';
import { OrderRowSkeleton } from '../components/ui/Skeleton';

type Tab = 'profile' | 'security' | 'orders';

const TAB_META: Record<Tab, { icon: typeof User; label: string }> = {
  profile: { icon: User, label: 'Profile' },
  security: { icon: Shield, label: 'Security' },
  orders: { icon: Package, label: 'Orders' },
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  shipped: 'bg-blue-50  text-blue-700  border-blue-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50   text-red-700   border-red-200',
};

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = (searchParams.get('tab') as Tab) || 'profile';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [isLoading, setIsLoading] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await orderService.getOrders();
      if (res.success) setOrders(res.data?.data || []);
    } catch {
      toast.error('Failed to load orders.');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  if (!user) return null;

  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiService.put('/me', profileData) as any;
      if (response.success) {
        if (response.data) updateUser(response.data);
        toast.success('Profile updated successfully! ✅');
      } else {
        toast.error(response.message || 'Update failed');
      }
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!validatePassword(passwordData.newPassword)) {
      toast.error('Password is too weak');
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiService.put('/me/password', {
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword,
      }) as any;
      if (res.success) {
        toast.success('Password updated! 🔒');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(res.message || 'Password update failed');
      }
    } catch {
      toast.error('Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Avatar initial ── */
  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/30 border border-indigo-400/30 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white">
              {initials}
            </div>
            <div>
              <p className="text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-1">My Account</p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{user.name || 'Welcome back'}</h1>
              <p className="text-slate-400 text-sm mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-7">

          {/* ── Sidebar Tabs ── */}
          <div className="w-full lg:w-60 flex-shrink-0">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden sticky top-24">
              {(Object.entries(TAB_META) as [Tab, typeof TAB_META[Tab]][]).map(([tab, meta]) => {
                const Icon = meta.icon;
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-semibold transition-all border-l-2 ${isActive
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-500' : 'text-gray-400'}`} />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div className="flex-1 min-w-0">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                  <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Profile Information</h3>
                    <p className="text-xs text-gray-400">Update your personal details</p>
                  </div>
                </div>
                <form onSubmit={handleProfileUpdate} className="px-6 py-6 space-y-5">
                  <Input
                    label="Full Name"
                    value={profileData.name}
                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                    leftIcon={<User className="w-4 h-4" />}
                  />
                  <Input
                    label="Email"
                    value={profileData.email}
                    disabled
                    leftIcon={<Mail className="w-4 h-4" />}
                  />
                  <Input
                    label="Phone"
                    value={profileData.phone}
                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                    leftIcon={<Phone className="w-4 h-4" />}
                    placeholder="+91 98765 43210"
                  />
                  <Input
                    label="Address"
                    value={profileData.address}
                    onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                    leftIcon={<MapPin className="w-4 h-4" />}
                    placeholder="Your shipping address"
                  />
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-indigo-200 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Saving…
                        </>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4" /> Save Changes</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                  <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Shield className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Security Settings</h3>
                    <p className="text-xs text-gray-400">Update your password</p>
                  </div>
                </div>
                <form onSubmit={handlePasswordChange} className="px-6 py-6 space-y-4 max-w-md">
                  <Input
                    type="password"
                    label="Current Password"
                    value={passwordData.currentPassword}
                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                  <Input
                    type="password"
                    label="New Password"
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                  <PasswordStrengthIndicator password={passwordData.newPassword} />
                  <Input
                    type="password"
                    label="Confirm Password"
                    value={passwordData.confirmPassword}
                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-indigo-200 disabled:opacity-70"
                    >
                      {isLoading ? 'Updating…' : <><Shield className="w-4 h-4" /> Update Password</>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                  <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Package className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Order History</h3>
                    <p className="text-xs text-gray-400">Track and manage your orders</p>
                  </div>
                </div>

                <div className="px-6 py-6">
                  {ordersLoading ? (
                    <div className="space-y-3">
                      {[0, 1, 2].map(i => <OrderRowSkeleton key={i} />)}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Package className="w-7 h-7 text-indigo-300" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h4>
                      <p className="text-gray-400 text-sm mb-6">Start shopping to see your orders here.</p>
                      <Link to={ROUTES.PRODUCTS}>
                        <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-indigo-200">
                          Start Shopping
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order: any) => {
                        const statusClass = ORDER_STATUS_COLORS[order.status?.toLowerCase?.()] ?? 'bg-gray-50 text-gray-600 border-gray-200';
                        return (
                          <div key={order.id} className="border border-gray-100 rounded-2xl p-5 hover:border-indigo-200 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <p className="font-bold text-gray-900 text-sm">Order #{order.order_number}</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full border capitalize ${statusClass}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>Total: <span className="font-bold text-gray-700">₹{parseFloat(order.total).toLocaleString('en-IN')}</span></span>
                              {order.created_at && (
                                <span>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}