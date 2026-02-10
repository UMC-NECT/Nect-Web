import type { CommonResponse } from '@/types/api/commonResponse';
import type { ProjectDetailDto } from '@/types/api/project';
import { api } from '@/utils/AxiosInstance';

export const getProjectDetail = async (projectId: number) => {
    const response = await api.get<CommonResponse<ProjectDetailDto>>(
        `/api/v1/home/projects/${projectId}`
    );
    return response.data.body;
};