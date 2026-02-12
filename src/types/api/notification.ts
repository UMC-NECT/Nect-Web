import type { CommonResponse } from "./commonResponse"

/**
 * 알림 필터 타입
 */
export type NotificationFilter = "EXPLORATION" | "WORKSPACE_ONLY" | "WORKSPACE_GLOBAL" | "WORKSPACES"

/**
 * 알림 타입
 */
export type NotificationType =
	| "CHAT_MESSAGE_RECEIVED"
	| "WORKSPACE_MEMBER_JOINED"
	| string // 다른 타입들도 있을 수 있으므로 string으로 확장 가능

/**
 * 알림 범위
 */
export type NotificationScope = "MAIN_HOME" | "WORKSPACE_ONLY" | "WORKSPACE_GLOBAL" | string

/**
 * 알림 DTO
 */
export type NotificationDto = {
	mainMessage: string
	contentMessage: string | null
	noticeId: number
	targetId: number
	projectId: number
	createdDate: string
	classification: string | null
	type: NotificationType
	scope: NotificationScope
	isRead: boolean
}

/**
 * 알림 목록 응답 DTO
 */
export type NotificationListDto = {
	notifications: NotificationDto[]
	nextCursor: number | null
}

/**
 * 알림 목록 조회 요청 파라미터
 */
export type GetNotificationListParams = {
	filter: NotificationFilter
	cursor?: number | null
	size?: number
}

/**
 * 알림 목록 조회 응답
 */
export type GetNotificationListResponse = CommonResponse<NotificationListDto>
