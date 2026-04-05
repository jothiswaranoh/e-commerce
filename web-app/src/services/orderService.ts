import api from '../api/apiService';

export interface PlaceOrderPayload {
  order: {
    tax: number;
    shipping_fee: number;
    shipping_address?: {
      full_name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      zip_code: string;
    };
  };
  items: {
    product_id: number;
    product_variant_id: number;
    quantity: number;
  }[];
}

export const orderService = {
  placeOrder(payload: PlaceOrderPayload) {
    return api({
      url: '/orders',
      method: 'post',
      data: payload,
    });
  },

  getOrders() {
    return api({
      url: '/orders',
      method: 'get',
    });
  },


  cancelOrder(orderId: number) {
  return api({
    url: `/orders/${orderId}/cancel`,
    method: 'patch',
  });
}
};