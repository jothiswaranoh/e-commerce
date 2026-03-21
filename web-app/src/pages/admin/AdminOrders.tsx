import { useState } from "react";
import { Package, Plus, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import { TableRowSkeleton } from "../../components/ui/Skeleton";

import { useOrders, useUpdateOrder, useCreateOrder } from "../../hooks/useOrder";
import OrderDataGrid from "../../components/orders/OrderDataGrid";
import OrderDetailsModal from "../../components/orders/OrderDetailsModal";
import AddOrderModal from "../../components/orders/AddOrderModal";
import { Order } from "../../api/order";

export default function AdminOrders() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const { data, isLoading } = useOrders(page, pageSize);
    const orders = data?.data ?? [];
    const meta = data?.meta;

    const updateMutation = useUpdateOrder();
    const createMutation = useCreateOrder();

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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">Orders</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        Manage customer orders and fulfillment
                    </p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 font-bold text-white transition-all duration-300 bg-secondary-600 rounded-xl hover:bg-secondary-500 hover:shadow-lg hover:shadow-secondary-500/20 hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                    <span>Add Order</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="group relative bg-white rounded-2xl p-6 border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-500 to-secondary-400 opacity-80`} />
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1">Total Orders</p>
                            <p className="text-3xl font-display font-bold text-neutral-900 tracking-tight">{totalOrders}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-secondary-50 transition-transform duration-300 group-hover:scale-110">
                            <Package className="w-6 h-6 text-secondary-600" />
                        </div>
                    </div>
                </div>

                <div className="group relative bg-white rounded-2xl p-6 border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-500 to-neutral-400 opacity-80`} />
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1">Pending</p>
                            <p className="text-3xl font-display font-bold text-neutral-900 tracking-tight">{pendingOrders}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-neutral-100 transition-transform duration-300 group-hover:scale-110">
                            <Clock className="w-6 h-6 text-neutral-600" />
                        </div>
                    </div>
                </div>

                <div className="group relative bg-white rounded-2xl p-6 border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-80`} />
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1">Completed</p>
                            <p className="text-3xl font-display font-bold text-neutral-900 tracking-tight">{completedOrders}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-50 transition-transform duration-300 group-hover:scale-110">
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </div>

                <div className="group relative bg-white rounded-2xl p-6 border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-400 opacity-80`} />
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1">Revenue (Page)</p>
                            <p className="text-3xl font-display font-bold text-neutral-900 tracking-tight">₹{totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-indigo-50 transition-transform duration-300 group-hover:scale-110">
                            <TrendingUp className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                </div>
            </div>

            <Card padding="none">
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

            <AddOrderModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                isLoading={createMutation.isPending}
                onSave={async (payload) => {
                    try {
                        await createMutation.mutateAsync(payload);
                        toast.success("Order created successfully!");
                        setIsAddOpen(false);
                        setPage(1); // Refresh page 1
                    } catch (error: any) {
                        toast.error(error.message || "Failed to create order");
                    }
                }}
            />
        </div>
    );
}
