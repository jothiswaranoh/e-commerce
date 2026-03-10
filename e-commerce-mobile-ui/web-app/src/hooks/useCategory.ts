import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CategoryAPI, { Category, CategoryPayload } from "../api/category";

/* =========================
   Query Keys
========================= */

const CATEGORY_KEYS = {
  list: (page: number, perPage: number) =>
    ["categories", page, perPage] as const,
  detail: (id: number) => ["categories", id] as const,
};
 
/* =========================
   Queries
========================= */

export function useCategories(page = 1, perPage = 10) {
  return useQuery<{
    data: Category[];
    meta: {
      current_page: number;
      per_page: number;
      total_pages: number;
      total_count: number;
    };
  }>({
    queryKey: CATEGORY_KEYS.list(page, perPage),
    queryFn: async () => {
      const res = await CategoryAPI.list({
        page,
        per_page: perPage,
      });

      if (!res.success) {
        throw new Error(res.message || "Failed to fetch categories");
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
    }
  });
}

/* =========================
   Mutations
========================= */

export function useCreateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoryPayload) =>
      CategoryAPI.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<CategoryPayload>;
    }) => CategoryAPI.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => CategoryAPI.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}