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
            {/* Desktop Sidebar */}
            <aside
                className={`admin-sidebar-panel fixed bottom-4 left-4 top-4 z-40 hidden rounded-[30px] text-white transition-all duration-300 lg:block ${isCollapsed ? 'w-20' : 'w-72'
                    }`}
            >
                {/* Logo */}
                <div className="flex h-20 items-center justify-between px-5">
                    {!isCollapsed && (
                        <Link to={ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/10">
                                <Package className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <span className="block text-lg font-semibold tracking-tight text-white">Admin Panel</span>
                                <span className="text-[11px] uppercase tracking-[0.22em] text-white/40">Operations</span>
                            </div>
                        </Link>
                    )}

                    <button
                        onClick={onToggle}
                        className="ml-auto rounded-2xl bg-white/8 p-2 text-white/70 transition-colors hover:bg-white/12 hover:text-white"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 p-4">
                    {ADMIN_NAV_ITEMS.map((item) => {
                        const Icon = iconMap[item.icon as keyof typeof iconMap];
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`admin-nav-item flex items-center gap-3 ${isActive
                                        ? 'admin-nav-item-active'
                                        : 'text-neutral-300 hover:bg-white/8 hover:text-white'
                                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                                title={isCollapsed ? item.label : ''}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Back to Store */}
                {!isCollapsed && (
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <Link
                            to={ROUTES.HOME}
                            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white/75 transition-colors hover:bg-white/12 hover:text-white"
                        >
                            <Package className="w-4 h-4" />
                            <span>Back to Store</span>
                        </Link>
                    </div>
                )}
            </aside>

            {/* Mobile Sidebar - Simplified for now */}
            <div className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-neutral-900/90 text-white backdrop-blur-xl lg:hidden">
                <div className="flex items-center justify-between px-4 h-16">
                    <Link to={ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                            <Package className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold">Admin</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
