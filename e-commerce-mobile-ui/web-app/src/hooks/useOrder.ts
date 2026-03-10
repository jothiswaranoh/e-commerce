import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OrderAPI from "../api/order";

export const useOrders = (page: number = 1, perPage: number = 10) => {
    return useQuery({
        queryKey: ["orders", page, perPage],
        queryFn: async () => {
            const res = await OrderAPI.list({ page, per_page: perPage });
            if (!res.success) {
                throw new Error(res.message || "Failed to fetch orders");
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
    });
};

export const useOrder = (id: number) => {
    return useQuery({
        queryKey: ["orders", id],
        queryFn: () => OrderAPI.get(id),
        enabled: !!id,
    });
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: { status?: string; payment_status?: string } }) => {
            const res = await OrderAPI.update(id, payload);
            if (!res.success) {
                throw new Error(res.message || "Failed to update order");
            }
            return res.data; // Return the actual Order object
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ["orders", data.id] });
            }
        },
    });
};
