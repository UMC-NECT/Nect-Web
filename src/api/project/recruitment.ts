import type { CommonResponse } from '@/types/api/commonResponse';
import type { RecruitmentDto } from '@/types/api/project/recruitment';
import { api } from '@/utils/AxiosInstance';

export const getProjectRecruitments = async (projectId: number) => {
    const response = await api.get<CommonResponse<RecruitmentDto[]>>(
        `/api/v1/mypage/${projectId}/recruitments`
    );
    return response.data.body;
};
