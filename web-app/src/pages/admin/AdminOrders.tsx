import { useState } from "react";
import { Package, Clock, CheckCircle, TrendingUp, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import { TableRowSkeleton } from "../../components/ui/Skeleton";

import { useOrders, useUpdateOrder } from "../../hooks/useOrder";
import OrderDataGrid from "../../components/orders/OrderDataGrid";
import OrderDetailsModal from "../../components/orders/OrderDetailsModal";
import { Order } from "../../api/order";

export default function AdminOrders() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const { data, isLoading } = useOrders(page, pageSize);
    const orders = data?.data ?? [];
    const meta = data?.meta;

    const updateMutation = useUpdateOrder();

    const handleUpdateStatus = async (status: string) => {
        if (!selectedOrder) return;
        try {
            await updateMutation.mutateAsync({
                id: selectedOrder.id,
                payload: { status },
            });
            toast.success(`Order ${status}`);
            // Update local selected state if still open
            setSelectedOrder((prev: any) => prev ? { ...prev, status } : null);
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleUpdatePayment = async (payment_status: string) => {
        if (!selectedOrder) return;
        try {
            await updateMutation.mutateAsync({
                id: selectedOrder.id,
                payload: { payment_status },
            });
            toast.success(`Payment marked as ${payment_status}`);
            setSelectedOrder((prev: any) => prev ? { ...prev, payment_status } : null);
        } catch {
            toast.error("Failed to update payment");
        }
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
    };

    // Stats calculation based on current page data
    const totalOrders = meta?.total_count ?? 0;
    const pendingOrders = orders.filter(o => o?.status === "pending").length;
    const completedOrders = orders.filter(o => o?.status === "delivered").length;
    const totalRevenue = orders.reduce((acc, o) => acc + Number(o?.total ?? 0), 0);

    return (
        <div className="space-y-8">
            <div className="admin-hero-panel p-6 md:p-8">
                <div className="relative z-10 max-w-2xl">
                    <span className="admin-kicker">
                        <Sparkles className="mr-2 h-3.5 w-3.5" />
                        Fulfillment Control
                    </span>
                    <h1 className="admin-title mt-4 text-4xl font-semibold text-neutral-900 md:text-5xl">Orders</h1>
                    <p className="admin-copy mt-3 text-base md:text-lg">
                        Manage customer orders and fulfillment with the same premium visual language as the dashboard.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Card className="rounded-[28px] border border-white/80 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">Total Orders</p>
                            <p className="mt-2 text-3xl font-bold text-neutral-900">{totalOrders}</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                            <Package className="h-6 w-6" />
                        </div>
                    </div>
                </Card>

                <Card className="rounded-[28px] border border-white/80 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">Pending</p>
                            <p className="mt-2 text-3xl font-bold text-amber-700">{pendingOrders}</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                            <Clock className="h-6 w-6" />
                        </div>
                    </div>
                </Card>

                <Card className="rounded-[28px] border border-white/80 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">Completed</p>
                            <p className="mt-2 text-3xl font-bold text-green-700">{completedOrders}</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                    </div>
                </Card>

                <Card className="rounded-[28px] border border-white/80 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">Revenue (Page)</p>
                            <p className="mt-2 text-3xl font-bold text-indigo-700">₹{totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                </Card>
            </div>

            <Card padding="none" className="rounded-[30px] border border-white/80 bg-white/78 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
                {isLoading ? (
                    <div className="p-6">
                        <table className="w-full">
                            <tbody>
                                {[...Array(pageSize)].map((_, i) => (
                                    <TableRowSkeleton key={i} cols={6} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <OrderDataGrid
                        autoHeight
                        rows={orders}
                        page={page}
                        pageSize={pageSize}
                        rowCount={meta?.total_count ?? 0}
                        loading={isLoading}
                        onPageChange={setPage}
                        onPageSizeChange={handlePageSizeChange}
                        onView={(order) => {
                            setSelectedOrder(order);
                            setIsDetailsOpen(true);
                        }}
                    />
                )}
            </Card>

            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title={`Order Details: ${selectedOrder?.order_number}`}
                size="lg"
            >
                {selectedOrder && (
                    <OrderDetailsModal
                        order={selectedOrder}
                        onUpdateStatus={handleUpdateStatus}
                        onUpdatePayment={handleUpdatePayment}
                        isLoading={updateMutation.isPending}
                    />
                )}
            </Modal>
        </div>
    );
}
