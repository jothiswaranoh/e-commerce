import { apiService } from './apiService';

export interface DashboardStats {
    label: string;
    value: number | string;
    change: string;
    isPositive: boolean;
    type: 'currency' | 'number';
}

export interface RecentOrder {
    id: string;
    customer: string;
    amount: number | string;
    status: string;
    date: string;
}

export interface TopProduct {
    id: number;
    name: string;
    sold: number;
    revenue: number;
    image?: string;
}

export interface DashboardData {
    stats: DashboardStats[];
    recent_orders: RecentOrder[];
    top_products: TopProduct[];
}

export const dashboardService = {
    getStats: () => apiService.get('/dashboard'),
};
