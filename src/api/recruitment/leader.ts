import type { CommonResponse } from '@/types/api/commonResponse';
import type { LeaderRecruitmentProjectDto } from '@/types/api/recruitment';
import { api } from '@/utils/AxiosInstance';

export const getLeaderRecruitments = async () => {
    const response = await api.get<CommonResponse<LeaderRecruitmentProjectDto[]>>(
        '/api/v1/recruitments/leader'
    );
    return response.data.body ?? [];
};
