import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  User, Shield, Package
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../config/routes.constants';
import { toast } from 'react-toastify';
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
  shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default function Profile() {

  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = (searchParams.get('tab') as Tab) || 'profile';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

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
  }, [activeTab]);

  if (!user) return null;

  const handleCancelOrder = async (orderId: number) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    setCancellingId(orderId);

    try {

      const res = await orderService.cancelOrder(orderId);

      if (res.success) {
        toast.success("Order cancelled successfully");
        fetchOrders();
      } else {
        toast.error(res.message || "Failed to cancel order");
      }

    } catch {
      toast.error("Failed to cancel order");

    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex flex-col lg:flex-row gap-7">

          <div className="flex-1 min-w-0">

            {activeTab === "orders" && (

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

                <div className="px-6 py-6">

                  {ordersLoading ? (

                    <div className="space-y-3">
                      {[0,1,2].map(i => (
                        <OrderRowSkeleton key={i} />
                      ))}
                    </div>

                  ) : orders.length === 0 ? (

                    <div className="text-center py-16">

                      <Package className="w-7 h-7 text-indigo-300 mx-auto mb-4"/>

                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        No orders yet
                      </h4>

                      <Link to={ROUTES.PRODUCTS}>
                        <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl">
                          Start Shopping
                        </button>
                      </Link>

                    </div>

                  ) : (

                    <div className="space-y-4">

                      {orders.map((order:any) => {

                        const statusClass =
                          ORDER_STATUS_COLORS[order.status?.toLowerCase?.()] ??
                          "bg-gray-50 text-gray-600 border-gray-200";

                        return (

                          <div
                            key={order.id}
                            className="border border-gray-100 rounded-2xl p-5 hover:border-indigo-200 transition"
                          >

                            <div className="flex items-center justify-between mb-3">

                              <p className="font-bold text-gray-900 text-sm">
                                Order #{order.order_number}
                              </p>

                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full border capitalize ${statusClass}`}
                              >
                                {order.status}
                              </span>

                            </div>

                            <div className="flex items-center justify-between">

                              <div className="flex items-center gap-4 text-xs text-gray-400">

                                <span>
                                  Total
                                  <span className="font-bold text-gray-700 ml-1">
                                    ₹{parseFloat(order.total).toLocaleString("en-IN")}
                                  </span>
                                </span>

                                {order.created_at && (
                                  <span>
                                    {new Date(order.created_at).toLocaleDateString("en-IN",{
                                      day:"numeric",
                                      month:"short",
                                      year:"numeric"
                                    })}
                                  </span>
                                )}

                              </div>

                              {order.status === "pending" && (

                                <button
                                  disabled={cancellingId === order.id}
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1 rounded-lg disabled:opacity-50"
                                >

                                  {cancellingId === order.id
                                    ? "Cancelling..."
                                    : "Cancel Order"}

                                </button>

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