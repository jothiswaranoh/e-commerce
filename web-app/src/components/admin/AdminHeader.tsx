import { LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes.constants';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminHeader() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();          // 🔥 THIS IS THE KEY
        navigate(ROUTES.HOME, { replace: true });
    };

    return (
        <header className="sticky top-0 z-30 px-4 pt-4 md:px-8 lg:pt-6">
            <div className="admin-topbar-panel flex h-[76px] items-center justify-between rounded-[30px] px-4 md:px-6">
                <div className="ml-auto flex items-center gap-2.5">
                    <div className="hidden rounded-[22px] border border-white/80 bg-white/70 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] md:block">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                            Admin
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-neutral-900">
                            Admin User
                        </p>
                    </div>

                    <div className="relative group">
                        <button className="flex h-12 items-center gap-2 rounded-full border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,246,247,0.92))] px-2 pr-3 text-neutral-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.1)]">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-600 shadow-[0_8px_18px_rgba(124,58,237,0.24)]">
                                <User className="h-4 w-4" />
                            </div>
                            <span className="hidden text-sm font-medium md:block">Account</span>
                        </button>

                        <div className="absolute right-0 top-full mt-3 w-52 rounded-[24px] border border-white/90 bg-white/95 p-2 shadow-[0_20px_50px_rgba(15,23,42,0.14)] backdrop-blur-2xl opacity-0 invisible transition-all group-hover:visible group-hover:opacity-100">
                            <Link
                                to={ROUTES.HOME}
                                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-neutral-700 transition-colors hover:bg-neutral-50"
                            >
                                <User className="w-4 h-4" />
                                <span className="text-sm">View Store</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 rounded-2xl px-4 py-3 text-red-600 transition-colors hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}