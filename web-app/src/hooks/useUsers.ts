import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserAPI, { User, UserPayload } from "../api/users";

/* =========================
   Query Keys
========================= */

const USER_KEYS = {
    list: (page: number, perPage: number) =>
        ["users", page, perPage] as const,
    detail: (id: number) => ["users", id] as const,
};

/* =========================
   Queries
========================= */

export function useUsers(page = 1, perPage = 10) {
    return useQuery<{
        data: User[];
        meta: {
            current_page: number;
            per_page: number;
            total_pages: number;
            total_count: number;
        };
    }>({
        queryKey: USER_KEYS.list(page, perPage),
        queryFn: async () => {
            const res = await UserAPI.list({
                page,
                per_page: perPage,
            });

            if (!res.success) {
                throw new Error(res.message || "Failed to fetch users");
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
}

/* =========================
   Mutations
========================= */

export function useCreateUser() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: UserPayload) => UserAPI.create(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

export function useUpdateUser() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: number;
            payload: Partial<UserPayload>;
        }) => UserAPI.update(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

export function useDeleteUser() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => UserAPI.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["users"] });
        },
    });
}
