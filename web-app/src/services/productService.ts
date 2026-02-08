import { apiService } from '../api/apiService';
import { ProductFormData } from '../types/product';

function buildProductFormData(data: any) {
  const fd = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'variants_attributes' && Array.isArray(value)) {
      value.forEach((v, i) => {
        Object.entries(v).forEach(([vk, vv]) => {
          fd.append(`product[variants_attributes][${i}][${vk}]`, String(vv));
        });
      });
      return;
    }

    if (key === 'images' && Array.isArray(value)) {
      value.forEach((file: File) => {
        fd.append('product[images][]', file);
      });
      return;
    }

    if (value !== undefined && value !== null) {
      fd.append(`product[${key}]`, String(value));
    }
  });

  return fd;
}

export const productService = {
  getProducts: (params?: { page?: number; per_page?: number }) =>
    apiService.get('/products', params),

  getProduct: (id: string | number) =>
    apiService.get(`/products/${id}`),

  createProduct: (data: ProductFormData) =>
    apiService.post(
      '/products',
      buildProductFormData(data),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ),

  updateProduct: (id: string | number, data: ProductFormData) =>
    apiService.put(
      `/products/${id}`,
      buildProductFormData(data),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ),

  deleteProduct: (id: string | number) =>
    apiService.delete(`/products/${id}`),
};