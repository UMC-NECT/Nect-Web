import type { CommonResponse } from '@/types/api/commonResponse';
import type { ResponseMembersDto } from '@/types/api/home';
import { api } from '@/utils/AxiosInstance';

export const getMatchableMembers = async (count: number = 4) => {
    const response = await api.get<CommonResponse<ResponseMembersDto>>(
        '/api/v1/home/members',
        {
        params: { count }
        }
    );
    return response.data;
    };

    export const getRecommendationMembers = async (count: number = 15) => {
    const response = await api.get<CommonResponse<ResponseMembersDto>>(
        '/api/v1/home/recommendations/members',
        {
        params: { count }
        }
    );
    return response.data;
    };