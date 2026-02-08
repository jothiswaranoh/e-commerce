import { User, LogOut } from 'lucide-react';
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
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
            <div className="flex items-center justify-end px-4 md:px-8 h-16">
                <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-semibold text-neutral-900">
                            Admin User
                        </p>
                        <p className="text-xs text-neutral-500">
                            admin@shophub.com
                        </p>
                    </div>

                    <div className="relative group">
                        <button className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white">
                            <User className="w-5 h-5" />
                        </button>

                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            <Link
                                to={ROUTES.HOME}
                                className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-50"
                            >
                                <User className="w-4 h-4" />
                                <span className="text-sm">View Store</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-neutral-50 text-red-600"
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