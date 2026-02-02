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
    return useQuery({
        queryKey: CATEGORY_KEYS.all,
        queryFn: async () => {
            const res = await CategoryAPI.list();
            if (!res.success) throw res;
            // API returns wrapped response { success: true, data: [...] }
            return (res.data as any).data as Category[];
        },
    });
}

export function useCategory(id: number) {
    return useQuery({
        queryKey: CATEGORY_KEYS.detail(id),
        queryFn: async () => {
            const res = await CategoryAPI.get(id);
            if (!res.success) throw res;
            // API returns wrapped response { success: true, data: {...} }
            return (res.data as any).data as Category;
        },
        enabled: !!id,
    });
}

/* =========================
   Mutations
========================= */

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CategoryPayload) => {
            const res = await CategoryAPI.create(payload);
            if (!res.success) throw res;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: number;
            payload: Partial<CategoryPayload>;
        }) => {
            const res = await CategoryAPI.update(id, payload);
            if (!res.success) throw res;
            return res.data;
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

    return useMutation({
        mutationFn: async (id: number) => {
            const res = await CategoryAPI.delete(id);
            if (!res.success) throw res;
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
        },
    });
}
