import { Platform } from 'react-native';

const CART_SESSION_KEY = 'cart_session_id';

// Simplified in-memory store for the sample app
let inMemoryCart: any[] = [];

export function getCartSessionId(): string {
  if (Platform.OS === 'web') {
    let sessionId = localStorage.getItem(CART_SESSION_KEY);
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem(CART_SESSION_KEY, sessionId);
    }
    return sessionId;
  }
  return generateSessionId();
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

export const mockCart = {
  getItems: () => [...inMemoryCart],
  addItem: (product: any) => {
    const existing = inMemoryCart.find(item => item.product_id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      inMemoryCart.push({
        id: Math.random().toString(36).substring(7),
        product_id: product.id,
        quantity: 1,
        products: product
      });
    }
    return [...inMemoryCart];
  },
  updateQuantity: (id: string, quantity: number) => {
    inMemoryCart = inMemoryCart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    return [...inMemoryCart];
  },
  removeItem: (id: string) => {
    inMemoryCart = inMemoryCart.filter(item => item.id !== id);
    return [...inMemoryCart];
  },
  clear: () => {
    inMemoryCart = [];
  }
};
