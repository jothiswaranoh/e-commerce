import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  User, Package, Heart, ChevronDown, ChevronUp, Mail, Pencil, Check, X, Image as ImageIcon
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../config/routes.constants';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';
import { OrderRowSkeleton } from '../components/ui/Skeleton';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product';
import { addWishlistListener, getWishlist } from '../utils/wishlist';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Input from '../components/ui/Input';
import UserAPI from '../api/users';

type Tab = 'profile' | 'orders' | 'wishlist';

const TAB_META: Record<Tab, { icon: typeof User; label: string }> = {
  profile: { icon: User, label: 'Profile' },
  orders: { icon: Package, label: 'Orders' },
  wishlist: { icon: Heart, label: 'Wishlist' },
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-primary-50 text-primary-700 border-primary-200',
  shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const getOrderItemImage = (item: any) => {
  const images = item?.product?.images;
  if (Array.isArray(images) && images.length > 0) {
    return images[0]?.url || images[0]?.image_url || images[0];
  }
  return null;
};

export default function Profile() {

  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const getTabFromSearchParams = (): Tab => {
    const tab = searchParams.get('tab');
    return tab && tab in TAB_META ? (tab as Tab) : 'profile';
  };

  const initialTab = getTabFromSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileErrors, setProfileErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  useEffect(() => {
    const nextTab = getTabFromSearchParams();
    setActiveTab((current) => (current === nextTab ? current : nextTab));
  }, [searchParams]);

  const fetchOrders = async () => {
    setOrdersLoading(true);

    try {
      const res = await orderService.getOrders();

      if (res.success) {
        setOrders(res.data?.data || []);
      }

    } catch {
      toast.error("Failed to load orders");

    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
    if (activeTab === "wishlist") {
      fetchWishlist();
    }
  }, [activeTab]);

  const fetchWishlist = async () => {
    setWishlistLoading(true);
    try {
      const ids: string[] = [...getWishlist()];

      if (ids.length === 0) {
        setWishlistProducts([]);
        return;
      }

      const results = await Promise.all(ids.map((id) => productService.getProduct(id)));
      const products = results
        .filter((res) => res.success && res.data)
        .map((res) => res.data as Product);

      setWishlistProducts(products);
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "wishlist") return;
    return addWishlistListener(fetchWishlist);
  }, [activeTab]);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      name: user.name || '',
      email: user.email || '',
    });
    setProfileErrors({});
  }, [user]);

  if (!user) return null;

  const validateProfileForm = () => {
    const nextErrors: { name?: string; email?: string } = {};

    if (!profileForm.name.trim()) {
      nextErrors.name = 'Name is required';
    }

    if (!profileForm.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    setProfileErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetProfileEdit = () => {
    setProfileForm({
      name: user.name || '',
      email: user.email || '',
    });
    setProfileErrors({});
    setIsEditingProfile(false);
  };

  const handleProfileSave = async () => {
    if (!validateProfileForm()) return;

    setIsSavingProfile(true);
    try {
      const response = await UserAPI.update(Number(user.id), {
        name: profileForm.name.trim(),
        email_address: profileForm.email.trim(),
      });

      if (!response.success || !response.data) {
        toast.error(response.message || 'Failed to update profile');
        return;
      }

      updateUser({
        ...user,
        name: response.data.name || profileForm.name.trim(),
        email: response.data.email_address || profileForm.email.trim(),
        phone: response.data.phone_number || user.phone,
        role: response.data.role || user.role,
        createdAt: response.data.created_at || user.createdAt,
      });
      setIsEditingProfile(false);
      setProfileErrors({});
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelOrder = (orderId: number) => {
    setOrderToCancel(orderId);
    setIsConfirmModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;

    setCancellingId(orderToCancel);
    setIsConfirmModalOpen(false);

    try {

      const res = await orderService.cancelOrder(orderToCancel);

      if (res.success) {
        toast.success("Order cancelled successfully");
        fetchOrders();
      } else {
        toast.error(res.message || "Failed to cancel order");
      }

    } catch (error: any) {
      toast.error(error?.message || error?.error?.error || "Failed to cancel order");

    } finally {
      setCancellingId(null);
      setOrderToCancel(null);
    }
  };

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrders((current) =>
      current.includes(orderId)
        ? current.filter((id) => id !== orderId)
        : [...current, orderId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* ── Hero / Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 text-white shadow-md">
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-center text-2xl sm:text-4xl font-display font-bold text-white shadow-inner">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-white mb-1">
                My Account
              </h1>
              <p className="text-primary-100/80 text-sm sm:text-lg font-medium">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 z-40 shadow-sm overflow-x-auto hide-scrollbar">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-6 sm:gap-10 min-w-max">
              {(Object.keys(TAB_META) as Tab[]).map((tabKey) => {
                const { icon: TabIcon, label } = TAB_META[tabKey];
                const isActive = activeTab === tabKey;
                return (
                  <button
                    key={tabKey}
                    onClick={() => setActiveTab(tabKey)}
                    className={`flex items-center gap-2 py-4 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
                      isActive 
                        ? 'border-primary-600 text-primary-700' 
                        : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300'
                    }`}
                  >
                    <TabIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-primary-600' : 'text-neutral-400'}`} />
                    {label}
                  </button>
                );
              })}
            </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="min-w-0">
            {activeTab === "profile" && (
              <div className="bg-white border border-neutral-100 rounded-3xl shadow-lg shadow-neutral-200/40 overflow-hidden animate-fade-in">
                <div className="px-6 sm:px-8 py-8 border-b border-neutral-100 bg-neutral-50/50 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-neutral-900">Personal Information</h2>
                    <p className="text-sm text-neutral-500 mt-1">
                      Manage your account details and profile information.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isEditingProfile ? (
                      <>
                        <button
                          type="button"
                          onClick={resetProfileEdit}
                          disabled={isSavingProfile}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleProfileSave}
                          disabled={isSavingProfile}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:from-primary-500 hover:to-accent-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Check className="w-4 h-4" />
                          {isSavingProfile ? 'Saving...' : 'Save changes'}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit profile
                      </button>
                    )}
                  </div>
                </div>

                <div className="px-6 sm:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm px-6 py-5 hover:border-primary-200 transition-colors">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary-600/60 mb-1 flex items-center gap-2">
                       <User className="w-4 h-4" /> Full Name
                    </p>
                    {isEditingProfile ? (
                      <Input
                        value={profileForm.name}
                        onChange={(e) => {
                          setProfileForm((current) => ({ ...current, name: e.target.value }));
                          setProfileErrors((current) => ({ ...current, name: undefined }));
                        }}
                        error={profileErrors.name}
                        placeholder="Enter your full name"
                        leftIcon={<User className="w-4 h-4" />}
                        className="mt-2 h-12 rounded-xl border-neutral-200 bg-neutral-50/60 font-medium text-neutral-900"
                      />
                    ) : (
                      <p className="text-lg font-bold text-neutral-900">{user.name || 'Not provided'}</p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm px-6 py-5 hover:border-primary-200 transition-colors">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary-600/60 mb-1">Email Address</p>
                    {isEditingProfile ? (
                      <Input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => {
                          setProfileForm((current) => ({ ...current, email: e.target.value }));
                          setProfileErrors((current) => ({ ...current, email: undefined }));
                        }}
                        error={profileErrors.email}
                        placeholder="Enter your email address"
                        leftIcon={<Mail className="w-4 h-4" />}
                        className="mt-2 h-12 rounded-xl border-neutral-200 bg-neutral-50/60 font-medium text-neutral-900"
                      />
                    ) : (
                      <p className="text-lg font-bold text-neutral-900">{user.email || 'Not provided'}</p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm px-6 py-5 hover:border-primary-200 transition-colors">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary-600/60 mb-1">Phone Number</p>
                    <p className="text-lg font-bold text-neutral-900">{user.phone || 'Not provided'}</p>
                  </div>
                  <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm px-6 py-5 hover:border-primary-200 transition-colors">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary-600/60 mb-1">Account Role</p>
                    <p className="text-lg font-bold text-neutral-900 capitalize">{user.role}</p>
                  </div>
                  <div className="rounded-2xl border border-neutral-100 bg-neutral-900 px-6 py-5 md:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">Member Since</p>
                    <p className="text-xl font-display font-bold text-white">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-4 animate-fade-in">

                <div className="bg-white border border-neutral-100 rounded-3xl shadow-lg shadow-neutral-200/40 overflow-hidden">
                  <div className="px-4 sm:px-6 lg:px-8 py-6">

                    {ordersLoading ? (
                      <div className="space-y-4">
                        {[0,1,2].map(i => (
                          <OrderRowSkeleton key={i} />
                        ))}
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-20 px-4">
                        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                           <Package className="w-10 h-10 text-primary-400"/>
                        </div>
                        <h4 className="text-2xl font-display font-bold text-neutral-900 mb-3">
                          No orders yet
                        </h4>
                        <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
                           When you place an order, it will appear here so you can track its progress securely.
                        </p>
                        <Link to={ROUTES.PRODUCTS}>
                          <button className="px-8 py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white rounded-2xl font-bold transition-all shadow-md">
                            Start Shopping
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                      {orders.map((order:any) => {
                        const statusClass =
                          ORDER_STATUS_COLORS[order.status?.toLowerCase?.()] ??
                          "bg-neutral-50 text-neutral-600 border-neutral-200";
                        const isExpanded = expandedOrders.includes(order.id);
                        const firstItem = order.order_items?.[0];
                        const previewImage = getOrderItemImage(firstItem);

                        return (
                          <div
                            key={order.id}
                            className={`border rounded-3xl p-5 sm:p-6 transition-all duration-300 ${isExpanded ? 'border-primary-200 shadow-md bg-white' : 'border-neutral-100 bg-white hover:border-primary-100 hover:shadow-sm'}`}
                          >

                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                              <button
                                type="button"
                                onClick={() => toggleOrderDetails(order.id)}
                                className="flex flex-1 items-start gap-4 text-left sm:pr-4"
                              >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 shadow-sm flex items-center justify-center shrink-0">
                                  {previewImage ? (
                                    <img
                                      src={previewImage}
                                      alt={firstItem?.product_name || 'Ordered product'}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <ImageIcon className="w-7 h-7 text-neutral-300" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-display font-bold text-lg text-neutral-900 break-words">
                                    Order #{order.order_number}
                                  </p>
                                  {firstItem?.product_name && (
                                    <p className="mt-1 text-sm font-medium text-neutral-500 truncate">
                                      {firstItem.product_name}
                                      {order.order_items?.length > 1 ? ` +${order.order_items.length - 1} more item${order.order_items.length - 1 > 1 ? 's' : ''}` : ''}
                                    </p>
                                  )}
                                  <p className="mt-2 flex items-center gap-1.5 text-xs text-primary-600 font-bold bg-primary-50 w-fit px-2.5 py-1 rounded-lg">
                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    {isExpanded ? 'Hide items' : 'View structured items'}
                                  </p>
                                </div>
                              </button>

                              <div className="flex items-center gap-3 self-start sm:self-auto">
                                <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-xl border uppercase tracking-wider ${statusClass}`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-neutral-100 pt-4 mt-2">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs font-medium text-neutral-500">
                                <span className="text-base text-neutral-900">
                                  Total: <span className="font-bold text-xl ml-1">₹{parseFloat(order.total).toLocaleString("en-IN")}</span>
                                </span>
                                {order.created_at && (
                                  <span className="sm:border-l sm:border-neutral-200 sm:pl-4">
                                    {new Date(order.created_at).toLocaleDateString("en-IN",{
                                      day:"numeric",
                                      month:"long",
                                      year:"numeric"
                                    })}
                                  </span>
                                )}
                              </div>

                              {order.status === "pending" && (
                                <button
                                  disabled={cancellingId === order.id}
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                                >
                                  {cancellingId === order.id
                                    ? "Cancelling..."
                                    : "Cancel Order"}
                                </button>
                              )}
                            </div>

                            {isExpanded && (
                              <div className="mt-5 border-t border-neutral-100 pt-5 animate-fade-in">
                                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 px-2">
                                  Items Shipped
                                </p>
                                <div className="space-y-3">
                                  {(order.order_items || []).map((item: any) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center justify-between gap-4 rounded-2xl bg-neutral-50 border border-neutral-100 px-5 py-4"
                                    >
                                      <div className="min-w-0">
                                        <p className="text-sm font-bold text-neutral-900">
                                          {item.product_name}
                                        </p>
                                        <p className="text-xs font-medium text-neutral-500 mt-1">
                                          Qty: {item.quantity} · Rate: ₹{Number(item.price).toLocaleString("en-IN")}
                                        </p>
                                      </div>
                                      <p className="text-lg font-bold text-neutral-900 whitespace-nowrap">
                                        ₹{Number(item.total).toLocaleString("en-IN")}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>

                        );
                      })}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="bg-white border border-neutral-100 rounded-3xl shadow-lg shadow-neutral-200/40 overflow-hidden animate-fade-in">
                <div className="px-6 sm:px-8 py-8">
                  {wishlistLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {[0, 1, 2, 3].map((i) => (
                        <OrderRowSkeleton key={i} />
                      ))}
                    </div>
                  ) : wishlistProducts.length === 0 ? (
                    <div className="text-center py-20 px-4">
                      <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                         <Heart className="w-10 h-10 text-pink-400" />
                      </div>
                      <h4 className="text-2xl font-display font-bold text-neutral-900 mb-3">
                        No favorites yet
                      </h4>
                      <p className="text-neutral-500 mb-8 max-w-sm mx-auto font-medium">
                        Your wishlist is empty. Discover items you love and add them here to save for later.
                      </p>
                      <Link to={ROUTES.PRODUCTS}>
                        <button className="px-8 py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold rounded-2xl shadow-md transition-all">
                          Explore Products
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {wishlistProducts.map((product) => (
                        <ProductCard
                          key={String(product.id)}
                          id={String(product.id)}
                          variantId={product.variants?.[0]?.id}
                          name={product.name}
                          price={product.variants?.[0]?.price ?? product.price ?? 0}
                          stock={product.variants?.[0]?.stock ?? 0}
                          images={product.images as any}
                          category={product.category?.name ?? 'Uncategorized'}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      <ConfirmDialog
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setOrderToCancel(null);
        }}
        onConfirm={confirmCancelOrder}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Cancel Order"
        cancelText="Keep Order"
        variant="danger"
        isLoading={cancellingId !== null}
      />
    </div>
  );
}