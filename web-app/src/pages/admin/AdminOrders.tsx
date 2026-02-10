import { useState } from "react";
import { Package, Clock, CheckCircle, TrendingUp } from "lucide-react";
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Orders</h1>
                    <p className="text-neutral-600 mt-1">
                        Manage customer orders and fulfillment
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-600">Total Orders</p>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{totalOrders}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-600">Pending</p>
                            <p className="text-2xl font-bold text-amber-700 mt-1">{pendingOrders}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-600">Completed</p>
                            <p className="text-2xl font-bold text-green-700 mt-1">{completedOrders}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-600">Revenue (Page)</p>
                            <p className="text-2xl font-bold text-indigo-700 mt-1">₹{totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                </Card>
            </div>

            <Card padding="none">
                {isLoading ? (
                    <div className="p-6">
                        <table className="w-full">
                            <tbody>
                                {[...Array(pageSize)].map((_, i) => (
                                    <TableRowSkeleton key={i} columns={6} />
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
