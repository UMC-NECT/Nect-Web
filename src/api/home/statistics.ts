import type { CommonResponse } from '@/types/api/commonResponse';
import type { ResponseStatisticsDto } from '@/types/api/home/statistics';
import { api } from '@/utils/AxiosInstance';

export const getStatistics = async () => {
    const response = await api.get<CommonResponse<ResponseStatisticsDto>>(
        '/api/v1/home/statistics'
    );
    return response.data;
};