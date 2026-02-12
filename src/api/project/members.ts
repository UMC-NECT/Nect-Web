import type { CommonResponse } from '@/types/api/commonResponse';
import type { ProjectMembersBody } from '@/types/api/project/members';
import { api } from '@/utils/AxiosInstance';

export const getProjectMembers = async (projectId: number) => {
    const response = await api.get<CommonResponse<ProjectMembersBody>>(
        `/api/v1/home/projects/${projectId}/members`
    );
    return response.data.body;
};
