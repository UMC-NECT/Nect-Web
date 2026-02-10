import { useQuery } from '@tanstack/react-query';
import { getProjectDetail } from '@/api/project';

export const useProjectDetail = (projectId: number) => {
    return useQuery({
        queryKey: ['project', 'detail', projectId],
        queryFn: () => getProjectDetail(projectId),
        enabled: !!projectId,
    });
};