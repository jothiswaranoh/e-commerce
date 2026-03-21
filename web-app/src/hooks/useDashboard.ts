import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardCounts } from '../api/dashboard';

export const useDashboard = () => {
    return useQuery<DashboardCounts>({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const res = await dashboardService.getStats();
            if (!res.success) throw new Error(res.message);
            return res.data as DashboardCounts;
        },
    });
};
