import { apiService } from '../api/apiService';
import { Product, ProductFormData } from '../types/product';

export const productService = {
    getProducts: () => apiService.get<Product[]>('/products'),

    getProduct: (id: string | number) => apiService.get<Product>(`/products/${id}`),

    createProduct: (data: ProductFormData) => apiService.post<Product>('/products', { product: data }),

    updateProduct: (id: string | number, data: ProductFormData) =>
        apiService.put<Product>(`/products/${id}`, { product: data }),

    deleteProduct: (id: string | number) => apiService.delete(`/products/${id}`),
};
