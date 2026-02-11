import { useQuery } from '@tanstack/react-query';
import { getLeaderRecruitments } from '@/api/recruitment/leader';

export const useLeaderRecruitments = () => {
    return useQuery({
        queryKey: ['recruitments', 'leader'],
        queryFn: getLeaderRecruitments,
    });
};
