import { useState, useEffect } from 'react';
import { Search, Eye, Download, Edit, Trash2 } from 'lucide-react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { apiService } from '../../api/apiService';

interface Order {
    id: string;
    customer: string;
    email: string;
    total: number;
    items: number;
    status: string;
    date: string;
    address?: string;
    phone?: string;
}


interface StatusOption {
    value: string;
    label: string;
}

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const updateStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {
            const response = await apiService.getOrders();
            if (response.success && response.data) {
                setOrders(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders(); // Initial fetch
        const interval = setInterval(fetchOrders, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<StatusOption>(statusOptions[0]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState<StatusOption | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        customer: '',
        email: '',
        total: '',
        items: '',
        address: '',
        phone: '',
        status: 'pending',
    });

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: 'success' | 'warning' | 'primary' | 'error' | 'secondary'; label: string }> = {
            completed: { variant: 'success', label: 'Completed' },
            pending: { variant: 'warning', label: 'Pending' },
            processing: { variant: 'primary', label: 'Processing' },
            cancelled: { variant: 'error', label: 'Cancelled' },
            shipped: { variant: 'secondary', label: 'Shipped' },
        };
        const config = variants[status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const handleUpdateStatus = () => {
        if (!selectedOrder || !newStatus) return;

        // Optimistic update
        const updatedOrders = orders.map(order =>
            order.id === selectedOrder.id
                ? { ...order, status: newStatus.value }
                : order
        );
        setOrders(updatedOrders);

        // TODO: Call API to update status
        // await apiService.updateOrderStatus(selectedOrder.id, newStatus.value);

        toast.success(`Order ${selectedOrder.id} status updated to ${newStatus.label}`);
        setIsViewModalOpen(false);
        setNewStatus(null);

        // Refresh orders to ensure sync
        fetchOrders();
    };

    const handleEditOrder = () => {
        if (!selectedOrder) return;
        setIsLoading(true);
        setTimeout(() => {
            setOrders(orders.map(o =>
                o.id === selectedOrder.id
                    ? {
                        ...o,
                        customer: formData.customer,
                        email: formData.email,
                        total: Number(formData.total),
                        items: Number(formData.items),
                        address: formData.address,
                        phone: formData.phone,
                        status: formData.status,
                    }
                    : o
            ));
            setIsEditModalOpen(false);
            setSelectedOrder(null);
            setFormData({ customer: '', email: '', total: '', items: '', address: '', phone: '', status: 'pending' });
            setIsLoading(false);
            toast.success('Order updated successfully!');
        }, 1000);
    };

    const handleDeleteOrder = () => {
        if (!selectedOrder) return;
        setIsLoading(true);
        setTimeout(() => {
            setOrders(orders.filter(o => o.id !== selectedOrder.id));
            setIsDeleteDialogOpen(false);
            setSelectedOrder(null);
            setIsLoading(false);
            toast.success('Order deleted successfully!');
        }, 1000);
    };

    const openViewModal = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(updateStatusOptions.find(opt => opt.value === order.status) || null);
        setIsViewModalOpen(true);
    };

    const openEditModal = (order: Order) => {
        setSelectedOrder(order);
        setFormData({
            customer: order.customer,
            email: order.email,
            total: String(order.total),
            items: String(order.items),
            address: order.address || '',
            phone: order.phone || '',
            status: order.status,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteDialog = (order: Order) => {
        setSelectedOrder(order);
        setIsDeleteDialogOpen(true);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus.value === 'all' || order.status === selectedStatus.value;
        return matchesSearch && matchesStatus;
    });

    const stats = [
        { label: 'Total Orders', value: orders.length },
        { label: 'Pending', value: orders.filter(o => o.status === 'pending').length },
        { label: 'Processing', value: orders.filter(o => o.status === 'processing').length },
        { label: 'Completed', value: orders.filter(o => o.status === 'completed').length },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Orders</h1>
                    <p className="text-neutral-600">Manage customer orders and track shipments</p>
                </div>
                <Button size="lg" variant="outline">
                    <Download className="w-5 h-5" />
                    Export Orders
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} variant="elevated" padding="lg">
                        <p className="text-sm text-neutral-600 mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-neutral-900">{stat.value}</h3>
                    </Card>
                ))}
            </div>

            {/* Filters & Search */}
            <Card variant="elevated" padding="lg">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search className="w-5 h-5" />}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={(option) => option && setSelectedStatus(option)}
                            placeholder="Status"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: '#d4d4d4',
                                    '&:hover': { borderColor: '#7c3aed' },
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isSelected ? '#7c3aed' : state.isFocused ? '#f5f3ff' : 'white',
                                    color: state.isSelected ? 'white' : '#171717',
                                }),
                            }}
                        />
                    </div>
                </div>
            </Card>

            {/* Orders Table */}
            <Card variant="elevated" padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-neutral-900">{order.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-neutral-900">{order.customer}</p>
                                            <p className="text-sm text-neutral-500">{order.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-700">{order.items} items</td>
                                    <td className="px-6 py-4 font-semibold text-neutral-900">₹{order.total.toLocaleString()}</td>
                                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                    <td className="px-6 py-4 text-neutral-600">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openViewModal(order)}
                                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4 text-neutral-600" />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(order)}
                                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4 text-primary-600" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteDialog(order)}
                                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200">
                    <p className="text-sm text-neutral-600">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            Previous
                        </Button>
                        <Button variant="outline" size="sm">
                            Next
                        </Button>
                    </div>
                </div>
            </Card>

            {/* View Order Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Order Details"
                size="lg"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        {/* Order Info */}
                        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-200">
                            <div>
                                <label className="text-sm font-medium text-neutral-600">Order ID</label>
                                <p className="text-lg font-bold text-neutral-900">{selectedOrder.id}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-neutral-600">Date</label>
                                <p className="text-neutral-900">{selectedOrder.date}</p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div>
                            <h3 className="font-semibold text-neutral-900 mb-3">Customer Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-neutral-600">Name</label>
                                    <p className="text-neutral-900">{selectedOrder.customer}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-600">Email</label>
                                    <p className="text-neutral-900">{selectedOrder.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-600">Phone</label>
                                    <p className="text-neutral-900">{selectedOrder.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-600">Address</label>
                                    <p className="text-neutral-900">{selectedOrder.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div>
                            <h3 className="font-semibold text-neutral-900 mb-3">Order Summary</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-neutral-600">Items</label>
                                    <p className="text-neutral-900">{selectedOrder.items} items</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-600">Total Amount</label>
                                    <p className="text-lg font-bold text-primary-600">₹{selectedOrder.total.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Update Status */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Update Order Status</label>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <Select
                                        options={updateStatusOptions}
                                        value={newStatus}
                                        onChange={(option) => setNewStatus(option)}
                                        placeholder="Select new status"
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderColor: '#d4d4d4',
                                                '&:hover': { borderColor: '#7c3aed' },
                                            }),
                                            option: (base, state) => ({
                                                ...base,
                                                backgroundColor: state.isSelected ? '#7c3aed' : state.isFocused ? '#f5f3ff' : 'white',
                                                color: state.isSelected ? 'white' : '#171717',
                                            }),
                                        }}
                                    />
                                </div>
                                <Button
                                    onClick={handleUpdateStatus}
                                    disabled={!newStatus || newStatus.value === selectedOrder.status}
                                >
                                    Update Status
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Edit Order Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Order"
                size="lg"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleEditOrder();
                    }}
                    className="space-y-5"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Customer Name"
                            placeholder="Enter customer name"
                            value={formData.customer}
                            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                            required
                        />

                        <Input
                            type="email"
                            label="Email"
                            placeholder="customer@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="number"
                            label="Total Amount (₹)"
                            placeholder="2999"
                            value={formData.total}
                            onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                            required
                        />

                        <Input
                            type="number"
                            label="Number of Items"
                            placeholder="3"
                            value={formData.items}
                            onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        label="Phone Number"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />

                    <Input
                        label="Shipping Address"
                        placeholder="123 Main St, City"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Order Status</label>
                        <Select
                            options={updateStatusOptions}
                            value={updateStatusOptions.find(opt => opt.value === formData.status)}
                            onChange={(option) => setFormData({ ...formData, status: option?.value || 'pending' })}
                            placeholder="Select status"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: '#d4d4d4',
                                    '&:hover': { borderColor: '#7c3aed' },
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isSelected ? '#7c3aed' : state.isFocused ? '#f5f3ff' : 'white',
                                    color: state.isSelected ? 'white' : '#171717',
                                }),
                            }}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            fullWidth
                            onClick={() => {
                                setIsEditModalOpen(false);
                                setFormData({ customer: '', email: '', total: '', items: '', address: '', phone: '', status: 'pending' });
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" fullWidth isLoading={isLoading}>
                            Update Order
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteOrder}
                title="Delete Order"
                message={`Are you sure you want to delete order "${selectedOrder?.id}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                isLoading={isLoading}
            />
        </div>
    );
}
