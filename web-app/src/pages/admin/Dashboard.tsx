import { TrendingUp, ShoppingBag, Users, DollarSign, ArrowUp, ArrowDown, Package } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function Dashboard() {
    const stats = [
        {
            label: 'Total Revenue',
            value: '₹1,24,500',
            change: '+12.5%',
            isPositive: true,
            icon: DollarSign,
            color: 'from-green-500 to-emerald-500',
        },
        {
            label: 'Total Orders',
            value: '1,234',
            change: '+8.2%',
            isPositive: true,
            icon: ShoppingBag,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            label: 'Total Customers',
            value: '856',
            change: '+15.3%',
            isPositive: true,
            icon: Users,
            color: 'from-purple-500 to-pink-500',
        },
        {
            label: 'Total Products',
            value: '342',
            change: '-2.4%',
            isPositive: false,
            icon: Package,
            color: 'from-orange-500 to-red-500',
        },
    ];

    const recentOrders = [
        { id: '#ORD-001', customer: 'John Doe', amount: '₹2,499', status: 'completed', date: '2025-12-03' },
        { id: '#ORD-002', customer: 'Jane Smith', amount: '₹1,299', status: 'pending', date: '2025-12-03' },
        { id: '#ORD-003', customer: 'Bob Johnson', amount: '₹3,999', status: 'processing', date: '2025-12-02' },
        { id: '#ORD-004', customer: 'Alice Williams', amount: '₹899', status: 'completed', date: '2025-12-02' },
        { id: '#ORD-005', customer: 'Charlie Brown', amount: '₹5,499', status: 'cancelled', date: '2025-12-01' },
    ];

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'success' | 'warning' | 'primary' | 'error'> = {
            completed: 'success',
            pending: 'warning',
            processing: 'primary',
            cancelled: 'error',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard</h1>
                <p className="text-neutral-600">Welcome back! Here's what's happening with your store today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} variant="elevated" padding="lg" hoverable>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-neutral-900 mb-2">{stat.value}</h3>
                                <div className="flex items-center gap-1">
                                    {stat.isPositive ? (
                                        <ArrowUp className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <ArrowDown className="w-4 h-4 text-red-600" />
                                    )}
                                    <span className={`text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.change}
                                    </span>
                                    <span className="text-sm text-neutral-500">vs last month</span>
                                </div>
                            </div>

                            <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart Placeholder */}
                <Card variant="elevated" padding="lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-neutral-900">Revenue Overview</h2>
                        <select className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                        </select>
                    </div>
                    <div className="h-64 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <TrendingUp className="w-16 h-16 text-primary-400 mx-auto mb-2" />
                            <p className="text-neutral-600">Chart visualization would go here</p>
                        </div>
                    </div>
                </Card>

                {/* Top Products */}
                <Card variant="elevated" padding="lg">
                    <h2 className="text-xl font-bold text-neutral-900 mb-6">Top Selling Products</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-neutral-100 rounded-lg"></div>
                                <div className="flex-1">
                                    <p className="font-semibold text-neutral-900">Product Name {i}</p>
                                    <p className="text-sm text-neutral-600">{50 - i * 5} sold</p>
                                </div>
                                <p className="font-bold text-neutral-900">₹{(i * 1299).toLocaleString()}</p>
                            </div>
                        ))}
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
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-neutral-900">{order.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-neutral-700">{order.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-neutral-900">{order.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-neutral-600">{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
