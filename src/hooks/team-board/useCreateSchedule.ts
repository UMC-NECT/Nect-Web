import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSchedule } from '@/api/team-board/boards'
import type { CreateScheduleRequest } from '@/types/api/team-board/schedule'

/**
 * 팀 일정을 생성하는 hook
 * @param projectId - 프로젝트 ID
 */
export const useCreateScheduleMutation = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (scheduleData: CreateScheduleRequest) => createSchedule(projectId, scheduleData),
		onSuccess: () => {
			// 일정 생성 후 관련 데이터 refetch
			queryClient.invalidateQueries({ queryKey: ['teamBoardOverview', projectId] })
			queryClient.invalidateQueries({ queryKey: ['calendarMonth', projectId] })
		},
	})
}
