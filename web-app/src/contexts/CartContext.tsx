import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService, CartResponse, CartItem } from '../services/cartService';
import { guestCart } from '../services/guestCart';
import { useAuth } from './AuthContext';

interface AddToCartOptions {
    productName?: string;
    variantName?: string;
    price?: number;
    image?: string;
}

interface CartContextType {
    cart: CartResponse | null;
    items: CartItem[];
    itemCount: number;
    subtotal: number;
    isLoading: boolean;
    error: string | null;
    addToCart: (productId: string | number, quantity: number, variantId?: string | number, options?: AddToCartOptions) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeFromCart: (itemId: number) => Promise<void>;
    refreshCart: () => Promise<void>;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearCart = () => {
        setCart(null);
        if (!isAuthenticated) {
            guestCart.clear();
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            setCart(guestCart.getCart());
        }
    }, [isAuthenticated]);

    const refreshCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCart(guestCart.getCart());
            return;
        }

        try {
            // Don't set global loading state for background refreshes to avoid UI flickering
            // but if we had a separate 'isRefreshing' state checking it would be good.
            // For initial load we might want it.
            const response = await cartService.getCart();
            if (response.success && response.data) {
                setCart(response.data);
                setError(null);
            } else {
                // If 404 (no cart yet) or other issues, maybe just clear
                console.error('Failed to get cart:', response.message);
            }
        } catch (err) {
            console.error('Failed to fetch cart:', err);
            // Don't hard error, just leave cart as is or empty
        }
    }, [isAuthenticated]);

    // Initial fetch
    useEffect(() => {
        if (isAuthenticated) {
            setIsLoading(true);
            refreshCart().finally(() => setIsLoading(false));
        } else {
            setCart(guestCart.getCart());
        }
    }, [isAuthenticated, refreshCart]);

    const addToCart = async (
        productId: string | number,
        quantity: number,
        variantId?: string | number,
        options?: AddToCartOptions
    ) => {
        if (!variantId) {
            const msg = 'Please select a variant before adding this item to cart';
            setError(msg);
            throw new Error(msg);
        }

        if (!isAuthenticated) {
            const response = guestCart.addItem({
                productId,
                productVariantId: variantId,
                quantity,
                productName: options?.productName,
                variantName: options?.variantName,
                price: options?.price,
                image: options?.image,
            });
            setCart(response);
            setError(null);
            return;
        }
        setIsLoading(true);
        try {
            const response = await cartService.addItem(productId, quantity, variantId);
            if (response.success && response.data) {
                setCart(response.data);
                setError(null);
            } else {
                throw new Error(
                    typeof response.message === 'string'
                        ? response.message
                        : typeof response.error === 'string'
                            ? response.error
                            : 'Failed to add item'
                );
            }
        } catch (err: any) {
            const msg = err?.message || 'Failed to add item to cart';
            setError(msg);
            throw new Error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (itemId: number, quantity: number) => {
        if (quantity < 1) return;

        if (!isAuthenticated) {
            const response = guestCart.updateItem(itemId, quantity);
            setCart(response);
            setError(null);
            return;
        }

        setIsLoading(true);

        try {
            const response = await cartService.updateItem(itemId, quantity);

            if (response.success && response.data) {
                setCart(response.data);
                setError(null);
            } else {
                const msg = response.message || 'Failed to update quantity';
                setError(msg);
                throw new Error(msg);
            }
        } catch (err: any) {
            const msg = err?.message || err?.response?.data?.error || 'Failed to update quantity';
            setError(msg);
            throw new Error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (itemId: number) => {
        if (!isAuthenticated) {
            const response = guestCart.removeItem(itemId);
            setCart(response);
            setError(null);
            return;
        }

        setIsLoading(true);
        try {
            const response = await cartService.removeItem(itemId);
            if (response.success && response.data) {
                setCart(response.data);
                setError(null);
            } else {
                const msg = response.message || 'Failed to remove item';
                setError(msg);
                throw new Error(msg);
            }
        } catch (err: any) {
            const msg = err?.message || err?.response?.data?.error || 'Failed to remove item';
            setError(msg);
            throw new Error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const items = cart?.items || [];
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    // Backend provides totals already, but we can sum if needed.
    // The cart items from backend have 'total' (price * qty).
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                items,
                itemCount,
                subtotal,
                isLoading,
                error,
                addToCart,
                updateQuantity,
                removeFromCart,
                refreshCart,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
