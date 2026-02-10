import { useQuery } from "@tanstack/react-query"
import { getNotificationList } from "@/api/notification"
import type { GetNotificationListParams } from "@/types/api/notification"

/**
 * 알림 목록 조회 hook
 *
 * @param params - 알림 목록 조회 파라미터
 * @returns 알림 목록 조회 결과
 */
export const useNotificationList = (params: GetNotificationListParams) => {
	return useQuery({
		queryKey: ["notificationList", params.filter, params.cursor, params.size],
		queryFn: () => getNotificationList(params),
		enabled: !!params.filter, // filter가 필수이므로 필수 체크
	})
}
