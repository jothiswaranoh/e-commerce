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
  count?: number;
}

export interface CategoryPayload {
  name: string;
  slug: string;
  parent_id?: number | null;
  is_active?: boolean;
  sort_order?: number;
  image?: File | null;
  remove_image?: boolean;
}

const BASE_PATH = "/categories";

const categoryToFormData = (payload: CategoryPayload) => {
  const fd = new FormData();

  fd.append("category[name]", payload.name);
  fd.append("category[slug]", payload.slug);

  if (payload.parent_id !== undefined && payload.parent_id !== null) {
    fd.append("category[parent_id]", String(payload.parent_id));
  }

  if (payload.is_active !== undefined) {
    fd.append("category[is_active]", String(payload.is_active));
  }

  if (payload.sort_order !== undefined) {
    fd.append("category[sort_order]", String(payload.sort_order));
  }

  if (payload.image) {
    fd.append("category[image]", payload.image);
  }

  if (payload.remove_image) {
    fd.append("category[remove_image]", "true");
  }

  return fd;
};

const CategoryAPI = {
  /**
   * GET /api/v1/categories?page=&per_page=
   */
  list(params?: { page?: number; per_page?: number }) {
    return apiService.get<{
      data: Category[];
      meta: {
        current_page: number;
        per_page: number;
        total_pages: number;
        total_count: number;
      };
    }>(BASE_PATH, params);
  },

  get(id: number) {
    return apiService.get<Category>(`${BASE_PATH}/${id}`);
  },

  create(payload: CategoryPayload) {
    return apiService.post<Category>(BASE_PATH, categoryToFormData(payload));
  },

  update(id: number, payload: Partial<CategoryPayload>) {
    return apiService.patch<Category>(
      `${BASE_PATH}/${id}`,
      categoryToFormData(payload as CategoryPayload)
    );
  },

  delete(id: number) {
    return apiService.delete<void>(`${BASE_PATH}/${id}`);
  },
};

export default CategoryAPI;