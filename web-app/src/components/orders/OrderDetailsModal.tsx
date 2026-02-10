import { Order } from "../../api/order";
import Button from "../ui/Button";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";

interface Props {
    order: Order;
    onUpdateStatus: (status: string) => void;
    onUpdatePayment?: (status: string) => void;
    isLoading?: boolean;
}

export default function OrderDetailsModal({ order, onUpdateStatus, onUpdatePayment, isLoading }: Props) {
    const statuses = [
        { value: "pending", label: "Pending", icon: Clock, color: "text-amber-600 bg-amber-50" },
        { value: "confirmed", label: "Confirmed", icon: CheckCircle, color: "text-blue-600 bg-blue-50" },
        { value: "shipped", label: "Shipped", icon: Truck, color: "text-indigo-600 bg-indigo-50" },
        { value: "delivered", label: "Delivered", icon: CheckCircle, color: "text-green-600 bg-green-50" },
        { value: "cancelled", label: "Cancelled", icon: XCircle, color: "text-red-600 bg-red-50" },
    ];

    return (
        <div className="space-y-8">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Customer Details</h3>
                    <p className="font-bold text-neutral-900">{order.user.name}</p>
                    <p className="text-sm text-neutral-600">{order.user.email_address}</p>
                </div>
                <div>
                    <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Order Date</h3>
                    <p className="font-bold text-neutral-900">
                        {order?.created_at ? new Date(order.created_at).toLocaleString() : "N/A"}
                    </p>
                </div>
            </div>

            {/* Status Manager */}
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Update Order Status</h3>
                <div className="flex flex-wrap gap-2">
                    {statuses.map((s) => {
                        const Icon = s.icon;
                        const isActive = order?.status === s.value;
                        return (
                            <button
                                key={s.value}
                                onClick={() => onUpdateStatus(s.value)}
                                disabled={isLoading || isActive}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${isActive
                                    ? `${s.color} border-current shadow-sm`
                                    : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                                    } disabled:opacity-50`}
                            >
                                <Icon className="w-4 h-4" />
                                {s.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Items List */}
            <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Order Items ({order?.order_items?.length ?? 0})
                </h3>
                <div className="border border-neutral-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 text-neutral-500 font-medium">
                            <tr>
                                <th className="px-4 py-3 text-left">Product</th>
                                <th className="px-4 py-3 text-right">Price</th>
                                <th className="px-4 py-3 text-center">Qty</th>
                                <th className="px-4 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {order?.order_items?.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-4 font-medium text-neutral-900">{item.product_name ?? "Unknown Product"}</td>
                                    <td className="px-4 py-4 text-right text-neutral-600">₹{(item.price ?? 0).toFixed(2)}</td>
                                    <td className="px-4 py-4 text-center text-neutral-600">{item.quantity}</td>
                                    <td className="px-4 py-4 text-right font-bold text-neutral-900">₹{(item.total ?? 0).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-neutral-50 font-bold">
                            <tr className="text-neutral-900">
                                <td colSpan={3} className="px-4 py-3 text-right">Total Amount</td>
                                <td className="px-4 py-3 text-right text-lg text-primary-600">₹{Number(order?.total ?? 0).toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Payment Status (Simplified) */}
            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-2xl border border-primary-100">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order?.payment_status === "paid" ? "bg-green-100 text-green-600" : "bg-primary-100 text-primary-600"
                        }`}>
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Payment Status</p>
                        <p className="font-bold text-neutral-900 capitalize">{order?.payment_status ?? "unpaid"}</p>
                    </div>
                </div>
                {order?.payment_status !== "paid" && onUpdatePayment && (
                    <Button
                        size="sm"
                        onClick={() => onUpdatePayment("paid")}
                        isLoading={isLoading}
                    >
                        Mark as Paid
                    </Button>
                )}
            </div>
        </div>
    );
}
