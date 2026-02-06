import type { CommonResponse } from '@/types/api/commonResponse'
import type { ResponseMypageProfileDto, RequestMypageProfileSaveDto } from '@/types/api/mypage'
import { api } from '@/utils/AxiosInstance'

// (내 프로필 설정) 프로필 조회
export const getMypageProfile = async (): Promise<ResponseMypageProfileDto> => {
	const { data } = await api.get('/api/v1/mypage/profile')

	return data
}

// (내 프로필 설정) 프로필 수정
export const patchMypageProfileSave = async (body: RequestMypageProfileSaveDto): Promise<CommonResponse> => {
	const { data } = await api.patch('/api/v1/mypage/profile/save', body)

	return data
}
