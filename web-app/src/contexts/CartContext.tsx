import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService, CartResponse, CartItem } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
    cart: CartResponse | null;
    items: CartItem[];
    itemCount: number;
    subtotal: number;
    isLoading: boolean;
    error: string | null;
    addToCart: (productId: string | number, quantity: number, variantId?: string | number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeFromCart: (itemId: number) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState<CartResponse | null>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : null;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (cart) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    const refreshCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCart(null);
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
        }
    }, [isAuthenticated, refreshCart]);

    const addToCart = async (productId: string | number, quantity: number, variantId?: string | number) => {
        if (!isAuthenticated) {
            // Ideally dispatch a 'open-login-modal' event or similar, or just throw
            const msg = 'Please log in to add items to cart';
            setError(msg);
            throw new Error(msg);
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
        }finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (itemId: number, quantity: number) => {
        // Optimistic update could happen here, but for now strict sync
        setIsLoading(true);
        try {
            const response = await cartService.updateItem(itemId, quantity);
            if (response.success && response.data) {
                setCart(response.data);
                setError(null);
            } else {
                setError(response.message || 'Failed to update quantity');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update quantity');
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (itemId: number) => {
        setIsLoading(true);
        try {
            const response = await cartService.removeItem(itemId);
            if (response.success && response.data) {
                setCart(response.data);
                setError(null);
            } else {
                setError(response.message || 'Failed to remove item');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to remove item');
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
                refreshCart
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
