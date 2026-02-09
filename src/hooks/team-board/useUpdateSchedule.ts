import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSchedule } from '@/api/team-board/boards'
import type { UpdateScheduleRequest } from '@/types/api/team-board/schedule'

/**
 * 팀 일정을 수정하는 hook
 * @param projectId - 프로젝트 ID
 */
export const useUpdateScheduleMutation = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ scheduleId, scheduleData }: { scheduleId: number; scheduleData: UpdateScheduleRequest }) =>
			updateSchedule(projectId, scheduleId, scheduleData),
		onSuccess: () => {
			// 일정 수정 후 관련 데이터 refetch
			queryClient.invalidateQueries({ queryKey: ['teamBoardOverview', projectId] })
			queryClient.invalidateQueries({ queryKey: ['calendarMonth', projectId] })
		},
	})
}
