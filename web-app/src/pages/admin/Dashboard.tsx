import { useNavigate } from 'react-router-dom';
import {
  Package, Users, ShoppingBag, Layers,
  ArrowRight, Plus, AlertCircle,
  Clock,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useDashboard } from '../../hooks/useDashboard';
import { useOrders } from '../../hooks/useOrder';
import { useProducts } from '../../hooks/useProduct';
import { ROUTES } from '../../config/routes.constants';

/* ─────────────────────────────────────────
   Skeleton Helpers
───────────────────────────────────────── */
function StatSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-100 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-3 bg-neutral-200 rounded w-24" />
          <div className="h-8 bg-neutral-200 rounded w-20" />
          <div className="h-3 bg-neutral-100 rounded w-32" />
        </div>
        <div className="w-12 h-12 bg-neutral-200 rounded-xl" />
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4"><div className="h-4 bg-neutral-100 rounded w-20 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-neutral-100 rounded w-28 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-neutral-100 rounded w-16 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-neutral-100 rounded w-20 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-neutral-100 rounded w-24 animate-pulse" /></td>
    </tr>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden animate-pulse">
      <div className="h-32 bg-neutral-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-100 rounded w-1/2" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Stat Card
───────────────────────────────────────── */
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  href?: string;
  delay?: number;
}

function StatCard({ label, value, icon, gradient, iconBg, href, delay = 0 }: StatCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={href ? () => navigate(href) : undefined}
      className={`group relative bg-white rounded-2xl p-6 border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden ${href ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle gradient accent at top */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-80`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500 mb-1">{label}</p>
          <h3 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">
            {value.toLocaleString('en-IN')}
          </h3>
          {href && (
            <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1 group-hover:text-primary-600 transition-colors">
              View all <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </p>
          )}
        </div>

        <div className={`p-3 rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Quick Action
───────────────────────────────────────── */
function QuickAction({
  label,
  description,
  icon,
  gradient,
  onClick,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-neutral-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left w-full"
    >
      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-800 group-hover:text-primary-700 transition-colors">{label}</p>
        <p className="text-xs text-neutral-400 mt-0.5">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 transition-all group-hover:translate-x-0.5" />
    </button>
  );
}

/* ─────────────────────────────────────────
   Status Badge
───────────────────────────────────────── */
function getOrderStatusBadge(status: string) {
  const variants: Record<string, 'success' | 'warning' | 'primary' | 'error' | 'neutral'> = {
    delivered: 'success',
    completed: 'success',
    paid: 'success',
    confirmed: 'primary',
    shipped: 'primary',
    processing: 'primary',
    pending: 'warning',
    cancelled: 'error',
    failed: 'error',
  };
  return <Badge variant={variants[status?.toLowerCase()] || 'neutral'} size="sm">{status}</Badge>;
}

function getProductStatusDot(status: string) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-500',
    inactive: 'bg-neutral-400',
    draft: 'bg-amber-500',
  };
  return <span className={`w-2 h-2 rounded-full ${colors[status?.toLowerCase()] || 'bg-neutral-300'}`} />;
}

/* ─────────────────────────────────────────
   Format Helpers
───────────────────────────────────────── */
function formatCurrency(val: number | string) {
  return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/* ─────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const { data: counts, isLoading: countsLoading, error: countsError } = useDashboard();
  const { data: ordersData, isLoading: ordersLoading } = useOrders(1, 5);
  const { data: productsData, isLoading: productsLoading } = useProducts(1, 5);

  const orders = (ordersData as any)?.data ?? [];
  const products = (productsData as any)?.data ?? [];

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  /* ── Error state ── */
  if (countsError) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-display font-bold text-neutral-900 mb-1">Failed to load dashboard</h3>
        <p className="text-sm text-neutral-500">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ══ HEADER ══ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <p className="text-primary-100 text-sm font-medium mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4" /> {today}
          </p>
          <h1 className="text-3xl font-display font-bold mb-1">{getGreeting()} 👋</h1>
          <p className="text-primary-100/90 text-sm">Here's what's happening with your store today.</p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -right-4 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute top-4 right-32 w-16 h-16 rounded-full bg-white/5" />
      </div>

      {/* ══ STAT CARDS ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {countsLoading ? (
          [...Array(4)].map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Products"
              value={counts?.products_count ?? 0}
              icon={<Package className="w-6 h-6 text-primary-600" />}
              gradient="from-primary-500 to-primary-400"
              iconBg="bg-primary-50"
              href={ROUTES.ADMIN_PRODUCTS}
              delay={0}
            />
            <StatCard
              label="Total Orders"
              value={counts?.orders_count ?? 0}
              icon={<ShoppingBag className="w-6 h-6 text-secondary-600" />}
              gradient="from-secondary-500 to-secondary-400"
              iconBg="bg-secondary-50"
              href={ROUTES.ADMIN_ORDERS}
              delay={50}
            />
            <StatCard
              label="Total Users"
              value={counts?.users_count ?? 0}
              icon={<Users className="w-6 h-6 text-accent-600" />}
              gradient="from-accent-500 to-accent-400"
              iconBg="bg-accent-50"
              href={ROUTES.ADMIN_USERS}
              delay={100}
            />
            <StatCard
              label="Categories"
              value={counts?.categories_count ?? 0}
              icon={<Layers className="w-6 h-6 text-amber-600" />}
              gradient="from-amber-500 to-amber-400"
              iconBg="bg-amber-50"
              href={ROUTES.ADMIN_CATEGORY}
              delay={150}
            />
          </>
        )}
      </div>

      {/* ══ MIDDLE ROW: Recent Orders + Quick Actions ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Orders — spans 2 cols */}
        <Card variant="elevated" padding="none" className="lg:col-span-2">
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h2 className="text-lg font-display font-bold text-neutral-900">Recent Orders</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Latest 5 orders from your store</p>
            </div>
            <button
              onClick={() => navigate(ROUTES.ADMIN_ORDERS)}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-y border-neutral-100 bg-neutral-50/50">
                  <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-400">Order</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-400">Customer</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-400">Amount</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-400">Status</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {ordersLoading ? (
                  [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <ShoppingBag className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
                      <p className="text-sm font-medium text-neutral-400">No orders yet</p>
                      <p className="text-xs text-neutral-300 mt-1">Orders will appear here once customers start purchasing.</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-primary-50/30 transition-colors cursor-pointer group">
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                          #{order.order_number || order.id}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-neutral-700">{order.user?.name ?? '—'}</p>
                          <p className="text-xs text-neutral-400">{order.user?.email_address ?? ''}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="text-sm font-bold text-neutral-900">
                          {formatCurrency(order.total ?? 0)}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        {getOrderStatusBadge(order.status ?? 'pending')}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-sm text-neutral-500">
                        {order.created_at ? formatDate(order.created_at) : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-lg font-display font-bold text-neutral-900 mb-1">Quick Actions</h2>
          <p className="text-xs text-neutral-400 mb-5">Jump to common tasks</p>

          <div className="space-y-3">
            <QuickAction
              label="Add New Product"
              description="Create a new product listing"
              icon={<Plus className="w-5 h-5 text-white" />}
              gradient="from-primary-500 to-primary-600"
              onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
            />
            <QuickAction
              label="View Orders"
              description="Check recent customer orders"
              icon={<ShoppingBag className="w-5 h-5 text-white" />}
              gradient="from-secondary-500 to-secondary-600"
              onClick={() => navigate(ROUTES.ADMIN_ORDERS)}
            />
            <QuickAction
              label="Manage Users"
              description="View and manage user accounts"
              icon={<Users className="w-5 h-5 text-white" />}
              gradient="from-accent-500 to-accent-600"
              onClick={() => navigate(ROUTES.ADMIN_USERS)}
            />
            <QuickAction
              label="Categories"
              description="Organize your product catalog"
              icon={<Layers className="w-5 h-5 text-white" />}
              gradient="from-amber-500 to-amber-600"
              onClick={() => navigate(ROUTES.ADMIN_CATEGORY)}
            />
          </div>
        </Card>
      </div>

      {/* ══ BOTTOM ROW: Products Overview ══ */}
      <Card variant="elevated" padding="none">
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h2 className="text-lg font-display font-bold text-neutral-900">Products Overview</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Your latest products at a glance</p>
          </div>
          <button
            onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
          >
            Manage all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-6 pb-6">
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="border-2 border-dashed border-neutral-200 rounded-xl p-12 text-center">
              <Package className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-neutral-400">No products yet</p>
              <p className="text-xs text-neutral-300 mt-1 mb-4">Start by adding your first product.</p>
              <button
                onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {products.map((product: any) => {
                const image = product.images?.[0];
                const imageUrl = typeof image === 'string' ? image : image?.url;
                const variantCount = product.variants?.length ?? 0;

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl border border-neutral-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    {/* Image */}
                    <div className="aspect-square bg-neutral-100 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-neutral-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3.5">
                      <p className="text-sm font-semibold text-neutral-800 truncate group-hover:text-primary-700 transition-colors">
                        {product.name}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          {getProductStatusDot(product.status)}
                          <span className="text-xs text-neutral-500 capitalize">{product.status}</span>
                        </div>
                        {variantCount > 0 && (
                          <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                            {variantCount} var{variantCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
