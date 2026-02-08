import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { ProductFormData, Product } from '../types/product';

export interface ProductsResponse {
  products: Product[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

/* ───────── GET PRODUCTS ───────── */

export function useProducts(page = 1, perPage = 10) {
  return useQuery<{
    data: Product[];
    meta: {
      current_page: number;
      per_page: number;
      total_pages: number;
      total_count: number;
    };
  }>({
    queryKey: ['products', page, perPage],
    queryFn: async () => {
      const res = await productService.getProducts({
        page,
        per_page: perPage,
      });

      if (!res.success) {
        throw new Error(res.message || 'Failed to fetch products');
      }

      return {
        data: res.data?.data ?? [],
        meta: res.data?.meta ?? {
          current_page: page,
          per_page: perPage,
          total_pages: 1,
          total_count: 0,
        },
      };
    },
    keepPreviousData: true,
  });
}

/* ───────── GET SINGLE ───────── */

export const useProduct = (id: string | number) =>
  useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const res = await productService.getProduct(id);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    enabled: !!id,
  });

/* ───────── CREATE ───────── */

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductFormData) =>
      productService.createProduct(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

/* ───────── UPDATE ───────── */

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: any) =>
      productService.updateProduct(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['products', vars.id] });
    },
  });
};

/* ───────── DELETE ───────── */

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};