import type { CartItem, CartResponse } from './cartService';

const GUEST_CART_KEY = 'looks-mens-guest-cart';

export interface GuestCartItem extends CartItem {
  product_variant_id: number;
}

interface AddGuestCartItemInput {
  productId: string | number;
  productVariantId?: string | number;
  quantity: number;
  productName?: string;
  variantName?: string;
  price?: number;
  image?: string;
}

function normalizeNumber(value: string | number | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeCart(items: GuestCartItem[]): CartResponse {
  return {
    id: 0,
    items: items.map((item, index) => ({
      ...item,
      id: index + 1,
      total: Number((item.price * item.quantity).toFixed(2)),
    })),
  };
}

function readItems(): GuestCartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item) => ({
      id: normalizeNumber(item.id),
      product_id: normalizeNumber(item.product_id),
      product_variant_id: normalizeNumber(item.product_variant_id),
      product_name: item.product_name ?? 'Product',
      variant_name: item.variant_name ?? '',
      quantity: Math.max(1, normalizeNumber(item.quantity, 1)),
      price: normalizeNumber(item.price),
      total: normalizeNumber(item.total),
      image: item.image ?? '',
    }));
  } catch (error) {
    console.error('Failed to parse guest cart', error);
    return [];
  }
}

function writeItems(items: GuestCartItem[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export const guestCart = {
  getCart(): CartResponse {
    return normalizeCart(readItems());
  },

  addItem(input: AddGuestCartItemInput): CartResponse {
    const productId = normalizeNumber(input.productId);
    const productVariantId = normalizeNumber(input.productVariantId);
    const items = readItems();

    const existingItem = items.find(
      (item) =>
        item.product_id === productId &&
        item.product_variant_id === productVariantId
    );

    if (existingItem) {
      existingItem.quantity += input.quantity;
      existingItem.total = Number((existingItem.price * existingItem.quantity).toFixed(2));
    } else {
      items.push({
        id: items.length + 1,
        product_id: productId,
        product_variant_id: productVariantId,
        product_name: input.productName ?? 'Product',
        variant_name: input.variantName,
        quantity: Math.max(1, input.quantity),
        price: normalizeNumber(input.price),
        total: Number((normalizeNumber(input.price) * Math.max(1, input.quantity)).toFixed(2)),
        image: input.image,
      });
    }

    writeItems(items);
    return normalizeCart(items);
  },

  updateItem(itemId: number, quantity: number): CartResponse {
    const items = readItems().map((item, index) => {
      if (index + 1 !== itemId) {
        return item;
      }

      return {
        ...item,
        quantity: Math.max(1, quantity),
        total: Number((item.price * Math.max(1, quantity)).toFixed(2)),
      };
    });

    writeItems(items);
    return normalizeCart(items);
  },

  removeItem(itemId: number): CartResponse {
    const items = readItems().filter((_, index) => index + 1 !== itemId);
    writeItems(items);
    return normalizeCart(items);
  },

  clear() {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(GUEST_CART_KEY);
  },
};
