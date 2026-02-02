

/* =========================
   Category Types
========================= */

import { apiService } from "./apiService";

export interface Category {
    id: number;
    org_id: number;
    name: string;
    slug: string;
    parent_id?: number | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    image?: string | null;
    count?: string | number;
}

export interface CategoryPayload {
    name: string;
    slug: string;
    parent_id?: number | null;
    is_active?: boolean;
    sort_order?: number;
}

/* =========================
   API Endpoints
========================= */

const BASE_PATH = '/categories';

/* =========================
   Category API
========================= */

export const CategoryAPI = {
    /**
     * GET /api/v1/categories
     */
    list() {
        return apiService.get<Category[]>(BASE_PATH);
    },

    /**
     * GET /api/v1/categories/:id
     */
    get(id: number) {
        return apiService.get<Category>(`${BASE_PATH}/${id}`);
    },

    /**
     * POST /api/v1/categories
     */
    create(payload: CategoryPayload) {
        return apiService.post<Category>(BASE_PATH, {
            category: payload,
        });
    },

    /**
     * PATCH /api/v1/categories/:id
     */
    update(id: number, payload: Partial<CategoryPayload>) {
        return apiService.patch<Category>(`${BASE_PATH}/${id}`, {
            category: payload,
        });
    },

    /**
     * DELETE /api/v1/categories/:id
     */
    delete(id: number) {
        return apiService.delete<void>(`${BASE_PATH}/${id}`);
    },
};

export default CategoryAPI;
