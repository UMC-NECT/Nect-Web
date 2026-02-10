import { useQuery } from '@tanstack/react-query';
import { getMemberDetail } from '@/api/member/detail';

export const useMemberDetail = (userId: number) => {
    return useQuery({
        queryKey: ['member', 'detail', userId],
        queryFn: () => getMemberDetail(userId),
        enabled: !!userId,
    });
};