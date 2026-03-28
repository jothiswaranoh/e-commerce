import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, ChevronLeft, ChevronRight, Tags } from 'lucide-react';
import { ROUTES, ADMIN_NAV_ITEMS } from '../../config/routes.constants';

interface AdminSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const iconMap = {
    LayoutDashboard,
    Tags,
    Package,
    ShoppingBag,
    Users,
};

export default function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
    const location = useLocation();

    return (
        <>
            {/* ── Desktop Sidebar ── */}
            <aside
                className={`fixed left-0 top-0 bottom-0 bg-neutral-900 text-white transition-all duration-300 z-40 hidden lg:flex flex-col ${isCollapsed ? 'w-16' : 'w-64'
                    }`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800 flex-shrink-0">
                    {!isCollapsed && (
                        <Link to={ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-bold">Admin Panel</span>
                        </Link>
                    )}
                    <button
                        onClick={onToggle}
                        className="p-2 hover:bg-neutral-800 rounded-lg transition-colors ml-auto"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    {ADMIN_NAV_ITEMS.map((item) => {
                        const Icon = iconMap[item.icon as keyof typeof iconMap];
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                                title={isCollapsed ? item.label : ''}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Back to Store — pinned at bottom */}
                {!isCollapsed && (
                    <div className="p-4 border-t border-neutral-800 flex-shrink-0">
                        <Link
                            to={ROUTES.HOME}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-sm"
                        >
                            <Package className="w-4 h-4" />
                            <span>Back to Store</span>
                        </Link>
                    </div>
                )}
            </aside>

            {/* ── Mobile Top Bar ── */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-neutral-900 text-white z-40">
                {/* Brand row */}
                <div className="flex items-center px-4 h-14 border-b border-neutral-800">
                    <Link to={ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5" />
                        </div>
                        <span className="text-base font-bold">Admin</span>
                    </Link>
                </div>

                {/* Scrollable nav links row */}
                <nav className="flex overflow-x-auto scrollbar-hide gap-1 px-2 py-1.5 bg-neutral-950/60">
                    {ADMIN_NAV_ITEMS.map((item) => {
                        const Icon = iconMap[item.icon as keyof typeof iconMap];
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isActive
                                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
