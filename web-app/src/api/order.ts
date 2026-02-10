import { apiService } from "./apiService";

export interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
    total: number;
    product?: any;
}

export interface Order {
    id: number;
    order_number: string;
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    payment_status: "unpaid" | "paid" | "refunded";
    subtotal: number;
    tax: number;
    shipping_fee: number;
    total: number;
    created_at: string;
    user: {
        id: number;
        name: string;
        email_address: string;
    };
    order_items: OrderItem[];
}

const BASE_PATH = "/orders";

const OrderAPI = {
    /**
     * GET /api/v1/orders?page=&per_page=
     */
    list(params?: { page?: number; per_page?: number }) {
        return apiService.get<{
            data: Order[];
            meta: {
                current_page: number;
                per_page: number;
                total_pages: number;
                total_count: number;
            };
        }>(BASE_PATH, params);
    },

    get(id: number) {
        return apiService.get<Order>(`${BASE_PATH}/${id}`);
    },

    update(id: number, payload: { status?: string; payment_status?: string }) {
        return apiService.patch<Order>(`${BASE_PATH}/${id}`, { order: payload });
    },
};

export default OrderAPI;
