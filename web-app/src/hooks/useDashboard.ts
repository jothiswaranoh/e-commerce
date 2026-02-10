import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardData } from '../api/dashboard';

export const useDashboard = () => {
    return useQuery<{ data: DashboardData }>({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const res = await dashboardService.getStats();
            if (!res.success) throw new Error(res.message);
            return res.data;
        },
    });
};
