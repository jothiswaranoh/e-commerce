import api from '../api/apiService';

export interface PlaceOrderPayload {
  order: {
    tax: number;
    shipping_fee: number;
  };
  items: {
    product_id: number;
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
};