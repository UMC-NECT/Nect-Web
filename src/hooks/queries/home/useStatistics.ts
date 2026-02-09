import { useQuery } from '@tanstack/react-query';
import { getStatistics } from '@/api/home';

export const useStatics = () => {
    return useQuery({
        queryKey: ['home', 'statistics'],
        queryFn: getStatistics,
        select: (data) => data.body,
    });
};