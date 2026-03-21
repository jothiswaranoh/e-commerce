import { apiService } from './apiService';

export interface DashboardCounts {
    users_count: number;
    products_count: number;
    orders_count: number;
    categories_count: number;
}

export const dashboardService = {
    getStats: () => apiService.get<DashboardCounts>('/dashboard'),
};
