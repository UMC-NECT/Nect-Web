import type { CommonResponse } from '@/types/api/commonResponse';
import type { ResponseProjectsDto } from '@/types/api/home';
import { api } from '@/utils/AxiosInstance';

export const getRecruitingProjects = async (count: number = 4) => {
    const response = await api.get<CommonResponse<ResponseProjectsDto>>(
        '/api/v1/home/projects',
        {
        params: { count }
        }
    );
    return response.data;
    };

    export const getRecommendationProjects = async (count: number = 15) => {
    const response = await api.get<CommonResponse<ResponseProjectsDto>>(
        '/api/v1/home/recommendations/projects',
        {
        params: { count }
        }
    );
    return response.data;
};