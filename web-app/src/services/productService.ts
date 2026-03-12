import { apiService } from '../api/apiService';

function buildProductFormData(data: any) {
  const fd = new FormData();

  Object.entries(data).forEach(([key, value]) => {

    if (key === "category") return;

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
      value.forEach((img: any) => {
        if (img instanceof File) {
          fd.append('product[images][]', img);
        }
      });
      return;
    }

    if (key === 'existing_images' && Array.isArray(value)) {
      value.forEach((img: string) => {
        fd.append('product[existing_images][]', img);
      });
      return;
    }

    if (key === 'delete_image_ids' && Array.isArray(value)) {
      value.forEach((id: number) => {
        fd.append('product[delete_image_ids][]', String(id));
      });
      return;
    }

    if (key === 'image_order_ids' && Array.isArray(value)) {
      value.forEach((id: number) => {
        fd.append('product[image_order_ids][]', String(id));
      });
      return;
    }

    if (
      value !== undefined &&
      value !== null &&
      typeof value !== "object"
    ) {
      fd.append(`product[${key}]`, String(value));
    }
      });

      return fd;
}

export const productService = {
  getProducts: (params?: { page?: number; per_page?: number; search?: string }) =>
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