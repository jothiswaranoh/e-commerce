import {
    Smartphone,
    Shirt,
    Home,
    BookOpen,
    Dumbbell,
    Sparkles,
    Watch,
    Headphones,
    Laptop,
    Camera,
    Gamepad2,
    Gift,
    User,
    MapPin,
    CreditCard,
    Package,
    Heart,
    Bell,
    Moon,
    Globe,
    HelpCircle,
    Shield,
    Trash2,
    Settings,
} from 'lucide-react-native';

export const APP_NAME = 'Shop';

export const CATEGORIES = [
    { id: '1', name: 'Electronics', icon: Smartphone, color: '#6366F1', productCount: 245 },
    { id: '2', name: 'Fashion', icon: Shirt, color: '#EC4899', productCount: 532 },
    { id: '3', name: 'Home', icon: Home, color: '#10B981', productCount: 189 },
    { id: '4', name: 'Books', icon: BookOpen, color: '#F59E0B', productCount: 423 },
    { id: '5', name: 'Sports', icon: Dumbbell, color: '#EF4444', productCount: 156 },
    { id: '6', name: 'Beauty', icon: Sparkles, color: '#8B5CF6', productCount: 298 },
    { id: '7', name: 'Toys', icon: Gamepad2, color: '#FCD34D', productCount: 342 },
    { id: '8', name: 'Grocery', icon: Sparkles, color: '#10B981', productCount: 876 },
    { id: '9', name: 'Automotive', icon: Settings, color: '#6B7280', productCount: 124 },
    { id: '10', name: 'Health', icon: Heart, color: '#F472B6', productCount: 432 },
    { id: '11', name: 'Garden', icon: Globe, color: '#4ADE80', productCount: 198 },
    { id: '12', name: 'Pets', icon: Heart, color: '#FB923C', productCount: 167 },
];

export const ACCOUNT_SETTINGS = [
    { id: 'profile', icon: User, title: 'Profile', subtitle: 'Edit your profile', type: 'link', route: '/profile' },
    { id: 'addresses', icon: MapPin, title: 'Addresses', subtitle: 'Manage delivery addresses', type: 'link', route: '/addresses' },
    { id: 'payment', icon: CreditCard, title: 'Payment Methods', subtitle: 'Manage cards & wallets', type: 'link', route: '/payment' },
] as const;

export const ORDER_SETTINGS = [
    { id: 'orders', icon: Package, title: 'My Orders', subtitle: 'Track your orders', type: 'link', route: '/orders' },
    { id: 'wishlist', icon: Heart, title: 'Wishlist', subtitle: 'Your saved items', type: 'link', route: '/wishlist' },
] as const;

export const APP_SETTINGS = [
    { id: 'notif', icon: Bell, title: 'Notifications', subtitle: 'Push & email alerts', type: 'toggle', value: true },
    { id: 'dark', icon: Moon, title: 'Dark Mode', subtitle: 'Toggle dark theme', type: 'toggle', value: false },
    { id: 'lang', icon: Globe, title: 'Language', subtitle: 'English (US)', type: 'link' },
] as const;

export const SUPPORT_SETTINGS = [
    { id: 'help', icon: HelpCircle, title: 'Help Center', subtitle: 'FAQs & support', type: 'link' },
    { id: 'privacy', icon: Shield, title: 'Privacy Policy', type: 'link' },
] as const;

export const MOCK_ADDRESSES = [
    {
        id: '1',
        type: 'Home',
        name: 'Stark',
        street: '123 Maple Avenue',
        city: 'San Francisco, CA',
        zip: '94105',
        isDefault: true,
    },
    {
        id: '2',
        type: 'Work',
        name: 'Stark',
        street: '456 Market Street, Suite 200',
        city: 'San Francisco, CA',
        zip: '94103',
        isDefault: false,
    },
];

export const UI_TEXT = {
    SIGN_OUT: 'Sign Out',
    LOGOUT_CONFIRM: 'Are you sure you want to sign out?',
    CANCEL: 'Cancel',
    SAVE: 'Save Changes',
    SHOP_NOW: 'Shop Now',
    SEE_ALL: 'See All',
    FLASH_DEALS: 'Flash Deals',
    FEATURED: 'Featured',
    RECOMMENDED: 'Recommended For You',
    IN_STOCK: 'In Stock',
    OUT_OF_STOCK: 'Out of Stock',
    ADD_TO_CART: 'Add to Cart',
    EMPTY_CART: 'Your cart is empty',
    ORDER_CONFIRMED: 'Order Confirmed!',
};
