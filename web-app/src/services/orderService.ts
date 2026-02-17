import api from '../api/apiService';

export interface PlaceOrderPayload {
  order: {
    tax: number;
    shipping_fee: number;
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
};