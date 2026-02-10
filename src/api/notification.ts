import type {
	GetNotificationListParams,
	GetNotificationListResponse,
} from "@/types/api/notification"
import { api } from "@/utils/AxiosInstance"

/**
 * 알림 목록 조회
 * 사용자의 알림 목록을 커서 기반 페이징 방식으로 조회합니다.
 *
 * @param params - 알림 목록 조회 파라미터
 * @returns 알림 목록 응답
 */
export const getNotificationList = async (
	params: GetNotificationListParams
): Promise<GetNotificationListResponse> => {
	const { filter, cursor, size } = params

	const queryParams = new URLSearchParams()
	queryParams.append("filter", filter)
	if (cursor !== undefined && cursor !== null) {
		queryParams.append("cursor", String(cursor))
	}
	if (size !== undefined) {
		queryParams.append("size", String(size))
	}

	const { data } = await api.get(`/api/v1/notifications?${queryParams.toString()}`)
	return data
}
