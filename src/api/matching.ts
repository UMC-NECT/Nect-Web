import type {
	ResponseMatchingCountDto,
	ResponseMatchingListDto,
	RequestUserToProjectMatchingDto,
	ResponseUserToProjectMatchingDto,
	ResponseMatchingAcceptDto,
	ResponseMatchingCancelDto,
	RequestMatchingRejectDto,
	ResponseMatchingRejectDto,
	RequestProjectToUserMatchingDto,
	ResponseProjectToUserMatchingDto,
	MatchingTarget,
	MatchingStatusParam,
} from '@/types/api/matching'
import type { ResponseMatchingDto } from '@/types/api/mypage'
import { api } from '@/utils/AxiosInstance'

// === 매칭 요청 개수 조회 ==========================================================
// 보낸/받은 매칭(PENDING) 개수를 조회
export const getMatchingCount = async (): Promise<ResponseMatchingCountDto> => {
	const { data } = await api.get('/api/v1/matchings/count')
	return data
}

// === 받은 매칭 요청 조회 ==========================================================
// target에 해당되는 받은(수신) 매칭 요청을 조회
export const getMatchingsReceived = async (
	target: MatchingTarget,
	status: MatchingStatusParam
): Promise<ResponseMatchingListDto> => {
	const { data } = await api.get('/api/v1/matchings/received', {
		params: { target, status },
	})
	return data
}

// === 보낸 매칭 요청 조회 ==========================================================
// 보낸(발신) 매칭 요청을 조회. target에 해당되는 매칭 요청만 조회됩니다.
export const getMatchingsSent = async (target: MatchingTarget, status: MatchingStatusParam): Promise<ResponseMatchingListDto> => {
	const { data } = await api.get('/api/v1/matchings/sent', {
		params: { target, status },
	})
	return data
}

// === 유저 -> 프로젝트 매칭 요청 ==========================================================
// 유저가 특정 프로젝트의 특정 분야(field)에 매칭을 요청
export const postMatchingUserToProject = async (
	projectId: string,
	body: RequestUserToProjectMatchingDto
): Promise<ResponseUserToProjectMatchingDto> => {
	const { data } = await api.post(`/api/v1/matchings/projects/${projectId}`, body)
	return data
}

// === 매칭 수락 ==========================================================
// 매칭 요청을 받은 주체(회원, 리더)가 요청을 수락
export const postMatchingAccept = async (matchingId: string): Promise<ResponseMatchingAcceptDto> => {
	const { data } = await api.post(`/api/v1/matchings/${matchingId}/accept`)
	return data
}

// === 매칭 취소 ==========================================================
// 매칭 요청을 한 유저가 해당 매칭을 취소
export const postMatchingCancel = async (matchingId: string): Promise<ResponseMatchingCancelDto> => {
	const { data } = await api.post(`/api/v1/matchings/${matchingId}/cancel`)
	return data
}

// === 매칭 거절 ==========================================================
// 매칭 요청을 받은 주체(회원, 리더)가 요청을 거절
export const postMatchingReject = async (
	matchingId: string,
	body: RequestMatchingRejectDto
): Promise<ResponseMatchingRejectDto> => {
	const { data } = await api.post(`/api/v1/matchings/${matchingId}/reject`, body)
	return data
}

// === 프로젝트 -> 유저 매칭 요청 ==========================================================
// 프로젝트의 리더가 특정 유저를 특정 분야에 매칭을 요청
export const postMatchingProjectToUser = async (
	projectId: string,
	targetUserId: string,
	body: RequestProjectToUserMatchingDto
): Promise<ResponseProjectToUserMatchingDto> => {
	const { data } = await api.post(`/api/v1/matchings/projects/${projectId}/users/${targetUserId}`, body)
	return data
}

// === 매칭 유저 상세 조회 ==========================================================
// 특정 유저의 매칭 목록을 조회
export const getMatchingUserDetail = async (
	userId: string,
	target: MatchingTarget,
	status: MatchingStatusParam
): Promise<ResponseMatchingListDto> => {
	const { data } = await api.get(`/api/v1/matchings/users/${userId}`, {
		params: { target, status },
	})
	return data
}

// === 매칭 현황 ==========================================================
// 받은 매칭 전체 조회
export const getMatchingsReceivedDto = async (): Promise<ResponseMatchingDto> => {
	const { data } = await api.get('/api/v1/matchings/received/total')

	return data
}

// 보낸 매칭 전체 조회
export const getMatchingsSentDto = async (): Promise<ResponseMatchingDto> => {
	const { data } = await api.get('/api/v1/matchings/sent/total')

	return data
}
