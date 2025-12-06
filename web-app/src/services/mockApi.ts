import { Product } from '../types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 2499,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Vintage Camera',
    price: 4999,
    image: 'https://images.pexels.com/photos/606933/pexels-photo-606933.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Designer Watch',
    price: 3499,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Fashion'
  },
  {
    id: '4',
    name: 'Leather Backpack',
    price: 1999,
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Fashion'
  },
  {
    id: '5',
    name: 'Modern Desk Lamp',
    price: 1299,
    image: 'https://images.pexels.com/photos/313659/pexels-photo-313659.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Home'
  },
  {
    id: '6',
    name: 'Comfortable Chair',
    price: 5999,
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Home'
  },
  {
    id: '7',
    name: 'Professional Yoga Mat',
    price: 1599,
    image: 'https://images.pexels.com/photos/4327049/pexels-photo-4327049.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sports'
  },
  {
    id: '8',
    name: 'Running Shoes',
    price: 3999,
    image: 'https://images.pexels.com/photos/3718897/pexels-photo-3718897.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sports'
  },
  {
    id: '9',
    name: 'Smartphone Stand',
    price: 599,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics'
  },
  {
    id: '10',
    name: 'Cotton T-Shirt',
    price: 699,
    image: 'https://images.pexels.com/photos/2769274/pexels-photo-2769274.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Fashion'
  },
  {
    id: '11',
    name: 'Wooden Shelf',
    price: 2199,
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Home'
  },
  {
    id: '12',
    name: 'Dumbbell Set',
    price: 2899,
    image: 'https://images.pexels.com/photos/3621812/pexels-photo-3621812.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sports'
  }
];

export const mockApi = {
  getAllProducts: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PRODUCTS;
  },

  getProductById: async (id: string): Promise<Product | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return MOCK_PRODUCTS.filter(p => p.category === category);
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowercaseQuery = query.toLowerCase();
    return MOCK_PRODUCTS.filter(
      p => p.name.toLowerCase().includes(lowercaseQuery) ||
           p.category.toLowerCase().includes(lowercaseQuery)
    );
  }
};
