/**
 * Global Constants
 * 
 * This file contains centralized constants used throughout the frontend.
 */

export const SHOP_NAME = 'Looks Mens';
export const SHOP_ADDRESS = 'Machine Street, Pullambadi,Lalgudi Taluk, Trichy -621711';
export const SHOP_PHONE = '+91 7558176281';
export const SHOP_EMAIL = 'Support@looksmens.com';

// Branding related constants
export const BRAND_TAGLINE = 'Premium Mens Fashion and Lifestyle';
export const LOGO_PATH = '/logo.svg';
export const LOGO_ALT = `${SHOP_NAME} Logo`;

// Storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'shophub_auth_token',
    USER_DATA: 'shophub_current_user',
    CART_DATA: 'shophub_cart_data',
    WISH_LIST: 'shophub_wishlist_data',
} as const;

// Combined export for convenience
export const APP_CONSTANTS = {
    shop: {
        name: SHOP_NAME,
        address: SHOP_ADDRESS,
        phone: SHOP_PHONE,
        email: SHOP_EMAIL,
    },
    brand: {
        tagline: BRAND_TAGLINE,
        logo: LOGO_PATH,
        alt: LOGO_ALT,
    },
    storage: STORAGE_KEYS,
} as const;
