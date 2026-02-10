import type { CommonResponse } from '@/types/api/commonResponse';
import type { MemberDetailDto } from '@/types/api/member/detail';
import { api } from '@/utils/AxiosInstance';

export const getMemberDetail = async (userId: number) => {
    const response = await api.get<CommonResponse<MemberDetailDto>>(
        `/api/v1/home/members/${userId}`
    );
    
    console.log('API Response:', response);
    console.log('Response data:', response.data);
    console.log('Response body:', response.data.body);
    
    return response.data.body;
};