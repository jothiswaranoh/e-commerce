import { apiService } from '../api/apiService';

function buildProductFormData(data: any) {
  const fd = new FormData();

  Object.entries(data).forEach(([key, value]) => {

    if (
      (key === 'variants' || key === 'variants_attributes') &&
      Array.isArray(value)
    ) {
      value.forEach((variant: any, index: number) => {
        Object.entries(variant).forEach(([vk, vv]) => {
          if (vv !== undefined && vv !== null) {
            fd.append(
              `product[variants_attributes][${index}][${vk}]`,
              String(vv)
            );
          }
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

    if (key === 'existing_images' && Array.isArray(value)) {
      value.forEach((img: string) => {
        fd.append('product[existing_images][]', img);
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

  createProduct: async (data: any) => {
    const formData = buildProductFormData(data);
    return apiService.post('/products', formData);
  },

  updateProduct: async (id: number, data: any) => {
    const formData = buildProductFormData(data);
    return apiService.put(`/products/${id}`, formData);
  },

  deleteProduct: (id: string | number) =>
    apiService.delete(`/products/${id}`),
};