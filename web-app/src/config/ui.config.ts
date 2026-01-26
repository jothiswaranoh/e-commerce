/**
 * UI Configuration
 * Centralized configuration for all UI text and images
 * Organize by component/page for easy maintenance
 */

// ==================== BRAND ====================
export const BRAND = {
    name: 'ShopHubs',
    tagline: 'Your Premium Shopping Destination',
    logo: '/logo.svg',
    logoAlt: 'ShopHub Logo',
} as const;

// ==================== CONTACT ====================
export const CONTACT = {
    email: 'support@shophub.com',
    phone: '+1 (555) 123-4567',
    address: '123 Shopping Street, Commerce City, CC 12345',
} as const;

// ==================== SOCIAL ====================
export const SOCIAL = {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
} as const;

// ==================== NAVBAR ====================
export const NAVBAR = {
    searchPlaceholder: 'Search products...',
    login: 'Login',
    menu: {
        myProfile: 'My Profile',
        myOrders: 'My Orders',
        adminDashboard: 'Admin Dashboard',
        signOut: 'Sign Out',
    },
    nav: {
        home: 'Home',
        products: 'Products',
        cart: 'Cart',
    },
} as const;

// ==================== FOOTER ====================
export const FOOTER = {
    description: 'Your trusted e-commerce destination for quality products at great prices.',

    sections: {
        quickLinks: {
            title: 'Quick Links',
            home: 'Home',
            products: 'Products',
            cart: 'Shopping Cart',
            about: 'About Us',
        },
        customerService: {
            title: 'Customer Service',
            contact: 'Contact Us',
            shipping: 'Shipping Info',
            returns: 'Returns',
            faq: 'FAQ',
        },
        contactUs: {
            title: 'Contact Us',
        },
    },

    legal: {
        privacyPolicy: 'Privacy Polssicy',
        termsOfService: 'Terms of Service',
        cookiePolicy: 'Cookie Policy',
    },

    copyright: (year: number) => `© ${year} ${BRAND.name}. All rights reserved.`,
} as const;

// ==================== HOME ====================
export const HOME = {
    hero: {
        title: 'Elevate Your Style',
        subtitle: 'Discover curated collections of premium products',
        primaryCTA: 'Shop Now',
        secondaryCTA: 'Browse Collections',
    },

    features: [
        {
            title: 'Free Shipping',
            description: 'On orders over ₹999',
        },
        {
            title: 'Secure Payment',
            description: '100% secure transactions',
        },
        {
            title: 'Easy Returns',
            description: '30-day return policy',
        },
        {
            title: '24/7 Support',
            description: 'Dedicated customer service',
        },
    ],

    sections: {
        featured: {
            title: 'Featured Products',
            subtitle: 'Handpicked items just for you',
        },
        newArrivals: {
            title: 'New Arrivals',
            subtitle: 'Check out the latest additions',
        },
        categories: {
            title: 'Shop by Category',
            subtitle: 'Find what you need',
        },
    },
} as const;

// ==================== AUTH ====================
export const AUTH = {
    login: {
        title: 'Welcome Back',
        subtitle: 'Sign in to your account to continue shopping',
        submitButton: 'Sign In',
        forgotPassword: 'Forgot password?',
        noAccount: "Don't have an account?",
        createAccount: 'Create account',
        rememberMe: 'Remember me',
        orContinueWith: 'Or continue with',

        hero: {
            title: 'Discover the Future of Shopping',
            subtitle: 'Join millions of shoppers and experience a curated marketplace designed for your lifestyle.',
        },

        features: [
            {
                icon: 'Shield',
                title: 'Secure Shopping',
                description: 'Your data is protected with industry-leading security',
            },
            {
                icon: 'Package',
                title: 'Fast Delivery',
                description: 'Free shipping on orders over ₹999',
            },
            {
                icon: 'Sparkles',
                title: 'Quality Products',
                description: 'Verified and authentic items from trusted sellers',
            },
        ],
    },

    register: {
        title: 'Create Account',
        subtitle: 'Join us to start your shopping journey',
        submitButton: 'Create Account',
        haveAccount: 'Already have an account?',
        signIn: 'Sign in',
        orSignUpWith: 'Or sign up with',
        agreeToTerms: 'I agree to the',
        termsOfService: 'Terms of Service',
        and: 'and',
        privacyPolicy: 'Privacy Policy',

        hero: {
            title: 'Join the Community',
            subtitle: 'Create an account to unlock exclusive deals, track orders, and personalized recommendations.',
        },

        features: [
            {
                icon: 'Shield',
                title: 'Member Benefits',
                description: 'Early access to sales and exclusive member-only discounts',
            },
            {
                icon: 'Package',
                title: 'Order Tracking',
                description: 'Real-time updates on your delivery status',
            },
            {
                icon: 'Sparkles',
                title: 'Wishlist',
                description: 'Save your favorite items and get notified when they drop in price',
            },
        ],

        fields: {
            fullName: {
                label: 'Full Name',
                placeholder: 'John Doe',
            },
            email: {
                label: 'Email Address',
                placeholder: 'you@example.com',
            },
            phone: {
                label: 'Phone Number (Optional)',
                placeholder: '+1 (555) 000-0000',
            },
            password: {
                label: 'Password',
                placeholder: '••••••••',
            },
            confirmPassword: {
                label: 'Confirm Password',
                placeholder: '••••••••',
            },
        },
    },

    forgotPassword: {
        title: 'Forgot Password',
        subtitle: 'Enter your email to reset your password',
        submitButton: 'Send Reset Link',
        backToLogin: 'Back to login',
    },
} as const;

// ==================== PRODUCTS ====================
export const PRODUCTS = {
    filters: {
        title: 'Filters',
        clear: 'Clear all',
        apply: 'Apply',
        priceRange: 'Price Range',
        category: 'Category',
        brand: 'Brand',
        rating: 'Rating',
    },

    sort: {
        label: 'Sort by',
        options: {
            popular: 'Most Popular',
            newest: 'Newest',
            priceLowToHigh: 'Price: Low to High',
            priceHighToLow: 'Price: High to Low',
            rating: 'Highest Rated',
        },
    },

    card: {
        addToCart: 'Add to Cart',
        viewDetails: 'View Details',
        outOfStock: 'Out of Stock',
    },
} as const;

// ==================== CART ====================
export const CART = {
    title: 'Shopping Cart',

    empty: {
        title: 'Your cart is empty',
        subtitle: 'Add items to get started',
        cta: 'Continue Shopping',
    },

    summary: {
        title: 'Order Summary',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        tax: 'Tax',
        total: 'Total',
        checkout: 'Proceed to Checkout',
    },

    remove: 'Remove',
    updateQuantity: 'Update quantity',
} as const;

// ==================== MESSAGES ====================
export const MESSAGES = {
    success: {
        loginSuccess: 'Welcome back!',
        registerSuccess: 'Account created successfully!',
        addedToCart: 'Added to cart',
        orderPlaced: 'Order placed successfully!',
    },

    error: {
        loginFailed: 'Invalid credentials',
        registerFailed: 'Registration failed',
        genericError: 'Something went wrong. Please try again.',
        networkError: 'Network error. Please check your connection.',
    },

    validation: {
        requiredField: 'This field is required',
        invalidEmail: 'Please enter a valid email address',
        invalidPhone: 'Please enter a valid phone number',
        passwordTooShort: 'Password must be at least 8 characters',
        passwordsDoNotMatch: 'Passwords do not match',
    },
} as const;

// ==================== IMAGES ====================
export const IMAGES = {
    auth: {
        loginBackground: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070',
        registerBackground: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070',
    },
    home: {
        hero: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070',
    },
    placeholders: {
        product: 'https://via.placeholder.com/400x400?text=Product',
        avatar: 'https://via.placeholder.com/150x150?text=User',
    },
    socialIcons: {
        google: 'https://www.svgrepo.com/show/475656/google-color.svg',
        github: 'https://www.svgrepo.com/show/448224/github.svg',
    },
} as const;

// ==================== COMBINED EXPORT ====================
export const UI_CONFIG = {
    brand: BRAND,
    contact: CONTACT,
    social: SOCIAL,
    navbar: NAVBAR,
    footer: FOOTER,
    home: HOME,
    auth: AUTH,
    products: PRODUCTS,
    cart: CART,
    messages: MESSAGES,
    images: IMAGES,
} as const;

// Type exports for TypeScript autocomplete
export type UIConfig = typeof UI_CONFIG;
export type BrandConfig = typeof BRAND;
export type ContactConfig = typeof CONTACT;
export type SocialConfig = typeof SOCIAL;
export type NavbarConfig = typeof NAVBAR;
export type FooterConfig = typeof FOOTER;
export type HomeConfig = typeof HOME;
export type AuthConfig = typeof AUTH;
export type ProductsConfig = typeof PRODUCTS;
export type CartConfig = typeof CART;
export type MessagesConfig = typeof MESSAGES;
export type ImagesConfig = typeof IMAGES;