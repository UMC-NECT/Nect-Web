import { useQuery } from '@tanstack/react-query';
import { getProjectMembers } from '@/api/project/members';
import { QUERY_KEY } from '@/constants/key';

export const useProjectMembers = (projectId: number) => {
    return useQuery({
        queryKey: QUERY_KEY.project.members(projectId),
        queryFn: () => getProjectMembers(projectId),
        enabled: !!projectId,
    });
};
