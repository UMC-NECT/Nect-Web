import { useQuery } from '@tanstack/react-query';
import { getProjectRecruitments } from '@/api/project/recruitment';

export const useProjectRecruitments = (projectId: number) => {
    return useQuery({
        queryKey: ['project', 'recruitments', projectId],
        queryFn: () => getProjectRecruitments(projectId),
        enabled: !!projectId,
    });
};
