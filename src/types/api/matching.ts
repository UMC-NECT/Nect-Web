import type { CommonResponse } from './commonResponse'

// === 공통 타입 ==========================================================

export type MatchingStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED' | 'EXPIRED'

export type MatchingStatusParam = 'pending' | 'accepted' | 'rejected' | 'canceled' | 'expired'

export type MatchingTarget = 'project' | 'user'

export type RequestType = 'USER_TO_PROJECT' | 'PROJECT_TO_USER'

export type RejectReason = 'OTHER' | string

// === 매칭 요청 개수 조회 ==========================================================

export type MatchingCountBody = {
	receivedCount: number
	sentCount: number
}

export type ResponseMatchingCountDto = CommonResponse<MatchingCountBody>

// === 받은/보낸 매칭 요청 ==========================================================

export type UserMatchingDto = {
	matchingId?: number
	userId: number
	nickname: string
	bio: string
	field: string
	profileUrl: string
	matchingStatus?: MatchingStatus
	expiresAt?: string
}

export type ProjectMatchingDto = {
	matchingId?: number
	projectId: number
	title: string
	description: string
	currentMembersNum: number
	imageUrl: string
	matchingStatus?: MatchingStatus
	expiresAt?: string
}

export type MatchingListBody = {
	counterParty: string
	userMatchings: UserMatchingDto[]
	projectMatchings: ProjectMatchingDto[]
}

export type ResponseMatchingListDto = CommonResponse<MatchingListBody>

// === 매칭 요청/수락/취소/거절 공통 ==========================================================

export type MatchingDto = {
	id: number
	requestUserId: number
	targetUserId: number
	projectId: number
	field: string
	customField: string | null
	matchingStatus: MatchingStatus
	requestType: RequestType
	expiresAt: string
}

// === 유저 -> 프로젝트 매칭 요청 ==========================================================

export type RequestUserToProjectMatchingDto = {
	field: string
}

export type ResponseUserToProjectMatchingDto = CommonResponse<MatchingDto>

// === 프로젝트 -> 유저 매칭 요청 ==========================================================

export type RequestProjectToUserMatchingDto = {
	field: string
}

export type ResponseProjectToUserMatchingDto = CommonResponse<MatchingDto>

// === 매칭 수락 ==========================================================

export type ProjectUserDto = {
	id: number
	userId: number
	projectId: number
	field: string
	memberType: string
	memberStatus: string
}

export type MatchingAcceptBody = {
	matching: MatchingDto
	projectUser: ProjectUserDto
}

export type ResponseMatchingAcceptDto = CommonResponse<MatchingAcceptBody>

// === 매칭 취소 ==========================================================

export type ResponseMatchingCancelDto = CommonResponse<MatchingDto>

// === 매칭 거절 ==========================================================

export type RequestMatchingRejectDto = {
	rejectReason: RejectReason
}

export type ResponseMatchingRejectDto = CommonResponse<MatchingDto>
