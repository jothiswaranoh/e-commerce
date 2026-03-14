import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { Product } from '@/types/product';
import { cartApi, CartData } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const DEFAULT_CART_IMAGE =
  'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?w=800';

export interface CartItem extends Product {
  quantity: number;
  productId: string;
  productVariantId: string;
  cartItemId: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (id: string, delta: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  totalPrice: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function mapCartResponseToItems(cartData: CartData): CartItem[] {
  return cartData.items.map((item) => ({
    id: String(item.id),
    cartItemId: String(item.id),
    productId: String(item.product_id),
    productVariantId: String(item.product_variant_id),
    name: item.product_name,
    price: Number(item.price ?? 0),
    image_url: item.image || DEFAULT_CART_IMAGE,
    images: item.image ? [item.image] : [DEFAULT_CART_IMAGE],
    description: item.variant_name ?? 'Product in cart',
    category: 'Cart',
    rating: 4.5,
    reviewCount: 0,
    inStock: true,
    quantity: Number(item.quantity ?? 0),
    variants: item.product_variant_id
      ? [
          {
            id: String(item.product_variant_id),
            name: item.variant_name,
            price: Number(item.price ?? 0),
            stock: Number(item.quantity ?? 0),
          },
        ]
      : [],
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = async () => {
    if (!token) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartApi.getCart();
      setCart(mapCartResponseToItems(response));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshCart();
    }
  }, [token]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!token) {
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        if (existing) {
          return prev.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        const variantId = String(product.variants?.[0]?.id ?? product.id);

        return [
          ...prev,
          {
            ...product,
            quantity,
            productId: product.id,
            productVariantId: variantId,
            cartItemId: product.id,
          },
        ];
      });
      return;
    }

    const variantId = product.variants?.[0]?.id;
    if (!variantId) {
      throw new Error('This product has no purchasable variant.');
    }

    try {
      setIsLoading(true);
      const response = await cartApi.addItem({
        product_id: product.id,
        product_variant_id: String(variantId),
        quantity,
      });
      setCart(mapCartResponseToItems(response));
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item to cart';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, delta: number) => {
    if (!token) {
      setCart((prev) =>
        prev
          .map((item) => {
            if (item.id === id) {
              const quantity = item.quantity + delta;
              return quantity > 0 ? { ...item, quantity } : null;
            }

            return item;
          })
          .filter(Boolean) as CartItem[]
      );
      return;
    }

    const targetItem = cart.find((item) => item.id === id);
    if (!targetItem) {
      return;
    }

    const quantity = targetItem.quantity + delta;
    if (quantity < 1) {
      await removeFromCart(id);
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartApi.updateItem({
        item_id: targetItem.cartItemId,
        quantity,
      });
      setCart(mapCartResponseToItems(response));
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update cart item';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (id: string) => {
    if (!token) {
      setCart((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    const targetItem = cart.find((item) => item.id === id);
    if (!targetItem) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartApi.removeItem(targetItem.cartItemId);
      setCart(mapCartResponseToItems(response));
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove cart item';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) {
      setCart([]);
      return;
    }

    try {
      setIsLoading(true);
      for (const item of cart) {
        await cartApi.removeItem(item.cartItemId);
      }
      setCart([]);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        totalPrice,
        itemCount,
        isLoading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
