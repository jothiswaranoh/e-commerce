export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image_url: string;
    images?: string[];
    description: string;
    category: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    isPrime?: boolean;
    discount?: number;
    features?: string[];
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    image: string;
    color: string;
}

export interface Banner {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    gradient: [string, string];
}

export interface Deal {
    id: string;
    product: Product;
    endsAt: Date;
    soldPercentage: number;
}

export const CATEGORIES: Category[] = [
    { id: '1', name: 'Electronics', icon: 'smartphone', image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?w=200', color: '#6366F1' },
    { id: '2', name: 'Fashion', icon: 'shirt', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?w=200', color: '#EC4899' },
    { id: '3', name: 'Home', icon: 'home', image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=200', color: '#10B981' },
    { id: '4', name: 'Books', icon: 'book-open', image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=200', color: '#F59E0B' },
    { id: '5', name: 'Sports', icon: 'dumbbell', image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?w=200', color: '#EF4444' },
    { id: '6', name: 'Beauty', icon: 'sparkles', image: 'https://images.pexels.com/photos/2587370/pexels-photo-2587370.jpeg?w=200', color: '#8B5CF6' },
];

export const BANNERS: Banner[] = [
    {
        id: '1',
        title: 'Summer Sale',
        subtitle: 'Up to 70% off on Electronics',
        image: 'https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg?w=800',
        gradient: ['#667eea', '#764ba2'],
    },
    {
        id: '2',
        title: 'New Arrivals',
        subtitle: 'Fresh styles just landed',
        image: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?w=800',
        gradient: ['#f093fb', '#f5576c'],
    },
    {
        id: '3',
        title: 'Flash Deals',
        subtitle: 'Limited time offers',
        image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?w=800',
        gradient: ['#4facfe', '#00f2fe'],
    },
];

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Wireless Noise Cancelling Earbuds',
        price: 149.99,
        originalPrice: 199.99,
        image_url: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?w=500',
        images: [
            'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?w=800',
            'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?w=800',
        ],
        description: 'Premium wireless earbuds with active noise cancellation, crystal-clear audio, and up to 8 hours of battery life. Perfect for music lovers and commuters.',
        category: 'Electronics',
        rating: 4.8,
        reviewCount: 12542,
        inStock: true,
        isPrime: true,
        discount: 25,
        features: [
            'Active Noise Cancellation',
            'Transparency Mode',
            '8 Hours Battery Life',
            'Wireless Charging Case',
        ],
    },
    {
        id: '2',
        name: 'Smart Fitness Watch Pro',
        price: 279.00,
        originalPrice: 349.99,
        image_url: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?w=500',
        images: [
            'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?w=800',
            'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?w=800',
        ],
        description: 'Advanced smartwatch with heart rate monitoring, GPS tracking, and sleep analysis. Water resistant up to 50m.',
        category: 'Electronics',
        rating: 4.6,
        reviewCount: 8540,
        inStock: true,
        isPrime: true,
        discount: 20,
        features: [
            'Heart Rate Monitor',
            'Built-in GPS',
            'Sleep Tracking',
            '5ATM Water Resistant',
        ],
    },
    {
        id: '3',
        name: 'Premium Over-Ear Headphones',
        price: 299.00,
        originalPrice: 379.99,
        image_url: 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?w=500',
        images: [
            'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?w=800',
            'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?w=800',
        ],
        description: 'Studio-quality sound with industry-leading noise cancellation. 30-hour battery life with quick charging.',
        category: 'Electronics',
        rating: 4.9,
        reviewCount: 42890,
        inStock: true,
        isPrime: true,
        discount: 21,
        features: [
            'Hi-Res Audio Certified',
            '30-Hour Battery',
            'Quick Charge (5 min = 3 hrs)',
            'Foldable Design',
        ],
    },
    {
        id: '4',
        name: 'Leather Crossbody Messenger Bag',
        price: 89.99,
        originalPrice: 129.99,
        image_url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=500',
        images: [
            'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=800',
        ],
        description: 'Handcrafted genuine leather messenger bag with adjustable strap. Multiple compartments for organized storage.',
        category: 'Fashion',
        rating: 4.5,
        reviewCount: 3420,
        inStock: true,
        isPrime: false,
        discount: 31,
        features: [
            '100% Genuine Leather',
            'Adjustable Strap',
            'Multiple Compartments',
            'Antique Brass Hardware',
        ],
    },
    {
        id: '5',
        name: 'Minimalist Desk Lamp with Wireless Charger',
        price: 69.99,
        originalPrice: 89.99,
        image_url: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?w=500',
        images: [
            'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?w=800',
        ],
        description: 'Modern LED desk lamp with touch controls, adjustable brightness, and built-in 15W wireless charging pad.',
        category: 'Home',
        rating: 4.4,
        reviewCount: 1890,
        inStock: true,
        isPrime: true,
        discount: 22,
        features: [
            'Touch Controls',
            '3 Color Temperatures',
            '15W Wireless Charging',
            'Eye-Care Technology',
        ],
    },
    {
        id: '6',
        name: 'Mechanical Gaming Keyboard RGB',
        price: 129.99,
        originalPrice: 179.99,
        image_url: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?w=500',
        images: [
            'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?w=800',
        ],
        description: 'Hot-swappable mechanical keyboard with per-key RGB lighting, aluminum frame, and premium PBT keycaps.',
        category: 'Electronics',
        rating: 4.7,
        reviewCount: 7650,
        inStock: true,
        isPrime: true,
        discount: 28,
        features: [
            'Hot-swappable Switches',
            'Per-key RGB Lighting',
            'Aircraft-grade Aluminum',
            'PBT Double-shot Keycaps',
        ],
    },
    {
        id: '7',
        name: 'Portable Power Bank 20000mAh',
        price: 45.99,
        originalPrice: 69.99,
        image_url: 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?w=500',
        images: [
            'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?w=800',
        ],
        description: 'High-capacity portable charger with 65W fast charging, multiple ports, and LED display.',
        category: 'Electronics',
        rating: 4.6,
        reviewCount: 15420,
        inStock: true,
        isPrime: true,
        discount: 34,
        features: [
            '65W Fast Charging',
            'LED Power Display',
            'USB-C + 2x USB-A',
            'Airline Approved',
        ],
    },
    {
        id: '8',
        name: 'Professional Camera Lens 50mm',
        price: 399.00,
        originalPrice: 549.00,
        image_url: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?w=500',
        images: [
            'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?w=800',
        ],
        description: 'Ultra-fast prime lens with exceptional bokeh and sharpness. Perfect for portraits and low-light photography.',
        category: 'Electronics',
        rating: 4.8,
        reviewCount: 2340,
        inStock: true,
        isPrime: false,
        discount: 27,
        features: [
            'f/1.4 Maximum Aperture',
            'Silent Autofocus Motor',
            'Weather Sealed',
            'Nano Crystal Coating',
        ],
    },
];

export const FLASH_DEALS: Deal[] = [
    {
        id: '1',
        product: MOCK_PRODUCTS[0],
        endsAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
        soldPercentage: 67,
    },
    {
        id: '2',
        product: MOCK_PRODUCTS[5],
        endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        soldPercentage: 82,
    },
    {
        id: '3',
        product: MOCK_PRODUCTS[6],
        endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
        soldPercentage: 45,
    },
];
