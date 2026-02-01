import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { ProductFormData } from '../types/product';

export const useProducts = (params?: Record<string, any>) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: async () => {
            const response = await productService.getProducts(params);
            if (!response.success) throw new Error(response.message);
            return response.data || [];
        },
    });
};

export const useProduct = (id: string | number) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: async () => {
            const response = await productService.getProduct(id);
            if (!response.success) throw new Error(response.message);
            return response.data;
        },
        enabled: !!id,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ProductFormData) => productService.createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: ProductFormData }) =>
            productService.updateProduct(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => productService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
