import { useMutation, useQueryClient } from '@tanstack/react-query'
import { stopWork } from '@/api/team-board/boards'

/**
 * 팀보드에서 작업 타이머를 정지하는 hook
 * @param projectId - 프로젝트 ID
 */
export const useStopWorkMutation = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: () => stopWork(projectId),
		onSuccess: () => {
			// 작업 정지 후 관련 데이터 refetch
			queryClient.invalidateQueries({ queryKey: ['teamBoardOverview', projectId] })
		},
	})
}
