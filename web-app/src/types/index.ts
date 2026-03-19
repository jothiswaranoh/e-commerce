export * from './product';

export interface Organization {
  id: number;
  name: string;
  store_name?: string;
  slug?: string;
  logo_url?: string;

  primary_color?: string;
  secondary_color?: string;

  support_email?: string;
  support_phone?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;

  role: 'admin' | 'manager' | 'user' | 'customer';

  emailVerified: boolean;
  createdAt: string;

  organization?: Organization;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  role?: string;
}