import { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes.constants';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export default function AdminHeader() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { clearCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsOpen(false);
        clearCart();
        await logout();
        navigate(ROUTES.HOME, { replace: true });
    };

    const getUserInitial = () => user?.name?.charAt(0)?.toUpperCase() || 'A';

    return (
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
            <div className="flex items-center justify-end px-4 md:px-8 h-16">
                <div className="flex items-center gap-3">
                    {/* User info — desktop only */}
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-semibold text-neutral-900">
                            {user?.name || 'Admin'}
                        </p>
                        <p className="text-xs text-neutral-500">
                            {user?.email || ''}
                        </p>
                    </div>

                    {/* Avatar + dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(prev => !prev)}
                            className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-all"
                            aria-label="Account menu"
                        >
                            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {getUserInitial()}
                            </div>
                            <ChevronDown
                                className={`hidden md:block w-4 h-4 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-neutral-100 py-2 z-50 animate-fade-in">
                                {/* User info inside dropdown (mobile) */}
                                <div className="md:hidden px-4 py-2 border-b border-neutral-100 mb-1">
                                    <p className="text-sm font-semibold text-neutral-900 truncate">{user?.name || 'Admin'}</p>
                                    <p className="text-xs text-neutral-500 truncate">{user?.email || ''}</p>
                                </div>

                                <Link
                                    to={ROUTES.HOME}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
                                >
                                    <User className="w-4 h-4" />
                                    View Store
                                </Link>

                                <div className="border-t border-neutral-100 my-1" />

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}