import type { CommonResponse } from '@/types/api/commonResponse';
import type { MemberDetailDto } from '@/types/api/member/detail';
import { api } from '@/utils/AxiosInstance';

export const getMemberDetail = async (userId: number): Promise<MemberDetailDto> => {
    const response = await api.get<CommonResponse<MemberDetailDto>>(
        `/api/v1/home/members/${userId}`
    );
    return response.data.body as MemberDetailDto;
};