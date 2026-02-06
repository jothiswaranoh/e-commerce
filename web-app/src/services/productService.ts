import { apiService } from '../api/apiService';
import { Product, ProductFormData } from '../types/product';
import { ApiResponse } from '../types/api';

export const productService = {
  getProducts: () =>
    apiService.get<ApiResponse<Product[]>>('/products'),

  getProduct: (id: string | number) =>
    apiService.get<ApiResponse<Product>>(`/products/${id}`),

  createProduct: (data: ProductFormData) =>
    apiService.post<ApiResponse<Product>>('/products', { product: data }),

  updateProduct: (id: string | number, data: ProductFormData) =>
    apiService.put<ApiResponse<Product>>(`/products/${id}`, { product: data }),

  deleteProduct: (id: string | number) =>
    apiService.delete<ApiResponse<null>>(`/products/${id}`),
};