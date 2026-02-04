import { apiService } from '../api/apiService';

export interface CartItem {
    id: number;
    product_id: number;
    product_name: string;
    variant_name?: string;
    quantity: number;
    price: number;
    total: number;
    image?: string;
}

export interface CartResponse {
    id: number;
    items: CartItem[];
}

export const cartService = {
    getCart: () => apiService.get<CartResponse>('/cart'),

    addItem: (productId: string | number, quantity: number, variantId?: string | number) =>
        apiService.post<CartResponse>('/cart/add', {
            product_id: productId,
            product_variant_id: variantId,
            quantity,
        }),

    updateItem: (itemId: number, quantity: number) =>
        apiService.put<CartResponse>('/cart/update', { item_id: itemId, quantity }),

    removeItem: (itemId: number) =>
        apiService.delete<CartResponse>(`/cart/remove?item_id=${itemId}`),
};
