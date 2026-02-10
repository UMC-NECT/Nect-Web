import { useQuery } from '@tanstack/react-query'
import { getCalendarMonth } from '@/api/team-board/boards'

/**
 * 캘린더 월간 인디케이터를 조회하는 hook
 * @param projectId - 프로젝트 ID
 * @param year - 조회 연도
 * @param month - 조회 월 (1~12)
 */
export const useCalendarMonth = (projectId: number | null, year: number, month: number) => {
	return useQuery({
		queryKey: ['calendarMonth', projectId, year, month],
		queryFn: () => getCalendarMonth(projectId!, year, month),
		enabled: projectId !== null && year > 0 && month >= 1 && month <= 12,
	})
}
