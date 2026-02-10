import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSchedule } from '@/api/team-board/boards'

/**
 * 팀 일정을 삭제하는 hook
 * @param projectId - 프로젝트 ID
 */
export const useDeleteScheduleMutation = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (scheduleId: number) => deleteSchedule(projectId, scheduleId),
		onSuccess: () => {
			// 일정 삭제 후 관련 데이터 refetch
			queryClient.invalidateQueries({ queryKey: ['teamBoardOverview', projectId] })
			queryClient.invalidateQueries({ queryKey: ['calendarMonth', projectId] })
		},
	})
}
