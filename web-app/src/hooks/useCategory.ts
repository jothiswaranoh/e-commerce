import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CategoryAPI, { Category, CategoryPayload } from '../api/category';

/* =========================
   Query Keys
========================= */

const CATEGORY_KEYS = {
    all: ['categories'] as const,
    detail: (id: number) => ['categories', id] as const,
};

/* =========================pn
   Queries
========================= */

export function useCategories() {
    return useQuery<Category[]>({
        queryKey: CATEGORY_KEYS.all,
        queryFn: async () => {
            const res = await CategoryAPI.list();

            if (!res.success) {
                throw new Error(res.message || 'Failed to fetch categories');
            }

            // 🔴 IMPORTANT: unwrap backend response
            return Array.isArray(res.data) ? res.data : [];
        },
    });
}

export function useCategory(id: number) {
    return useQuery<Category, Error>({
        queryKey: CATEGORY_KEYS.detail(id),
        queryFn: async () => {
            const res = await CategoryAPI.get(id);

            if (!res.success || !res.data) {
                throw new Error(res.message || 'Failed to fetch category');
            }

            return res.data;
        },
        enabled: Boolean(id),
    });
}

/* =========================
   Mutations
========================= */

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation<Category, Error, CategoryPayload>({
        mutationFn: async (payload) => {
            const res = await CategoryAPI.create(payload);

            if (!res.success || !res.data) {
                throw new Error(res.message || 'Failed to create category');
            }

            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation<
        Category,
        Error,
        { id: number; payload: Partial<CategoryPayload> }
    >({
        mutationFn: async ({ id, payload }) => {
            const res = await CategoryAPI.update(id, payload);
            if (!res.success) throw new Error('Update failed');
            return res.data as Category;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
            queryClient.invalidateQueries({
                queryKey: CATEGORY_KEYS.detail(variables.id),
            });
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation<boolean, Error, number>({
        mutationFn: async (id) => {
            const res = await CategoryAPI.delete(id);
            if (!res.success) throw new Error('Delete failed');
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
        },
    });
}
