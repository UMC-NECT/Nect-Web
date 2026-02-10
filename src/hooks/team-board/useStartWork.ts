import { useMutation, useQueryClient } from '@tanstack/react-query'
import { startWork } from '@/api/team-board/boards'

/**
 * 팀보드에서 작업 타이머를 시작하는 hook
 * @param projectId - 프로젝트 ID
 */
export const useStartWorkMutation = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: () => startWork(projectId),
		onSuccess: () => {
			// 작업 시작 후 관련 데이터 refetch
			queryClient.invalidateQueries({ queryKey: ['teamBoardOverview', projectId] })
		},
	})
}
