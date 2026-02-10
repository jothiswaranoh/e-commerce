import { TrendingUp, ShoppingBag, Users, DollarSign, ArrowUp, ArrowDown, Package, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useDashboard } from '../../hooks/useDashboard';

export default function Dashboard() {
    const { data: dashboardData, isLoading, error } = useDashboard();

    // Safely access data
    const stats = dashboardData?.data?.stats || [];
    const recentOrders = dashboardData?.data?.recent_orders || [];
    const topProducts = dashboardData?.data?.top_products || [];

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'success' | 'warning' | 'primary' | 'error' | 'neutral'> = {
            completed: 'success',
            paid: 'success',
            pending: 'warning',
            processing: 'primary',
            cancelled: 'error',
            failed: 'error',
        };
        return <Badge variant={variants[status.toLowerCase()] || 'neutral'}>{status}</Badge>;
    };

    const getIcon = (label: string) => {
        if (label.includes('Revenue')) return DollarSign;
        if (label.includes('Orders')) return ShoppingBag;
        if (label.includes('Customers')) return Users;
        return Package;
    };

    const getColor = (label: string) => {
        if (label.includes('Revenue')) return 'from-green-500 to-emerald-500';
        if (label.includes('Orders')) return 'from-blue-500 to-cyan-500';
        if (label.includes('Customers')) return 'from-purple-500 to-pink-500';
        return 'from-orange-500 to-red-500';
    };

    const formatValue = (val: number | string, type: 'currency' | 'number') => {
        if (type === 'currency') return `₹${Number(val).toLocaleString('en-IN')}`;
        return Number(val).toLocaleString('en-IN');
    };

    if (error) {
        return (
            <div className="h-96 flex flex-col items-center justify-center text-red-500">
                <AlertCircle className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold">Failed to load dashboard data</h3>
                <p className="text-sm text-neutral-500">Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard</h1>
                <p className="text-neutral-600">Welcome back! Here's what's happening with your store today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-white rounded-xl animate-pulse border border-gray-100" />
                    ))
                ) : (
                    stats.map((stat, index) => {
                        const Icon = getIcon(stat.label);
                        const color = getColor(stat.label);
                        return (
                            <Card key={index} variant="elevated" padding="lg" hoverable>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-neutral-600 mb-1">{stat.label}</p>
                                        <h3 className="text-3xl font-bold text-neutral-900 mb-2">
                                            {formatValue(stat.value, stat.type)}
                                        </h3>
                                        <div className="flex items-center gap-1">
                                            {stat.isPositive ? (
                                                <ArrowUp className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <ArrowDown className="w-4 h-4 text-red-600" />
                                            )}
                                            <span className={`text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                {stat.change}
                                            </span>
                                            <span className="text-sm text-neutral-500 ml-1">vs last month</span>
                                        </div>
                                    </div>

                                    <div className={`p-3 bg-gradient-to-br ${color} rounded-lg shadow-sm`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart Placeholder */}
                <Card variant="elevated" padding="lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-neutral-900">Revenue Overview</h2>
                        <select className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div className="h-64 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg flex items-center justify-center border border-primary-100/50">
                        <div className="text-center">
                            <TrendingUp className="w-16 h-16 text-primary-400 mx-auto mb-2" />
                            <p className="text-neutral-600 font-medium">Chart visualization coming soon</p>
                        </div>
                    </div>
                </Card>

                {/* Top Products */}
                <Card variant="elevated" padding="lg">
                    <h2 className="text-xl font-bold text-neutral-900 mb-6">Top Selling Products</h2>
                    <div className="space-y-4">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                                        <div className="h-3 bg-gray-100 rounded w-1/4 animate-pulse" />
                                    </div>
                                </div>
                            ))
                        ) : topProducts.length === 0 ? (
                            <p className="text-neutral-500 text-center py-8">No sales data yet.</p>
                        ) : (
                            topProducts.map((product) => (
                                <div key={product.id} className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package className="w-6 h-6 text-neutral-400 m-auto" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-neutral-900 truncate group-hover:text-primary-600 transition-colors">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-neutral-600">{product.sold} sold</p>
                                    </div>
                                    <p className="font-bold text-neutral-900 whitespace-nowrap">
                                        ₹{Number(product.revenue).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card variant="elevated" padding="none">
                <div className="p-6 border-b border-neutral-200">
                    <h2 className="text-xl font-bold text-neutral-900">Recent Orders</h2>
                </div>
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
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="px-6 py-4">
                                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                                        No recent orders found.
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-semibold text-neutral-900">{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-neutral-700">{order.customer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-neutral-900">
                                            ₹{Number(order.amount).toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-neutral-600">{order.date}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
