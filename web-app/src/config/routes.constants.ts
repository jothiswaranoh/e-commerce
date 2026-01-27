/**
 * Application Routes Constants
 * Type-safe route definitions
 */

export const ROUTES = {
    // Customer Routes
    HOME: '/',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/product/:id',
    CART: '/cart',
    CHECKOUT: '/checkout',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password/:token',
    VERIFY_EMAIL: '/verify-email/:token',
    PROFILE: '/profile',

    // Admin Routes
    ADMIN: '/admin',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_ORDERS: '/admin/orders',
    ADMIN_USERS: '/admin/users',
    ADMIN_CATEGORY: '/admin/category',
} as const;

// Helper function to generate product detail route
export const getProductRoute = (id: string) => `/product/${id}`;

// Admin navigation items
export const ADMIN_NAV_ITEMS = [
    {
        label: 'Dashboard',
        path: ROUTES.ADMIN_DASHBOARD,
        icon: 'LayoutDashboard',
    },
    {
        label: 'Products',
        path: ROUTES.ADMIN_PRODUCTS,
        icon: 'Package',
    },
    {
        label: 'Orders',
        path: ROUTES.ADMIN_ORDERS,
        icon: 'ShoppingBag',
    },
    {
        label: 'Users',
        path: ROUTES.ADMIN_USERS,
        icon: 'Users',
    },
    {
        label: 'Categories',
        path: ROUTES.ADMIN_CATEGORY,
        icon: 'Users',
    },
] as const;
