import { apiService } from "./apiService";

export interface User {
    id: number;
    org_id: number;
    name: string;
    email_address: string;
    role: "admin" | "manager" | "user" | "customer";
    created_at: string;
    updated_at: string;
}

export interface UserPayload {
    name: string;
    email_address: string;
    password?: string;
    role: "admin" | "manager" | "user" | "customer";
}

const BASE_PATH = "/users";

const UserAPI = {
    /**
     * GET /api/v1/users?page=&per_page=
     */
    list(params?: { page?: number; per_page?: number }) {
        return apiService.get<{
            data: User[];
            meta: {
                current_page: number;
                per_page: number;
                total_pages: number;
                total_count: number;
            };
        }>(BASE_PATH, params);
    },

    get(id: number) {
        return apiService.get<User>(`${BASE_PATH}/${id}`);
    },

    create(payload: UserPayload) {
        return apiService.post<User>(BASE_PATH, { user: payload });
    },

    update(id: number, payload: Partial<UserPayload>) {
        return apiService.patch<User>(`${BASE_PATH}/${id}`, { user: payload });
    },

    delete(id: number) {
        return apiService.delete<void>(`${BASE_PATH}/${id}`);
    },
};

export default UserAPI;
