import { API_BASE_URL } from './constants';
import { BackendProduct } from '@/types/product';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

//APi responses
export interface AuthResponse {
  success: boolean;
  token?: string;
  email?: string;
  role?: string;
  message?: string;
  error?: string;
  errors?: string[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  orgId?: string;
}

export interface BackendUser {
  id: string;
  name?: string;
  email_address: string;
  role?: string;
  org_id?: string;
}
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedProductsData {
  data: BackendProduct[];
  meta: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
  };
}

export interface BackendCategory {
  id: string;
  org_id?: string;
  name: string;
  slug?: string;
  parent_id?: string | null;
  is_active?: boolean;
  sort_order?: number | null;
  image_url?: string | null;
  products_count?: number;
}

export interface PaginatedCategoriesData {
  data: BackendCategory[];
  meta: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
  };
}

export interface CartApiItem {
  id: string;
  product_id: string;
  product_variant_id: string;
  product_name: string;
  variant_name?: string;
  quantity: number;
  price: number;
  total: number;
  image?: string | null;
}

export interface CartData {
  id: string;
  items: CartApiItem[];
}

export interface OrderItemPayload {
  product_id: string;
  product_variant_id: string;
  quantity: number;
}

export interface OrderProduct {
  id: string;
  name: string;
  images?: string[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
  product?: OrderProduct;
}

export interface OrderData {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  tax: number;
  shipping_fee: number;
  total: number;
  created_at: string;
  order_items: OrderItem[];
}

export interface PaginatedOrdersData {
  data: OrderData[];
  meta: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
  };
}

interface ApiRequestConfig {
  authenticated?: boolean;
}

async function getAuthToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export function mapBackendUser(user: BackendUser): User {
  return {
    id: String(user.id),
    email: user.email_address,
    name: user.name,
    role: user.role,
    orgId: user.org_id,
  };
}

//helper function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  config: ApiRequestConfig = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = config.authenticated ? await getAuthToken() : null;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const rawResponse = await response.text();
  let data: T | null = null;

  if (rawResponse) {
    try {
      data = JSON.parse(rawResponse) as T;
    } catch {
      if (!response.ok) {
        throw new Error(
          rawResponse.trim() || `Request failed with status ${response.status}`
        );
      }

      throw new Error('Server returned an invalid JSON response');
    }
  }

  if (!response.ok) {
    const errorData = data as AuthResponse | null;
    throw new Error(
      errorData?.error ||
        errorData?.errors?.join(', ') ||
        `Request failed with status ${response.status}`
    );
  }

  if (data === null) {
    throw new Error('Server returned an empty response');
  }

  return data;
}

//auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({
        email_address: email,
        password: password,
      }),
    });
  },

  signup: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/signup', {
      method: 'POST',
      body: JSON.stringify({
        user: {
          name: name,
          email_address: email,
          password: password,
          password_confirmation: password,
          role: "customer",
        },
      }),
    });
  },

  logout: async (token: string): Promise<void> => {
    await apiRequest('/logout', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiRequest<ApiResponse<BackendUser>>('/me', {}, { authenticated: true });
    return mapBackendUser(response.data);
  },

  updateUser: async (
    id: string,
    payload: { name: string; email: string }
  ): Promise<User> => {
    const response = await apiRequest<ApiResponse<BackendUser>>(
      `/users/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          user: {
            name: payload.name,
            email_address: payload.email,
          },
        }),
      },
      { authenticated: true }
    );
    return mapBackendUser(response.data);
  },
};

export const passwordApi = {
  requestReset: async (email: string): Promise<void> => {
    await apiRequest<ApiResponse<unknown>>('/passwords', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (params: {
    token: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> => {
    await apiRequest<ApiResponse<unknown>>(`/passwords/${params.token}`, {
      method: 'PUT',
      body: JSON.stringify({
        password: params.password,
        password_confirmation: params.password_confirmation,
      }),
    });
  },
};
//product
function buildQueryParams(params?: Record<string, string | number | undefined>) {
  if (!params) return '';

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

export const productApi = {
  getProducts: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedProductsData> => {
    const response = await apiRequest<ApiResponse<PaginatedProductsData>>(
      `/products${buildQueryParams(params)}`
    );
    return response.data;
  },

  getProduct: async (id: string): Promise<BackendProduct> => {
    const response = await apiRequest<ApiResponse<BackendProduct>>(`/products/${id}`);
    return response.data;
  },
};

export const categoryApi = {
  getCategories: async (params?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedCategoriesData> => {
    const response = await apiRequest<ApiResponse<PaginatedCategoriesData>>(
      `/categories${buildQueryParams(params)}`,
      {}
    );
    return response.data;
  },
};

export const cartApi = {
  getCart: async (): Promise<CartData> => {
    const response = await apiRequest<ApiResponse<CartData>>('/cart', {}, { authenticated: true });
    return response.data;
  },

  addItem: async (params: {
    product_id: string;
    product_variant_id: string;
    quantity: number;
  }): Promise<CartData> => {
    const response = await apiRequest<ApiResponse<CartData>>(
      '/cart/add',
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
      { authenticated: true }
    );
    return response.data;
  },

  updateItem: async (params: {
    item_id: string;
    quantity: number;
  }): Promise<CartData> => {
    const response = await apiRequest<ApiResponse<CartData>>(
      '/cart/update',
      {
        method: 'PUT',
        body: JSON.stringify(params),
      },
      { authenticated: true }
    );
    return response.data;
  },

  removeItem: async (item_id: string): Promise<CartData> => {
    const response = await apiRequest<ApiResponse<CartData>>(
      '/cart/remove',
      {
        method: 'DELETE',
        body: JSON.stringify({ item_id }),
      },
      { authenticated: true }
    );
    return response.data;
  },
};

export const orderApi = {
  getOrders: async (params?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedOrdersData> => {
    const response = await apiRequest<ApiResponse<PaginatedOrdersData>>(
      `/orders${buildQueryParams(params)}`,
      {},
      { authenticated: true }
    );
    return response.data;
  },

  createOrder: async (params: {
    shipping_fee?: number;
    items: OrderItemPayload[];
  }): Promise<OrderData> => {
    const response = await apiRequest<ApiResponse<OrderData>>(
      '/orders',
      {
        method: 'POST',
        body: JSON.stringify({
          order: {
            shipping_fee: params.shipping_fee ?? 0,
          },
          items: params.items,
        }),
      },
      { authenticated: true }
    );
    return response.data;
  },

  getOrder: async (id: string): Promise<OrderData> => {
    const response = await apiRequest<ApiResponse<OrderData>>(
      `/orders/${id}`,
      {},
      { authenticated: true }
    );
    return response.data;
  },

  cancelOrder: async (id: string): Promise<OrderData> => {
    const response = await apiRequest<ApiResponse<OrderData>>(
      `/orders/${id}/cancel`,
      {
        method: 'PATCH',
      },
      { authenticated: true }
    );
    return response.data;
  },
};
