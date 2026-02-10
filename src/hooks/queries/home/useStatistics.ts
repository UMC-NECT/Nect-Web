import { useQuery } from '@tanstack/react-query';
import { getStatistics } from '@/api/home/statistics';

export const useStatistics = () => {
    return useQuery({
        queryKey: ['statistics'],
        queryFn: getStatistics,
        select: (data) => data.body,
    });
};