
import { ShoppingCart, Search, Menu, X, User as UserIcon, Heart, Package, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ROUTES } from '../config/routes.constants';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { NAVBAR, BRAND } from '../config/ui.config';
import { addWishlistListener, getWishlistCount } from '../utils/wishlist';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { itemCount: cartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { clearCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);

  const navLinks = [
    { label: NAVBAR.nav.home, path: ROUTES.HOME },
    { label: NAVBAR.nav.products, path: ROUTES.PRODUCTS },
    { label: NAVBAR.nav.cart, path: ROUTES.CART },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setWishlistCount(0);
      return;
    }

    const syncWishlist = () => setWishlistCount(getWishlistCount());
    syncWishlist();
    return addWishlistListener(syncWishlist);
  }, [isAuthenticated, user?.id]);

  const handleLogout = async () => {
    await logout();
    clearCart();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  const getUserInitial = () => {
    return user?.name?.charAt(0)?.toUpperCase() || 'U';
  };

  const getUserFirstName = () => {
    return user?.name?.split(' ')[0] || 'User';
  };

  return (
    <nav className="sticky top-0 z-50 px-3 pt-3 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-[72px] items-center justify-between rounded-[28px] border border-white/80 bg-white/88 px-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to={ROUTES.HOME} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 shadow-[0_12px_26px_rgba(124,58,237,0.22)]">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="block text-xl font-bold gradient-text">{BRAND.name}</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden rounded-full border border-neutral-200/80 bg-white/80 p-1 md:flex md:gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-100 hover:text-primary-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="mx-8 hidden max-w-md flex-1 items-center gap-4 md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder={NAVBAR.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(searchQuery)}`);
                    setSearchQuery("");
                  }
                }}
                className="w-full rounded-full border border-neutral-200 bg-neutral-50/80 py-2.5 pl-10 pr-4 text-sm text-neutral-700 outline-none transition-all placeholder:text-neutral-400 focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <Link
              to={isAuthenticated ? `${ROUTES.PROFILE}?tab=wishlist` : ROUTES.LOGIN}
              className="relative hidden rounded-2xl border border-transparent bg-white/50 p-2.5 transition-all hover:border-neutral-200 hover:bg-neutral-100 sm:flex"
            >
              <Heart className="w-5 h-5 text-neutral-700" />
              {isAuthenticated && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to={ROUTES.CART}
              className="relative rounded-2xl border border-transparent bg-white/50 p-2.5 transition-all hover:border-neutral-200 hover:bg-neutral-100"
            >
              <ShoppingCart className="w-5 h-5 text-neutral-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="hidden items-center gap-2 rounded-full border border-neutral-200/80 bg-white/90 p-1.5 pr-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:bg-white sm:flex"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-600 text-sm font-bold text-white shadow-[0_8px_20px_rgba(124,58,237,0.2)]">
                    {getUserInitial()}
                  </div>
                  <span className="font-medium text-sm text-neutral-700 max-w-[100px] truncate">
                    {getUserFirstName()}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 z-50 mt-3 w-60 animate-fade-in rounded-[24px] border border-white/90 bg-white/95 py-2 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
                    <div className="border-b border-neutral-100 px-4 py-3">
                      <p className="text-sm font-semibold text-neutral-900 truncate">{user.name || 'User'}</p>
                      <p className="text-xs text-neutral-500 truncate">{user.email || ''}</p>
                    </div>

                    <div className="py-1">
                      <Link
                      to={ROUTES.PROFILE}
                        className="mx-2 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-primary-600" onClick={() => setIsUserMenuOpen(false)}
                      >
                    <UserIcon className="w-4 h-4" />
                  {NAVBAR.menu.myProfile}
                  </Link>
<Link
  to={`${ROUTES.PROFILE}?tab=wishlist`}
  className="mx-2 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-primary-600"
  onClick={() => setIsUserMenuOpen(false)}
>
  <Heart className="w-4 h-4" />
  {NAVBAR.menu.myWishlist}
</Link>

<Link
  to="/profile?tab=orders"
  className="mx-2 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-primary-600"
  onClick={() => setIsUserMenuOpen(false)}
>
  <Package className="w-4 h-4" />
  {NAVBAR.menu.myOrders}
</Link>
                      {user.role === 'admin' && (
                        <Link
                          to={ROUTES.ADMIN_DASHBOARD}
                          className="mx-2 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-primary-600"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          {NAVBAR.menu.adminDashboard}
                        </Link>
                      )}
                    </div>

                    <div className="mt-1 border-t border-neutral-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="mx-2 flex w-[calc(100%-1rem)] items-center gap-2 rounded-2xl px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {NAVBAR.menu.signOut}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-white shadow-[0_12px_28px_rgba(124,58,237,0.2)] transition-all hover:-translate-y-0.5 hover:from-primary-700 hover:to-primary-600 hover:shadow-[0_16px_34px_rgba(124,58,237,0.26)] sm:flex"
              >
                <UserIcon className="w-4 h-4" />
                <span className="font-semibold">{NAVBAR.login}</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-2xl border border-transparent p-2 transition-colors hover:border-neutral-200 hover:bg-neutral-100 md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-neutral-700" />
              ) : (
                <Menu className="w-6 h-6 text-neutral-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder={NAVBAR.searchPlaceholder}
              className="w-full rounded-full border border-neutral-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mx-auto mt-3 max-w-7xl animate-fade-in rounded-[28px] border border-white/85 bg-white/92 px-4 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:hidden">
          <div className="space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block rounded-2xl px-4 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && user ? (
              <>
                <div className="my-2 border-t border-neutral-100 pt-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
                      {getUserInitial()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{user.name || 'User'}</p>
                      <p className="text-xs text-neutral-500">{user.email || ''}</p>
                    </div>
                  </div>
                  <Link
                    to={ROUTES.PROFILE}
                    className="block rounded-2xl px-4 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {NAVBAR.menu.myProfile}
                  </Link>
                  <Link
                    to={`${ROUTES.PROFILE}?tab=wishlist`}
                    className="block rounded-2xl px-4 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                  {NAVBAR.menu.myWishlist}
                  </Link>
                  <Link
                    to="/profile?tab=orders"
                    className="block rounded-2xl px-4 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {NAVBAR.menu.myOrders}
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to={ROUTES.ADMIN_DASHBOARD}
                      className="block rounded-2xl px-4 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {NAVBAR.menu.adminDashboard}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-2xl px-4 py-3 text-left font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    {NAVBAR.menu.signOut}
                  </button>
                </div>
              </>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="block rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 text-center font-semibold text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {NAVBAR.login}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}