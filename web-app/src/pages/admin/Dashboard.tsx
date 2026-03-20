import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    DollarSign,
    Package,
    ShoppingBag,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useDashboard } from '../../hooks/useDashboard';

export default function Dashboard() {
    const { data: dashboardData, isLoading, error } = useDashboard();

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
        if (label.includes('Customers')) return 'from-primary-500 to-accent-500';
        return 'from-orange-500 to-red-500';
    };

    const formatValue = (val: number | string, type: 'currency' | 'number') => {
        if (type === 'currency') return `₹${Number(val).toLocaleString('en-IN')}`;
        return Number(val).toLocaleString('en-IN');
    };

    if (error) {
        return (
            <div className="flex h-96 flex-col items-center justify-center text-red-500">
                <AlertCircle className="mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold">Failed to load dashboard data</h3>
                <p className="text-sm text-neutral-500">Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="admin-hero-panel p-6 md:p-8">
                <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <span className="admin-kicker">
                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                            Admin Overview
                        </span>
                        <h1 className="admin-title mt-4 text-4xl font-semibold text-neutral-900 md:text-5xl">
                            Dashboard
                        </h1>
                        <p className="admin-copy mt-3 max-w-xl text-base md:text-lg">
                            Welcome back! Here's what's happening with your store today.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="admin-surface-soft rounded-[28px] p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Today</p>
                            <p className="mt-3 text-3xl font-bold text-neutral-900">{recentOrders.length}</p>
                            <p className="mt-2 text-sm text-neutral-600">Recent orders on the live dashboard</p>
                        </div>
                        <div className="rounded-[28px] bg-neutral-900 p-5 text-white shadow-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Top Products</p>
                            <p className="mt-3 text-3xl font-bold">{topProducts.length}</p>
                            <p className="mt-2 text-sm text-white/70">Best performing products tracked here</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="admin-surface-soft h-36 rounded-[28px] animate-pulse" />
                    ))
                ) : (
                    stats.map((stat, index) => {
                        const Icon = getIcon(stat.label);
                        const color = getColor(stat.label);

                        return (
                            <Card
                                key={index}
                                variant="glass"
                                padding="lg"
                                hoverable
                                className="rounded-[28px] border border-white/80 bg-white/78 shadow-[0_18px_48px_rgba(15,23,42,0.06)]"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
                                        <h3 className="mt-3 text-3xl font-bold text-neutral-900">
                                            {formatValue(stat.value, stat.type)}
                                        </h3>
                                        <div className="mt-3 flex items-center gap-1.5">
                                            {stat.isPositive ? (
                                                <ArrowUp className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <ArrowDown className="h-4 w-4 text-red-600" />
                                            )}
                                            <span className={`text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                {stat.change}
                                            </span>
                                            <span className="text-sm text-neutral-500">vs last month</span>
                                        </div>
                                    </div>

                                    <div className={`rounded-2xl bg-gradient-to-br ${color} p-3 text-white shadow-lg`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </section>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.95fr]">
                <Card
                    variant="glass"
                    padding="lg"
                    className="rounded-[30px] border border-white/80 bg-white/78 shadow-[0_18px_48px_rgba(15,23,42,0.06)]"
                >
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Performance</p>
                            <h2 className="mt-2 text-2xl font-semibold text-neutral-900">Revenue Overview</h2>
                        </div>
                        <select className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 outline-none focus:ring-2 focus:ring-primary-200">
                            <option>Last 30 days</option>
                        </select>
                    </div>

                    <div className="flex h-72 items-center justify-center rounded-[28px] border border-white/80 bg-gradient-to-br from-white via-primary-50/50 to-neutral-100">
                        <div className="text-center">
                            <TrendingUp className="mx-auto mb-3 h-16 w-16 text-primary-500" />
                            <p className="font-medium text-neutral-700">Revenue visualization area</p>
                            <p className="mt-1 text-sm text-neutral-500">Designed to feel lighter and more premium.</p>
                        </div>
                    </div>
                </Card>

                <Card
                    variant="glass"
                    padding="lg"
                    className="rounded-[30px] border border-white/80 bg-white/78 shadow-[0_18px_48px_rgba(15,23,42,0.06)]"
                >
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Sales</p>
                        <h2 className="mt-2 text-2xl font-semibold text-neutral-900">Top Products</h2>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-neutral-100 animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-3/4 rounded bg-neutral-100 animate-pulse" />
                                        <div className="h-3 w-1/3 rounded bg-neutral-100 animate-pulse" />
                                    </div>
                                </div>
                            ))
                        ) : topProducts.length === 0 ? (
                            <p className="py-8 text-center text-neutral-500">No sales data yet.</p>
                        ) : (
                            topProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-4 rounded-[24px] border border-white/90 bg-white/70 p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <Package className="h-5 w-5 text-neutral-400" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-neutral-900">{product.name}</p>
                                        <p className="text-sm text-neutral-500">{product.sold} sold</p>
                                    </div>
                                    <p className="whitespace-nowrap font-semibold text-neutral-900">
                                        ₹{Number(product.revenue).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </section>

            <Card
                variant="glass"
                padding="none"
                className="rounded-[30px] border border-white/80 bg-white/78 shadow-[0_18px_48px_rgba(15,23,42,0.06)]"
            >
                <div className="border-b border-neutral-200/80 px-6 py-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Activity</p>
                    <h2 className="mt-2 text-2xl font-semibold text-neutral-900">Recent Orders</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/60">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Order ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Customer
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Date
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-200/80">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="px-6 py-4">
                                            <div className="h-4 animate-pulse rounded bg-neutral-100" />
                                        </td>
                                    </tr>
                                ))
                            ) : recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                                        No recent orders found.
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="transition-colors hover:bg-white/60">
                                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-neutral-900">{order.id}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-neutral-700">{order.customer}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-neutral-900">
                                            ₹{Number(order.amount).toLocaleString('en-IN')}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">{getStatusBadge(order.status)}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-neutral-500">{order.date}</td>
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
