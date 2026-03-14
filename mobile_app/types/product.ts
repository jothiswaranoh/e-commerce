export interface ProductVariant {
  id: string;
  name?: string;
  sku?: string;
  price: number;
  stock: number;
}

export interface ProductAttribute {
  id: string;
  key: string;
  value: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface BackendProduct {
  id: string;
  org_id?: string;
  name: string;
  slug?: string;
  description?: string;
  status?: string;
  category_id?: string;
  category?: ProductCategory;
  variants?: ProductVariant[];
  product_attributes?: ProductAttribute[];
  images?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image_url: string;
  images?: string[];
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isPrime?: boolean;
  discount?: number;
  features?: string[];
  variants?: ProductVariant[];
}
