import type { CommonResponse } from '@/types/api/commonResponse'
import type { ResponseMypageProfileDto, RequestMypageProfileSaveDto, ResponseProjectUsers } from '@/types/api/mypage'
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

// (모든 프로젝트) 현재 참여중인 프로젝트 조회
export const getMypageProjects = async (): Promise<ResponseProjectUsers> => {
	const { data } = await api.get('/api/v1/mypage/projects')

	return data
}
